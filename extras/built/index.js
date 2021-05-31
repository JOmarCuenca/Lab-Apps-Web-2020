var admin = require('firebase-admin');
var serviceAccount = require("../punto-b84a8-firebase-adminsdk-upnf2-f8460e62a8.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://punto-b84a8.firebaseio.com"
});

const db = admin.firestore();

async function uploadStatistics() {
    var db = admin.firestore();
    const batch = db.batch();
    // Statistics
    const docs = [
        {value : "86%", description : "Asistentes a eventos esta semana"},
        {value : "220", description : "Usuarios activos esta semana"},
        {value : "4/5", description : "Bienestar de los usuarios promedio"},
        {value : "ZEN", description : "Meditación mas popular esta semana"},
    ];
    docs.forEach((d,i) => {
        const temp = {
            ...d,
            date : new Date()
        }
        batch.create(db.collection("Statistics").doc(`Test_Doc_${i}`),temp);
    })
    await batch.commit();
}

/*
interface Notificacion {
	id: string;
	title: string;
	descripcion: string;
	fecha: Date;
	lifetime?: number; // ?? default 24 hrs
}
*/

async function uploadNotif() {
    var db = admin.firestore();
    const batch = db.batch();
    // Statistics
    const docs = [
        {
            title : "Ejemplo 1",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 2",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 3",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        },
        {
            title : "Ejemplo 4",
            descripcion : "Lorem Ipsum sit amet",
            fecha : new Date(),
            lifetime : 24
        }
    ];
    docs.forEach((d,i) => {
        const temp = {
            ...d,
            date : new Date()
        }
        batch.create(db.collection("Notificaciones").doc(`Test_Doc_${i}`),temp);
    })
    await batch.commit();
}

async function getLimited(){
    const db = admin.firestore();
    // const notif = await db.collection("Notificaciones")
    // .orderBy("fecha","desc")
    // .startAt(0)
    // .limit(4)
    // .get();
    const notif = await db.collection("Notificaciones")
    .startAt(0)
    .orderBy("fecha","desc")
    .limit(4)
    .get();
    notif.docs.forEach( d => console.log(d.id));
}
// uploadStatistics().then(() => console.log("Done"));
// uploadNotif().then(() => console.log("Done"));
// getLimited();

const STATS_CATEGORIES = [
    "activeUsersPercent",     // Divide by the total number of users in the Db (Percentage)
    "totalActiveUsers",       // Number of active Users per Week  (Number)
    "avgWellBeing",           // Int over 5
    "mostPopularMeditation"   // Enum value (Yet to be determined)
]

const STATS_GENERAL_OBJ = {
    "activeUsersPercent"    : {category : 0 },
    "totalActiveUsers"      : {category : 1 },
    "avgWellBeing"          : {category : 2 },
    "mostPopularMeditation" : {category : 3 }
}

const MEDITATION_TYPES = [
    "ZEN",
    "SHINTO",
    "BUDHA",
    "TIBET",
    "CHAKRA",
    "PSY"
]

const WEEK_NUM = 1*7*24*60*60*1000;

function randomStat(i){
    const random = Math.random();
    switch(i){
        case 0: // Percentage of active Users
            return random*100;
        case 1: // Number of active users in the DB
            return Math.round(random*100000);
        case 2: // Avg Well being of the users
            return Math.floor((random*100)%5 + 1);
        default: // Most popular Meditation
            return Math.floor((random*100)%(MEDITATION_TYPES.length));
    }
}

function genRandomStatObj(i){
    return {
        ...STATS_GENERAL_OBJ[STATS_CATEGORIES[i]],
        value : randomStat(i)
    }
}

async function uploadStatsTest(){
    const now = new Date();
    const futureWeeks = 4, pastWeeks = 8;
    let batch, counter = 0;
    for(var i = 0 ; i < futureWeeks ; i++){
        if(counter%200 === 0){
            if(batch){
                await batch.commit();
            }
            batch = db.batch();
        }
        for(var s = 0; s < STATS_CATEGORIES.length ; s++){
            batch.set(db.collection("Statistics").doc(`stats_test_future_${i}_${s}`),{
            ...genRandomStatObj(s),
            createdDate : new Date(now.getTime() + WEEK_NUM * (i+1))
        });
        }
        counter++;
    }
    for(var i = 0 ; i < pastWeeks ; i++){
        if(counter%200 === 0){  
            if(batch){
                await batch.commit();
            }
            batch = db.batch();
        }
        for(var s = 0; s < STATS_CATEGORIES.length ; s++){
            batch.set(db.collection("Statistics").doc(`stats_test_past_${i}_${s}`),{
            ...genRandomStatObj(s),
            createdDate : new Date(now.getTime() - WEEK_NUM * i)
        });
        }
        counter++;
    }
    await batch.commit();
}

async function setActiveUsers(number){
    let batch;
    for(var i = 0 ; i < number ; i++){
        if(i%200 === 0){
            if(batch){
                await batch.commit();
            }
            batch = db.batch();
        }
        batch.set(db.collection("users").doc(`stats_test_${i}`),{"lastLogged" : new Date()})
    }
    await batch.commit();
}

async function deleteActiveUsers(number){
    let batch;
    for(var i = 0 ; i < number ; i++){
        if(i%200 === 0){
            if(batch){
                await batch.commit();
            }
            batch = db.batch();
        }
        batch.delete(db.collection("users").doc(`stats_test_${i}`));
    }
    await batch.commit();
}

function mainFunction(){
    // const future = uploadStatsTest();
    const future = setActiveUsers(100);
    future
    .catch((e) => console.log(e))
    .finally(() => console.log("Done"));
    // const now = new Date();
    // console.log(`A week into the future is ${new Date(now.getTime() + WEEK_NUM)}`)
}

mainFunction();
