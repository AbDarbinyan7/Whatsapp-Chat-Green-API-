import { Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import HomePage from "../Pages/Home/HomePage";
import LoginPage from "../Pages/LogIn/LogInPage";

export const USERIDS = createContext({
  IDINSTANCE: null,
  APITOKENINSTANSE: null,
  CHATID: null,
});

export const UsersContext = createContext(null);
export const UserContext = createContext([]);
export const MessagesContext = createContext([]);

function AppRoutes() {
  const [userIds, setUserIds] = useState(null);
  const [userContext, setUserContext] = useState();
  const [usersContext, setUsersContext] = useState([]);
  const [messagesContext, setMessagesContext] = useState([]);

  return (
    <USERIDS.Provider value={{ userIds, setUserIds }}>
      <MessagesContext.Provider value={{ messagesContext, setMessagesContext }}>
        <UsersContext.Provider value={{ usersContext, setUsersContext }}>
          <UserContext.Provider value={{ userContext, setUserContext }}>
            <Routes>
              <Route path={"/"} element={<LoginPage />} />
              <Route path={"/whatsapp"} element={<HomePage />} />
            </Routes>
          </UserContext.Provider>
        </UsersContext.Provider>
      </MessagesContext.Provider>
    </USERIDS.Provider>
  );
}

export default AppRoutes;
