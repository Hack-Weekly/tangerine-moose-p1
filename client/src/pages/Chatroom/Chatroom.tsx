import React, { FC, useState } from 'react';
import { Box, createTheme, Theme } from '@mui/material';
import { styled } from '@mui/system';
import { TextField, Button, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 3,
  },
  messageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    mb: 3,
  },
  message: {
    mb: 1,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    mr: 1,
  },
};

interface ChatroomProps {}

const Chatroom: FC<ChatroomProps> = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages([...messages, inputValue]);
    setInputValue('');
  };
  return (
    <Box sx={styles.container}>
      <Typography variant='h4' gutterBottom>
        Chatroom
      </Typography>
      <Box sx={styles.messageContainer}>
        {messages.map((message, index) => (
          <Typography key={index} variant='body1' sx={{ mb: 1 }}>
            {message}
          </Typography>
        ))}
      </Box>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={styles.inputContainer}
      >
        <TextField
          id='message-input'
          label='Enter your message'
          variant='outlined'
          value={inputValue}
          onChange={handleInputChange}
          sx={styles.input}
        />
        <Button variant='contained' color='primary' type='submit'>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatroom;
