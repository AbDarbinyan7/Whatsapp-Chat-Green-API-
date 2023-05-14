import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../Pages/Home/HomePage";
import LoginPage from "../Pages/LogIn/LogInPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage />} />
      <Route path={"/whatsapp"} element={<HomePage />} />
    </Routes>
  );
}

export default AppRoutes;
