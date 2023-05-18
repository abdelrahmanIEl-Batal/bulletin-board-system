import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { AddPost } from "./AddPost";
import { SinglePost } from "./SinglePost";
import { Comment, Header, Confirm } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import { ReplyForm } from "./ReplyForm";
import { lockThread } from "../api";

interface ThreadDetailsProps {
  rootStore: RootStore;
}

export const ThreadDetails: React.FC<ThreadDetailsProps> = observer(
  ({ rootStore }) => {
    const { id } = useParams<{ id?: string }>();
    const [addPost, setAddPost] = useState(false);

    const [pageNumber, setPageNumber] = useState(0);
    const postsPerPage = 20;
    const postsVisited = postsPerPage * pageNumber;
    const thread = rootStore.threadStore?.threadList.find(
      (x) => x.id === parseInt(id!)
    );
    const displayPosts = thread?.posts
      .slice(postsVisited, postsVisited + postsPerPage)
      .map((post) => {
        return <SinglePost key={post.id} post={post} rootStore={rootStore} />;
      });

    const changePage = (data: any) => {
      const { selected } = data;
      setPageNumber(selected);
    };

    const [confirmLock, setConfirmLock] = useState(false);
    const handleLockConfirm = async () => {
      const response = await lockThread(
        thread?.id!,
        true,
        rootStore.userStore?.currentUser?.key!
      );
      console.log(response);
      if (response.status === 200) {
        rootStore.threadStore?.lockThread(
          thread?.id!,
          rootStore.threadStore.threadList
        );
        setConfirmLock(false);
      }
    };
    const handleLockCancel = () => {
      setConfirmLock(false);
    };

    const fetchPosts = useCallback(async () => {
      rootStore.postStore?.fetchPosts();
    }, [rootStore.postStore]);

    useEffect(() => {
      fetchPosts();
    }, [fetchPosts]);

    return (
      <>
        <Confirm
          content="Are you sure you want to lock this thread"
          open={confirmLock}
          onCancel={handleLockCancel}
          onConfirm={handleLockConfirm}
          size="small"
          style={{ height: "150px", marginLeft: "25%", marginTop: "10%" }}
        />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-8 text-center">
              <h2>Thread Name: {thread?.name}</h2>
              <p>Status: {thread?.is_locked ? "Locked" : "Open"}</p>
            </div>
            <div className="col">
              {rootStore.userStore?.currentUser &&
                !rootStore.userStore.currentUser.user.is_banned &&
                !thread?.is_locked && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setAddPost(true)}
                  >
                    Add Post
                  </button>
                )}
              {(rootStore.userStore?.currentUser?.user.is_admin ||
                rootStore.userStore?.currentUser?.user.is_moderator) &&
                !thread?.is_locked && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setConfirmLock(true)}
                  >
                    Lock thread
                  </button>
                )}
              <AddPost
                addPost={addPost}
                setAddPost={setAddPost}
                threadID={parseInt(id!)}
                rootStore={rootStore}
              />
            </div>
          </div>
          <Comment.Group className="p-2">
            <Header as="h3" dividing>
              Posts
            </Header>
            {displayPosts}
          </Comment.Group>
          {!thread?.is_locked &&
            rootStore.userStore?.currentUser &&
            !rootStore.userStore.currentUser.user.is_banned && <ReplyForm />}
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={Math.ceil(thread!.posts.length / postsPerPage)}
            onPageChange={changePage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            containerClassName={"paginationBttns"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisable"}
            activeClassName={"paginationActive"}
          />
        </div>
      </>
    );
  }
);
