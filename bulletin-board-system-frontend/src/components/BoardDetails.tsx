import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import RootStore from "../stores/RootStore";
import {
  Header,
  Icon,
  List,
  Pagination,
  PaginationProps,
} from "semantic-ui-react";
import { AddThread } from "./AddThread";
import { Link } from "react-router-dom";
import moment from "moment";

interface BoardDetailsProps {
  rootStore: RootStore;
}

export const BoardDetails: React.FC<BoardDetailsProps> = observer(
  ({ rootStore }) => {
    const [addThread, setAddThread] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const { id } = useParams<{ id?: string }>();
    const board = rootStore.boardStore?.boardList.find(
      (x) => x.id === parseInt(id!)
    );

    const fetchThreads = useCallback(async () => {
      await rootStore.threadStore?.fetchThreadsPage(pageNumber, parseInt(id!));
    }, [rootStore.threadStore, id, pageNumber]);

    useEffect(() => {
      fetchThreads();
    }, [fetchThreads]);

    const displayThreads =
      rootStore.threadStore &&
      rootStore.threadStore.threadList &&
      rootStore.threadStore.threadList.map((thread) => {
        return (
          <List.Item>
            <List.Icon
              name={thread.is_locked ? "lock" : "unlock"}
              size="large"
              verticalAlign="middle"
            />
            <List.Content>
              <Link to={`/thread/${thread.id}`}>
                <List.Header as="a">Name: {thread.name}</List.Header>
              </Link>

              <List.Description>
                Last Reply Date:{" "}
                {thread.latest_reply_date
                  ? moment(thread.latest_reply_date).format("llll")
                  : "No Posts Yet"}
              </List.Description>
              <List.Description>
                Last Replier Name:{" "}
                {thread.latest_replier ? thread.latest_replier : "None"}
              </List.Description>
              <List.Description>
                Status: {thread.is_locked ? "Locked" : "Open"}
              </List.Description>
              <List.Description>
                Sticky:{" "}
                {thread.is_sticky ? (
                  <Icon name="check" />
                ) : (
                  <Icon name="close" />
                )}
              </List.Description>
            </List.Content>
          </List.Item>
        );
      });

    const handleChange = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      data: PaginationProps
    ) => {
      const { activePage } = data;
      setPageNumber(activePage as number);
      rootStore.threadStore?.fetchThreadsPage(
        activePage as number,
        parseInt(id!)
      );
    };

    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="text-center">Board Name: {board?.name}</h1>
            </div>
            <div className="col">
              {rootStore.userStore?.currentUser &&
                !rootStore.userStore?.currentUser?.user.is_banned && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setAddThread(true)}
                  >
                    Add Thread
                  </button>
                )}
              <AddThread
                addThread={addThread}
                setAddThread={setAddThread}
                id={board?.id!}
                rootStore={rootStore}
              />
            </div>
          </div>
          <Header as="h3" dividing>
            Threads
          </Header>
          <List divided relaxed>
            {displayThreads}
          </List>
          <Pagination
            defaultActivePage={pageNumber}
            totalPages={Math.ceil(rootStore.threadStore?.count! / 20)}
            onPageChange={handleChange}
          />
        </div>
      </>
    );
  }
);
