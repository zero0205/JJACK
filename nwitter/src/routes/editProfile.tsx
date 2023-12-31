import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 60px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: gray;
  font-size: 20px;
`;

const TextArea = styled.textarea`
  background-color: black;
  color: white;
  resize: none;
  font-size: 20px;
  padding: 10px;
  border: none;
  border: solid 1px gray;
  &:focus {
    outline: none;
    border: solid 1px #1d9bf0;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  width: 100px;
  padding: 10px 0px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditProfile() {
  const user = auth.currentUser;
  if (!user) return;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  // 프로필 사진 바꾸기
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      confirm("프로필 사진을 바꾸시겠습니까? 확인을 누르면 바로 적용됩니다.")
    ) {
      const { files } = e.target;
      if (files && files.length === 1) {
        const file = files[0];
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);
        setAvatar(avatarUrl);

        await updateDoc(doc(db, "users", user.uid), {
          photo: avatarUrl,
        });
        await updateProfile(user, { photoURL: avatarUrl });
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        userName: name,
        userEmail: user.email,
        description: description,
      });

      await updateProfile(user, { displayName: name });
      navigate(`/profile/${user.uid}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setName(user?.displayName ?? "");
    if (user === null) {
      navigate("/login");
      return;
    }
    const getProfile = async () => {
      try {
        const docRef = await getDoc(doc(db, "users", user.uid));
        if (docRef.exists()) {
          setDescription(docRef.get("description"));
          setAvatar(docRef.get("photo"));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Form onSubmit={onSubmit}>
        <Label>Name</Label>
        <TextArea
          required
          name="name"
          rows={1}
          onChange={onChange}
          value={name}
        />
        <Label>Description</Label>
        <TextArea
          name="description"
          rows={5}
          maxLength={180}
          onChange={onChange}
          value={description}
        />
        <BtnWrapper>
          <SubmitBtn type="submit" value="저장" />
        </BtnWrapper>
      </Form>
    </Wrapper>
  );
}
