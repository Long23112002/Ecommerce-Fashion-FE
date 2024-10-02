type ChatRoom = {
    id?: string,
    idClient?: number,
    nameClient?: string,
    avatar?: string,
    seen?: boolean,
    lastChatContent?: string,
    lastChatSendBy?: number
}

export default ChatRoom