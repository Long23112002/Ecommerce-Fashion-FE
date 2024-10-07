type Notification = {
    id: string,
    title?: string,
    content?: string,
    idReceiver?: number,
    nameCreateBy?: string,
    avatar?: string,
    seen?: boolean,
    createAt?: Date
}

export default Notification;
