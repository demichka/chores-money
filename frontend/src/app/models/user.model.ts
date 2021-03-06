export class User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isParent: boolean;
    balance: number;
    children: [];
    parents: [];
    password: string;
    isActive: boolean;
    currency: string;
    myChores: [];
    assignedChores: [];
    choresForPayment: [];
    transactions: [];
}

export class UserInterface {
    name: string;
    phone: string;
    email: string;
    password: string;
    isParent: boolean;
}
