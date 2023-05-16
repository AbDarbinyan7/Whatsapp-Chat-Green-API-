import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../Pages/Home/HomePage";
import LoginPage from "../Pages/LogIn/LogInPage";
import { createContext, useEffect, useState } from "react";

export const USERIDS = createContext({
  IDINSTANCE: null,
  APITOKENINSTANSE: null,
  CHATID: null,
});

export const UsersContext = createContext(null);
export const UserContext = createContext([]);

function AppRoutes() {
  const [userIds, setUserIds] = useState(null);
  const [userContext, setUserContext] = useState();
  const [usersContext, setUsersContext] = useState([]);

  return (
    <USERIDS.Provider value={{ userIds, setUserIds }}>
      <UsersContext.Provider value={{ usersContext, setUsersContext }}>
        <UserContext.Provider value={{ userContext, setUserContext }}>
          <Routes>
            <Route path={"/"} element={<LoginPage />} />
            <Route path={"/whatsapp"} element={<HomePage />} />
          </Routes>
        </UserContext.Provider>
      </UsersContext.Provider>
    </USERIDS.Provider>
  );
}

export default AppRoutes;
