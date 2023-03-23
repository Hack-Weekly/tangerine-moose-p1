import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import styles from './Login.module.css';
import LoginForm from './LoginForm/LoginForm';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername, setConnected, setJoinedServer, setSessionId } from 'features/user/userSlice';
import { RootState } from 'store/store';
import { socket } from 'socket';
import { useNavigate } from 'react-router-dom';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [bypassLogin, setBypassLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState<string>('KV');
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const username = useSelector((state: RootState) => state.user.username);
  const sessionId = useSelector((state: RootState) => state.user.sessionId);
  const connected = useSelector((state: RootState) => state.user.connected);
  const joinedServer = useSelector((state: RootState) => state.user.joinedServer);
  const dispatch = useDispatch();
  const handleSetByPassLogin = () => {
    if (!bypassLogin) {
      setPassword('');
    }
    setBypassLogin(!bypassLogin);
  };
  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsernameInput(e.target.value);
  const navigate = useNavigate();

  useEffect(() => {
    function onUsernameTaken() {
      console.log('Username is taken!');
      setUsernameTaken(true);
    }
    function onJoinSuccess(username: string) {
      console.log('Joined server success!');
      setUsernameTaken(false);
      dispatch(setJoinedServer(true));
      dispatch(setUsername(username));
      navigate('/chatroom');
    }
    socket.on('username_taken', onUsernameTaken);
    socket.on('join_success', onJoinSuccess);

    return () => {
      socket.off('username_taken', onUsernameTaken);
      socket.off('join_success', onJoinSuccess);
    };
  }, []);

  const handleConnect = () => {
    if (!joinedServer) {
      socket.auth = { username: usernameInput };
      socket.connect();
      socket.emit('join_server', usernameInput);
      // socketRef.current.emit('join_room', 'general', (messages) => roomJoinCallback(messages, 'general'));
    } else {
      console.log(`Already joined the server with username ${username} ${sessionId}!`);
    }
  };

  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography component='h1' variant='h4'>
        {bypassLogin ? "Let's chat!" : 'Login'}
      </Typography>

      <LoginForm
        username={usernameInput}
        password={password}
        bypassLogin={bypassLogin}
        onSetBypassLogin={handleSetByPassLogin}
        onSetPassword={handleSetPassword}
        onUsernameChange={handleUsernameChange}
        onConnect={handleConnect}
        usernameTaken={usernameTaken}
      />
      <Box sx={{ textAlign: 'center' }}>
        <div>{connected ? 'Connected' : 'Not connected'}</div>
        {connected && <div>Joined as: {joinedServer ? username : 'Not joined'}</div>}
      </Box>
    </Box>
  );
};

export default Login;
