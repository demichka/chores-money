import { User } from "./user.model";

export class Message {
    _id: string;
    text: string;
    date: Date;
    receiver: User;
    sender: User;
    unread: boolean;
    choreAction?: string;
}
