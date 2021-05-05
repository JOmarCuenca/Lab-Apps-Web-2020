const admin = require('firebase-admin');
const serviceAccount = require("../punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const db = admin.firestore();

async function avgBienestar(){

    // Esta funcion solo debe de jalar las meditaciones de la semana que acaba de pasar
    // Esta funcion se va a ejecutar los domingos en la noche
    const meditaciones = await db.collection("Meditaciones").get();
    let sum = 0;
    meditaciones.docs.forEach(m => {
        const d = m.data();
        sum += d.estado_de_animo;
    });
    const l = meditaciones.docs.length;
    console.log(sum/l);
    return sum/l;
}

async function activeUsers(){
    // Esta funcion solo debe de jalar los usuarios cuya ultima actividad haya sido esta semana
    // Esta funcion se va a ejecutar los domingos en la noche
    // const meditaciones = await db.collection("users").where("lastLogin",">=",).get();
    const users = await db.collection("users").get();
    return users.docs.length;
}

async function mostPopularMeditation(){
    // Esta funcion solo debe de jalar las meditaciones de la semana que acaba de pasar
    // Esta funcion se va a ejecutar los domingos en la noche
    const meditaciones = await db.collection("Meditaciones").get();
}

function main(){
    avgBienestar().then(() => console.log("Done"));
    activeUsers().then(() => console.log("Done"));
    mostPopularMeditation().then(() => console.log("Done"));
}

main();