const admin = require("firebase-admin");
const serviceAccount = require("./punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const db = admin.firestore();

/**
 * interfaz Evento
 * {
    id              : string,
    nombre          : string,
    descripcion     : string,
    fecha           : Date,
    fecha_delete    : Date,
    img             : string,
    place           : string | Coord,
    maxUsers        : number,
    currentUsers    : string[], // id de los usuarios
}
 */

async function saveToHistory(eventosCaducos){
    let batch = db.batch();

    const now = Date.now();

    let counter = 0;
    let i = 0;
    for(var e of eventosCaducos){
        counter++;
        i++;
        batch.create(db.collection("Historical").doc(`Doc_${now}_${i}`),e.data());
        if(counter >= 200){
            await batch.commit();
            counter = 0;
            batch = db.batch();
        }
    }

    if(counter > 0){
        await batch.commit();
    }
    console.log(`${i} files have been written in the historical collection`);
}

async function deletePastEvents(eventosCaducos){
    let batch = db.batch();

    let counter = 0;
    let i = 0;
    for(var e of eventosCaducos){
        counter++;
        i++;
        batch.delete(e.ref);
        if(counter >= 200){
            await batch.commit();
            counter = 0;
            batch = db.batch();
        }
    }

    if(counter > 0){
        await batch.commit();
    }
    console.log(`${i} files have been deleted`);
}

async function getEventos(){
    const eventos = await db.collection("Testing").where("fecha_delete","<", new Date()).get()
    console.log("Se han descargado los eventos")
    // eventos.docs[0].
    console.log(eventos.size)
    saveToHistory(eventos.docs);
    deletePastEvents(eventos.docs);
}

async function batchUpload(){
    const batch = db.batch();

    const now = Date.now();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    const date = new Date();

    for(var i = 0; i < 100; i++ ){
        batch.create(db.collection("Testing").doc(`Doc_${i}`),{
            nombre          : "Nombre de Meditacion Generico",
            descripcion     : "Acercate Mas a Budha",
            fecha           : date,
            fecha_delete    : yesterday,
            img             : "https...",
            place           : "Alguna liga de zoom",
            maxUsers        : 250,
            currentUsers    : [], // id de los usuarios
        });
    }

    await batch.commit();
}

batchUpload();
// getEventos();