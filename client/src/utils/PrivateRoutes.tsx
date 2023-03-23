import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from 'store/store';

const PrivateRoutes = () => {
  const connected = useSelector((state: RootState) => state.user.connected);
  const joinedServer = useSelector((state: RootState) => state.user.joinedServer);
  return connected && joinedServer ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoutes;