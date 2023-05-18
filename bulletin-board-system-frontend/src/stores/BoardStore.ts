import { Model, model, modelAction, modelFlow, prop, _async, _await } from "mobx-keystone";
import { getBoards } from "../api";
import { Board } from "../interfaces/Interfaces";

@model('myApp/BoardStore')
export class BoardStore extends Model({

    boardList: prop<Board[]>(() => []).withSetter(),
}) {

    @modelFlow
    fetchBoards = _async(function* (this: BoardStore) {
        const boards = yield* _await(getBoards())
        this.setBoardList(boards)
        // console.log(ToJS(this.userList))
    })

    @modelAction
    add(board: Board) {
        this.boardList.push(board)
    }

    @modelAction
    updateBoard() {
        this.fetchBoards()
    }

    @modelAction
    delete(id: number) {
        const index = this.boardList.findIndex(x => x.id === id)
        if (index > -1) this.boardList.splice(index, 1)
    }
}

export function createBoardStore() {
    const boardStore = new BoardStore({})
    return boardStore;
}
