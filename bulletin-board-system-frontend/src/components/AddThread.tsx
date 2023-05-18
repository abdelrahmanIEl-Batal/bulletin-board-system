import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Form, Checkbox } from "semantic-ui-react";
import { addNewThread } from "../api";
import RootStore from "../stores/RootStore";

interface AddThreadProps {
  addThread: boolean;
  setAddThread: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  rootStore: RootStore;
}

export const AddThread: React.FC<AddThreadProps> = observer(
  ({ addThread, setAddThread, id, rootStore }) => {
    const [name, setName] = useState("");
    const [sticky, setSticky] = useState(false);

    const handleAddThread = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      var moment = require("moment");
      let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = await addNewThread(
        name,
        sticky,
        dateNow,
        false,
        id,
        rootStore.userStore?.currentUser?.key!
      );
      if (response.status === 201) {
        rootStore.threadStore?.add(response.body);
        rootStore.boardStore?.updateBoard();
        setAddThread(false);
      }
    };
    return (
      <Modal
        style={{ height: "60%", marginLeft: "25%", marginTop: "5%" }}
        open={addThread}
        onClose={() => setAddThread(false)}
        onOpen={() => setAddThread(true)}
        size="small"
      >
        <Modal.Header className="text-center">Add a new Thread</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={handleAddThread}>
              <Form.Input
                label="Name"
                placeholder="Thread name"
                required
                onChange={(e) => setName(e.target.value)}
              />

              <Checkbox
                label="is thread sticky?"
                onChange={(e, data) => setSticky(data.checked!)}
              />

              <Form.Button>Submit</Form.Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
);
