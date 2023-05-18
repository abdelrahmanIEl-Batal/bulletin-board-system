import React from "react";
import { observer } from "mobx-react-lite";
import { Card } from "semantic-ui-react";
import { SingleBoard } from "./SingleBoard";
import RootStore from "../stores/RootStore";

interface SingleTopicProps {
  id: number;
  rootStore: RootStore;
}

export const SingleTopic: React.FC<SingleTopicProps> = observer(
  ({ id, rootStore }) => {
    const topic = rootStore.topicStore?.topicList.find((x) => x.id === id);
    return (
      <>
        <h4>Name: {topic!.name}</h4>

        <Card.Group>
          {topic!.boards.map((board) => {
            return (
              <SingleBoard key={board.id} board={board} rootStore={rootStore} />
            );
          })}
        </Card.Group>
      </>
    );
  }
);
