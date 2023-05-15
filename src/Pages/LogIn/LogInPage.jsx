import * as React from "react";
import { useContext, useState, useRef } from "react";

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

const theme = createTheme();

export default function SignIn() {
  const { userIds, setUserIds } = useContext(USERIDS);

  const [instanceInput, setInstanceInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const instanceREf = useRef(null);
  const tokenRef = useRef(null);
  const phoneRef = useRef(null);

  const navigate = useNavigate();

  const toCheckIfUserAuthorized = (event) => {
    event.preventDefault();
    if (
      setInstanceInput !== "" &&
      setTokenInput !== "" &&
      setPhoneInput !== ""
    ) {
      axios
        .get(
          `https://api.green-api.com/waInstance${instanceInput}/getStateInstance/${tokenInput}`
        )
        .then((response) => {
          if (response.status === 200) {
            // Handle successful response
            toast.success("Everything is correct"); // Show success notification
          } else {
            // Handle other status codes
            toast.error("An error occurred"); // Show error notification
          }
        });
    }
  };

  function onNavigate() {
    navigate("/whatsapp");
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
          onSubmit={toCheckIfUserAuthorized}
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
          />
          <TextField
            onChange={(e) => handleInputChange2(e)}
            ref={tokenRef}
            margin="normal"
            required
            fullWidth
            label="Api Token Instance"
          />
          <TextField
            onChange={(e) => handleInputChange3(e)}
            ref={phoneRef}
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            variant="outlined"
            fullWidth
          />

          <Button
            // onClick={onNavigate}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
