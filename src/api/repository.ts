import {Adoption, Dog, Drive, User} from "../utils/interfaces";
import {DatabaseTools} from "../utils/database-tools";

export class Repository {

    static async getDrives(): Promise<Drive[]> {
        return await DatabaseTools.getDrives();
    }

    static async upsertDrive(drive: Partial<Drive>): Promise<Drive> {
        return await DatabaseTools.upsertDrive(drive);
    }

    static async deleteDrive(id: number): Promise<number> {
        return await DatabaseTools.deleteDriveById(id);
    }

    static async getDogs(options?: Partial<Dog>): Promise<Dog[]> {
        return await DatabaseTools.getDogs(options);
    }

    static async upsertDog(dog: Partial<Dog>): Promise<Dog> {
        return await DatabaseTools.upsertDog(dog);
    }

    static async login(username: string, password: string): Promise<User> {
        return await DatabaseTools.login(username, password);
    }

    static async getUsers(): Promise<User[]> {
        return await DatabaseTools.getUsers();
    }

    static async getUserById(id: number): Promise<User> {
        return await DatabaseTools.getUserById(id);
    }

    static async getPendingAdoptionApplications(): Promise<Adoption[]> {
        return await DatabaseTools.getPendingAdoptionApplications();
    }

    static async upsertUser(user: Partial<User>): Promise<User> {
        return await DatabaseTools.upsertUser(user);
    }

    static async upsertAdoption(adoption: Partial<Adoption>): Promise<Adoption> {
        return await DatabaseTools.upsertAdoption(adoption);
    }

    static async deleteAdoptionById(id: number): Promise<number> {
        return await DatabaseTools.deleteAdoption(id);
    }

    static async deleteAdoptionByDogId(dogId: number): Promise<number> {
        return await DatabaseTools.deleteAdoptionByDogId(dogId);
    }

    static async deleteDriveByDogId(dogId: number): Promise<number> {
        return await DatabaseTools.deleteDriveByDogId(dogId);
    }

    static async deleteDogById(dogId: number): Promise<number> {
        return await DatabaseTools.deleteDogById(dogId);
    }
}
