import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

const PrivateRoutes = ({ children }: any) => {
  const { logged } = useSelector((state: RootState) => state.auth);

  return logged ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
