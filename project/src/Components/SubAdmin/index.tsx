import Snackbar from "@material-ui/core/Snackbar";
import React, { FC, useContext, useEffect, useState } from "react";
import { Form, Spinner, Alert } from "react-bootstrap";
import { useHistory } from "react-router";
import { FirebaseContext } from "../../API/Firebase";
import { SUPER_ADMIN_TAG } from "../../Constants/constants";
import { Usuario } from "../../Constants/interfaces";
import MuiAlert from "@material-ui/lab/Alert";

import "./style.css";

interface Props {
    user: Usuario
}

const SubAdminWindow: FC<Props> = (p) => {

    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState<any>({
        message: "This is an alert",
        open: false,
        severity: "success",
    });

    // On Render
    useEffect(() => {
        if (p.user.rol === undefined || p.user.rol !== SUPER_ADMIN_TAG)
            history.push("/");
        // eslint-disable-next-line
    }, []);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        setAlerta({
            ...alerta,
            message: "",
            open: false,
        });
    };

    const createTag = () => {
        setLoading(true);
        firebase.createPermit()
            .then((result) => {
                setLink(createLink(result));
                setAlerta({
                    message: "Se ha creado el link exitosamente",
                    open: true,
                    severity: "success",
                });
            })
            .catch((e) => {
                setLink("");
                setAlerta({
                    message: "Ha habido un problema de conexion, contacte soporte tecnico",
                    open: true,
                    severity: "error",
                });
            })
            .finally(() => setLoading(false));
    }

    function createLink(subRoute: string) {
        const currentDNS = window.location.hostname;
        return `https://${currentDNS}/${subRoute}/signup`;
    }

    function copyToClipBoard() {
        navigator.clipboard.writeText(link);
        setAlerta({
            message: "Se ha copiado el link al portapapeles",
            open: true,
            severity: "info",
        });
    }

    const hiddenField = link.length === 0 || loading;

    const btnText = () => loading ? <Spinner animation='border' variant='light' /> : "Create Link";

    return <>
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={alerta.open}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <MuiAlert elevation={6} variant="filled" severity={alerta.severity} onClose={handleClose} >
                {alerta.message}
            </MuiAlert>
        </Snackbar>
        <div id="subAdminWindow">
            <Alert variant="warning">
                <Alert.Heading>Aviso sobre creación de sub-administradores</Alert.Heading>
                <p>
                    En este apartado puedes generar un enlace que te permite invitar a nuevos administradores
                    al manejo de la aplicación, asegurate que este enlace solo sea compartido con personal
                    autorizado. 

                    
  </p>
                <hr />
                <p className="mb-0">
                Es importante considerar que la duración de esta "invitación" tiene un periodo <b> MAXIMO de 24 horas</b> desde su
                creación.
  </p>
            </Alert>

            <button onClick={createTag} >{btnText()}</button>
            <div id="linkField" onClick={copyToClipBoard} style={{ visibility: hiddenField ? "hidden" : "visible" }}>
                <Form.Control
                    hidden={hiddenField}
                    type='text'
                    disabled
                    value={link}
                />
            </div>
        </div>
    </>;
}

export default SubAdminWindow;