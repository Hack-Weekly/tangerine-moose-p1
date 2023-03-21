import { Box, Button, List, ListItem, Modal, Typography } from '@mui/material';
import React, { FC, Fragment } from 'react';
import styles from './ChatroomUsers.module.css';
import { grey } from '@mui/material/colors';
import { bgcolor, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Size } from '../../../interfaces/size';

interface ChatroomUsersProps {
  users: string[];
}

const UserList: FC<ChatroomUsersProps> = ({ users }) => {
  return (
    <Box className={styles['users-list']}>
      <List sx={{ py: 0, overflow: 'scroll', height: '100%' }}>
        {users.map((user) => (
          <ListItem sx={{ px: 1, py: 0.5 }}>{user}</ListItem>
        ))}
      </List>
    </Box>
  );
};

const ChatroomUsers: FC<ChatroomUsersProps> = ({ users }) => {
  const theme = useTheme();
  const [openUsersList, setOpenUsersList] = React.useState(false);
  const handleOpenUsersList = () => setOpenUsersList(true);
  const handleCloseUsersList = () => setOpenUsersList(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box className={styles.ChatroomUsers} sx={{ mr: 1 }}>
      {isSmallScreen && (
        <Button
          variant='outlined'
          color='primary'
          type='submit'
          onClick={handleOpenUsersList}
          sx={{ mb: 1 }}
        >
          Show users
        </Button>
      )}

      {!isSmallScreen && (
        <Fragment>
          <Typography
            component='h2'
            variant='h6'
            sx={{ textAlign: 'center', position: 'sticky', top: 0 }}
          >
            Users
          </Typography>
          <UserList users={users} />
        </Fragment>
      )}

      <Modal
        open={openUsersList && isSmallScreen}
        onClose={handleCloseUsersList}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={modalContentStyle}>
          <UserList users={users} />
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
