import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navigation from "../Navigation";
import { Switch, Route } from "react-router-dom";
import "./style.scss";
import { useWindowSize } from "../../Constants/functions";
import { Usuario } from "../../Constants/interfaces";
import { ADD_NEW_ITEM_CODE, SUB_ADMIN_TAG } from "../../Constants/constants";
import { FirebaseContext } from "../../API/Firebase";
import EventosForm from "../Eventos/EditForm";
import EventosMenu from "../Eventos/VisualizeMenu";
import HomeScreen from "../Home";
import pbIcon from "../../Assets/img/PuntoBlanco_icon.png";
import Configuracion from "../Configuracion";
import profilepicture from "../../Assets/img/profilepicture.png";
import StatsScreen from "../Stats";
import NotificationForm from "../Notificaciones";
import SubAdminWindow from "../SubAdmin";

interface Props {}

const Dashboard: React.FC<Props> = () => {
	const firebase = useContext(FirebaseContext);
	const history = useHistory();
	const size = useWindowSize();
	const [user, setUser] = useState<Usuario>({
		nombre: "",
		uid: "",
		imagen_perfil: profilepicture,
		email: "",
		rol: "",
	});
	const minSize = 768;

	useEffect(() => {
		firebase
			.getAuthUser()
			.then((user) => {
				if (user === null) {
					history.push("/login");
				} else {
					firebase.getUserByUID(user.uid)
					.then( async (usuario) => {
						if(usuario.rol && usuario.rol === SUB_ADMIN_TAG && (usuario.delete_date!).getTime() < Date.now()){
							await firebase.removeSubAdmin(usuario.uid);
							window.alert("You no longer have access to this dashboard :(");
							throw new Error("YOU SHALL NOT PASS!");
						}
						setUser(usuario);
					})
					.catch((err) => {
						console.log(err);
						firebase.signout();
						history.push("/login");
					});
				}
			})
			.catch((err) => {
				history.push("/login");
			});
	    // eslint-disable-next-line
	}, []);

	return (
		
		<div style={{ height: "100%" }}>
				
				<Navigation user={user} />
				<div className="disappearable-logo image-container">
					<img className="imgLogo" src= {pbIcon} alt="Falta logo" />
				</div>
				<div
					style={{
						paddingTop: 30,
						paddingLeft: 30,
                        paddingRight: 30,
						minHeight: "80vh",
						display: "flex",
						backgroundColor: "#F5F7FA",
						flexDirection: "column",
						position: "relative",
					}}
				>
					<div
						style={{
							minHeight: "100%",
							display: "block",
							marginLeft: size.width && size.width < minSize ? "0" : "250px",
						}} //19%
					>   
					
						<div
							className={`mb-4 ${
								size.width && size.width < minSize ? "" : "ml-3"
							}`}
						>
					<Switch>
						<Route exact path='/dashboard'>
							<HomeScreen user={user} />
						</Route>
						<Route path='/dashboard/administrative_sub_admin'>
							<SubAdminWindow user={user} />
						</Route>
						<Route path='/dashboard/notifications'>
							<NotificationForm />
						</Route>
						<Route path='/dashboard/stats'>
							<StatsScreen/>
						</Route>
						<Route path={`/dashboard/events/${ADD_NEW_ITEM_CODE}`}>
							<EventosForm />
						</Route>
						<Route path='/dashboard/events'>
							<EventosMenu />
						</Route>
						<Route path='/dashboard/configuracion'>
							{user.nombre !== "" ? (
								<Configuracion
									usuario={user}
								/>
							) : null}
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
		</div>
		</div>
	);
};

export default Dashboard;
