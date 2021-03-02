const admin = require("firebase-admin");

const serviceAccount = require("./punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://punto-b84a8.firebaseio.com"
});

function main(){
    const firestore = admin.firestore();
    firestore.collection("Meditacion").doc("Example").set({
        "id" : "Example"
    }).then(() => {
        console.log("Done");
    });
}

main();