import { Button, SxProps, Theme } from '@mui/material';
import { setCurrentChat } from 'features/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { socket } from 'socket';
import { RootState } from 'store/store';


interface LeaveRoomButtonProps {
    sx?: SxProps<Theme>;
  }

const LeaveRoomButton = ({sx}: LeaveRoomButtonProps) => {
  const dispatch = useDispatch();
  const currentChat = useSelector((state: RootState) => state.user.currentChat);

  return (
    <Button sx={sx} variant='contained' onClick={() => dispatch(setCurrentChat(null))} disabled={!currentChat}>
      Leave
    </Button>
  );
};

export default LeaveRoomButton;
