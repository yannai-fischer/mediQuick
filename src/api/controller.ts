import {Express, NextFunction, Request, Response} from "express";
import {Dog, Adoption, Drive, User} from "../utils/interfaces";
import {Service} from "./service";

export class Controller {
    static app: Express;

    static init(app: Express): void {
        Controller.app = app;
        Controller.setUpRoutes();
    }

    static setUpRoutes(): void {
        Controller.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
            next();
        });
        Controller.app.post('/getDogs', Controller.getDogs);
        Controller.app.get('/getDogsToVaccinate', Controller.getDogsToVaccinate);
        Controller.app.post('/upsertDog', Controller.upsertDog);
        Controller.app.post('/adoptDog/:id', Controller.adoptDog);
        Controller.app.get('/getDrives', Controller.getDrives);
        Controller.app.post('/upsertDrive', Controller.upsertDrive);
        Controller.app.post('/claimDrive/:id/:userId', Controller.claimDrive);
        Controller.app.delete('/deleteDrive/:id', Controller.deleteDrive);
        Controller.app.get('/getUsers', Controller.getUsers);
        Controller.app.get('/getUserById/:id', Controller.getUserById);
        Controller.app.post('/upsertUser', Controller.upsertUser);
        Controller.app.get('/login/:username/:password', Controller.login);
        Controller.app.get('/pendingAdoptionApplications', Controller.getPendingAdoptionApplications);
        Controller.app.post('/upsertAdoption', Controller.upsertAdoption);
        Controller.app.delete('/deleteAdoption/:id', Controller.deleteAdoption);
    }

    private static async getDogs(req: Request, res: Response): Promise<Response> {
        try {
            const options: Partial<Dog> = req?.query as unknown as Dog;
            console.log(`Got request to get dogs`);
            return res.send(await Service.getDogs(options));
        } catch (e) {
            console.error(`Request to get dogs failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getDogsToVaccinate(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get dogs to vaccinate`);
            return res.send(await Service.getDogsToVaccinate());
        } catch (e) {
            console.error(`Request to get dogs to vaccinate failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertDog(req: Request, res: Response): Promise<Response> {
        try {
            const dog: Dog = req.query as unknown as Dog;
            console.log(`Got request to upsert dog: ${JSON.stringify(dog)}`);
            return res.send(await Service.upsertDog(dog));
        } catch (e) {
            console.error(`Request to upsert dog failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async adoptDog(req: Request, res: Response): Promise<Response> {
        try {
            const dogId: number =  req?.params?.id ? +req.params.id : -1;
            console.log(`Got request to adopt dog with id: ${dogId}`);
            return res.send(dogId && await Service.adoptDog(dogId));
        } catch (e) {
            console.error(`Request to adopt dog failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getDrives(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get drives`);
            return res.send(await Service.getDrives());
        } catch (e) {
            console.error(`Request to get drives failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertDrive(req: Request, res: Response): Promise<Response> {
        try {
            const drive: Drive = req.query as unknown as Drive;
            console.log(`Got request to upsert drive: ${JSON.stringify(drive)}`);
            return res.send(await Service.upsertDrive(drive));
        } catch (e) {
            console.error(`Request to upsert drive failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async claimDrive(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = req?.params?.id ? +req?.params?.id : -1;
            const userId: number =  req?.params?.userId ? +req.params.userId : -1;
            console.log(`Got request to claim drive by user with id: ${JSON.stringify(id)}`);
            return res.send(await Service.claimDrive(id, userId));
        } catch (e) {
            console.error(`Request to claim drive failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async deleteDrive(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to delete drive with id: ${id}`);
            return res.json({success: await Service.deleteDrive(id)});
        } catch (e) {
            console.error(`Request to delete drive failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get all users`);
            return res.send(await Service.getUsers());
        } catch (e) {
            console.error(`Request to get users failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const id: number =  req?.params?.id ? +req.params.id : -1;
            console.log(`Got request to get user by id: ${id}`);
            return res.send(await Service.getUserById(id));
        } catch (e) {
            console.error(`Request to get user by id failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertUser(req: Request, res: Response): Promise<Response> {
        try {
            const user: User = req.query as unknown as User;
            console.log(`Got request to upsert user: ${JSON.stringify(user)}`);
            return res.send(await Service.upsertUser(user));
        } catch (e) {
            console.error(`Request to upsert user failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async login(req: Request, res: Response): Promise<Response> {
        try {
            const username: string = req.params.username;
            const password: string = req.params.password;
            console.log(`Got request to login: ${JSON.stringify({username, password})}`);
            return res.send(await Service.login(username, password));
        } catch (e) {
            console.error(`Request to login user failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getPendingAdoptionApplications(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get pending adoption applications`);
            return res.send(await Service.getPendingAdoptionApplications());
        } catch (e) {
            console.error(`Request to get pending adoption applications failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertAdoption(req: Request, res: Response): Promise<Response> {
        try {
            const adoption: Adoption = {
                dog: {id: req.query.dogId},
                user: {id: req.query.userId},
                adoptionDate: req.query.adoptionDate,
            } as unknown as Adoption;
            console.log(`Got request to upsert adoption: ${JSON.stringify(adoption)}`);
            return res.send(await Service.upsertAdoption(adoption));
        } catch (e) {
            console.error(`Request to upsert adoption failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async deleteAdoption(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to delete adoption with id: ${id}`);
            return res.json({success: await Service.deleteAdoption(id)});
        } catch (e) {
            console.error(`Request to delete adoption failed. Error: ${e}`);
            return res.send(e);
        }
    }
}
