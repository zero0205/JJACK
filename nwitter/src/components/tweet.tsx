import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
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
  padding: 5px 10px;
  margin: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [name, setName] = useState("");
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

  const getName = async () => {
    const docRef = await getDoc(doc(db, "users", userId));
    setName(docRef.get("name"));
  };

  const toggleEdit = () => {
    setIsEditing((isEditing) => !isEditing);
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <Wrapper>
      <Column>
        <Username>{name}</Username>
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
