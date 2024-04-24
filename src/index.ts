// @ts-ignore
import express from 'express';
import {Router} from "./server/router";
import {DataAccess} from "./server/data-access";
import {DatabasePoller} from "./server/database-poller";

class Application {
    static async start() {
        express().listen(4000);
        Router.initialize();
        await DataAccess.initialize();
        DatabasePoller.initialize();
        console.log(`MediQuick up!`);
    }
}

Application.start();
