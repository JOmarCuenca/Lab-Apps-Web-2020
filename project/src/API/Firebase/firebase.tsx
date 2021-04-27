import app from "firebase/app";
import { StorageFolders } from "../../Constants/constants";
import {
	Reto,
	Usuario,
	Evento,
	Notificacion,
	Meditacion,
	StatisticObj,
} from "../../Constants/interfaces";
import { DataAccess } from "./data";

const USER_COLLECTION_TAG = "Usuarios";
const RETOS_COLLECTION_TAG = "Retos";
const EVENTOS_COLLECTION_TAG = "Eventos";
const NOTIFICACIONES_COLLECTION_TAG = "Notificaciones";
const MEDITACIONES_COLLECTION_TAG = "Meditaciones";
const STATISTICS_COLLECTION_TAG = "Statistics";
const PERMITS_COLLECTION_TAG = "Permits";

class Firebase {
	private dataAccess: DataAccess;

	constructor() {
		this.dataAccess = new DataAccess();
	}

	/**
	 * Regresa el usuario activo
	 */
	getAuthUser = (): Promise<firebase.User> => this.dataAccess.getAuthUser();

	/**
	 * Inicia sesión con correo y contraseña
	 * @param email Correo del usuario
	 * @param password Contraseña del usuario
	 */
	doSignInWithEmailAndPassword = (email: string, password: string) =>
		this.dataAccess.doSignInWithEmailAndPassword(email, password);

	/**
	 * Cierra la sesión actual
	 */
	signout = () => this.dataAccess.signout();

	/**
	 * Resetea la contraseña
	 * @param email Manda el mensaje de reinicio de la contraseña al email dado
	 */
	sendResetPassword = async (email: string): Promise<void> =>
		this.dataAccess.sendResetPassword(email);

	sendPassReset = async (userMail: string) =>
		this.dataAccess.sendPassReset(userMail);

	/**
	 * Get the Uer
	 * @param uid UID del usuario
	 */
	getUserByUID = async (uid: string): Promise<Usuario> =>
		this.dataAccess.getUserByUID(uid);

	/****************************************OPERACIONES CRUD DE NUESTRAS INTERFACES********************************************/

