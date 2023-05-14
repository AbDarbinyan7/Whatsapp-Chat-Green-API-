import { useContext, useEffect, useRef, useState } from "react";

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
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import "./Chat.scss";
import axios from "axios";
import ScrollContainer from "react-indiana-drag-scroll";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../../Pages/Home/HomePage";

const messagesArr = [];

const IDINSTANCE = 1101820135;
const APITOKENINSTANSE = "3945021c508d4c79bf3bf54562ec601178d43da81b3847628d";

function Chat() {
  const { userContext, setUserContext } = useContext(UserContext);

  const [userState, setUserState] = useState();
  const [smsState, setSmsState] = useState(null);
  const [smsFlagState, setFlagSmsState] = useState();
  const [smsInputState, setSmsInputState] = useState();
  const [messagesArr, setMessagesArr] = useState([]);

  const chatRef = useRef(null);

  const el = document.querySelector(".chat__body__messages");

  function toGetLocalTmeNow() {
    let time = new Date(Date.now() + 0 * 60 * 60 * 1000).toLocaleTimeString(
      "en-AM",
      {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
      }
    );

    return time;
  }

  const scrollToBottom = () => {
    if (chatRef.current) {
      const lastMessage = chatRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  function toSetValues(event) {
    // toSendMessage(event.target.value);
    if (event.target.value && event.target.value !== "") {
      setMessagesArr([
        ...messagesArr,
        {
          receiver: userContext.name,
          textMessage: event.target.value,
          time: toGetLocalTmeNow(),
          type: "outgoing",
          sendByApi: true,
        },
      ]);
    }

    console.log("asdasdad");
    event.target.value = "";
  }

  function toSendMessage(value) {
    let idSms = null;
    axios
      .post(
        `https://api.green-api.com/waInstance${IDINSTANCE}/SendMessage/${APITOKENINSTANSE}`,
        {
          chatId: "37494676058@c.us",
          message: value,
        }
      )
      .then((res) => {
        if (res.data) {
          idSms = res.data.idMessage;
        }
      });
  }

  useEffect(() => {
    // toGetAllMessages();
  }, []);

  function toGetAllMessages() {
    let allMessagesArr = [];
    axios
      .post(
        `https://api.green-api.com/waInstance${IDINSTANCE}/getChatHistory/${APITOKENINSTANSE}`,
        {
          chatId: "37494676058@c.us",
          count: 50,
        }
      )
      .then((res) => {
        if (res.data) {
          res.data.map((sms) => {
            allMessagesArr.push({
              chatId: sms.chatId,
              idMessage: sms.idMessage,
              sendByApi: sms.sendByApi,
              statusMessage: sms.statusMessage,
              textMessage: sms.textMessage,
              timestamp: sms.timestamp,
              type: sms.type,
            });
          });
        }
        allMessagesArr.reverse();
        setMessagesArr(allMessagesArr);
      });
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header__left_side">
          <Avatar />
          <div className="chat__header__left_side__name">
            <p>{userContext?.name}</p>
          </div>
        </div>
        <div className="chat__header__right_side">
          <div className="chat__header__right_side__search">
            <IconButton>
              <SearchOutlinedIcon />
            </IconButton>
          </div>
          <div className="chat__header__right_side__settings">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <ScrollableFeed className="chat__body">
        <div className="chat__body__messages_list" ref={chatRef}>
          {messagesArr.length !== 0 &&
            messagesArr.map((sms, index) => {
              if (sms.textMessage) {
                return (
                  <div
                    key={index}
                    className={
                      sms.type == "outgoing" && sms.sendByApi
                        ? "chat__body__messages_list__outgoing_sms"
                        : "chat__body__messages_list__outgoing_sms chat__body__messages_list__incoming_sms"
                    }
                  >
                    {sms.textMessage}
                    {
                      <span className="chat__body__messages_list__outgoing_sms__timestamp">
                        {sms.time}
                        <DoneAllOutlinedIcon
                          style={{ fontSize: 15 }}
                          color="disabled"
                        />
                      </span>
                    }
                  </div>
                );
              }
            })}
        </div>
      </ScrollableFeed>
      <div className="chat__bottom">
        <div className="chat__bottom__emoji_attach">
          <IconButton>
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
        </div>
        <div className="chat__bottom__input">
          <input
            type="text"
            placeholder="Введите сообщение"
            onKeyUp={(ev) => {
              if (ev.keyCode === 13) {
                toSetValues(ev);
              }
              ev.preventDefault();
            }}
          />
        </div>
        <IconButton>
          <KeyboardVoiceIcon />
        </IconButton>
      </div>
    </div>
  );
}
export default Chat;
