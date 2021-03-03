var admin = require('firebase-admin');
var serviceAccount = require("../punto-b84a8-firebase-adminsdk-upnf2-5aca4ad96e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});
function main() {
    var firestore = admin.firestore();
    var evento = {
        nombre: 'a',
        desc: 'b',
        fecha: '05-05-2020',
        fecha_delete: '05-06-2020',
        img: 'url_here',
        place: 'ITESM',
        maxUsers: 10,
        currentUsers: []
    };
    firestore.collection("Eventos").get().then(function (results) {
        results.forEach(function (result) {
            console.log(result.data());
        });
    });
    // const docs1 = docs.docs.map(doc => this.toEvento(doc));
    // console.log(docs);
    // return docs.docs.map(doc => this.toEvento(doc))
    // firestore.collection("Eventos").add(evento);
    // firestore.collection("Meditacion").doc("Example").set({
    //     "id" : "Example"
    // }).then(() => {
    //     console.log("Done");
    // });
}
main();
