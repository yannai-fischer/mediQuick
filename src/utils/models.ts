export interface Cat {
    id?: number;
    name: string;
    age: number;
    sex: string;
    dateOfArrival: Date;
    illnesses: string[];
    isVaccinated: boolean;
    isVetted: boolean;
    isNeutered: boolean;
    hasWorms: boolean;
    isAdopted: boolean;
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isApproved: boolean;
    address: string;
    username: string;
    password: string;
    email: string;
    phone: string;
}

export interface Ride {
    id?: number;
    catId: number;
    timeOfDeparture: Date;
    source: string;
    destination: string;
    userId:number;
}

export interface FosterCare {
    id?: number;
    isApproved?:boolean;
    startDate: Date;
    finishDate: Date;
    cat: Partial<Cat>;
    user: Partial<User>;
}
