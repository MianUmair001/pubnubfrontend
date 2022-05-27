import React, { useContext, useEffect, useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { login, signUp } from "../api/api";
import "../Sass/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuickBloxContext from "../ContextandProvider/QuickBloxContext";
import TwilioContext from "../ContextandProvider/TwilioContext";
const Login = ({  }) => {
  const navigate = useNavigate();
  const { connectChat } = useContext(QuickBloxContext);
  const { twilioState, initConversations, initTwilioSync } =
    useContext(TwilioContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUpFlag, setSignUpFlag] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    localStorage.setItem("loginStatus", false);
  }, [error]);
  // useEffect(() => {}, []);
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
    login({
      login: email,
      password: password,
      full_name: username,
    })
      .then(async (data) => {
        
        // const getData=await pubnub.objects.getUUIDMetadata({
        //   uuid: localStorage.getItem('sub-c-5c58d27a-2fa6-4dc4-a29a-5b4d9febd207uuid'),
        // });
        // console.log("GETData",getData)

        console.log("Data in Login", data.data);
        localStorage.setItem("userId", data.data._id);
        localStorage.setItem("password", password);
        // localStorage.setItem("username", data.login);
        localStorage.setItem("username", data?.data?.email.split("@")[0]);
        localStorage.setItem("email", data?.data?.email);
        initConversations(data?.data?.twilioConvToken);
        initTwilioSync(data?.data?.twilioSyncToken);
        localStorage.setItem("loginStatus", true);

        // connectChat({
        //   userId: data.id,
        //   password: password,
        // });
        navigate("/dashboard");
        // navigate("/pubnubchat");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 401) {
          console.log("Error came");
          setError(true);
          localStorage.setItem("loginStatus", false);

        }
      });
    } catch (error) {
      console.log({error})
    }
    
  };
  const handleSignUp = async (e) => {
    signUp({
      login: email,
      password: password,
      username: email.split("@")[0],
    })
      .then((data) => {
        connectChat({
          userId: data.id,
          password: password,
        });
        localStorage.setItem("userId", data.id);
        localStorage.setItem("password", password);
        localStorage.setItem("username", data.login);
        handleLogin(e)
        localStorage.setItem("firstLogin", true);
        navigate("/dashboard");
        // navigate("/pubnubchat");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubmit = async (e) => {
    setUsername(email.split("@")[0]);
    e.preventDefault();
    if (signUpFlag) {
      handleSignUp(e);
    } else {
      handleLogin(e);
    }
  };
  return (
    <>
      <Header />
      <div className="row loginParent">
        <div className="col-md-4 __body">
          <p>QuickBloxTest</p>
          {error && (
            <span className="mb-2">
              Invalid Credentials or User does not exist
              <Link
                to=""
                style={{
                  background: "none",
                  color: "#707070",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setSignUpFlag(true);
                  setError(false);
                }}
              >
                SignUp
              </Link>
            </span>
          )}
          <Link
            to=""
            style={{
              background: "none",
              color: "#707070",
              fontSize: "15px",
              fontWeight: "bold",
            }}
            onClick={(e) => {
              e.preventDefault();
              setSignUpFlag(true);
              setError(false);
            }}
          >
            SignUp
          </Link>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <TextField
            style={{ marginTop: "20px" }}
            fullWidth
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            component={Link}
            to="/dashboard"
            fullWidth
            className="btn btn-lg"
            onClick={handleSubmit}
          >
            {signUpFlag === true ? "SignUP" : "Login"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
