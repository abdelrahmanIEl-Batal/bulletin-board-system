import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Modal, Form } from "semantic-ui-react";
import { addNewPost } from "../api";
import RootStore from "../stores/RootStore";

interface AddPostProps {
  addPost: boolean;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  threadID: number;
  rootStore: RootStore;
}

export const AddPost: React.FC<AddPostProps> = observer(
  ({ addPost, setAddPost, threadID, rootStore }) => {
    const [message, setMessage] = useState("");

    const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = await addNewPost(
        message,
        dateNow,
        threadID,
        rootStore.userStore?.currentUser?.key!
      );
      try {
        if (response.status === 201) {
          rootStore.postStore?.add(response.post);
          rootStore.threadStore?.updateThreads();
          setAddPost(false);
        }
      } catch (e) {
        rootStore.threadStore?.updateThreads();
        setAddPost(false);
      }
    };

    return (
      <Modal
        style={{ height: "60%", marginLeft: "25%", marginTop: "5%" }}
        open={addPost}
        onClose={() => setAddPost(false)}
        onOpen={() => setAddPost(true)}
        size="small"
      >
        <Modal.Header className="text-center">Add a new Post</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={handleAddPost}>
              <Form.Input
                label="Message"
                placeholder="message body"
                required
                onChange={(e) => setMessage(e.target.value)}
              />
              <Form.Button>Submit</Form.Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
);
