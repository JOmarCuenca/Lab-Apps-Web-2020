import React, { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import Navigation from "../Navigation";
import { Switch, Route } from "react-router-dom";
import "./style.scss";
import { Breadcrumbs } from "@material-ui/core";
import { useWindowSize } from "../../Constants/functions";
import { Spinner } from "react-bootstrap";
import { Usuario } from "../../Constants/interfaces";
import homeIcon from "../../Assets/img/home_icon.png";
// import { FirebaseContext } from "../../API/Firebase";
// import firebase from "firebase";
// import Forms from "../Forms";
import NotificationsMenu from "../Notificaciones/VisualizeMenu";
import { ADD_NEW_ITEM_CODE } from "../../Constants/constants";
import EditForm from "../Notificaciones/EditForm";
import { FirebaseContext } from "../../API/Firebase";
import EventosForm from "../Eventos/EditForm";
import EventosMenu from "../Eventos/VisualizeMenu";

interface Props {}

export const UsuarioObj: Usuario = {
	nombre: "some",
	id: "joifjoijf",
	imagen_perfil: "eojoifjiojf",
	email: "some",
	rol: "some",
};

export const UsuarioContext = React.createContext(UsuarioObj);

const Dashboard: React.FC<Props> = () => {
	const firebase = useContext(FirebaseContext);
	const history = useHistory();
	const [unidad, setUnidad] = useState<string>();
	const size = useWindowSize();
	const [ready, setReady] = useState(true);
	const [breadCrumb, setBreadCrumb] = useState("Dashboard");
	const minSize = 768;

	useEffect(() => {
		firebase
			.getAuthUser()
			.then((user) => {
				// console.log(user);
				if (user === null) {
					history.push("/login");
				}
			})
			.catch((err) => {
				history.push("/login");
			});
		//es-lint: disable
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
				<Spinner animation='border' variant='info' />
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
							<Breadcrumbs aria-label='breadcrumb'>
								<Link className='aTag' to='/dashboard'>
									<img className='mb-1' width={15} alt='home' src={homeIcon} />
								</Link>
								<Link
									className='aTag'
									to='/dashboard'
									onClick={() => setUnidad(undefined)}
								>
									{breadCrumb}
								</Link>
								{unidad ? (
									<Link className='aTag' to={`/dashboard/${unidad}`}>
										{unidad.toUpperCase()}
									</Link>
								) : null}
							</Breadcrumbs>
						</div>
						<Switch>
							<Route path={`/dashboard/notifications/${ADD_NEW_ITEM_CODE}`}>
								<EditForm />
							</Route>
							<Route path='/dashboard/notifications'>
								<NotificationsMenu setBreadCrumb={setBreadCrumb} />
							</Route>
							<Route path={`/dashboard/events/${ADD_NEW_ITEM_CODE}`}>
								<EventosForm />
							</Route>
							<Route path='/dashboard/events'>
								<EventosMenu setBreadCrumb={setBreadCrumb} />
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
