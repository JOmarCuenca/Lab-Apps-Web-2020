export interface Product {
    id: string,
    name: string,
    description: string,
    averageWeight: number,
    price: number,
    discount?: number,
    imageURL: string,
    active  : boolean,
    date    : Date,
    receta? : string,
    cantidad?: number
}

interface Coord {
    x : number,
    y : number
}

export interface Evento {
    id              : string,
    nombre          : string,
    descripcion     : string,
    fecha           : Date, // Formato
    fecha_delete    : Date, // Formato?
    img             : string, //URL
    place           : string | Coord
}

export interface Usuario {
    id              : string,
    nombre          : string,
    email           : string,
    imagen_perfil   : string, // URL
    rol?            : string
}

export interface Retos {
    id          : string,
    dia         : number, // Date 
    descripcion : string,
    link        : string // URL a la aplicacion de punto blanco
}

enum TiposMeditation {
    tipoA,
    tipoB
}

export interface Meditacion {
    nombre              : string,
    tipo                : TiposMeditation,
    nota?               : string,
    estado_de_animo?    : number, // Carita feliz --- triste
    fecha               : Date,
    ritmo_cardiaco_i?   : number,
    ritmo_cardiaco_f?   : number
}

export interface Notificacion {
    id              : string,
    descripcion     : string,
    fecha           : Date,
    lifetime?       : number // ?? default 24hrs
}

/*

los usuarios pueden tener muchos eventos
en el historico de eventos debemos tener registros de los usuarios

*/