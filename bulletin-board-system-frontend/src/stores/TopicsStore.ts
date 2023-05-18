import { Model, model, modelAction, modelFlow, prop, _async, _await } from "mobx-keystone";
import { getTopics } from "../api";
import { Topic } from '../interfaces/Interfaces'

@model('myApp/TopicStore')
export class TopicStore extends Model({

    topicList: prop<Topic[]>(() => []).withSetter(),

}) {

    @modelAction
    add(topic: Topic) {
        this.topicList.push(topic)
    }

    @modelFlow
    fetchTopics = _async(function* (this: TopicStore) {
        const topics = yield* _await(getTopics())
        this.setTopicList(topics)
        // console.log(ToJS(this.userList))
    })

    @modelAction
    updateTopics() {
        this.fetchTopics()
    }
}

export function createTopicStore() {
    const topicStore = new TopicStore({})
    return topicStore
}

