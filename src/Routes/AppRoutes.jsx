import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../Pages/Home/HomePage";
import LoginPage from "../Pages/LogIn/LogInPage";
import { createContext, useEffect, useState } from "react";

export const USERIDS = createContext({
  IDINSTANCE: null,
  APITOKENINSTANSE: null,
  CHATID: null,
});

function AppRoutes() {
  const [userIds, setUserIds] = useState(null);


  return (
    <USERIDS.Provider value={{ userIds, setUserIds }}>
      <Routes>
        <Route path={"/"} element={<LoginPage />} />
        <Route path={"/whatsapp"} element={<HomePage />} />
      </Routes>
    </USERIDS.Provider>
  );
}

export default AppRoutes;
