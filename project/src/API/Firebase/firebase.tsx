import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import {Usuario} from "../../Constants/interfaces";

const firebaseConfig = {
  apiKey: "AIzaSyCplhL4TQUpmTDmgDGUXzC6ipykmQ6HM_E",
  authDomain: "punto-b84a8.firebaseapp.com",
  databaseURL: "https://punto-b84a8.firebaseio.com",
  projectId: "punto-b84a8",
  storageBucket: "punto-b84a8.appspot.com",
  messagingSenderId: "597623444685",
  appId: "1:597623444685:web:87028dc2feeacaf6794584",
  measurementId: "G-K8E5LDDGY2"
};

class Firebase {
  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
  types: typeof app.firestore;
  user: Usuario | undefined;
  functions: firebase.functions.Functions;
  storage: firebase.storage.Storage;

  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.firestore = app.firestore();
    this.types = app.firestore;
    this.functions = app.functions();
    this.storage = app.storage();
  }

  /**
   * Esta functión hace un set del usuario activo
   */
  setUser = async (userID: string): Promise<Usuario> => {
    try {
      return (
        await this.firestore.collection(`Users`).doc(userID).get()
      ).data() as Usuario;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  /**
   * Regresa el usuario activo
   */
  getAuthUser = (): Promise<firebase.User> =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((authUser) => {
        if (authUser) resolve(authUser);
        reject("No logged user!");
      });
    });

  /**
   * Inicia sesión con correo y contraseña
   * @param email Correo del usuario
   * @param password Contraseña del usuario
   */
  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  /**
   * Cierra la sesión actual
   */
  signout = () => this.auth.signOut();

  /**
   * Resetea la contraseña
   * @param email Manda el mensaje de reinicio de la contraseña al email dado
   */
  sendResetPassword = async (email: string): Promise<void> => {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  sendPassReset = async (userMail: string) => {
    try {
      await this.auth.sendPasswordResetEmail(userMail);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the Uer
   * @param uid UID del usuario
   */
  getUserByUID = async (uid: string): Promise<Usuario> => {
    try {
      const user = (
        await this.firestore.collection("Users").doc(uid).get()
      ).data();
      return user as Usuario;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  uploadImage = async (file: File) => {
    try {
      const storageRef = this.storage.ref().child(`products/${file.name}`);
      await storageRef.put(file);
      return storageRef.getDownloadURL();
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

export default Firebase;
