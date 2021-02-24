import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ADD_NEW_ITEM_CODE } from "../../../Constants/constants";
// import { FirebaseContext } from "../../../API/Firebase";
// import { Product } from "../../../Constants/interfaces";
// import { ADD_NEW_ITEM_CODE } from "../../../Constants/values";
// import {ProductsTable} from "./table";
// import { UsuarioContext } from "../Dashboard";

import "../style.css";

interface Props{
  setBreadCrumb: (val:string) => void;
}
const NotificationsMenu: React.FC<Props> = ({setBreadCrumb}) => {

    // const firebase          = useContext(FirebaseContext);
    const history           = useHistory();
    // const [menu,setMenu]    = useState<Product[]>([]);
    const [changeStatus,setChangeStatus] = useState("");

    // const usuario = useContext(UsuarioContext);
    useEffect(() => {
        setBreadCrumb("Menu");
        // firebase.getProducts().then(menu => setMenu(menu)).catch(e => {
        //     console.log(e);
        //     setMenu([]);
        // });
        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        if(changeStatus !== ""){
            // firebase.getProducts().then(menu => setMenu(menu)).catch(e => {
            //     console.log(e);
            //     setMenu([]);
            // }).finally(() => setChangeStatus(""));
        }
        // eslint-disable-next-line
    },[changeStatus]);

    return <Row>
        <Col style={{paddingBottom : "20px"}} xs="12"><button className="submit-button" style={{float : "right"}} onClick={() => history.push(`/dashboard/notifications/${ADD_NEW_ITEM_CODE}`)} >Nuevo Producto</button></Col>
        <Col xs="12">
            <Card style={{ borderRadius: 10 }}>
                <Card.Header>
                    <Card.Title as="h5">Productos en el Menu</Card.Title>
                </Card.Header>
                {/* <ProductsTable rows={menu} setter={setChangeStatus} /> */}
            </Card>
        </Col>
        <Col xs="6">
            <Card style={{ borderRadius: 10 }}>
                <Card.Header>
                    <Card.Title as="h5">Productos 1</Card.Title>
                </Card.Header>
                {/* <ProductsTable rows={menu} setter={setChangeStatus} /> */}
            </Card>
        </Col>
        <Col xs="3">
            <Card style={{ borderRadius: 10 }}>
                <Card.Header>
                    <Card.Title as="h5">Productos 2</Card.Title>
                </Card.Header>
                {/* <ProductsTable rows={menu} setter={setChangeStatus} /> */}
            </Card>
        </Col>
        <Col xs="4">
            <Card style={{ borderRadius: 10 }}>
                <Card.Header>
                    <Card.Title as="h5">Productos 3</Card.Title>
                </Card.Header>
                {/* <ProductsTable rows={menu} setter={setChangeStatus} /> */}
            </Card>
        </Col>
    </Row>;
};

export default NotificationsMenu;
