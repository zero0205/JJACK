import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";
import LoadingScreen from "../components/loading-screen";
import { IUser } from "./profile";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SearchAnother = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
`;

const BackBtn = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    color: white;
  }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Search() {
  const [result, setResult] = useState<IUser[]>([]);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { word } = useParams();

  const getResult = async () => {
    setLoading(true);
    const tweetQuery = query(
      collection(db, "users"),
      where("userName", "==", word),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const users = snapshot.docs.map((doc, i) => {
      const { userName, description, photo } = doc.data();
      return {
        userId: doc.id,
        userName,
        description,
        photo,
      };
    });
    setResult(users);
    setLoading(false);
  };

  useEffect(() => {
    setResult([]);
    getResult();
  }, [word]);

  return (
    <Wrapper>
      <SearchAnother>
        <BackBtn
          onClick={() => {
            navigate(-1);
          }}
        >
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
        </BackBtn>
        <SearchBox />
      </SearchAnother>
      {!isLoading ? (
        result.length >= 1 ? (
          <Tweets>
            {result.map((res) => (
              <div key={res.userId}>
                <div>{res.userName}</div>
                <div>{res.description}</div>
                <div>{res.photo ?? null}</div>
              </div>
            ))}
          </Tweets>
        ) : (
          <div>{word} 검색 결과가 없습니다.</div>
        )
      ) : (
        <LoadingScreen />
      )}
    </Wrapper>
  );
}
