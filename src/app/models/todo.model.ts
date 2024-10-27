export interface GetTodo {
    id: string;
    title: string;
    content: string;
    position: number;
}

export interface PostTodo {
    title: string;
    content: string;
    position: number;
}

export interface PatchTodo {
    title: string;
    content: string;
    position: number;
}