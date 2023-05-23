import {Cat, FosterCare, Ride, User} from "../utils/models";
import {DbUtils} from "../utils/db-utils";

export class Repository {

    static async getRides(): Promise<Ride[]> {
        return await DbUtils.getRides();
    }

    static async upsertRide(ride:Partial<Ride>): Promise<Ride> {
        return await DbUtils.upsertRide(ride);
    }

    static async deleteRide(id: number): Promise<number> {
        return await DbUtils.deleteRideById(id);
    }

    static async getCats(): Promise<Cat[]> {
        return await DbUtils.getCats();
    }

    static async getCatById(id:number): Promise<Cat> {
        return await DbUtils.getCatById(id);
    }

    static async upsertCat(cat: Partial<Cat>): Promise<Cat> {
        return await DbUtils.upsertCat(cat);
    }

    static async getUserById(id:number): Promise<User> {
        return await DbUtils.getUserById(id);
    }

    static async login(username:string, password:string): Promise<User> {
        return await DbUtils.login(username, password);
    }

    static async getUsers(): Promise<User[]> {
        return await DbUtils.getUsers();
    }

    static async getPendingUserApplications(): Promise<User[]> {
        return await DbUtils.getPendingUserApplications();
    }

    static async getPendingFosterCareApplications(): Promise<FosterCare[]> {
        return await DbUtils.getPendingFosterCareApplications();
    }

    static async upsertUser(user: Partial<User>): Promise<User> {
        return await DbUtils.upsertUser(user);
    }

    static async createUser(user: User): Promise<User> {
        return await DbUtils.createUser(user);
    }

    static async deleteUser(id: number): Promise<number> {
        return await DbUtils.deleteUser(id);
    }

    static async upsertFosterCare(fosterCare: Partial<FosterCare>): Promise<FosterCare> {
        return await DbUtils.upsertFosterCare(fosterCare);
    }

    static async deleteFosterCareById(id: number): Promise<number> {
        return await DbUtils.deleteFosterCare(id);
    }

    static async deleteFosterCareByCatId(catId: number): Promise<number> {
        return await DbUtils.deleteFosterCareByCatId(catId);
    }

    static async deleteRideByCatId(catId: number): Promise<number> {
        return await DbUtils.deleteRideByCatId(catId);
    }
}
