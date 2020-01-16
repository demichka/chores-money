import { User } from "./user.model";

export class Transaction {
    _id: string;
    amount: number;
    desc: string;
    date: Date;
    author: User;
}

export class TransactionInterface {
    amount: number;
    desc: string;
}
