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
    // ingredients?: Ingredient[],
    receta? : string,
    cantidad?: number
}