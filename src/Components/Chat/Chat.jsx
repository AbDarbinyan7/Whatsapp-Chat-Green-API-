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
import { USERIDS } from "../../Routes/AppRoutes";

const messagesArr = [];

// const IDINSTANCE = 1101820813;
// const APITOKENINSTANSE = "296abde5df1a4e719f85899926bc8566604822eab57044a7a4";
// const CHATID = "37494676058@c.us";

function Chat() {
  const { userContext, setUserContext } = useContext(UserContext);
  const { userIds, setUserIds } = useContext(USERIDS);

  const [smsState, setSmsState] = useState(null);
  const [smsFlagState, setFlagSmsState] = useState();
  const [smsInputValue, setSmsInputValue] = useState();
  const [messagesArr, setMessagesArr] = useState([]);
  const [idSms, setIdSms] = useState();
  const [receiptId, setReceiptId] = useState();

  const chatRef = useRef(null);

  const el = document.querySelector(".chat__body__messages");

  const padZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  useEffect(() => {
    // toGetAllMessages();
  }, []);

  useEffect(() => {
    if (idSms && smsInputValue) {
      toSmsPushInArr(idSms, smsInputValue);
    }
  }, [idSms, smsInputValue]);

  // useEffect(() => {
  //   if (messagesArr.length) {
  //     console.log(messagesArr);
  //   }
  // }, [messagesArr]);

  useEffect(() => {
    const interval = setInterval(() => {
      // toReseiveNotification();
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [messagesArr]);

  useEffect(() => {
    console.log(userIds);
  }, [userIds]);

  function toReseiveNotification() {
    axios
      .get(
        `https://api.green-api.com/waInstance${userIds.IDINSTANCE}/receiveNotification/${userIds.APITOKENINSTANSE}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.body.typeWebhook === "incomingMessageReceived") {
            let resDataBody = res.data.body;
            let notificSms = {
              chatId: resDataBody.senderData.chatId,
              textMessage: resDataBody.messageData.textMessageData.textMessage,
              idInstance: resDataBody.instanceData.idInstance,
              idMessage: resDataBody.idMessage,
              statusMessage: "read",
              timestamp: resDataBody.timestamp,
              type: resDataBody.typeWebhook,
            };
            setMessagesArr([...messagesArr, notificSms]);
          }
          axios
            .delete(
              `https://api.green-api.com/waInstance${userIds.IDINSTANCE}/deleteNotification/${userIds.APITOKENINSTANSE}/${res.data.receiptId}`
            )
            .then((res) => {
              if (res.data.result) {
                toReseiveNotification();
              }
            });
        }
      });
  }

  function toDeleteNotification(id) {}

  function toGetAllMessages() {
    let allMessagesArr = [];
    axios
      .post(
        `https://api.green-api.com/waInstance${userIds.IDINSTANCE}/getChatHistory/${userIds.APITOKENINSTANSE}`,
        {
          chatId: "37494676058@c.us",
          count: 20,
        }
      )
      .then((res) => {
        if (res.data) {
          res.data.map((sms) => {
            let oldMessage = {
              chatId: sms.chatId,
              idInstance: userIds.IDINSTANCE,
              idMessage: sms.idMessage,
              textMessage: sms.textMessage,
              timestamp: sms.timestamp,
              type: sms.type,
            };
            allMessagesArr.push(oldMessage);
          });
        }
        allMessagesArr.reverse();
        setMessagesArr(allMessagesArr);
      });
  }

  function toSetValues(event) {
    if (event.target.value && event.target.value !== "") {
      toSendMessage(event.target.value);
      setSmsInputValue(event.target.value);
      event.target.value = "";
    }
  }

  function toSmsPushInArr(id, text) {
    setMessagesArr([
      ...messagesArr,
      {
        chatId: userIds.CHATID,
        textMessage: text,
        time: toGetLocalTmeNow(),
        type: "outgoing",
        idMessage: idSms,
      },
    ]);
    setSmsInputValue(null);
  }

  function toSendMessage(value) {
    axios
      .post(
        `https://api.green-api.com/waInstance${userIds.IDINSTANCE}/SendMessage/${userIds.APITOKENINSTANSE}`,
        {
          chatId: "37494676058@c.us",
          message: value,
        }
      )
      .then((res) => {
        if (res.data) {
          setIdSms(res.data.idMessage);
        }
      });
  }

  const toGetLocalTmeNow = () => {
    const currentTime = new Date();
    const timestamp = currentTime.getTime();

    const timeString = new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const convertTo24HourFormat = (timestamp) => {
    const timeOptions = {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };

    const timeString = new Date(timestamp * 1000).toLocaleTimeString(
      "en-US",
      timeOptions
    );
    return `${timeString}`;
  };

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
            Array.isArray(messagesArr) &&
            messagesArr.map((sms, index) => {
              if (sms.textMessage) {
                return (
                  <div
                    key={index}
                    className={
                      sms.type == "outgoing" ||
                      (sms.type == "outgoingAPIMessageReceived" &&
                        sms.sendByApi)
                        ? "chat__body__messages_list__outgoing_sms"
                        : "chat__body__messages_list__outgoing_sms chat__body__messages_list__incoming_sms"
                    }
                  >
                    {sms.textMessage}
                    {
                      <span className="chat__body__messages_list__outgoing_sms__timestamp">
                        {convertTo24HourFormat(sms.timestamp)}
                        {sms.type !== "outgoing" ||
                          (sms.type !== "outgoingAPIMessageReceived" && (
                            <DoneAllOutlinedIcon
                              style={{ fontSize: 15 }}
                              color="disabled"
                            />
                          ))}
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
