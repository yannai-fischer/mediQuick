import {Dog, Adoption, Drive, User} from "../utils/interfaces";
import {Repository} from "./repository";

export class Service {

    static async getDrives(): Promise<Drive[]> {
        return await Repository.getDrives();
    }

    static async upsertDrive(drive: Drive): Promise<Drive> {
        return await Repository.upsertDrive(drive);
    }

    static async deleteDrive(id: number): Promise<number> {
        return await Repository.deleteDrive(id);
    }

    static async getDogs(): Promise<Dog[]> {
        return await Repository.getDogs();
    }

    static async upsertDog(dog: Dog): Promise<Dog> {
        return await Repository.upsertDog(dog);
    }

    static async adoptDog(dogId: number): Promise<boolean> {
        return !!await Repository.deleteAdoptionByDogId(dogId) && !!await Repository.deleteDriveByDogId(dogId) && !!await Repository.deleteDogById(dogId);
    }

    static async getUsers(): Promise<User[]> {
        return await Repository.getUsers();
    }

    static async upsertUser(user: User): Promise<User> {
        return await Repository.upsertUser(user);
    }

    //TODO:Remove
    // static async createUser(user: User): Promise<User> {
    //     const userToReturn: User = await Repository.createUser(user);
    //     userToReturn && await MailingSystem.sendApprovalEmail(user);
    //     return userToReturn;
    // }

    static async login(username: string, password: string): Promise<User> {
        return await Repository.login(username, password);
    }

    static async deleteUser(id: number): Promise<number> {
        return await Repository.deleteUser(id);
    }

    static async upsertAdoption(adoption: Adoption): Promise<boolean> {
        return !!await Repository.upsertAdoption(adoption)
            // && MailingSystem.sendAdoptionEmail(await Repository.getUserById(adoption.user.id ?? -1), await Repository.getDogById(adoption.dog.id ?? -1));
    }

    static async getPendingAdoptionApplications(): Promise<Adoption[]> {
        return await Repository.getPendingAdoptionApplications();
    }

    static async deleteAdoption(id: number): Promise<number> {
        return await Repository.deleteAdoptionById(id);
    }

    static async claimDrive(id: number, userId: number): Promise<boolean> {
        return !!await Repository.upsertDrive({id, userId});
    }
}
