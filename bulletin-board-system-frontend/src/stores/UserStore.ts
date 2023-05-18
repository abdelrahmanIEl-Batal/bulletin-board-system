import { Model, model, modelAction, modelFlow, prop, _async, _await } from 'mobx-keystone';
import { getUsers } from '../api';
import { LoggedUser, User } from '../interfaces/Interfaces';

@model('myApp/UserStore')
export class UserStore extends Model({

    userList: prop<User[]>(() => []).withSetter(),
    currentUser: prop<LoggedUser | null>(null).withSetter(),

}) {

    @modelFlow
    fetchUsers = _async(function* (this: UserStore) {
        const users = yield* _await(getUsers())
        this.setUserList(users)
        // console.log(ToJS(this.userList))
    })

    @modelAction
    logUser(user: LoggedUser) {
        this.setCurrentUser(user)
    }

    @modelAction
    update() {
        this.fetchUsers()
    }

    @modelAction
    banUser(id: number, list: User[]) {
        const index = this.userList.findIndex(x => x.id === id)
        const user = this.userList[index]
        list.splice(index, 1)
        user.is_banned = true
        list.push(user)
        this.userList = []
        this.setUserList(list)
    }
}


export function createUserStore(): UserStore {
    const userStore = new UserStore({})
    userStore.fetchUsers()
    return userStore
}
