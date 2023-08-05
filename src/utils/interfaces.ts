export interface Dog {
    id?: number;
    name: string;
    colour: string;
    breed: string;
    gender: string;
    birthday: boolean;
    lastVaccination: Date;
    hasBeenNeutered: boolean;
    sicknesses: string[];
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    address: string;
    username: string;
    password: string;
    email: string;
    phone: string;
}

export interface Drive {
    id?: number;
    dogId: number;
    timeOfDeparture: Date;
    startingPoint: string;
    destination: string;
    userId:number;
}

export interface Adoption {
    id?: number;
    adoptionDate: Date;
    dog: Partial<Dog>;
    user: Partial<User>;
}
