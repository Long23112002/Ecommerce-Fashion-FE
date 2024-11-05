import { User } from "./User"

type Review = {
    id?: number
    user?: User
    rating?: number
    comment?: string
}

export default Review