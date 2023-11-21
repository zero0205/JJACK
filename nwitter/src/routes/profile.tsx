import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarWrapper = styled.div`
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

const NameWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const EditBtn = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: 50%;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Description = styled.div`
  font-size: 16px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [description, setDescription] = useState("");
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const navigate = useNavigate();

  // 본인의 트윗 가져오기
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, userName, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        userName,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  // users 정보 갖고 오기
  const getProfile = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);
    if (snapshot) {
      setDescription(snapshot.data()?.description);
    }
  };

  const onClickProfile = () => {
    navigate("/editProfile");
  };

  useEffect(() => {
    fetchTweets();
    getProfile();
  }, []);

  return (
    <Wrapper>
      <AvatarWrapper>
        {user?.photoURL ? (
          <AvatarImg src={user?.photoURL} />
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

      <NameWrapper>
        <Name>{user?.displayName ?? "(Anonymous)"}</Name>
        <EditBtn onClick={onClickProfile}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            ></path>
          </svg>
        </EditBtn>
      </NameWrapper>
      <Description>{description}</Description>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
