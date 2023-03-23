import { Theme } from '@mui/material';
import Button from '@mui/material/Button/Button';
import { SxProps } from '@mui/system';
import { setConnected } from 'features/user/userSlice';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { socket } from 'socket';
import { RootState } from 'store/store';
import styles from './DisconnectButton.module.css';

interface DisconnectButtonProps {
  sx?: SxProps<Theme>;
}

const DisconnectButton: FC<DisconnectButtonProps> = ({sx}) => {
  const dispatch = useDispatch();
  const connected = useSelector((state: RootState) => state.user.connected);
  return (
    <Button sx={sx} variant='outlined' onClick={() => socket.disconnect()} disabled={!connected}>
      Disconnect
    </Button>
  );
};

export default DisconnectButton;
