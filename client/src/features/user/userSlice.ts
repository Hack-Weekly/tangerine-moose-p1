import { socket } from './../../socket';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User, UserObj } from 'interfaces/User';
import { ChatInfo } from 'interfaces/ChatInfo';

export interface UserState {
    connected: boolean;
    joinedServer: boolean;
    sessionId: string;
    username: string;
    password: string;
    users: User[];
    currentChat: string | null;
    channels: { [key: string]: ChatInfo };
}

type Channels = { [key: string]: ChatInfo };
const rooms = ['general', 'random', 'jokes'];
const result = rooms.reduce((r, key: string) => {
    return {
        ...r,
        [key]: {
            isChannel: true,
            chatName: key,
            receiverId: '',
            users: [],
        },
    }
}, {});

// const testChannel = {
//     'general': {
//         isChannel: true,
//         chatName: 'general',
//         receiverId: '',
//         users: []
//     },
//     'jokes': {
//         isChannel: true,
//         chatName: 'general',
//         receiverId: '',
//         users: []
//     }
// } as { [key: string]: ChatInfo }

const initialState = (): UserState => ({
    connected: false,
    joinedServer: false,
    sessionId: '',
    username: '',
    password: '',
    users: [],
    currentChat: null,
    channels: result
})

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState(),
    reducers: {
        // increment: (state) => {
        //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
        //     // doesn't actually mutate the state because it uses the Immer library,
        //     // which detects changes to a "draft state" and produces a brand new
        //     // immutable state based off those changes
        //     state.value += 1
        // },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        resetUserState: () => initialState(),
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload
        },
        setJoinedServer: (state, action: PayloadAction<boolean>) => {
            state.joinedServer = action.payload
        },
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },
        setCurrentChat: (state, action: PayloadAction<string | null>) => {
            state.currentChat = action.payload
        },
        setChannels: (state, action: PayloadAction<Channels>) => {
            state.channels = action.payload
        },
        addUserToChannel: (state, action: PayloadAction<{ channel: string, user: User }>) => {
            const { channel, user } = action.payload;
            state.channels[channel].users.push(user);
        },
        // addUserToChannel: (state, action: PayloadAction<{ channel: string, userId: string, user: User }>) => {
        //     const { channel, user } = action.payload;
        //     state.channels[channel].userObj.userId = user;
        // },
        removeUserFromChannel: (state, action: PayloadAction<{ channel: string, user: User }>) => {
            const { channel, user } = action.payload;
            state.channels[channel].users = state.channels[channel].users.filter(u => u.id !== user.id);
        },
        // removeUserFromChannel: (state, action: PayloadAction<{ channel: string, userId: string}>) => {
        //     const { channel } = action.payload;
        //     delete state.channels[channel].userObj.userId;
        // },
        setUsersOfChannel: (state, action: PayloadAction<{ channel: string, users: User[] }>) => {
            const { channel, users } = action.payload;
            state.channels[channel].users = users;
        },
        // setUsersOfChannel: (state, action: PayloadAction<{ channel: string, userObj: UserObj }>) => {
        //     const { channel, userObj } = action.payload;
        //     state.channels[channel].userObj = userObj;
        // }
    },
})

// Action creators are generated for each case reducer function
export const { resetUserState, setUsername, setConnected, setJoinedServer, setSessionId, setUsers, setCurrentChat, setChannels, addUserToChannel, removeUserFromChannel, setUsersOfChannel } = userSlice.actions;

export default userSlice.reducer;