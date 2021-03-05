import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { StorageFolders } from "../../Constants/constants";
import {Reto, Usuario, Evento, Notificacion, Meditacion} from "../../Constants/interfaces";

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
        await this.firestore.collection("Usuarios").doc(uid).get()
      ).data();
      return user as Usuario;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  /****************************************OPERACIONES CRUD DE NUESTRAS INTERFACES********************************************/

  private toReto = (obj : any) : Reto => {
    let data = obj.data();
    return {
      id          : obj.id,
      descripcion : data.description ?? "Este es un reto",
      dia         : data.dia,
      link        : data.link
    };
  }

 private toEvento = (obj : any) : Evento => {
    let data = obj.data();
    return  {
      id              : obj.id,
      nombre          : data.nombre,
      descripcion     : data.descripcion,
      fecha           : data.fecha.toDate(),
      fecha_delete    : data.fecha_delete.toDate(),
      img             : data.img,
      place           : ((data.place.latitude) ? {latitude: data.place.latitude, longitude: data.place.longitude} : data.place),
      maxUsers        : data.maxUsers,
      currentUsers    : data.currentUsers
    }
  }

  private toNotificacion = (obj: any) : Notificacion => {
    let data = obj.data();
    return {
      id              : obj.id,
      descripcion     : data.descripcion,
      fecha           : data.fecha.toDate(),
      lifetime        : data.lifetime ?? 24
    }
  }

  private toMeditacion = (obj: any) : Meditacion => {
    let data = obj.data();
    return {
      id                  : obj.id,
      nombre              : data.nombre,
      tipo                : data.tipo,
      nota                : data.nota ?? "",
      estado_de_animo     : data.estado_de_animo ?? "", // Carita feliz --- triste
      fecha               : data.fecha.toDate(),
      ritmo_cardiaco_i    : data.ritmo_cardiaco_i ?? 0,
      ritmo_cardiaco_f    : data.ritmo_cardiaco_f ?? 0
    }
  }

  private toUsuario = (obj:any) : Usuario => {
    let data = obj.data();
    return {
      id                  : obj.id,
      nombre              : data.nombre,
      email               : data.email,
      imagen_perfil       : data.imagen_perfil,
      rol                 : data.rol ?? ""
    }
  }

  getAllUsuarios = async (): Promise<Usuario[]> => {
    const retos = await this.firestore.collection("Usuarios").get();
    return retos.docs.map(doc => this.toUsuario(doc));
  }

  setNewUsuario = async (obj: Usuario): Promise<void> => {
    await this.firestore.collection("Usuarios").add(obj);
  }

  deleteUsuariosByID = async(id: string): Promise<void> => {
    await this.firestore.collection("Usuarios").doc(id).delete();
  }

  updateUsuario = async(obj: Usuario): Promise<void> => {
    await this.firestore.collection("Usuarios").doc(obj.id).update(obj);
  }

  getAllRetos = async (): Promise<Reto[]> => {
    const retos = await this.firestore.collection("Retos").get();
    return retos.docs.map(doc => this.toReto(doc));
  }

  setNewReto = async (obj : Reto) : Promise<void> => {
    await this.firestore.collection("Retos").add(obj);
  }

  deleteRetoByID = async(id: string): Promise<void> => {
    await this.firestore.collection("Retos").doc(id).delete();
  }

  updateReto = async(obj: Reto): Promise<void> => {
    await this.firestore.collection("Retos").doc(obj.id).update(obj);
  }

  getAllEventos = async(): Promise<Evento[]> => {
    const eventos = await this.firestore.collection("Eventos").get();
    return eventos.docs.map(doc => this.toEvento(doc))
  }

  setNewEvento = async (obj : Evento): Promise<void> => {
    if(obj.imgFile && typeof obj.imgFile === "object"){
      obj.img = `${StorageFolders.image}/${obj.imgFile!.name}`;
      obj.imgFile = await this.uploadFile(obj.imgFile!,StorageFolders.image);
    }
    await this.firestore.collection("Eventos").add(obj);
    console.log("Done");
  }

  deleteEventoById = async(id: string): Promise<void> => {
    await this.firestore.collection("Eventos").doc(id).delete();
  }

  updateEvento = async(obj: Evento): Promise<void> => {
    await this.firestore.collection("Eventos").doc(obj.id).update(obj);
  }

  getAllNotifications = async(): Promise<Notificacion[]> => {
    const notifications = await this.firestore.collection("Notificaciones").get();
    return notifications.docs.map(doc => this.toNotificacion(doc));
  }

  setNewNotificacion = async(obj: Notificacion): Promise<void> => {
    await this.firestore.collection("Notificaciones").add(obj);
  }

  deleteNotificacionById = async(id: string): Promise<void> => {
    await this.firestore.collection("Notificaciones").doc(id).delete();
  }

  updateNotificacion = async(obj: Notificacion): Promise<void> => {
    await this.firestore.collection("Notificacion").doc(obj.id).update(obj);
  }

  getAllMeditacions = async(): Promise<Meditacion[]> => {
    const meditaciones = await this.firestore.collection("Meditaciones").get();
    return meditaciones.docs.map(doc => this.toMeditacion(doc));
  }

  setNewMeditacion = async(obj: Meditacion): Promise<void> => {
    await this.firestore.collection("Meditaciones").add(obj);
  }

  deleteMeditacionByID = async(id: string): Promise<void> => {
    await this.firestore.collection("Meditaciones").doc(id).delete();
  }

  updateMeditacion = async(obj: Meditacion): Promise<void> => {
    await this.firestore.collection("Meditaciones").doc(obj.id).update(obj);
  }

  /*********************************************Extra UseFul Functions*****************************************/

  private uploadFile = async (file: File, storageFolder : StorageFolders) : Promise<string> => {
    try {
      const storageRef = this.storage.ref().child(`${storageFolder}/${file.name}`);
      await storageRef.put(file);
      return storageRef.getDownloadURL();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  private deletFile = (path : string) : Promise<any> => {
    try {
      return this.storage.ref().child(path).delete();
    } catch (e) {
      return Promise.reject(e);
    }
  };

}

export default Firebase;
