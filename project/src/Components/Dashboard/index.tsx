/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import Navigation from "../Navigation";
import { Switch, Route } from "react-router-dom";
import "./style.scss";
import { Breadcrumbs } from "@material-ui/core";
import {useWindowSize} from "../../Constants/functions";
import { Spinner } from "react-bootstrap";
import { Usuario } from "../../Constants/interfaces";
import homeIcon from "../../Assets/img/home_icon.png";
// import { FirebaseContext } from "../../API/Firebase";
// import firebase from "firebase";
// import Forms from "../Forms";
import Graphs from "../Graphs";

interface Props {}

export const UsuarioObj: Usuario = {
  nombre: "some",
  apellido: "some",
  correo: "some",
  rol: "some",
};

export const UsuarioContext = React.createContext(UsuarioObj);

const Dashboard: React.FC<Props> = () => {
  // const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const [unidad, setUnidad] = useState<string>();
  const size = useWindowSize();
  const [ready, setReady] = useState(true);
  const [breadCrumb, setBreadCrumb] = useState("Dashboard");
  const minSize = 768;

  useEffect(() => {
    // firebase
    //   .getAuthUser()
    //   .then(async (userFB) => {
    //     // console.log(userFB.uid);
    //     // console.log(userFB.email);
    //     try {
    //       let user = await firebase.setUser(userFB.uid);
    //       // console.log(user);
    //       UsuarioObj.apellido = user.apellido ?? "";
    //       UsuarioObj.correo = user.correo;
    //       UsuarioObj.nombre = user.nombre;
    //       UsuarioObj.rol = user.rol;
    //       setReady(true);
    //     } catch (err) {
    //       console.error(err);
    //       history.push("/login");
    //     }
    //   })
    //   .catch((err) => {
    //     history.push("/login");
    //   });
  }, []);

  if (!ready)
    return (
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        <Spinner animation="border" variant="info" />
      </div>
    );

  return (
    <div style={{ height: "100%" }}>
      <UsuarioContext.Provider value={UsuarioObj}>
        <Navigation />
        <div
          style={{
            padding: 30,
            minHeight: "100vh",
            display: "flex",
            backgroundColor: "#F5F7FA",
            flexDirection: "column",
            position: "relative",
            paddingBottom: "2.5rem",
          }}
        >
          <div
            style={{
              minHeight: "100%",
              display: "block",
              marginLeft: size.width && size.width < minSize ? "0" : "250px",
            }} //19%
          >
            <h5
              className={`mb-4 ${
                size.width && size.width < minSize ? "" : "ml-3"
              }`}
            >
              Dashboard
            </h5>
            <div
              className={`mb-4 ${
                size.width && size.width < minSize ? "" : "ml-3"
              }`}
            >
              <Breadcrumbs aria-label="breadcrumb">
                <Link className="aTag" to="/dashboard">
                  <img
                    className="mb-1"
                    width={15}
                    alt="home"
                    src={homeIcon}
                  />
                </Link>
                <Link
                  className="aTag"
                  to="/dashboard"
                  onClick={() => setUnidad(undefined)}
                >
                  {breadCrumb}
                </Link>
                {unidad ? (
                  <Link className="aTag" to={`/dashboard/${unidad}`}>
                    {unidad.toUpperCase()}
                  </Link>
                ) : null}
              </Breadcrumbs>
            </div>
            <Switch>
              <Route path="/dashboard/historico">
                <Graphs setBreadCrumb={setBreadCrumb} />
              </Route>
              <Route path="/dashboard/manage">
                {/* <Forms setBreadCrumb={setBreadCrumb} /> */}
              </Route>
            </Switch>
          </div>
          {/* <footer
            style={{
              fontSize: 8,
              color: "grey",
              textAlign: "center",
              marginLeft: size.width && size.width < minSize ? -40 : 230,
              position: "absolute",
              bottom: 0,
              width: size.width && size.width < minSize ? "100%" : "80%",
              height: "2.5rem",
            }}
          >
            <div style={{ bottom: 0 }}>
              <span>Website Design by Zendasys&nbsp;&copy;</span>
              <br />
              <span>
                Icon made by Kiranshastry, Becris, dmitri13, srip and Pixel
                perfect from{" "}
                <a style={{ color: "grey" }} href="https://www.flaticon.com">
                  www.flaticon.com
                </a>
              </span>
            </div>
          </footer>
         */}
        </div>
      </UsuarioContext.Provider>
    </div>
  );
};

export default Dashboard;
