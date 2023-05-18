import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Board } from "../interfaces/Interfaces";
import { Card, Image, Confirm } from "semantic-ui-react";
import { Link } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { deleteBoard } from "../api";

interface SingleBoardProps {
  board: Board;
  rootStore: RootStore;
}

export const SingleBoard: React.FC<SingleBoardProps> = observer(
  ({ board, rootStore }) => {
    const [open, setOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const calcPostCount = () => {
      var c = 0;
      for (var i = 0; i < board.threads.length; ++i) {
        c += board.threads[i].posts.length;
      }
      return c;
    };
    const postCount = calcPostCount();
    console.log(postCount);
    const handleConfirm = (e: any) => {
      handleDelete();
    };
    const handleCancel = (e: any) => {
      setOpen(false);
    };

    const handleDelete = async () => {
      setOpen(true);
      const response = await deleteBoard(
        board.id,
        rootStore.userStore?.currentUser?.key!
      );
      console.log(response);
      if (response.status === 204) {
        rootStore.boardStore?.delete(board.id);
        rootStore.boardStore?.updateBoard();
        rootStore.topicStore?.updateTopics();
        setOpen(false);
      }
    };
    const handleMouseOver = () => {
      setIsHovering(true);
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const HoverableDiv = (e: any) => {
      const { handleMouseOver, handleMouseOut } = e;
      return (
        <div
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          className="m-3"
        >
          <Card>
            <Image src={board.image} wrapped ui={false} />
            <p className="text-center">Hover me</p>
            <Card.Header className="text-center">
              <Link to={`/board/${board.id}`} className="m-2">
                {board.name}
              </Link>
            </Card.Header>
            <Card.Meta className="p-2">
              Description: {board.description}
            </Card.Meta>
            <Card.Meta className="p-2">
              Thread Count: {board.threads.length}
            </Card.Meta>
            <Card.Meta className="p-2">Post Count: {postCount}</Card.Meta>
            <Card.Meta className="p-2">
              {rootStore.userStore?.currentUser?.user.is_admin && (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setOpen(true)}
                >
                  Delete
                </button>
              )}
            </Card.Meta>
          </Card>
        </div>
      );
    };
    const HoverCard = () => {
      return (
        <div className="display-flex">
          <p> Description: {board.description}</p>
          <p>Thread Count: {board.threads.length}</p>
          <p>Post Count: {postCount}</p>
        </div>
      );
    };
    return (
      <>
        <Confirm
          content="Are you sure you want to delete this board?"
          open={open}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          size="small"
          style={{ height: "150px", marginLeft: "25%", marginTop: "10%" }}
        />

        {/* Hover over this div to hide/show <HoverCard /> */}
        <HoverableDiv
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
        />
        {isHovering && <HoverCard />}
      </>
    );
  }
);
