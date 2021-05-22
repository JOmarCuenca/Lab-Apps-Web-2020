const admin = require('firebase-admin');
const serviceAccount = require("./punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");
import main from "./index";

jest.useFakeTimers();

jest.setTimeout(10000);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://punto-b84a8.firebaseio.com"
// });

const firestore = admin.firestore();

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

test('Checking Super User Exists', () => {
  const getSuper = getUserByUID("6ykgDp4swCWj1WJbUGfnZ5BPEIJ2");
  expect(getSuper).resolves.toMatchObject({
    email : "admin@gmail.com",
    uid   : "6ykgDp4swCWj1WJbUGfnZ5BPEIJ2",
    rol   : "SUPER_ADMIN"
  });
});

// interface Notificacion {
// 	id: string;
// 	title: string;
// 	descripcion: string;
// 	fecha: Date;
// 	lifetime?: number; // ?? default 24 hrs
// }

test('Check CRUD on Notifications', async () => {
  await expect(main()).resolves.toBe("DONE");
});