import "./HomePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import SideBar from "../../Components/SideBar/SideBar";
import Chat from "../../Components/Chat/Chat";
import { createContext, useState } from "react";

export const Users = [
  {
    name: "Edmon",
    photo: "url(../imges/user.png)",
  },
];

export const UserContext = createContext(null);

function HomePage() {
  const [userContext, setUserContext] = useState();
  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <div className="home_page">
        <SideBar />
        <Chat />
      </div>
    </UserContext.Provider>
  );
}

export default HomePage;
