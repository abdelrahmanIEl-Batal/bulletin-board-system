import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import {
  Card,
  Image,
  Confirm,
  Header,
  Comment,
  Pagination,
  PaginationProps,
} from "semantic-ui-react";

import RootStore from "../stores/RootStore";
import { User } from "../interfaces/Interfaces";
import { banUser } from "../api";
import { SinglePost } from "./SinglePost";

interface ProfileProps {
  rootStore: RootStore;
}

export const Profile: React.FC<ProfileProps> = observer(({ rootStore }) => {
  const { id } = useParams<{ id?: string }>();

  const [confirmBan, setConfirmBan] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [pageNumber, setPageNumber] = useState(1);

  const loggedUser = rootStore.userStore?.currentUser;

  const handleCancel = () => {
    setConfirmBan(false);
  };
  const handleConfirm = () => {
    handleBan();
  };

  const handleBan = async () => {
    const response = await banUser(
      user?.id!,
      true,
      rootStore.userStore?.currentUser?.key!
    );
    if (response.status === 200) {
      rootStore.userStore?.banUser(user?.id!, rootStore.userStore.userList);
      setConfirmBan(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    await rootStore.userStore?.fetchUsers();
    setUser(rootStore.userStore?.userList.find((x) => x.id === parseInt(id!))!);
  }, [rootStore.userStore, id]);

  const fetchPosts = useCallback(async () => {
    await rootStore.postStore?.fetchPostsPage(pageNumber);
  }, [rootStore.postStore, pageNumber]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, [fetchUsers, fetchPosts]);

  const handleChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) => {
    const { activePage } = data;
    setPageNumber(activePage as number);
    rootStore.postStore?.fetchPostsPage(activePage);
  };

  return (
    user && (
      <>
        <Confirm
          content="Are you sure you want to ban this user?"
          open={confirmBan}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          size="small"
          style={{ height: "150px", marginLeft: "25%", marginTop: "10%" }}
        />
        <div className="container">
          <div className="row">
            <div className="col text-center">
              {loggedUser &&
                loggedUser.user.id !== user.id &&
                (loggedUser.user.is_admin || loggedUser.user.is_moderator) &&
                !loggedUser.user.is_banned &&
                !user.is_banned &&
                (loggedUser.user.is_moderator && user.is_admin ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-outline-danger m-2"
                    onClick={() => setConfirmBan(true)}
                  >
                    Ban user
                  </button>
                ))}
              Status: {user.is_banned ? "Banned" : "Not banned"}
            </div>
          </div>

          <div className="row justify-content-center pb-5">
            <div className="col">
              <Card color="red">
                <Image src={user.avatar} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>Name: {user.name}</Card.Header>
                  <Card.Meta>
                    <span className="date">
                      Date of birth: {user.date_of_birth}
                    </span>
                  </Card.Meta>
                  <Card.Meta>
                    <h3>Location</h3>
                    <span>Country: {user.location.country}, </span>
                    <span>City: {user.location.city}</span>
                  </Card.Meta>
                  <Card.Meta>
                    <h3>Hometown: {user.hometown}</h3>
                  </Card.Meta>
                  <h3>About</h3>
                  <Card.Description>{user.about}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <p>Website: {user.website}</p>
                  <p>Gender: {user.gender}</p>
                  <p>Interests: {user.interests}</p>
                </Card.Content>
              </Card>
            </div>
            <div className="col mt-4">
              <Header>Posts</Header>
              <Comment.Group>
                {rootStore.postStore &&
                  rootStore.postStore.postListPage
                    .filter((x) => x.author === user?.id)
                    .map((post) => {
                      return (
                        <SinglePost
                          key={post.id}
                          post={post}
                          rootStore={rootStore}
                        />
                      );
                    })}
              </Comment.Group>
              <Pagination
                defaultActivePage={pageNumber}
                totalPages={Math.ceil(rootStore.postStore?.pageCount! / 20)}
                onPageChange={handleChange}
              />
            </div>
          </div>
        </div>
      </>
    )
  );
});
