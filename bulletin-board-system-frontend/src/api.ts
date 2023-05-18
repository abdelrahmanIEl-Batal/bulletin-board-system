import { Board, User } from "./interfaces/Interfaces"

const url = process.env.REACT_APP_API

export const initPost = (body: any, token?: string) => {
    return {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
        body: JSON.stringify(body)
    }
}

export const initGet = (token = null) => {
    return {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        }
    }
}

export const initPatch = (body: any, token?: string) => {
    return {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
        body: JSON.stringify(body)
    }
}

export const initDelete = (token?: string) => {
    return {
        method: "Delete",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
    }
}

export const register = async (
    name: string,
    username: string,
    email: string,
    date_of_birth: string,
    hometown: string,
    about: string,
    location_country: string,
    location_city: string,
    website: string,
    gender: string,
    avatar: string,
    password1: string,
    password2: string,
    interests: string,
) => {
    const response = await fetch(`${url}/register/`, initPost({
        name, username, email, date_of_birth, hometown, about,
        location_country, location_city, website, gender, avatar, password1, password2, interests
    }))
    const res = await response.json()
    return {
        body: res,
        status: response.status
    }
}


export const login = async (email: string, password: string) => {
    const response = await fetch(`${url}/login/`, initPost({ email, password }))
    const res = await response.json()

    return {
        user: res,
        status: response.status
    }
}

export const logout = async (token: string) => {
    const response = await fetch(`${url}/logout/`, initPost({}, token))
    return {
        status: response.status
    }
}

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${url}/users/`, initGet())
    const res = await response.json()
    console.log(res)
    return res.results
}

export const banUser = async (id: number, is_banned: boolean, token: string) => {
    const response = await fetch(`${url}/users/${id}/`, initPatch({ is_banned }, token))
    const res = await response.json()
    console.log(res)
    return {
        status: response.status,
        res: res
    }
}

export const getBoards = async (): Promise<Board[]> => {
    const response = await fetch(`${url}/boards/`, initGet())
    const res = await response.json()
    console.log(res)
    return res
}

export const addNewBoard = async (name: string, topic: string, image: string, description: string, token: string) => {
    const response = await fetch(`${url}/boards/`, initPost({ name, topic, image, description }, token))
    const res = await response.json()
    console.log(res)
    return {
        status: response.status,
        board: res
    }
}

export const deleteBoard = async (id: number, token: string) => {
    const response = await fetch(`${url}/boards/${id}/`, initDelete(token)).catch(e => e)
    return {
        status: response.status
    }
}

// adds a new topic and updates list of boards to specified topics
export const addNewTopic = async (name: string, list: number[], token: string) => {
    const response = await fetch(`${url}/topics/`, initPost({ name }, token))
    const res = await response.json()
    const topic = res.id
    if (response.status === 201) {
        const response = await Promise.all(
            list.map(async id => {
                console.log(id)
                const resp = await fetch(`${url}/boards/${id}/`, initPatch({ topic }, token)).catch(e => console.log(e))
                return resp
            })
        )
        console.log(response)
    }
    return {
        ids: list,
        status: response.status,
        body: res
    }
}

export const getTopics = async () => {
    const response = await fetch(`${url}/topics/`, initGet())
    const res = await response.json()
    return res
}

export const getThreads = async () => {
    const response = await fetch(`${url}/threads/`, initGet())
    const res = await response.json()
    console.log(res)
    return res.results
}

export const getThreadsPage = async (page: number, board: number) => {
    const response = await fetch(`${url}/threads/?page=${page}&board=${board}`, initGet())
    const res = await response.json()
    console.log(res)
    return {
        threads: res.results,
        count: res.count
    }
}

export const lockThread = async (id: number, is_locked: boolean, token: string) => {
    const response = await fetch(`${url}/threads/${id}/`, initPatch({ is_locked }, token))
    const res = await response.json()
    console.log(res)
    return {
        status: response.status,
        res: res
    }
}

export const addNewThread = async (name: string, is_sticky: boolean, created_at: string, is_locked: boolean, board: number, token: string) => {
    console.log(created_at)
    const response = await fetch(`${url}/threads/`, initPost({ name, is_sticky, created_at, is_locked, board }, token))
    const res = await response.json()
    console.log(res)
    return {
        status: response.status,
        body: res
    }
}

export const getPosts = async () => {
    const response = await fetch(`${url}/posts/`, initGet())
    const res = await response.json()
    return res
}

export const getPostsPage = async (page: number) => {
    const response = await fetch(`${url}/posts/?page=${page}`, initGet())
    const res = await response.json()
    console.log(res)
    return {
        count: res.count,
        posts: res.results
    }
}

export const addNewPost = async (message: string, created_at: string, thread: number, token: string) => {
    const response = await fetch(`${url}/posts/`, initPost({ created_at, message, thread }, token))
    const res = await response.json()
    return {
        status: response.status,
        post: res
    }
}