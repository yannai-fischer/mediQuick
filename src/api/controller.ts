import {Express, NextFunction, Request, Response} from "express";
import {Cat, FosterCare, Ride, User} from "../utils/models";
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
            res.setHeader('Access-Control-Allow-Methods', 'Content-Type');
            next();
        });
        Controller.app.get('/getCats', Controller.getCats);
        Controller.app.post('/upsertCat', Controller.upsertCat);
        Controller.app.post('/adoptCat/:id', Controller.adoptCat);
        Controller.app.get('/getRides', Controller.getRides);
        Controller.app.post('/upsertRide', Controller.upsertRide);
        Controller.app.post('/claimRide/:id/:userId', Controller.claimRide);
        Controller.app.delete('/deleteRide/:id', Controller.deleteRide);
        Controller.app.get('/pendingUserApplications', Controller.getPendingUserApplications);
        Controller.app.post('/upsertUser', Controller.upsertUser);
        Controller.app.post('/approveUser/:id', Controller.approveUser);
        Controller.app.delete('/deleteUser/:id', Controller.deleteUser);
        Controller.app.post('/upsertFosterCare', Controller.upsertFosterCare);
        Controller.app.post('/approveFosterCare/:id', Controller.approveFosterCare);
        Controller.app.delete('/deleteFosterCare/:id', Controller.deleteFosterCare);
    }

    private static async getCats(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get cats`);
            return res.send(await Service.getCats());
        } catch (e) {
            console.error(`Request to get cats failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertCat(req: Request, res: Response): Promise<Response> {
        try {
            const cat: Cat = req.query as unknown as Cat;
            console.log(`Got request to upsert cat: ${JSON.stringify(cat)}`);
            return res.send(await Service.upsertCat(cat));
        } catch (e) {
            console.error(`Request to upsert cat failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async adoptCat(req: Request, res: Response): Promise<Response> {
        try {
            const catId: number = +req.params.id;
            console.log(`Got request to adopt cat with id: ${catId}`);
            return res.send(catId && await Service.adoptCat(catId));
        } catch (e) {
            console.error(`Request to adopt cat failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getRides(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get rides`);
            return res.send(await Service.getRides());
        } catch (e) {
            console.error(`Request to get rides failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertRide(req: Request, res: Response): Promise<Response> {
        try {
            const ride: Ride = req.query as unknown as Ride;
            console.log(`Got request to upsert ride: ${JSON.stringify(ride)}`);
            return res.send(await Service.upsertRide(ride));
        } catch (e) {
            console.error(`Request to upsert ride failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async claimRide(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            const userId: number = +req.params.userId;
            console.log(`Got request to claim ride by user with id: ${JSON.stringify(id)}`);
            return res.send(await Service.claimRide(id, userId));
        } catch (e) {
            console.error(`Request to claim ride failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async deleteRide(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to delete ride with id: ${id}`);
            return res.json({success: await Service.deleteRide(id)});
        } catch (e) {
            console.error(`Request to delete ride failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async getPendingUserApplications(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`Got request to get pending user applications`);
            return res.send(await Service.getPendingUserApplications());
        } catch (e) {
            console.error(`Request to get pending user applications failed. Error: ${e}`);
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

    private static async approveUser(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to approve user with id: ${JSON.stringify(id)}`);
            return res.send(await Service.approveUser(id));
        } catch (e) {
            console.error(`Request to approve user failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to delete user with id: ${id}`);
            return res.json({success: await Service.deleteUser(id)});
        } catch (e) {
            console.error(`Request to delete user failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async upsertFosterCare(req: Request, res: Response): Promise<Response> {
        try {
            const fosterCare: FosterCare = {
                cat: {id: req.query.catId},
                user: {id: req.query.userId},
                finishDate: req.query.finishDate,
                startDate: req.query.startDate
            } as unknown as FosterCare;
            console.log(`Got request to upsert foster care: ${JSON.stringify(fosterCare)}`);
            return res.send(await Service.upsertFosterCare(fosterCare));
        } catch (e) {
            console.error(`Request to upsert foster care failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async approveFosterCare(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to approve foster care with id: ${JSON.stringify(id)}`);
            return res.send(await Service.approveFosterCare(id));
        } catch (e) {
            console.error(`Request to approve foster care failed. Error: ${e}`);
            return res.send(e);
        }
    }

    private static async deleteFosterCare(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = +req.params.id;
            console.log(`Got request to delete foster care with id: ${id}`);
            return res.json({success: await Service.deleteFosterCare(id)});
        } catch (e) {
            console.error(`Request to delete foster care failed. Error: ${e}`);
            return res.send(e);
        }
    }
}
