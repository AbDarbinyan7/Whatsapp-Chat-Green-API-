import React, { useContext } from "react";

import { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import MessageIcon from "@mui/icons-material/Message";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";

import "./SideBar.scss";

import {
  MessagesContext,
  USERIDS,
  UserContext,
  UsersContext,
} from "../../Routes/AppRoutes";
import { convertTo24HourFormat } from "../Chat/Chat";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const { messagesContext, setMessagesContext } = useContext(MessagesContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const { usersContext, setUsersContext } = useContext(UsersContext);
  const { userIds, setUserIds } = useContext(USERIDS);

  const navigate = useNavigate();

  const [lastMessageAndTime, setLastMessageAndTime] = useState();

  useEffect(() => {
    if (messagesContext.length) {
      let lastMessage = messagesContext.map((sms, i) => {
        if (i === messagesContext.length - 1) {
          let timeAndSms = {
            lastMessage: sms.textMessage,
            timestamp:
              typeof sms.timestamp === "number"
                ? convertTo24HourFormat(sms.timestamp)
                : sms.timestamp,
          };
          return setLastMessageAndTime(timeAndSms);
        }
      });
    }
  }, [messagesContext]);

  return (
    <div className="side_bar">
      <div className="side_bar__admin_panel">
        <div className="side_bar__admin_panel__avatar_log_out">
          <Avatar />
          <IconButton
            onClick={() => {
              navigate("/");
            }}
          >
            <LogoutIcon color="action" />
          </IconButton>
        </div>
        <div className="side_bar__admin_panel__links">
          <IconButton>
            <Groups2Icon />
          </IconButton>
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <MessageIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="side_bar__search">
        <div className="side_bar__search__input">
          <div className="search_icon">
            <IconButton>
              <SearchOutlinedIcon />
            </IconButton>
          </div>
          <input type="text" placeholder="Поиск или новый чат" />
        </div>
        <IconButton>
          <FilterListOutlinedIcon />
        </IconButton>
      </div>
      <div className="side_bar__users">
        {usersContext &&
          Array.isArray(usersContext) &&
          usersContext.map((user, index) => {
            return (
              <div
                key={index}
                className="side_bar__users__user"
                onClick={(e) => {
                  setUserContext(user);
                }}
              >
                <Avatar src={user.avatar} alt="user Avatar" />
                <div className="side_bar__users__user__description">
                  <div className="side_bar__users__user__description__name_time">
                    <p>{user?.name}</p>
                    <div className="side_bar__users__user__description__name_time__time">
                      {lastMessageAndTime?.timestamp}
                    </div>
                  </div>
                  <div className="side_bar__users__user__description__text_nots">
                    <p>{lastMessageAndTime?.lastMessage}</p>
                  </div>
                </div>
                <div className="side_bar__users__user__underline"></div>
                <div className="side_bar__users__user__chevron">
                  <ExpandMoreIcon fontSize="large" color="disabled" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default SideBar;
