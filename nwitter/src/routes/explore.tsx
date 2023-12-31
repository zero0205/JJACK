import styled from "styled-components";
import SearchBox from "../components/SearchBox";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Explore() {
  return (
    <Wrapper>
      <div>정확히 일치하는 이름 검색만 가능합니다.</div>
      <SearchBox />
    </Wrapper>
  );
}
