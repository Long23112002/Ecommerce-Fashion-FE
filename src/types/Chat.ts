type Reply = {
    id?: string,
    content?: string,
    createBy?: number,
    createAt?: Date,
    nameCreateBy?: string
}

type Chat = {
    id?: string,
    idRoom?: string,
    content?: string,
    seen?: boolean,
    createBy?: number,
    createAt?: Date,
    avatar?: string,
    nameCreateBy?: string
    reply?: Reply
}
export default Chat