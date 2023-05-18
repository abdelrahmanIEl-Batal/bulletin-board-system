import { model, Model, prop, registerRootStore } from "mobx-keystone";
import { createUserStore, UserStore } from './UserStore'
import { createBoardStore, BoardStore } from "./BoardStore";
import { createTopicStore, TopicStore } from "./TopicsStore";
import { createThreadStore, ThreadStore } from "./ThreadStore";
import { createPostStore, PostStore } from "./PostStore";
@model('myApp/Rootstore')
class RootStore extends Model({

    userStore: prop<UserStore | null>(() => null).withSetter(),
    boardStore: prop<BoardStore | null>(() => null).withSetter(),
    topicStore: prop<TopicStore | null>(() => null).withSetter(),
    threadStore: prop<ThreadStore | null>(() => null).withSetter(),
    postStore: prop<PostStore | null>(() => null).withSetter()
}) {
}

export function createRootStore(): RootStore {
    const rootStore = new RootStore({})
    rootStore.setUserStore(createUserStore())
    rootStore.setBoardStore(createBoardStore())
    rootStore.setTopicStore(createTopicStore())
    rootStore.setThreadStore(createThreadStore())
    rootStore.setPostStore(createPostStore())
    registerRootStore(rootStore)
    return rootStore
}

export default RootStore