export interface Usuario {
    nombre: string,
    apellido: string,
    correo: string,
    rol: string
};

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

export interface Evento {
    id          : string,
    nombre      : string,
    descripcion : string,
    fecha       : string // Formato?
}

// export interface Usuario {
//     id              : string,
//     nombre          : string,
//     email           : string,
//     imagen_perfil   : string // URL
// }

export interface Retos {
    id          : string,
    // dia         : int, // Date 
    descripcion : string
}

// export interface Meditacion {
//     nombre              : string,
//     tipo                : string,
//     nota?               : string,
//     estado_de_animo?    : int,
//     fecha               : string,
//     ritmo_cardiaco_i?   : int,
//     ritmo_cardiaco_f?   : int
// }

export interface Notificacion {
    id              : string,
    descripcion     : string,
    fecha           : Date
}

export interface UsuarioEvento {
    id_evento   : string,
    id_usuario  : string
}

export interface UsuarioNotificacion {
    id_usuario      : string,
    id_notificacion : string
}