	private toReto = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): Reto => {
		let data = obj.data();
		return {
			id: obj.id,
			descripcion: data.description ?? "Este es un reto",
			dia: data.dia,
			link: data.link,
		};
	};

	private toEvento = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): Evento => {
		let data = obj.data();
		return {
			id: obj.id,
			nombre: data.nombre,
			descripcion: data.descripcion,
			fecha: data.fecha.toDate(),
			fecha_delete: data.fecha_delete.toDate(),
			img: data.img,
			place: data.place.latitude
				? {
						latitude: data.place.latitude,
						longitude: data.place.longitude,
				  }
				: data.place,
			maxUsers: data.maxUsers,
			currentUsers: data.currentUsers,
		};
	};

	private cleanEvento = (event: Evento) => {
		return {
			nombre: event.nombre,
			descripcion: event.descripcion,
			fecha: event.fecha,
			fecha_delete: event.fecha_delete,
			img: event.img,
			place: event.place,
			maxUsers: event.maxUsers,
			currentUsers: event.currentUsers,
			imgFile: event.imgFile,
		};
	};

	private toNotificacion = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): Notificacion => {
		let data = obj.data();
		return {
			id: obj.id,
			descripcion: data.descripcion,
			title: data.title,
			fecha: data.fecha.toDate(),
			lifetime: data.lifetime ?? 24,
		};
	};

	private cleanNotificacion = (n: Notificacion) => {
		return {
			title: n.title,
			descripcion: n.descripcion,
			fecha: n.fecha,
			lifetime: n.lifetime ?? 24,
		};
	};

	private toMeditacion = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): Meditacion => {
		let data = obj.data();
		return {
			id: obj.id,
			nombre: data.nombre,
			tipo: data.tipo,
			nota: data.nota ?? "",
			estado_de_animo: data.estado_de_animo ?? "", // Carita feliz --- triste
			fecha: data.fecha.toDate(),
			ritmo_cardiaco_i: data.ritmo_cardiaco_i ?? 0,
			ritmo_cardiaco_f: data.ritmo_cardiaco_f ?? 0,
		};
	};

	private toUsuario = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): Usuario => {
		let data = obj.data();
		return {
			uid: data.uid,
			nombre: data.nombre,
			email: data.email,
			imagen_perfil: data.imagen_perfil,
			rol: data.rol ?? "",
		};
	};

	private userClean = (usr: Usuario) => {
		const temp = JSON.parse(JSON.stringify(usr));
		delete temp["id"];
		return temp;
	};

	private toStatisticObj = (
		obj: app.firestore.QueryDocumentSnapshot<app.firestore.DocumentData>
	): StatisticObj => {
		let data = obj.data();
		return {
			value		: data.value,
			description : data.description
		}
	}

	// USUARIOS SECTION

	setNewUsuario = (obj: Usuario): Promise<void> | Promise<app.firestore.DocumentReference<app.firestore.DocumentData>> => 
		this.dataAccess.writeDoc(
			USER_COLLECTION_TAG,
			this.userClean(obj),
			obj.uid
		);

	getAllUsuarios = async (): Promise<Usuario[]> => {
		const retos = await this.dataAccess.getAllFromCollection(
			USER_COLLECTION_TAG
		);
		return retos.docs.map((doc) => this.toUsuario(doc));
	};

	updateUsuario = async (obj: Usuario): Promise<void> => {
		if (obj.imgFile && typeof obj.imgFile === "object") {
			const fileName = `${obj.uid}.png`;
			obj.imagen_perfil = await this.uploadUserProfileImage(obj.uid, obj.imgFile!);		
			obj.imgFile = `${StorageFolders.image}/${fileName}`;
		}
		return this.dataAccess.updateDoc(USER_COLLECTION_TAG, obj.uid, obj);
	};

	deleteUsuariosByID = async (id: string): Promise<void> => {
		await this.dataAccess.deleteDoc(USER_COLLECTION_TAG, id);
	};

	// RETOS SECTION

	setNewReto = async (obj: Reto): Promise<void> => {
		await this.dataAccess.writeDoc(RETOS_COLLECTION_TAG, obj);
	};

	getAllRetos = async (): Promise<Reto[]> => {
		const retos = await this.dataAccess.getAllFromCollection(
			RETOS_COLLECTION_TAG
		);
		return retos.docs.map((doc) => this.toReto(doc));
	};

	updateReto = async (obj: Reto): Promise<void> => {
		await this.dataAccess.updateDoc(RETOS_COLLECTION_TAG, obj.id, obj);
	};

	deleteRetoByID = async (id: string): Promise<void> => {
		await this.dataAccess.deleteDoc(RETOS_COLLECTION_TAG, id);
	};

	// Eventos Section

	setNewEvento = async (obj: Evento): Promise<void> => {
		if (obj.imgFile && typeof obj.imgFile === "object") {
			obj.img = `${StorageFolders.image}/${obj.imgFile!.name}`;
			obj.imgFile = await this.uploadFile(
				obj.imgFile!,
				StorageFolders.image
			);
		}
		await this.dataAccess.writeDoc(
			EVENTOS_COLLECTION_TAG,
			this.cleanEvento(obj)
		);
		console.log("Done");
	};

	getAllEventos = async (): Promise<Evento[]> => {
		const eventos = await this.dataAccess.getAllFromCollection(
			EVENTOS_COLLECTION_TAG
		);
		return eventos.docs.map((doc) => this.toEvento(doc));
	};

	updateEvento = async (obj: Evento): Promise<void> => {
		if (obj.imgFile && typeof obj.imgFile === "object") {
			obj.img = `${StorageFolders.image}/${obj.imgFile!.name}`;
			obj.imgFile = await this.uploadFile(
				obj.imgFile!,
				StorageFolders.image
			);
		}
		await this.dataAccess.updateDoc(
			EVENTOS_COLLECTION_TAG,
			obj.id,
			this.cleanEvento(obj)
		);
	};

	deleteEventoById = async (id: string): Promise<void> => {
		await this.dataAccess.deleteDoc(EVENTOS_COLLECTION_TAG, id);
	};

	// Notifications section

	setNewNotificacion = async (obj: Notificacion): Promise<void> => {
		await this.dataAccess.writeDoc(
			NOTIFICACIONES_COLLECTION_TAG,
			this.cleanNotificacion(obj)
		);
	};

	getAllNotifications = async (): Promise<Notificacion[]> => {
		const notifications = await this.dataAccess.getAllFromCollection(
			NOTIFICACIONES_COLLECTION_TAG
		);
		return notifications.docs.map((doc) => this.toNotificacion(doc));
	};

	updateNotificacion = async (obj: Notificacion): Promise<void> => {
		await this.dataAccess.updateDoc(
			NOTIFICACIONES_COLLECTION_TAG,
			obj.id,
			this.cleanNotificacion(obj)
		);
	};

	deleteNotificacionById = async (id: string): Promise<void> => {
		await this.dataAccess.deleteDoc(NOTIFICACIONES_COLLECTION_TAG, id);
	};

	// Meditaciones section

	setNewMeditacion = async (obj: Meditacion): Promise<void> => {
		await this.dataAccess.writeDoc(MEDITACIONES_COLLECTION_TAG, obj);
	};

	getAllMeditacions = async (): Promise<Meditacion[]> => {
		const meditaciones = await this.dataAccess.getAllFromCollection(
			MEDITACIONES_COLLECTION_TAG
		);
		return meditaciones.docs.map((doc) => this.toMeditacion(doc));
	};

	updateMeditacion = async (obj: Meditacion): Promise<void> => {
		await this.dataAccess.updateDoc(
			MEDITACIONES_COLLECTION_TAG,
			obj.id,
			obj
		);
	};

	deleteMeditacionByID = async (id: string): Promise<void> => {
		await this.dataAccess.deleteDoc(MEDITACIONES_COLLECTION_TAG, id);
	};

	// Statistics Section

	getStats = async () => {
		const values = await this.dataAccess.getAllFromCollection(STATISTICS_COLLECTION_TAG);
		return values.docs.map(s => this.toStatisticObj(s));
	}

	// Limited Queries Section Section

	getLimitedNotification = async (
		limit: number,
		initial = 0
	): Promise<Notificacion[]> => {
		const notif = await this.dataAccess.getLimitedFromCollection(
			NOTIFICACIONES_COLLECTION_TAG,
			"fecha",
			limit,
			initial,
			"desc"
		);
		return notif.docs.map((n) => this.toNotificacion(n));
	};

	getLimitedEvento = async (
		limit: number,
		initial = 0
	): Promise<Evento[]> => {
		const eventos = await this.dataAccess.getLimitedFromCollection(
			EVENTOS_COLLECTION_TAG,
			"fecha",
			limit,
			initial,
			"desc"
		);
		return eventos.docs.map((n) => this.toEvento(n));
	};

	getPermit = (id : string) : Promise<app.firestore.DocumentSnapshot<app.firestore.DocumentData>> => this.dataAccess.readDoc(PERMITS_COLLECTION_TAG, id);

	registerNewSubAdmin = async (mail : string, pass : string, name : string) : Promise<app.auth.UserCredential> => {
		try {
			// Try to create the new User
			const authUser = await this.dataAccess.createAuthUser(mail,pass);
			if(authUser.user === undefined || authUser.user === null) throw new Error("AUTH_ERROR");
			// Save the new User to the DB.
			const usuarioObj : Usuario = {
				email : mail,
				nombre : name,
				uid : authUser.user.uid,
				imagen_perfil : "",
				rol: "SUB_ADMIN"
			};
			await this.setNewUsuario(usuarioObj);
			return authUser;
		} catch (e) {
			return Promise.reject(e);
		}
	}

	/*********************************************Extra UseFul Functions*****************************************/

	/**
	 * This function sends the file to the Firebase Storage Service and returns the URL to render it
	 * in the web application.
	 * 
	 * @param file File to upload to Firebase Storage
	 * @param storageFolder Path of firebase where the file will be
	 * @returns Returns URL where to get the file from.
	 */
	private uploadFile = async (
		file: File,
		storageFolder: StorageFolders
	): Promise<string> => {
		try {
			const storageRef = this.dataAccess.storageAccess
				.ref()
				.child(`${storageFolder}/${file.name}`);
			await storageRef.put(file);
			return storageRef.getDownloadURL();
		} catch (e) {
			return Promise.reject(e);
		}
	};

	private uploadUserProfileImage = async (docId : string, file : File) => {
		const fileName = `${docId}.png`;
		return this.uploadFile(
			new File([file],fileName, { type: 'image/png' }),
			StorageFolders.image
		);
	}

	private deleteFile = (path: string): Promise<any> => {
		try {
			return this.dataAccess.storageAccess.ref().child(path).delete();
		} catch (e) {
			return Promise.reject(e);
		}
	};
}

export default Firebase;
