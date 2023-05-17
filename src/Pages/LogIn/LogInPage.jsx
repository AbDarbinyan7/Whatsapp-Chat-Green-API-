import * as React from "react";
import { useContext, useState, useRef, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as MaterialLink } from "@mui/material";
import { USERIDS } from "../../Routes/AppRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const { userIds, setUserIds } = useContext(USERIDS);

  const [instanceInput, setInstanceInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneInWp, setPhoneInWp] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [invalidVaule, setInvalidVaule] = useState(false);

  const instanceREf = useRef(null);
  const tokenRef = useRef(null);
  const phoneRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    checkAndNavigate();
  }, [authorized, phoneInWp]);

  useEffect(() => {
    // console.log(messagesContext);
    // console.log(convertTo24HourFormat(Date.now()));
    // console.log(new Date().setHours(19, 1, 0, 0) / 1000);
  }, []);

  const toCheckIfUserAuthorized = (event) => {
    event?.preventDefault();
    if (instanceInput !== "" && tokenInput !== "" && phoneInput !== "") {
      toCheckIds(instanceInput, tokenInput);
    }
  };

  function toCheckIds(instanceInput, tokenInput) {
    toCheckPhoneNumber(phoneInput);
    axios
      .get(
        `https://api.green-api.com/waInstance${instanceInput}/getStateInstance/${tokenInput}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.stateInstance === "authorized") {
            setAuthorized(true);
          }
        }
      })
      .catch((error) => {
        if (error) {
          setInvalidVaule(true);
        } else {
          setInvalidVaule(false);
        }
      });
  }

  function checkAndNavigate() {
    if (authorized && phoneInWp) {
      setLoading(false);
      let auhorizedUserIds = {
        IDINSTANCE: instanceInput,
        APITOKENINSTANSE: tokenInput,
        CHATID: phoneInput + "@c.us",
      };
      localStorage.setItem("userIds", JSON.stringify(auhorizedUserIds));
      navigate("/whatsapp");
      setUserIds({
        ...userIds,
        auhorizedUserIds,
      });
    }
  }

  function toCheckPhoneNumber(phoneInput) {
    axios
      .post(
        `https://api.green-api.com/waInstance${instanceInput}/checkWhatsapp/${tokenInput}`,
        {
          phoneNumber: phoneInput,
        }
      )
      .then((res) => {
        if (res) {
          if (res.data.existsWhatsapp) {
            setPhoneInWp(true);
            setLoading(false);
          } else {
            setPhoneInWp(false);
          }
        }
      })
      .catch((error) => {
        if (error) {
          setInvalidVaule(true);
        } else {
          setInvalidVaule(false);
        }
      });
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setInstanceInput(value);
  }

  function handleInputChange2(e) {
    const value = e.target.value;
    setTokenInput(value);
  }

  function handleInputChange3(e) {
    const value = e.target.value;
    setPhoneInput(value);
    const userInput = e.target.value.replace(/\D/g, "");
    setValue(userInput);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            ref={instanceREf}
            onChange={(e) => handleInputChange(e)}
            margin="normal"
            fullWidth
            label="Id Instance"
            autoFocus
            error={invalidVaule}
          />
          <TextField
            onChange={(e) => handleInputChange2(e)}
            ref={tokenRef}
            margin="normal"
            fullWidth
            label="Api Token Instance"
            error={invalidVaule}
          />
          <TextField
            value={value}
            onChange={(e) => handleInputChange3(e)}
            ref={phoneRef}
            margin="normal"
            label="Recipients phone number"
            variant="outlined"
            fullWidth
            error={phoneInWp === false}
            pattern="[0-9]*"
            inputMode="numeric"
          />

          <Button
            onClick={() => toCheckIfUserAuthorized()}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          {invalidVaule && (
            <Box mt={1}>
              <Typography color="error">User is not authorized.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
