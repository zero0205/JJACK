import styled from "styled-components";
import { IUser } from "../routes/profile";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr 2fr;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  gap: 5px;
  border-radius: 15px;
  vertical-align: center;
`;

const PhotoWrapper = styled.div`
  width: 40px;
  overflow: hidden;
  height: 40px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 30px;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Photo = styled.img``;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Name = styled.div`
  font-family: GiantsBold;
`;

const Email = styled.div`
  color: gray;
  font-size: 12px;
`;

const Description = styled.div`
  font-weight: 200;
  font-size: 14px;
`;

const FollowBtn = styled.button`
  diplay: flex;
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

export default function UserInfo({
  userId,
  userName,
  userEmail,
  description,
  photo,
}: IUser) {
  const onClick = () => {
    alert("Follow 기능은 아직 준비 중입니다");
  };
  return (
    <Wrapper>
      <PhotoWrapper>
        {photo ? (
          <Photo src={photo} />
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
      </PhotoWrapper>
      <TextInfo>
        <Name>{userName}</Name>
        <Email>{userEmail}</Email>
        <Description>{description}</Description>
      </TextInfo>
      <FollowBtn onClick={onClick}>Follow</FollowBtn>
    </Wrapper>
  );
}
