import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import EditTweetForm from "./edit-tweet-form";
import { useNavigate } from "react-router-dom";
import { IUser } from "../routes/profile";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

const AvatarWrapper = styled.div`
  width: 32px;
  overflow: hidden;
  height: 32px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 24px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 15px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  font-family: GiantsRegular;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  font-family: GiantsRegular;
  padding: 5px 10px;
  margin: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  const navigate = useNavigate();

  // const [name, setName] = useState("");
  // const [profilePhoto, setProfilePhoto] = useState("");
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id)); // delete tweet
      // delete photo
      if (photo) {
        const photoRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${id}`
        );
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onClickUserInfo = () => {
    navigate(`/profile/${userId}`);
  };

  const toggleEdit = () => {
    setIsEditing((isEditing) => !isEditing);
  };

  useEffect(() => {
    // state 초기화
    setUserInfo(null);
    // userInfo 갖고 오기
    const getUserInfo = async () => {
      const snapshot = await getDoc(doc(db, "users", userId));
      if (snapshot.exists()) {
        const { userName, userEmail, photo } = snapshot.data();
        setUserInfo({
          userId: snapshot.id,
          userName: userName,
          userEmail: userEmail,
          photo: photo,
        });
      }
    };
    getUserInfo();
  }, []);

  return (
    <Wrapper>
      <Column>
        <UserInfo>
          <AvatarWrapper onClick={onClickUserInfo}>
            {userInfo?.photo ? (
              <AvatarImg src={userInfo.photo} />
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
          </AvatarWrapper>
          <Username onClick={onClickUserInfo}>{userInfo?.userName}</Username>
        </UserInfo>
        {isEditing ? (
          <EditTweetForm tweet={tweet} id={id} closeEdit={toggleEdit} />
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            ) : null}
            {user?.uid === userId ? (
              <EditButton onClick={toggleEdit}>Edit</EditButton>
            ) : null}
          </>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
