export interface Location {
    country: string;
    city: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    date_of_birth: string;
    hometown: string;
    location: Location;
    about: string;
    website: string;
    avatar: string;
    interests: string;
    is_banned: boolean;
    is_admin: boolean;
    is_moderator: boolean;
    gender: string;
}

export interface LoggedUser {
    user: User;
    key: string;
}

export interface Thread {
    id: number;
    name: string;
    is_sticky: boolean;
    created_at: string;
    is_locked: boolean;
    board: number;
    posts: Post[];
    latest_reply_date: string;
    latest_replier: string
}

export interface Post {
    id: number;
    author: number;
    created_at: string;
    message: string;
    thread: Thread;
    replies: Reply[];
}

export interface Reply {
    id: number;
    created_at: string;
    author: User;
    body: string;
    post: Post;
}

export interface Board {
    id: number;
    name: string;
    topic?: number;
    image: string;
    threads: Thread[];
    description: string;
}

export interface Topic {
    id: number;
    name: string;
    user: User;
    boards: Board[];
}