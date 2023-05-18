import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Form } from "semantic-ui-react";
import { addNewBoard } from "../api";
import RootStore from "../stores/RootStore";
import { uploadImage } from "../utils";

interface AddBoardProps {
  addBoard: boolean;
  setAddBoard: React.Dispatch<React.SetStateAction<boolean>>;
  rootStore: RootStore;
}

export const AddBoard: React.FC<AddBoardProps> = observer(
  ({ addBoard, setAddBoard, rootStore }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState<any>(null);
    const [description, setDescription] = useState("");

    const handleAddBoard = async (e: React.FormEvent<HTMLFormElement>) => {
      const imageURL = image
        ? await uploadImage(image)
        : process.env.REACT_APP_DEFAULT_BOARD_IMAGE!;
      const response = await addNewBoard(
        name,
        "",
        imageURL,
        description,
        rootStore.userStore?.currentUser?.key!
      );
      if (response.status === 201) {
        rootStore.boardStore?.add(response.board);
        setAddBoard(false);
      }
    };

    return (
      <Modal
        style={{ height: "60%", marginLeft: "25%", marginTop: "5%" }}
        open={addBoard}
        onClose={() => setAddBoard(false)}
        onOpen={() => setAddBoard(true)}
        size="small"
      >
        <Modal.Header className="text-center">Add a new Board</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={handleAddBoard}>
              <Form.Input
                label="Name"
                placeholder="board name"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Input
                label="Description"
                placeholder="board description"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
              <Form.Field>
                <label>Board Image</label>
                <input
                  type="file"
                  multiple={false}
                  onChange={(e) => setImage(e.target.files![0])}
                />
              </Form.Field>
              <Form.Button>Submit</Form.Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
);
