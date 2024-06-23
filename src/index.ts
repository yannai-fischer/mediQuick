// @ts-ignore
import express, {Express} from 'express';
import {Router} from "./server/rest-api/router";
import {DataAccess} from "./server/rest-api/data-access";
import {DatabasePoller} from "./server/database-poller";

class Application {
    static async start() {
        const server: Express = express();
        server.listen(4000);
        Router.initialize(server);
        await DataAccess.initialize();
        DatabasePoller.initialize();
        console.log(`MediQuick up!`);
    }
}

Application.start();
