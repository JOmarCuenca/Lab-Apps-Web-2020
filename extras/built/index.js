var admin = require('firebase-admin');
var serviceAccount = require("../punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const db = admin.firestore();

async function uploadStatistics() {
    var db = admin.firestore();
    const batch = db.batch();
    // Statistics
    const docs = [
        {value : "86%", description : "Asistentes a eventos esta semana"},
        {value : "220", description : "Usuarios activos esta semana"},
        {value : "4/5", description : "Bienestar de los usuarios promedio"},
        {value : "ZEN", description : "Meditación mas popular esta semana"}
    ];
    docs.forEach((d,i) => {
        const temp = {
            ...d,
            date : new Date()
        }
        batch.create(db.collection("Statistics").doc(`Test_Doc_${i}`),temp);
    })
    await batch.commit();
}

/*
interface Notificacion {
	id: string;
	title: string;
	descripcion: string;
	fecha: Date;
	lifetime?: number; // ?? default 24 hrs
}
*/

async function uploadNotif() {
    var db = admin.firestore();
    const batch = db.batch();
    // Statistics
    const docs = [
        {
            title : "Ejemplo 1",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 2",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 3",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 4",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        }
    ];
    docs.forEach((d,i) => {
        const temp = {
            ...d,
            date : new Date()
        }
        batch.create(db.collection("Notificaciones").doc(`Test_Doc_${i}`),temp);
    })
    await batch.commit();
}

async function getLimited(){
    const db = admin.firestore();
    // const notif = await db.collection("Notificaciones")
    // .orderBy("fecha","desc")
    // .startAt(0)
    // .limit(4)
    // .get();
    const notif = await db.collection("Notificaciones")
    .startAt(0)
    .orderBy("fecha","desc")
    .limit(4)
    .get();
    notif.docs.forEach( d => console.log(d.id));
}
// uploadStatistics().then(() => console.log("Done"));
// uploadNotif().then(() => console.log("Done"));
// getLimited();

async function setActiveUsers(){
    const number = 200;
    let batch = admin.firestore
}

function mainFunction(){
    const future 
    
    future
    .catch((e) => console.log(e))
    .finally(() => console.log("Done"));
}

mainFunction();
