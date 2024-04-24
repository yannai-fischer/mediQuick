import {Patient, Room, Treatment, User} from "../metadata/models";
import {DataAccess} from "./data-access";

export class Service {

    static async getUsers(): Promise<User[]> {
        return await DataAccess.getAllUsers();
    }

    static async getAllTreatments(): Promise<Treatment[]> {
        return await DataAccess.getAllTreatments();
    }

    static async getUserById(id: number): Promise<User> {
        return await DataAccess.getUserById(id);
    }

    static async upsertUser(user: User): Promise<User> {
        return await DataAccess.upsertUser(user);
    }

    static async login(username: string, password: string): Promise<User> {
        return await DataAccess.login(username, password);
    }

    static async handlePatients(patients: Patient[]): Promise<void> {
        for (const patient of patients) {
            await Service.handlePatient(patient);
        }
    }

    static async handlePatient(patient: Patient): Promise<void> {
        console.log('Attempting to handle patient ' + patient.id);
        try {
            const freeRoom: Room = await DataAccess.getFreeRoom();
            const freeHealthCareProfessional: User = await DataAccess.getFreeUser();
            console.log('xxx', freeRoom, freeHealthCareProfessional);
            if (freeRoom && freeHealthCareProfessional) {
                await DataAccess.setTreatment(freeHealthCareProfessional.id, patient.id, freeRoom.id);
                await DataAccess.setPatientHandled(patient.id);
                await DataAccess.setRoomActive(freeRoom.id);
                await DataAccess.setHealthCareProfessionalActive(freeHealthCareProfessional.id);
                console.log('Successfully handled patient ' + patient.id);
            } else {
                throw new Error('Could not find room or healthCareProfessional! HealthCareProfessional found: ' + freeHealthCareProfessional?.firstName + ', Room found: ' + freeRoom?.roomNumber);
            }
        } catch (e) {
            console.error('Failed to handle patient', patient, e);
        }
    }
}
