// @ts-ignore
import express, {NextFunction, Request, Response} from "express";
import {Service} from "./service";

export class Router {
    static initialize(): void {
        const router = express.Router();

        router.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
            next();
        });

        router.get('/users', async (req, res) => {
            const users = await Service.getUsers();
            res.json(users);
        });

        router.get('/treatments', async (req, res) => {
            const treatments = await Service.getAllTreatments();
            res.json(treatments);
        });

        router.get('/users/:id', async (req, res) => {
            const user = await Service.getUserById(+req.params.id);
            res.json(user);
        });

        router.post('/users', async (req, res) => {
            const user = await Service.upsertUser(req.body);
            res.json(user);
        });

        router.post('/login', async (req, res) => {
            const user = await Service.login(req.body.username, req.body.password);
            res.json(user);
        });
    }
}
