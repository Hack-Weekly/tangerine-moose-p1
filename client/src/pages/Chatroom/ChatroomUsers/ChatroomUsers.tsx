import { Box, Button, List, ListItem, Modal, Typography } from '@mui/material';
import React, { FC, Fragment } from 'react';
import styles from './ChatroomUsers.module.css';
import { bgcolor, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { grey } from '@mui/material/colors';

interface ChatroomUsersProps {
  showUsers: boolean;
  onHideUsers: () => void;
}

const UserList = () => {
  const users = useSelector((state: RootState) => state.user.users);
  const sessionId = useSelector((state: RootState) => state.user.sessionId);
  const channels = useSelector((state: RootState) => state.user.channels);
  const currentChat = useSelector((state: RootState) => state.user.currentChat);
  const usersInRoom = currentChat && channels[currentChat].users

  return (
    <List className='custom-scroll' sx={{ py: 0, overflowY: 'scroll', height: '100%' }}>
      {usersInRoom &&
        usersInRoom.map((user, index) => (
          <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
            {user.username} {user.id === sessionId && '(You)'}
          </ListItem>
        ))}
    </List>
  );
};

const ChatroomUsers: FC<ChatroomUsersProps> = ({ showUsers, onHideUsers }) => {
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('md'));

  const handleHideUsers = () => {
    onHideUsers();
  };

  return (
    <Box id='ChatroomUsers' className={styles.ChatroomUsers} sx={{}}>
      {/* For desktops */}
      {!isSmallScreen && (
        <Fragment>
          <Typography component='h2' variant='h6' sx={{ textAlign: 'center', position: 'sticky', top: 0, bgcolor: grey[900], zIndex: 1 }}>
            Users
          </Typography>
          <UserList />
        </Fragment>
      )}
      {/* Modal for mobile & tablet devices */}
      <Modal open={showUsers && isSmallScreen} onClose={handleHideUsers} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={modalContentStyle}>
          <UserList />
        </Box>
      </Modal>
    </Box>
  );
};

const modalContentStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '66vw',
  bgcolor: 'rgb(0,0,0,1)',
  maxHeight: '50vh',
  overflowY: 'scroll',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
};

export default ChatroomUsers;
