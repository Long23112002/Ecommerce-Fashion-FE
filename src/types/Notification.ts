type Sender = {
    name: string,
    avatar: string
}

type Notification = {
    id: number,
    message: string,
    sender: Sender,
    viewed: boolean,
    deleted: boolean,
    createAt: Date
}

export default Notification;
