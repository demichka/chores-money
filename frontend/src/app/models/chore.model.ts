import { User } from "./user.model";

export class Chore {
    id: string;
    desc: string;
    isDonation: boolean;
    cost: number;
    isDone: boolean;
    isPaid: boolean;
    performer: User;
    payer: User;
    author: User;
    date: Date;
    isConfirmed: boolean;
}

export class ChoreInterface {
    desc: string;
    isDonation: boolean;
    cost: number;
    phone: string;
}
