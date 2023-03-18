import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  createTheme,
  Drawer,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
} from '@mui/material';
import css from './Chatroom.module.css';
import { TextField, Button, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { red, grey } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { List } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';

const styles = {
  container: {
    borderRadius: 4,
    backgroundColor: grey[900],
    minWidth: '66vw',
    padding: { xs: 1.5, sm: 2, md: 3 },
  },
  chatBoxContainer: {
    // display: 'flex',
    // flexDirection: 'column',
    // backgroundColor: grey[900],
    // minWidth: '66vw',
    // padding: 3,
    // borderRadius: 4,
  },
  messageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    minHeight: '66vh',
    maxHeight: '66vh',
    textAlign: 'left',
    mb: 3,
  },
  message: {
    mb: 1,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    mr: 1,
  },
};
const drawerWidth = 240;

interface ChatroomProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Chatroom: FC<ChatroomProps> = (props: ChatroomProps) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [username, setUserName] = useState<string>('KV');
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const textInput = useRef<HTMLInputElement>(null);
  const messageContainerEnd = useRef<HTMLDivElement>(null);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages([...messages, inputValue]);
    setInputValue('');
    textInput.current?.focus();
  };

  const scrollToBottom = () => {
    messageContainerEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>

      <Typography component='h1' variant='h4' gutterBottom>
        VIP Room
      </Typography>
      <Grid container sx={styles.container}>
        <Grid item xs={12} md={4}>
          Hello
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={styles.chatBoxContainer}>
            <Box sx={styles.messageContainer} className={`custom-scroll`}>
              {messages.map((message, index) => (
                <Typography key={index} variant='body1' sx={{ mb: 1 }}>
                  {username}: {message}
                </Typography>
              ))}
              <div ref={messageContainerEnd}></div>
            </Box>
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={styles.inputContainer}
            >
              <TextField
                id='message-input'
                variant='outlined'
                value={inputValue}
                onChange={handleInputChange}
                sx={styles.input}
                InputLabelProps={{ shrink: false }}
                autoComplete='off'
                inputRef={textInput}
              />
              <Button
                disabled={inputValue === ''}
                variant='outlined'
                color='primary'
                type='submit'
              >
                Send
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chatroom;
