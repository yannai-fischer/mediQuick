export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    speciality: string;
    status: string;
}

export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    severity: string;
    injuryTime: Date;
    injuryDescription: string;
    specialityNeeded: string;
}

export interface Room {
    id: number;
    roomNumber: string;
    status: string;
}

export interface Treatment {
    id: number;
    residingHealthCareProfessional: User;
    patient: Patient;
    room: Room;
}
