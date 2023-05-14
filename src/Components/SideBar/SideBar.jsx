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
import { UserContext, Users } from "../../Pages/Home/HomePage";

import "./SideBar.scss";

function SideBar() {
  const { userContext, setUserContext } = useContext(UserContext);

  useEffect(() => {
    setUserContext(Users[0]);
  }, []);

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
        {Users.map((user, index) => {
          return (
            <div
              key={index}
              className="side_bar__users__user"
              onClick={(e) => {
                setUserContext(user);
              }}
            >
              <Avatar />
              <div className="side_bar__users__user__description">
                <div className="side_bar__users__user__description__name_time">
                  <p>{user.name}</p>
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
                {/* <i className="fa-solid fa-chevron-down"></i> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
