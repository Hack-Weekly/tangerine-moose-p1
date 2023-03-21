import './Chat.css';

import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3000/'); //url of frontend server

export default function Chat() {
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState('');
  const [oldRecipient, setOldRecipient] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<any[]>([]);

  function selectRecipient() {
    if (username !== '' && recipient !== '') {
      if (oldRecipient !== recipient) {
        setOldRecipient(recipient);
      }
      socket.emit('select_recipient', { old: oldRecipient, new: recipient });
      setMessageList([]); //this is where we would load the specific recipients users messages from the database
    }
  }

  async function sendMessage() {
    console.log(oldRecipient);
    if (currentMessage.trim() !== '') {
      const messageData = {
        recipient: recipient,
        sender: username,
        message: currentMessage,
        timestamp: Date.now(),
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  }

  useEffect((): any => {
    function addMessage(data: any) {
      setMessageList((list) => [...list, data]);
    }
    socket.on('recieve_message', addMessage);
    return () => socket.off('recieve_message', addMessage);
  }, [socket]);

  return (
    <>
      <h3>Join A Chat</h3>
      <p>
        {'Messaging user: ' +
          (recipient === '' ? 'No recipient selected' : recipient)}
      </p>
      <p>{'User: ' + (username === '' ? 'Not signed in' : username)}</p>

      <input
        type='text'
        placeholder='Name:'
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />

      <input
        type='text'
        placeholder='Recipient id'
        onChange={(event) => {
          setRecipient(event.target.value);
          console.log(oldRecipient);
        }}
      />

      <button onClick={selectRecipient}>Select recipient</button>

      <input
        type='text'
        placeholder='message'
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        value={currentMessage}
      />

      <button onClick={sendMessage}>Send message</button>

      <div>
        {messageList.map((messageData, index) => {
          return (
            <div key={index} className='message'>
              <p>{'user: ' + messageData.sender}</p>
              <p>{'message: ' + messageData.message}</p>
              <p>
                {'time: ' +
                  new Date(messageData.timestamp).toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
