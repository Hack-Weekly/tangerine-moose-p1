import { User, UserObj } from './User';

export interface ChatInfo {
    isChannel: boolean;
    chatName: string;
    receiverId: string;
    users: User[];
  }