import Snackbar from "@material-ui/core/Snackbar";
import React, { FC, useContext, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import { FirebaseContext } from "../../API/Firebase";
import { CURRENT_DNS, SUPER_ADMIN_TAG } from "../../Constants/constants";
import { Usuario } from "../../Constants/interfaces";
import MuiAlert from "@material-ui/lab/Alert";

import "./style.css";

interface Props {
    user : Usuario
}

const SubAdminWindow : FC<Props> = (p) => {

    const firebase  = useContext(FirebaseContext);
    const history   = useHistory();

    const [link,setLink]  = useState("");
    const [loading,setLoading]  = useState(false);
    const [alerta, setAlerta]   = useState<any>({
        message: "This is an alert",
        open: false,
        severity: "success",
      });

    // On Render
    useEffect(() => {
        if(p.user.rol === undefined || p.user.rol !== SUPER_ADMIN_TAG)
            history.push("/");
        // eslint-disable-next-line
    },[]);

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

    function createLink(subRoute : string){
        return `https://${CURRENT_DNS}/${subRoute}/signup`;
    }

    function copyToClipBoard(){
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
            <h3>Sub Admin link Creator</h3>
            <p>Disclaimer: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            <button onClick={createTag} >{btnText()}</button>
            <div id="linkField" onClick={copyToClipBoard} style={{visibility : hiddenField ? "hidden" : "visible"}}>
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