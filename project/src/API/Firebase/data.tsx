import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { Usuario } from "../../Constants/interfaces";

const firebaseConfig = {
    apiKey: "AIzaSyBAVX3_Gwe3ucuMOvSocvezLf5cgSf6suo",
    authDomain: "punto-dev-d9d2c.firebaseapp.com",
    projectId: "punto-dev-d9d2c",
    storageBucket: "punto-dev-d9d2c.appspot.com",
    messagingSenderId: "462541076427",
    appId: "1:462541076427:web:dd4aacd73cb5cc9c18284e",
    measurementId: "G-CC9JSXYSQL"
  };

export enum QueryCondition {
    notEqual,
    equal,
    greaterThan,
    greaterEqualThan,
    lessThan,
    lessEqualThan
}

export class DataAccess {

    private auth: firebase.auth.Auth;
	private firestore: firebase.firestore.Firestore;
	// private types: typeof app.firestore;
	// private functions: firebase.functions.Functions;
	private storage: firebase.storage.Storage;

    constructor (){
        app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		this.firestore = app.firestore();
		// this.types = app.firestore;
		// this.functions = app.functions();
		this.storage = app.storage();
    }

    private QuerytoFirestoreFilter(qc : QueryCondition) : app.firestore.WhereFilterOp {
        switch(qc){
            case QueryCondition.equal:
                return "==";
            case QueryCondition.notEqual:
                return "!=";
            case QueryCondition.greaterThan:
                return ">";
            case QueryCondition.greaterEqualThan:
                return ">=";
            case QueryCondition.lessThan:
                return "<";
            case QueryCondition.lessEqualThan:
                return "<=";
            default:
                return "!=";
        }
    }

    private toUsuario = (
		obj: app.firestore.DocumentData
	): Usuario => {
		return {
			uid: obj.uid,
			nombre: obj.nombre,
			email: obj.email,
			imagen_perfil: obj.imagen_perfil,
			rol: obj.rol ?? "",
            delete_date : (obj.delete_date) ? new Date(obj.delete_date as string) : undefined
		};
	}

    public get storageAccess() {
        return this.storage;
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

	changeUserPassword = (password: string): Promise<void> => {
		return this.auth.currentUser!.updatePassword(password);
	}

	changeUserEmail = (email: string): Promise<void> => {
		return this.auth.currentUser!.updateEmail(email);
	}

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
    };

    /**
     * Get the Uer
     * @param uid UID del usuario
     */
    getUserByUID = async (uid: string): Promise<Usuario> => {
        try {
            const user = (
                await this.firestore.collection("Usuarios").doc(uid).get()
            ).data();
            return this.toUsuario(user!);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
     * Gets all the documents from the Collection That you wanted
     * @param coll Collection Name
     * @returns Firebase Documents
     */
    getAllFromCollection = (coll : string) => {
        return this.firestore.collection(coll).get();
    }

    /**
     * Returns the Firebase Reference of the specific document requested
     * @param coll Collection Name
     * @param doc Specifica Document Name
     * @returns Reference to the Firebase Document
     */
    private getDocRefFromCollection = (coll : string,doc : string) => {
        return this.firestore.collection(coll).doc(doc);
    }

    //CRUD Operations for the remote Docs
    readDoc   = (coll : string, doc : string) => this.getDocRefFromCollection(coll,doc).get();
    deleteDoc = (coll : string, doc : string) => this.getDocRefFromCollection(coll,doc).delete();
    writeDoc  = (coll : string, obj : any, doc? : string) => (doc && doc !== "") ? this.getDocRefFromCollection(coll,doc).set(obj) : this.firestore.collection(coll).add(obj);
    updateDoc = (coll : string, doc : string, obj : any) => this.getDocRefFromCollection(coll,doc).update(obj);

    /**
     * Gets the amount of files requested from the Firebase collection.
     * 
     * Used for the creation of Infinite Scrolls
     * @param coll Firebase collection
     * @param orderAttr Attribute to order by
     * @param amountLimit Amount of docs to be extracted
     * @param startAt Initial Position to extract documents from
     * @param orderDirection Order Direction of the order by parameter
     * @returns Firebase Documents
     */
    getLimitedFromCollection = 
    (   coll : string, orderAttr : string, 
        amountLimit : number, startAt = 0,
        orderDirection? : app.firestore.OrderByDirection ) => 
            this.firestore.collection(coll)
            .orderBy(orderAttr,orderDirection)
            .limit(amountLimit)
            .get();
    
    getWhere = (coll : string, field : string, condition : QueryCondition, value : any) => this.firestore.collection(coll).where(field,this.QuerytoFirestoreFilter(condition),value).get();

    getWithParam = (coll : string, queryString : string, limitLow : any, limitUp? : any) => {
        let initialQuery = this.firestore.collection(coll).where(queryString, ">=", limitLow);
        if(limitUp) {
            initialQuery = initialQuery.where(queryString, "<=", limitUp);
        }
        return initialQuery.get();
    }

    createAuthUser = (mail : string, pass : string) => this.auth.createUserWithEmailAndPassword(mail,pass);
}