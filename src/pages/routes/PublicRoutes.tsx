import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

const PublicRoutes = ({ children }: any) => {
  const { logged } = useSelector((state: RootState) => state.auth);

  return !logged ? children : <Navigate to="/" />;
};

export default PublicRoutes;
