import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import css from './Chatroom.module.css';
import { TextField, Button, Typography } from '@mui/material';
import { red, grey } from '@mui/material/colors';
import ChatroomUsers from './ChatroomUsers/ChatroomUsers';
import { Socket } from 'socket.io-client';
import immer from 'immer';
import { socket } from 'socket';
import { useTheme } from '@mui/system';
import LeaveRoomButton from 'components/LeaveRoomButton/LeaveRoomButton';
import { ChatInfo } from 'interfaces/ChatInfo';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { addUserToChannel, setChannels, setCurrentChat, setUsersOfChannel } from 'features/user/userSlice';
import { useDispatch } from 'react-redux';
import { User } from 'interfaces/User';
import { format, parseISO } from 'date-fns';

interface ChatroomProps {
  window?: () => Window;
}

type Messages = {
  [key: string]: Message[];
};

interface Message {
  sender: string;
  content: string;
  date: Date | String;
  chatName: string;
}

const initialMessagesState: Messages = {
  general: [],
  random: [],
  jokes: [],
};

const rooms = ['general', 'random', 'jokes'];

const roomsState = {
  general: {
    users: ['KV', 'John', 'Jane'],
  },
};

const Chatroom: FC<ChatroomProps> = (props: ChatroomProps) => {
  const dispatch = useDispatch();
  const { window } = props;
  const [username, setUserName] = useState<string>('KV'); // current username
  const [inputValue, setInputValue] = useState<string>(''); // input from message text field
  // const [currentChat, setCurrentChat] = useState<ChatInfo>({ isChannel: true, chatName: 'general', receiverId: '' });
  const [connectedRooms, setConnectedRooms] = useState<string[]>(['general']);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Messages>(initialMessagesState);
  const [showUsers, setShowUsers] = React.useState(false);

  const textInput = useRef<HTMLInputElement>(null);
  const messageContainerEnd = useRef<HTMLDivElement>(null);

  const currentChat = useSelector((state: RootState) => state.user.currentChat);
  const channels = useSelector((state: RootState) => state.user.channels);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent default form submit behavior
    if (!currentChat) return;
    // build payload to send to server
    const payload = {
      content: inputValue,
      to: channels[currentChat].isChannel ? currentChat : channels[currentChat].receiverId,
      sender: username,
      chatName: currentChat,
      isChannel: channels[currentChat].isChannel,
      date: new Date(),
    };

    socket.emit('send_message2', payload);
    // add message to local messages state
    const newMessages = immer(messages, (draft) => {
      draft[currentChat].push({
        sender: username,
        content: inputValue,
        date: new Date(),
        chatName: currentChat,
      });
    });

    console.log(`submitting message: ${inputValue} to ${currentChat}`);
    setMessages(newMessages);

    setInputValue(''); // clear input field
    textInput.current?.focus(); // focus on last message
  };

  const toggleChat = (currentChat: string) => {
    if (!messages[currentChat]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat] = [];
      });
      setMessages(newMessages);
    }
    console.log('currentChat', currentChat);
    dispatch(setCurrentChat(currentChat));
    joinRoom(currentChat);
  };

  const joinRoom = (room: string) => {
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });

    socket.emit('join_room', room, (response: any) => roomJoinCallback(response, room));
    setConnectedRooms(newConnectedRooms);
  };

  const roomJoinCallback = (response: any, room: string) => {
    console.log('roomJoinCallback', response, room);
    const newMessages = immer(messages, (draft) => {
      const roomMessages = response.messages as Message[];
      roomMessages.forEach((message) => {
        message.date = parseISO(message.date as string);
      });
      draft[room] = roomMessages;
    });
    console.log('Room users -> ', response.users);
    console.log('Room messages:', response.messages);
    setMessages(newMessages);
    const users = response.users as User[];
    users && dispatch(setUsersOfChannel({ channel: room, users: users }));
    console.log(currentChat, room);
  };

  const scrollToBottom = () => {
    messageContainerEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleShowUsers = (e: React.MouseEvent<HTMLElement>) => {
    setShowUsers(!showUsers);
  };

  const handleHideUsers = () => {
    setShowUsers(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function onNewMessage(message: Message) {
      console.log(message);
      setMessages((messages) => {
        const newMessages = immer(messages, (draft) => {
          if (draft[message.chatName]) {
            draft[message.chatName].push(message);
          } else {
            draft[message.chatName] = [message];
          }
        });
        return newMessages;
      });
    }

    socket.on('new_message', onNewMessage);

    return () => {
      socket.off('new_message', onNewMessage);
    };
  }, []);

  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('md'));

  const renderRooms = (room: string) => {
    const currentChat = room;
    return (
      <Box key={room} onClick={() => toggleChat(currentChat)}>
        {room}
      </Box>
    );
  };

  const renderMessages = ({ sender, content, date }: { sender: string; content: string, date: Date }, index: number) => {
    const formattedDate = date ? format(date, 'h:mm aa') : '';
    return (
      <Typography key={index} variant='body1' sx={{ mb: 0.5 }}>
        {`[${formattedDate}]`} {sender}: {content}
      </Typography>
    );
  };

  return (
    <Box id='chatroom' sx={styles.chatroom}>
      {/* App Bar */}
      <Box id='chatroom-nav' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center' }}>
        {currentChat && (
          <Fragment>
            <Typography variant='h6' component='div'>
              Room: {currentChat}
            </Typography>
            <Box id='chatroom-btn-group'>
              <Button sx={{ display: { xs: 'inline-flex', md: 'none' } }} variant='outlined' color='primary' type='submit' onClick={toggleShowUsers}>
                Users
              </Button>
              <LeaveRoomButton sx={{ ml: 1 }} />
            </Box>
          </Fragment>
        )}
        {!currentChat && <Box sx={{ flex: 1 }}>Channels</Box>}
      </Box>
      {/* Chatroom Content */}
      {currentChat && (
        <Box id='chatroom-content' sx={{ minHeight: 0, display: 'flex', flex: 1, gap: 2 }}>
          <Box id='left-panel' className={css['border']} sx={{ overflowY: 'scroll', width: '30%', display: { xs: 'none', md: 'block' } }}>
            <ChatroomUsers showUsers={showUsers} onHideUsers={handleHideUsers} />
          </Box>
          <Box id='right-panel' sx={styles.rightPanel}>
            <Box id='chatroom-messages' className={`custom-scroll ${css['border']}`} sx={{ flex: 1, overflowY: 'scroll', px: 1, py: 1 }}>
              {messages[currentChat].map(renderMessages)}
              <div ref={messageContainerEnd}></div>
            </Box>
            <Box id='chatroom-group-inputs'>
              <Box component='form' onSubmit={handleSubmit} sx={styles.inputContainer}>
                <TextField
                  id='message-input'
                  variant='outlined'
                  value={inputValue}
                  onChange={handleInputChange}
                  sx={{ flex: 1, mr: 1 }}
                  InputLabelProps={{ shrink: false }}
                  autoComplete='off'
                  inputRef={textInput}
                />
                <Button disabled={inputValue === ''} variant='outlined' color='primary' type='submit'>
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {/* Room list */}
      {!currentChat && (
        <Box id='chatroom-channels' sx={{ minHeight: 0, display: 'flex', flex: 1, gap: 2 }}>
          {rooms.map(renderRooms)}
        </Box>
      )}
    </Box>
  );
};

export default Chatroom;

const styles = {
  chatroom: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 4,
    backgroundColor: grey[900],
    padding: { xs: 1.5, sm: 2, md: 3 },
    gap: 2,
  },
  rightPanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    width: { xs: '100%', md: '70%' },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
};
