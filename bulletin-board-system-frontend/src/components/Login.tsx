import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { login } from "../api";
import { useHistory } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";

interface LoginProps {
  rootStore: RootStore;
}

export const Login: React.FC<LoginProps> = observer(({ rootStore }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const response = await login(email, password);
    if (response.status === 400) setErrorMessage("Wrong Credentials");
    else setErrorMessage("");
    const { user } = response;
    if (response.status === 200) {
      console.log(user);
      rootStore.userStore?.logUser(user);
      history.push("/");
    }
  };

  return (
    <div className="container">
      <h3 className="text-center">Login</h3>
      <div className="row justify-content-center">
        <div className="col-5">
          <Form onSubmit={handleLogin}>
            <Form.Input
              label="Email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              label="Password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Button type="submit">Login</Button>
          </Form>
          {errorMessage}
        </div>
      </div>
    </div>
  );
});
