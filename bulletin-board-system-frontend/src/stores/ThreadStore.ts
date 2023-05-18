import { Model, model, modelAction, modelFlow, prop, _async, _await } from "mobx-keystone";
import { getThreads, getThreadsPage } from "../api";
import { Thread } from "../interfaces/Interfaces";

@model('myApp/ThreadStore')
export class ThreadStore extends Model({

    threadList: prop<Thread[]>(() => []).withSetter(),
    count: prop<number>(() => 0).withSetter()
}) {

    @modelFlow
    fetchThreads = _async(function* (this: ThreadStore) {
        const threads = yield* _await(getThreads())
        this.setThreadList(threads)
    })

    @modelFlow
    fetchThreadsPage = _async(function* (this: ThreadStore, page: number, board: number) {
        const { threads, count } = yield* _await(getThreadsPage(page, board))
        this.setThreadList(threads)
        this.setCount(count)
    })

    @modelAction
    add(thread: Thread) {
        this.threadList.push(thread)
        this.setCount(this.count + 1)
        // const temp = this.threadList
        // this.threadList = []
        // temp.sort((a, b) => (a.latest_reply_date > b.latest_reply_date) ? 1 : (a.is_sticky === b.is_sticky) ? 0 : a.is_sticky ? -1 : 1)
        // this.threadList = temp
    }

    @modelAction
    updateThreads() {
        this.fetchThreads()
    }

    @modelAction
    lockThread(id: number, list: Thread[]) {
        const index = this.threadList.findIndex(x => x.id === id)
        const thread = this.threadList[index]
        thread.is_locked = true
        list.splice(index, 1)
        this.threadList = []
        list.push(thread)
        this.threadList = list
    }
}

export function createThreadStore() {
    const threadStore = new ThreadStore({})
    return threadStore
}