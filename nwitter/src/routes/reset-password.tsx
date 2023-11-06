import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      console.log("reset");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Reset Password</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Send Email"} />
      </Form>
      <Switcher>
        Go back to <Link to="/login">Login &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
