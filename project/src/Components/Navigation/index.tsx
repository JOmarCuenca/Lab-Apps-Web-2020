import React, { useState } from "react";
import { makeStyles, Collapse } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useWindowSize } from "../../Constants/functions";
import { Container, Col, Row } from "react-bootstrap";
import MenuIcon from "@material-ui/icons/Menu";
import navigationItems from "../../navigation.json";
import logoutIcon from "../../Assets/img/logout.png";
import teamIcon from "../../Assets/img/equipo.png";
import scheduleIcon from "../../Assets/img/hora.png";
import orderIcon from "../../Assets/img/purchase.png";
import rateIcon from "../../Assets/img/rate.png";
import menuIcon from "../../Assets/img/menu.png";
import { primaryColor, secondaryColor } from "../../Constants/constants";

const useStyles = makeStyles({
  root: {
    backgroundColor: secondaryColor,
    height: "100vh",
    // width: "18%", //Test
    width: "250px",
    boxShadow: "1px 4px 50px 0px rgba(64,77,103,0.88)",
    float: "left",
    zIndex: 100,
    paddingTop: 20,
    paddingLeft: 10,
    position: "fixed",
  },
});

const chooseIcon = (s: string) => {
  switch (s) {
    case "Pedidos":
      return orderIcon;
    case "Contactos":
      return teamIcon;
    case "Retro":
      return rateIcon;
    case "Menu":
      return menuIcon;
    case "Promo":
      return scheduleIcon;
    default:
      return logoutIcon;
  }
}

const Navigation: React.FC = () => {
  const styles = useStyles();
  // const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const size = useWindowSize();
  const [open, setOpen] = useState(false);

  const createElement = (
    e: {
      title: string;
      action:
      | string
      | {
        route: string;
        action: string;
      };
      icon: string;
      children?: any[];
    },
    i: number
  ) => {
    return (
      <>
        <Col key={i} md={12} >
          <img
            style={{ filter: primaryColor, cursor: "pointer" }}
            width="20"
            alt="icon"
            src={chooseIcon(e.icon)}
          // require(e.icon)
          />
          &nbsp;&nbsp;
          <span
            onClick={() => {
              setOpen(false);
              if (typeof e.action === "string") history.push(e.action);
              else {
                // if (e.action.action === "logout") firebase.signout();
                if (e.action.action === "logout") history.push("/login");
                history.push("/login"); //e.action.action
              }
            }}
            style={{ color: primaryColor, fontSize: 18, cursor: "pointer" }}
          >
            {e.title}
          </span>
        </Col>
        {/* {e.children ? (
          <Col className="mt-2" md={12}>
            <img
              style={{ filter: primaryColor }}
              width="15"
              alt="icon"
              src={require(e.icon)}
            />
            &nbsp;&nbsp;
            <span
              onClick={() => {
                setOpen(false);
                if (typeof e.action === "string") history.push(e.action);
                else {
                  if (e.action.action === "logout") firebase.signout();
                  history.push(e.action.action);
                }
              }}
              style={{ color: primaryColor, fontSize: 14, cursor: "pointer" }}
            >
              Tiempo Real
            </span>
          </Col>
        ) : null} */}
      </>
    );
  };

  const navElements = () => {
    return <div>{navigationItems.map((e: any, i) => createElement(e, i))}</div>;
  };

  if (size.width && size.width < 768)
    return (
      <>
        <div
          style={{
            position: "fixed",
            zIndex: 99,
            backgroundColor: secondaryColor,
            width: "100%",
            height: "80px",
            padding: 20,
          }}
        >
          {/* <img
            width={35}
            style={{
              borderRadius: 10,
            }}
            alt="logo"
            src={require("../../Assets/img/dashbooard.png")}
          /> */}
          <div
            style={{
              display: "inline-block",
              height: "100%",
              width:
                size.width && size.width < 340
                  ? "85%"
                  : size.width < 391
                    ? "88%"
                    : "90%",
            }}
          >
            <span
              style={{
                color: primaryColor,
                fontSize: 35,
                fontWeight: 900,
                marginLeft: -10,
              }}
            >
              Dashboard
            </span>
            <MenuIcon
              onClick={() => setOpen(!open)}
              style={{
                color: "white",
                float: "right",
                verticalAlign: "middle",
                marginTop: 3,
              }}
            />
          </div>
        </div>
        <Collapse in={open}>
          <div
            style={{
              color: "white",
              paddingLeft: 20,
              paddingBottom: 20,
              zIndex: 99,
              backgroundColor: secondaryColor,
              marginTop: 80,
              position: "fixed",
              width: "100%",
            }}
          >
            {navElements()}
          </div>
        </Collapse>
        <div style={{ height: 70 }} />
      </>
    );
  return (
    <div className={styles.root}>
      <Container>
        <Row>
          {/* <Col md={3}>
            <img
              width={35}
              style={{
                borderRadius: 10,
              }}
              alt="logo"
              src={require("../../Assets/img/dashbooard.png")}
            />
          </Col> */}
          <Col md={12} className="mt-1">
            <span
              style={{
                color: primaryColor,
                fontSize: 35,
                fontWeight: 900,
                marginLeft: -10,
              }}
            >
              Dashboard
            </span>
          </Col>
          <br />
          <br />
          <br />
          {navElements()}
        </Row>
      </Container>
    </div>
  );
};

export default Navigation;
