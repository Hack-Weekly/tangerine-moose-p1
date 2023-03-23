import { FC, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from 'store/store';
import { socket } from 'socket';
import { resetUserState, setConnected, setCurrentChat, setJoinedServer, setSessionId, setUsers, setUsersOfChannel } from 'features/user/userSlice';
import { User } from 'interfaces/User';
interface SocketIOProps {
  children: JSX.Element;
}

const SocketIO: FC<SocketIOProps> = ({ children }: SocketIOProps) => {
  const connected = useSelector((state: RootState) => state.user.connected);
  const joinedServer = useSelector((state: RootState) => state.user.joinedServer);
  const sessionId = useSelector((state: RootState) => state.user.sessionId);
  const dispatch = useDispatch();

  useEffect(() => {
    function onConnect() {
      console.log('[Connected] socket.id: ', socket.id);
      dispatch(setSessionId(socket.id));
      dispatch(setConnected(true));
    }
    function onDisconnect() {
      console.log('[Disconnected] socket.id: ', socket.id);
      dispatch(resetUserState());
    }
    function onUpdateUsers(users: User[]) {
      dispatch(setUsers(users));
    }
    function onNewMessage({ content, chatName, sender }: any) {
      // console.log({ content, chatName, sender });
    }
    function onUpdateRoomUsers(users: User[], channel: string) {
      console.log('[onUpdateRoomUsers]', channel , users );
      dispatch(setUsersOfChannel({ channel, users }));
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('update_users', onUpdateUsers);
    socket.on('new_message', (onNewMessage));
    socket.on('update_room_users', (onUpdateRoomUsers));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update_users', onUpdateUsers);
      socket.off('new_message', onNewMessage);
      socket.off('update_room_users', onUpdateRoomUsers);
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default SocketIO;
