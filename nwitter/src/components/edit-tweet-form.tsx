import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0p 5px;
`;

const TextArea = styled.textarea`
  padding: 20px;
  border: none;
  outline: none;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:hover {
    border: none;
    outline: none;
  }
`;

const Btn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

interface Props {
  tweet: string;
  id: string;
  closeEdit: () => void;
}

export default function EditTweetForm({ tweet, id, closeEdit }: Props) {
  const [isLoading, setLoading] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      const docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet: newTweet,
      });
      setNewTweet("");
      closeEdit();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        placeholder="Please enter the contents to be modified."
        value={newTweet}
      />
      <Btn type="submit" value={isLoading ? "Loading..." : "Edit Tweet"} />
      <Btn onClick={closeEdit} value="Close" />
    </Form>
  );
}
