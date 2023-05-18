import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { uploadImage } from "../utils";
import { register } from "../api";
import { useHistory } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";

interface RegisterProps {
  rootStore: RootStore;
}

const genderOptions = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
];

export const Register: React.FC<RegisterProps> = observer(({ rootStore }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [hometown, setHometown] = useState("");
  const [county, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState("");
  const [img, setImage] = useState<any>(null);

  const [errorMessage, setErrorMessage] = useState("");

  let history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const imgURL =
      img === null
        ? process.env.REACT_APP_DEFAULT_AVATAR
        : await uploadImage(img);

    const res = await register(
      name,
      username,
      email,
      dateOfBirth,
      hometown,
      about,
      county,
      city,
      website === "" ? "no website" : website,
      gender === "" ? "O" : gender === "male" ? "M" : "F",
      imgURL!,
      password1,
      password2,
      interests === "" ? "no interests" : interests
    );
    if (res.status === 400) {
      Object.keys(res.body).map((obj: any) => {
        setErrorMessage(res.body[obj]);
        return null;
      });
    } else setErrorMessage("");

    if (res.status === 200) {
      rootStore.userStore?.update();
      history.push("/login");
    }
  };

  return (
    <div className="container mb-5">
      <h3 className="text-center">Register</h3>
      <div className="row justify-content-center">
        <div className="col-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Input
                label="Name"
                placeholder="name"
                width={8}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Form.Input
                label="Username"
                placeholder="username"
                width={8}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Email"
                placeholder="email"
                width={8}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                required
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Password (numbers,uppercase and lowercase)"
                width={12}
                onChange={(e) => setPassword1(e.target.value)}
                required
                type="password"
              />
              <Form.Input
                label="Confirm Password"
                width={8}
                onChange={(e) => setPassword2(e.target.value)}
                required
                type="password"
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Hometown"
                placeholder="hometown"
                onChange={(e) => setHometown(e.target.value)}
                required
              />
              <Form.Input
                label="Country"
                placeholder="hometown"
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              <Form.Input
                label="City"
                placeholder="hometown"
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Website"
                placeholder="website"
                width={8}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <Form.Select
                fluid
                label="Gender"
                options={genderOptions}
                placeholder="Gender"
                onChange={(e, { value }) => setGender(value as string)}
              />
            </Form.Group>
            <Form.Field>
              <label>Avatar</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files![0])}
              />
            </Form.Field>
            <Form.TextArea
              label="Interests"
              placeholder="interests"
              onChange={(e) => setInterests(e.target.value)}
            />
            <Form.TextArea
              label="About"
              placeholder="about"
              onChange={(e) => setAbout(e.target.value)}
              required
            />
            <Button type="submit">Submit</Button>
            {errorMessage}
          </Form>
        </div>
      </div>
    </div>
  );
});
