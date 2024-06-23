// @ts-ignore
import express, {Express, NextFunction, Request, Response} from "express";
import {BusinessLogic} from "./business-logic";
const bodyParser = require('body-parser')

export class Router {

    static initialize(server: Express): void {

        server.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
            next();
        });
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());

        server.get('/users', async (req, res) => {
            try {
                const users = await BusinessLogic.getUsers();
                res.json(users);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.get('/treatments', async (req, res) => {
            try {
                const treatments = await BusinessLogic.getAllTreatments();
                res.json(treatments);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.get('/treatments/:userId', async (req, res) => {
            try {
                const treatment = await BusinessLogic.getLastTreatmentByUserId(+req.params.userId);
                res.json(treatment);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.get('/users/:id', async (req, res) => {
            try {
                const user = await BusinessLogic.getUserById(+req.params.id);
                res.json(user);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.post('/users/deactivate/:id', async (req, res) => {
            try {
                const user = await BusinessLogic.handleDeactivation(+req.params.id);
                res.json(user);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.post('/users/activate/:id', async (req, res) => {
            try {
                const user = await BusinessLogic.activateUser(+req.params.id);
                res.json(user);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.post('/users', async (req, res) => {
            try {
                const user = await BusinessLogic.setUser(req.body);
                res.json(user);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });

        server.post('/login', async (req, res) => {
            try {
                const user = await BusinessLogic.login(req.body.username, req.body.password);
                res.json(user);
            } catch (error: any) {
                res.status(500).json({message: error.message});
            }
        });
    }
}
