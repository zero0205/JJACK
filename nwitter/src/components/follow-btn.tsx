import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";

const FollowingBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1d9bf0;
  border: none;
  border-radius: 15px;
  padding: 5px;
  font-family: GiantsRegular;
  color: white;
  height: 30px;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

const FollowedBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: gray;
  border: none;
  border-radius: 15px;
  padding: 5px;
  font-family: GiantsRegular;
  color: white;
  height: 30px;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

export default function FollowBtn({ userId }: { userId: string }) {
  const user = auth.currentUser;

  const [isFollowing, setIsFollowing] = useState(false);

  // FOLLOW
  const follow = async () => {
    if (!user) return;
    // update my users info
    await updateDoc(doc(db, "users", user.uid), {
      followingNum: increment(1),
    });
    await setDoc(doc(db, "users", user.uid, "following", userId), {});

    // update following's users info
    await updateDoc(doc(db, "users", userId), {
      followerNum: increment(1),
    });
    await setDoc(doc(db, "users", userId, "follower", user.uid), {});

    setIsFollowing(true);
  };

  //UNFOLLOW
  const unfollow = async () => {
    if (!user) return;
    // update my users info
    await updateDoc(doc(db, "users", user.uid), {
      followingNum: increment(-1),
    });
    await deleteDoc(doc(db, "users", user.uid, "following", userId));

    // update following's users info
    await updateDoc(doc(db, "users", userId), {
      followerNum: increment(-1),
    });
    await deleteDoc(doc(db, "users", userId, "follower", user.uid));

    setIsFollowing(false);
  };

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user) return;
      const snapShot = await getDoc(
        doc(db, "users", user.uid, "following", userId)
      );
      if (snapShot.exists()) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };
    fetchFollowing();
  }, [isFollowing]);

  return (
    <>
      {isFollowing ? (
        <FollowedBtn onClick={unfollow}>Following</FollowedBtn>
      ) : (
        <FollowingBtn onClick={follow}>Follow</FollowingBtn>
      )}
    </>
  );
}
