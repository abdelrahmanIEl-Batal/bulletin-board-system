import { Model, model, modelAction, modelFlow, prop, _async, _await } from "mobx-keystone";
import { getPosts, getPostsPage } from "../api";
import { Post } from "../interfaces/Interfaces";



@model('myApp/PostStore')
export class PostStore extends Model({

    postList: prop<Post[]>(() => []).withSetter(),
    pageCount: prop(0).withSetter().withSetter(),
    postListPage: prop<Post[]>(() => []).withSetter(),

}) {

    @modelFlow
    fetchPosts = _async(function* (this: PostStore) {
        const posts = yield* _await(getPosts())
        this.setPostList(posts)
    })

    @modelFlow
    fetchPostsPage = _async(function* (this: PostStore, page) {
        const obj = yield* _await(getPostsPage(page))
        const { count, posts } = obj
        this.setPostListPage(posts)
        this.setPageCount(count)
    })


    @modelAction
    add(post: Post) {
        this.postList.push(post)
    }

}

export function createPostStore() {
    const postStore = new PostStore({})
    postStore.fetchPosts()
    return postStore
}