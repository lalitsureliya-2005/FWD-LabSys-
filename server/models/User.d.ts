import { Model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email?: string;
    passwordHash: string;
    role: 'Admin' | 'Doctor' | 'LabStaff' | 'user';
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

declare const User: Model<IUser>;
export default User;
