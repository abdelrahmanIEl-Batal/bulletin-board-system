import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Form } from "semantic-ui-react";
import { addNewTopic } from "../api";
import RootStore from "../stores/RootStore";
import Select from "react-select";

interface AddTopicProps {
  addTopic: boolean;
  setAddTopic: React.Dispatch<React.SetStateAction<boolean>>;
  rootStore: RootStore;
}

export const AddTopic: React.FC<AddTopicProps> = observer(
  ({ addTopic, setAddTopic, rootStore }) => {
    const [name, setName] = useState("");
    const [list, setList] = useState<number[]>([]);

    const handleAddTopic = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (list.length > 0) {
        const response = await addNewTopic(
          name,
          list,
          rootStore.userStore?.currentUser?.key!
        );
        console.log(response);
        if (response.status === 201) {
          rootStore.topicStore?.updateTopics();
          rootStore.boardStore?.updateBoard();
          setAddTopic(false);
        }
      }
    };

    return (
      <Modal
        style={{ height: "60%", marginLeft: "25%", marginTop: "5%" }}
        open={addTopic}
        onClose={() => setAddTopic(false)}
        onOpen={() => setAddTopic(true)}
        size="small"
      >
        <Modal.Header className="text-center">Add a new Topic</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={handleAddTopic}>
              <Form.Input
                label="Name"
                placeholder="Topic name"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Field required>
                <label>Pick Boards to add</label>
                <Select
                  onChange={(e) => setList(e.map((obj) => obj.value))}
                  isMulti={true}
                  options={rootStore.boardStore?.boardList.map((board) => {
                    return {
                      value: board.id,
                      label: board.name,
                    };
                  })}
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
