import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/loading-screen";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Home() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  if (!user) return;

  useEffect(() => {
    setLoading(true);
    const getProfile = async () => {
      try {
        const docRef = await getDoc(doc(db, "users", user.uid));
        if (!docRef.exists()) {
          navigate("/editProfile");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
