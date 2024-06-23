import {Patient, Room, Treatment, User} from "../../metadata/models";
import {DataAccess} from "./data-access";
import {Speciality} from "../../metadata/enums";

export class BusinessLogic {

    static async getUsers(): Promise<User[]> {
        return await DataAccess.getAllUsers();
    }

    static async getLastTreatmentByUserId(id: number): Promise<Treatment> {
        return await DataAccess.getLastTreatmentByProfessional(id);
    }

    static async getAllTreatments(): Promise<Treatment[]> {
        return await DataAccess.getAllTreatments();
    }

    static async getUserById(id: number): Promise<User> {
        return await DataAccess.getUserById(id);
    }

    static async setUser(user: User): Promise<User> {
        return await DataAccess.setUser(user);
    }

    static async login(username: string, password: string): Promise<User> {
        return await DataAccess.login(username, password);
    }

    static async activateUser(userId: number): Promise<User> {
        return await DataAccess.setHealthCareProfessionalActive(userId);
    }

    static async handleDeactivation(userId: number): Promise<User> {
        const lastTreatmentByProfessional: Treatment = await DataAccess.getLastTreatmentByProfessional(userId);
        if (lastTreatmentByProfessional?.room?.id) {
            const lastTreatmentInRoom: Treatment = await DataAccess.getLatestTreatmentInRoom(lastTreatmentByProfessional.room.id);
            if (lastTreatmentInRoom?.id == lastTreatmentByProfessional.id) {
                await DataAccess.setRoomInactive(lastTreatmentByProfessional.room.id);
            }
        }

        return await DataAccess.setUserInactive(userId);
    }

    static async handlePatients(patients: Patient[]): Promise<void> {
        for (const patient of patients) {
            await BusinessLogic.handlePatient(patient);
        }
    }

    static async handlePatient(patient: Patient): Promise<void> {
        console.log('Attempting to handle patient ' + patient.id);
        try {
            const freeRoom: Room = await DataAccess.getFreeRoom();
            const freeHealthCareProfessional: User = await DataAccess.getFreeUser(patient.specialityNeeded as Speciality);
            if (freeRoom && freeHealthCareProfessional) {
                await DataAccess.setTreatment(freeHealthCareProfessional.id, patient.id, freeRoom.id);
                await DataAccess.setPatientHandled(patient.id);
                await DataAccess.setRoomActive(freeRoom.id);
                await DataAccess.setHealthCareProfessionalActive(freeHealthCareProfessional.id);
                console.log('Successfully handled patient ' + patient.id);
            } else {
                throw new Error('Could not find room or healthCareProfessional! HealthCareProfessional found: ' + freeHealthCareProfessional?.firstName + ', Room found: ' + freeRoom?.roomNumber);
            }
        } catch (error) {
            console.error('Failed to handle patient', patient, error);
        }
    }
}
