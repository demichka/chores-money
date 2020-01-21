import { User } from "./user.model";

export class Transaction {
    _id: string;
    amount: number;
    desc: string;
    date: Date;
    author: User;
    receiver?: User;
}

export class TransactionInterface {
    amount: number;
    desc: string;
    receiver?: User;
}
