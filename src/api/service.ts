import {Cat, FosterCare, Ride, User} from "../utils/models";
import {Repository} from "./repository";
import {MailingSystem} from "../utils/mailing-system";

export class Service {

    static async getRides(): Promise<Ride[]> {
        return await Repository.getRides();
    }

    static async upsertRide(ride: Ride): Promise<Ride> {
        return await Repository.upsertRide(ride);
    }

    static async deleteRide(id: number): Promise<number> {
        return await Repository.deleteRide(id);
    }

    static async getCats(): Promise<Cat[]> {
        return await Repository.getCats();
    }

    static async upsertCat(cat: Cat): Promise<Cat> {
        return await Repository.upsertCat(cat);
    }

    static async adoptCat(catId: number): Promise<Cat> {
        return await Repository.upsertCat({id: catId, isAdopted: true});
    }

    static async getPendingUserApplications(): Promise<User[]> {
        return await Repository.getPendingUserApplications();
    }

    static async upsertUser(user: User): Promise<User> {
        const userToReturn: User = await Repository.upsertUser(user);
        !user.id && await MailingSystem.sendApprovalEmail(user);
        return userToReturn;
    }

    static async deleteUser(id: number): Promise<number> {
        return await Repository.deleteUser(id);
    }

    static async upsertFosterCare(fosterCare: FosterCare): Promise<boolean> {
        return await Repository.upsertFosterCare(fosterCare) && MailingSystem.sendFosterCareEmail(await Repository.getUserById(fosterCare.user.id ?? -1), await Repository.getCatById(fosterCare.cat.id ?? -1));
    }

    static async approveFosterCare(id: number): Promise<FosterCare> {
        return await Repository.upsertFosterCare({id, isApproved: true});
    }

    static async approveUser(id: number): Promise<boolean> {
        return !!await Repository.upsertUser({id, isApproved: true});
    }

    static async deleteFosterCare(id: number): Promise<number> {
        return await Repository.deleteFosterCare(id);
    }

    static async claimRide(id: number, userId: number): Promise<boolean> {
        return !!await Repository.upsertRide({id, userId});
    }
}
