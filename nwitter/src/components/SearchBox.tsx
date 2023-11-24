import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = styled.form``;

const Input = styled.input`
  display: flex;
  border: 2px solid white;
  border-radius: 20px;
  font-size: 20px;
  font-family: GiantsRegular;
  color: white;
  background-color: black;
  width: 100%;
  height: 50px;
  resize: none;
  padding: 8px;
  text-align: left;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 20px;
    font-family: GiantsRegular;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function SearchBox() {
  const [word, setWord] = useState("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search/${word}`);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        required
        maxLength={180}
        onChange={onChange}
        placeholder="Search"
        value={word}
      />
    </Form>
  );
}
