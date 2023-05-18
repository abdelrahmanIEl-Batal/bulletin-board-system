import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import RootStore from "../stores/RootStore";
import { Card, Loader } from "semantic-ui-react";
import { SingleBoard } from "./SingleBoard";
import { AddBoard } from "./AddBoard";
import { AddTopic } from "./AddTopic";
import { SingleTopic } from "./SingleTopic";

interface HomeProps {
  rootStore: RootStore;
}

export const Home: React.FC<HomeProps> = observer(({ rootStore }) => {
  const [loading, setLoading] = useState(true);
  const [addBoard, setAddBoard] = useState(false);
  const [addTopic, setAddTopic] = useState(false);

  const fetchObjects = useCallback(async () => {
    await rootStore.boardStore?.fetchBoards();
    await rootStore.topicStore?.fetchTopics();
    setLoading(false);
  }, [rootStore.boardStore, rootStore.topicStore]);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);
  return loading ? (
    <>
      <Loader active={loading} inline="centered" />
    </>
  ) : (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-9">
          <h2 className="text-center">Home</h2>
        </div>
        {rootStore.userStore?.currentUser?.user.is_admin && (
          <>
            <div className="col">
              <button
                className="btn btn-outline-primary"
                onClick={() => setAddBoard(true)}
              >
                Add Board
              </button>
              <AddBoard
                addBoard={addBoard}
                setAddBoard={setAddBoard}
                rootStore={rootStore}
              />
            </div>
            <div className="col">
              <button
                className="btn btn-outline-primary"
                onClick={() => setAddTopic(true)}
              >
                Add Topic
              </button>
              <AddTopic
                addTopic={addTopic}
                setAddTopic={setAddTopic}
                rootStore={rootStore}
              />
            </div>
          </>
        )}
      </div>
      <h3>Topics ({rootStore.topicStore?.topicList.length})</h3>
      {rootStore.topicStore?.topicList.map((topic) => {
        return (
          <SingleTopic key={topic.id} id={topic.id} rootStore={rootStore} />
        );
      })}
      {/* Boards not having any topic */}
      <h3>Boards (with no topic)</h3>
      <Card.Group className="mt-5">
        {rootStore.boardStore?.boardList.map((board) => {
          return (
            board.topic === null && (
              <SingleBoard key={board.id} board={board} rootStore={rootStore} />
            )
          );
        })}
      </Card.Group>
    </div>
  );
});
