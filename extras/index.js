const admin = require('firebase-admin');
const serviceAccount = require("./punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const firestore = admin.firestore();

const NOTIFICACIONES_COLLECTION_TAG = "Notificaciones";

function addToCollection(coll, obj){
  return firestore.collection(coll).add(obj);
}

async function deleteDoc(coll, doc){
  await firestore.collection(coll).doc(doc).delete();
  return null;
}

function getFromCollection(coll, doc){
  return firestore.collection(coll).doc(doc).get();
}

async function updateDoc(coll, doc, obj){
  await firestore.collection(coll).doc(doc).update(obj);
  return null;
}

async function getUserByUID(uid) {
  try {
      const user = (
          await firestore.collection("Usuarios").doc(uid).get()
      ).data();
      return user;
  } catch (err) {
      return Promise.reject(err);
  }
};

async function main(){
    const originalNotif = {
        title: "JEST Testing",
        descripcion: "JEST Testing, this is not Supposed to exist",
        fecha: new Date(),
        lifetime: 24
    };
    const doc = await addToCollection(NOTIFICACIONES_COLLECTION_TAG,originalNotif);
    console.log(typeof doc.id === "string")
    const alteredNotif = {
        ...originalNotif,
        title: "JEST Testing ALTERED",
        descripcion: "JEST Testing ALTERED, this is not Supposed to exist"
    }
    console.log(null === await updateDoc(NOTIFICACIONES_COLLECTION_TAG,doc.id,alteredNotif));
    const downloaded = await getFromCollection(NOTIFICACIONES_COLLECTION_TAG,doc.id);
    console.log(downloaded.data());
    await deleteDoc(NOTIFICACIONES_COLLECTION_TAG,doc.id);
    return "DONE";
}

// main().then(() => console.log("DONE"));
export default main;