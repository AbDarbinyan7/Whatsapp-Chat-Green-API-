import React, { useContext } from "react";
import ReactDOM from "react-dom";

import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { Avatar, IconButton } from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import MessageIcon from "@mui/icons-material/Message";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./SideBar.scss";
import { USERIDS, UserContext, UsersContext } from "../../Routes/AppRoutes";
import { Users } from "../../Pages/Home/HomePage";
import axios from "axios";

function SideBar() {
  const { userContext, setUserContext } = useContext(UserContext);
  const { usersContext, setUsersContext } = useContext(UsersContext);
  const { userIds, setUserIds } = useContext(USERIDS);

  useEffect(() => {
    console.log(usersContext);
  }, [usersContext]);

  return (
    <div className="side_bar">
      <div className="side_bar__admin_panel">
        <Avatar />
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
                      02:42
                    </div>
                  </div>
                  <div className="side_bar__users__user__description__text_nots">
                    <p>Last message...</p>
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
