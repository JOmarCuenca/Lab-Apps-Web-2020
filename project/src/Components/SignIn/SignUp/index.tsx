import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import "../style.scss";
import { FirebaseContext } from "../../../API/Firebase";
import { CONFUSED_TRAVOLTA_URL } from "../../../Constants/constants";

const SignUp: React.FC = () => {

  // General Hooks
  const firebase  = useContext(FirebaseContext);
  const {id}      = useParams<{id : string}>()
  const history   = useHistory();

  // State Variables
  const [validURL,setValidURL]  = useState(false);
  const [loading,setLoading]    = useState(true);
  const [permit,setPermit]      = useState<null | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>(null);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [alerta, setAlerta]     = React.useState<any>({
    message: "This is an alert",
    open: false,
    severity: "success",
  });

  async function createUser(){
    // Check if the permit is still valid
    const recheck = await permit!.ref.get();
    if(!recheck.exists) throw new Error("PERMIT_EXPIRED");
    // Upload the info and create the user
    await firebase.registerNewSubAdmin(email,password,name);
    // Delete the permit cause it has been used
    return recheck.ref.delete();
  }

  useEffect(() => {
    firebase.getPermit(id)
    .then((p) => {
      setPermit(p);
      setValidURL(p && p !== null && p.exists);
    })
    .catch(() => setAlerta({
      message: "Service may be down, contact Technical Support",
      open: true,
      severity: "error",
    }))
    .finally(() => setLoading(false));
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

  const signUpBtn = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
    let alert = {
      message: "",
      open: true,
      severity: "error",
    };
    if (name === "") {
      alert.message = "You cannot leave your name empty";
      setAlerta(alert);
      return;
    } else if (email === "") {
      alert.message = "Email can't be empty";
      setAlerta(alert);
      return;
    } else if (password === "") {
      alert.message = "Password can't be empty";
      setAlerta(alert);
      return;
    }
    setLoading(true);
    createUser()
    .then(() => history.push("/dashboard"))
    .catch(e => {
      if(e.toString().includes("EXPIRED")){
        alert.message = "This Permit has expired and is no longer usable";
      } else alert.message = e.toString();
      setAlerta(alert);
    }).finally(() => setLoading(false));
  };

  const renderSignUp = () => <>
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
                Sign Up
              </h2>
            <div className="input-group mb-3">
              <input
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") signUpBtn();
                }}
              />
            </div>

            <button
              onClick={signUpBtn}
              className="btn btn-primary-new shadow-2 mb-4"
              style={{ backgroundColor: "#04a9f5", color: "white" }}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>;

  const renderVoidScreen = () => <div className="center">
    <img src={CONFUSED_TRAVOLTA_URL} alt="Confused" />
  </div>;

  const loadingScreen = () => <div className="center">
    <h1>Loading...</h1>
  </div>;

  return (validURL) ? renderSignUp() : 
    (loading) ? loadingScreen() : renderVoidScreen();
};

export default SignUp;
