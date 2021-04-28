const admin = require('firebase-admin');
const serviceAccount = require("./punto-b84a8-firebase-adminsdk-upnf2-5aca4ad96e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const firestore = admin.firestore();

interface Coord {
    latitude: number,
    longitude: number
}

interface Evento {
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

const toEvento = (obj : any) : Evento => {
    let data = obj.data();
    return  {
      id              : obj.id,
      nombre          : data.nombre,
      descripcion     : data.descripcion,
      fecha           : data.fecha.toDate(),
      fecha_delete    : data.fecha_delete.toDate(),
      img             : data.img,
      place           : ((data.place.latitude != undefined) ? {latitude: data.place.latitude, longitude: data.place.longitude} : data.place),
      maxUsers        : data.maxUsers,
      currentUsers    : data.currentUsers
    }
  }

const getAllEventos = async(): Promise<Evento[]> => {
    const collection = await firestore.collection("Eventos").get();
    const eventos = collection.docs.map(doc => toEvento(doc));
    return eventos;
}


function main() {
    var place = new admin.firestore.GeoPoint(1.0, 2.0);
    var fecha_delete = admin.firestore.Timestamp.fromDate(new Date());
    let place2:Coord = {latitude: 5, longitude: 6};
    var evento = {
        nombre: 'a',
        descripcion: 'b',
        fecha: new Date(),
        fecha_delete: new Date(),
        img: 'url_here',
        place: place2,
        maxUsers: 10,
        currentUsers: []
    };

    const eventos = getAllEventos();
    eventos.then(function (results) {
        console.log(results);
    });

    // firestore.collection("Eventos").get()
    // .then(function (results) {
    //     results.forEach(function (result) {
    //         console.log((result.data() as Evento));
    //     });
    // });
    // const docs1 = docs.docs.map(doc => this.toEvento(doc));
    // console.log(docs);
    // return docs.docs.map(doc => this.toEvento(doc))

    // console.log(evento);
    // firestore.collection("Eventos").add(evento);

    // firestore.collection("Meditacion").doc("Example").set({
    //     "id" : "Example"
    // }).then(() => {
    //     console.log("Done");
    // });
}
// main();

function batchUpload(){
    const batch = firestore.batch();
}

batchUpload()