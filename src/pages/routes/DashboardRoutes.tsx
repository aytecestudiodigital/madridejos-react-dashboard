import { Route, Routes } from "react-router-dom";
import DashboardPage from "../dashboard/DashboardPage";
import { MainPage } from "../dashboard/MainPage";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<DashboardPage />}>
        <Route path="" element={<MainPage />} />
      </Route>
    </Routes>
  );
};
