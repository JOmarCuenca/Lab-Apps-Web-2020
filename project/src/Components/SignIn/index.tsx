import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import "./style.scss";
import { FirebaseContext } from "../../API/Firebase";

interface Props {}

const SignIn: React.FC<Props> = () => {

  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = React.useState<any>({
    message: "This is an alert",
    open: false,
    severity: "success",
  });


  useEffect(() => {
    firebase.getAuthUser()
    .then(user => {
      if(user !== null){
        history.push("/dashboard");
      }
    })
    // eslint-disable-next-line
  },[]);

  const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    setAlerta({
      message: "This is an alert",
      open: false,
      severity: "success",
    });
  };

  const loginButton = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let temp = {
      message: "",
      open: true,
      severity: "error",
    };
    if (email === "") {
      temp.message = "Email can't be empty";
      setAlerta(temp);
      return;
    } else if (password === "") {
      temp.message = "Password can't be empty";
      setAlerta(temp);
      return;
    }
    firebase.doSignInWithEmailAndPassword(email,password)
      .then( result => {
        if(result.user !== null){
          // console.log("Success");
          history.push("/dashboard"); 
        }
      }).catch(err => {
        if(err.toString().includes("password")){
          temp.message = "Wrong Password, please try again.";
        } else {
          temp.message = "There is no user registered";
        }
        setAlerta(temp);
      });
    // temp.message = "Everything is okay";
    // temp.severity = "success";
    // history.push("/dashboard");
  };

  const resetPass = (e: any) => {
    if (email === "") {
      setAlerta({
        message: "Por favor provee un correo",
        open: true,
        severity: "info",
      });
      return;
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alerta.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alerta.severity}>
          {alerta.message}
        </Alert>
      </Snackbar>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <div className="card">
            <div style={{ textAlign: "center" }} className="card-body">
              <LockOpenIcon
                className="auth-icon mb-4"
                style={{
                  color: "#1dc4e9",
                  fontSize: 38,
                }}
              />
              <h2 style={{ fontWeight: 100, fontSize: 26 }} className="mb-4">
                Login
              </h2>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group mb-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") loginButton();
                  }}
                />
              </div>

              <button
                onClick={loginButton}
                className="shy shadow-2 mb-4"
                style={{ backgroundColor: "#04a9f5", color: "white" }}
              >
                Login
              </button>

              <div style={{ fontSize: 14 }}>
                <p className="mb-2 text-muted" onClick={resetPass} style={{cursor: "pointer"}}>
                  Forgot password?{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
