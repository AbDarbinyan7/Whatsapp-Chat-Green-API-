import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";

import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";

import {
  MessagesContext,
  USERIDS,
  UserContext,
  UsersContext,
} from "../../Routes/AppRoutes";

import "./Chat.scss";

export const convertTo24HourFormat = (timestamp) => {
  const date = new Date(null);
  date.setSeconds(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

function Chat() {
  const { messagesContext, setMessagesContext } = useContext(MessagesContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const { userIds, setUserIds } = useContext(USERIDS);
  const { usersContext, setUsersContext } = useContext(UsersContext);

  const [smsInputValue, setSmsInputValue] = useState();
  const [idSms, setIdSms] = useState();
  const [isRequestPending, setIsRequestPending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (usersContext && Array.isArray(messagesContext) && usersContext.length) {
      setUserContext(usersContext[0]);
    }
  }, [usersContext]);

  useEffect(() => {
    getItemInLocalStorage("userIds");
  }, []);

  useEffect(() => {
    if (userIds) {
      if (userIds.IDINSTANCE && userIds.APITOKENINSTANSE && userIds.CHATID) {
        getInfoContact();
        toGetAllMessages();
      }
    }
  }, [userIds]);

  useEffect(() => {
    if (idSms && smsInputValue) {
      toSmsPushInArr(idSms, smsInputValue);
    }
  }, [idSms, smsInputValue]);

  useEffect(() => {
    if (userIds) {
      if (userIds.IDINSTANCE && userIds.APITOKENINSTANSE && userIds.CHATID) {
        const interval = setInterval(() => {
          toReseiveNotification();
        }, 10000);
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [userIds]);

  function toGetAllMessages() {
    let allmessagesArr = [];
    axios
      .post(
        `https://api.green-api.com/waInstance${userIds?.IDINSTANCE}/getChatHistory/${userIds?.APITOKENINSTANSE}`,
        {
          chatId: userIds?.CHATID,
          count: 50,
        }
      )
      .then((res) => {
        if (res.data) {
          if (res.data && res.data.length) {
            res.data.map((sms) => {
              let oldMessage = {
                chatId: sms?.chatId,
                idInstance: userIds?.IDINSTANCE,
                idMessage: sms?.idMessage,
                textMessage: sms?.textMessage,
                timestamp: sms?.timestamp,
                type: sms?.type,
              };
              allmessagesArr.push(oldMessage);
            });
            allmessagesArr.reverse();
            setMessagesContext(allmessagesArr);
          }
        }
      })
      .catch((error) => {
        if (error) {
          navigate("/");
        }
      });
  }

  function getInfoContact() {
    axios
      .post(
        `https://api.green-api.com/waInstance${userIds?.IDINSTANCE}/GetContactInfo/${userIds?.APITOKENINSTANSE}`,
        {
          chatId: userIds?.CHATID,
        }
      )
      .then((res) => {
        if (res) {
          let userInfo = {
            name: res?.data?.name,
            chatId: res?.data?.chatId,
            avatar: res?.data?.avatar,
          };
          setUsersContext([...usersContext, userInfo]);
          localStorage.setItem("users", JSON.stringify(userInfo));
        }
      })
      .catch((error) => {
        if (error) {
          console.log("error", error);
        }
      });
  }

  function getItemInLocalStorage(value) {
    let afterRefreshIds = localStorage.getItem(value);
    if (afterRefreshIds) {
      let parseAfterRefreshIds = JSON.parse(afterRefreshIds);
      setUserIds(parseAfterRefreshIds);
    } else {
      navigate("/");
    }
  }

  function toReseiveNotification() {
    if (isRequestPending) {
      return;
    }
    setIsRequestPending(true);
    axios
      .get(
        `https://api.green-api.com/waInstance${userIds?.IDINSTANCE}/receiveNotification/${userIds?.APITOKENINSTANSE}`
      )
      .then((res) => {
        if (res.data) {
          if (
            res.data.body.typeWebhook &&
            res.data.body.typeWebhook === "incomingMessageReceived" &&
            res.data.body.senderData.chatId &&
            res.data.body.senderData.chatId === userIds.CHATID
          ) {
            let notificSms = {
              chatId: res?.data?.body?.senderData?.chatId,
              textMessage:
                res?.data?.body?.messageData?.textMessageData?.textMessage,
              idInstance: res?.data?.body?.instanceData?.idInstance,
              idMessage: res?.data?.body?.idMessage,
              statusMessage: "read",
              timestamp: res?.data?.body?.timestamp,
              type: res?.data?.body?.typeWebhook,
            };
            setMessagesContext((messagesContext) => [
              ...messagesContext,
              notificSms,
            ]);
            toDeleteNotivication(res.data.receiptId);
          } else {
            toDeleteNotivication(res.data.receiptId);
          }
        }
      })
      .catch((error) => {
        if (error) {
          console.log("error", error);
        }
      })
      .finally(() => {
        setIsRequestPending(false);
      });
  }

  function toDeleteNotivication(id) {
    axios
      .delete(
        `https://api.green-api.com/waInstance${userIds?.IDINSTANCE}/deleteNotification/${userIds?.APITOKENINSTANSE}/${id}`
      )
      .then((res) => {
        if (res.data.result) {
          toReseiveNotification();
        }
      })
      .catch((error) => {
        if (error) {
          console.log("error", error);
        }
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
    setMessagesContext((messagesContext) => [
      ...messagesContext,
      {
        chatId: userIds?.CHATID,
        textMessage: text,
        timestamp: toGetLocalTmeNow(),
        type: "outgoing",
        idMessage: idSms,
      },
    ]);
    setSmsInputValue(null);
  }

  function toSendMessage(value) {
    axios
      .post(
        `https://api.green-api.com/waInstance${userIds?.IDINSTANCE}/SendMessage/${userIds?.APITOKENINSTANSE}`,
        {
          chatId: userIds?.CHATID,
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
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (hours === "24") {
      hours = "00";
    }
    const currentTime = `${hours}:${minutes}`;
    return currentTime;
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header__left_side">
          <Avatar src={userContext?.avatar} alt="User Avatar" />
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
        <div className="chat__body__messages_list">
          {messagesContext &&
            Array.isArray(messagesContext) &&
            messagesContext.length !== 0 &&
            messagesContext.map((sms, index) => {
              if (sms.textMessage) {
                return (
                  <div
                    key={index}
                    className={
                      sms.type === "outgoing" ||
                      (sms.type === "outgoingAPIMessageReceived" &&
                        sms.sendByApi)
                        ? "chat__body__messages_list__outgoing_sms"
                        : "chat__body__messages_list__outgoing_sms chat__body__messages_list__incoming_sms"
                    }
                  >
                    {sms.textMessage}
                    {
                      <span className="chat__body__messages_list__outgoing_sms__timestamp">
                        {typeof sms.timestamp === "number"
                          ? convertTo24HourFormat(sms.timestamp)
                          : sms.timestamp}
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
