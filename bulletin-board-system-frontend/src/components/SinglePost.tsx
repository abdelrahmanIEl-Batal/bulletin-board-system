import React from "react";
import { Post } from "../interfaces/Interfaces";
import { Comment } from "semantic-ui-react";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Link } from "react-router-dom";

interface SinglePostProps {
  post: Post;
  rootStore: RootStore;
}

export const SinglePost: React.FC<SinglePostProps> = observer(
  ({ post, rootStore }) => {
    const user = rootStore.userStore?.userList.find(
      (x) => x.id === post.author
    );
    return (
      <Comment>
        <Comment.Avatar src={user?.avatar} />
        <Comment.Content>
          <Link to={`/profile/${user?.id}`}>
            <Comment.Author>{user?.name}</Comment.Author>
          </Link>
          <Comment.Metadata>
            Created: {moment(post.created_at).format("llll")}
          </Comment.Metadata>
          <Comment.Text>{post.message}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  }
);
