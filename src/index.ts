// @ts-ignore
import express, {Express} from 'express';
import {Controller} from "./api/controller";
import {DbUtils} from "./utils/db-utils";
import {MailingSystem} from "./utils/mailing-system";

const PORT:number = 3000;

class Application {
    static async run() {
        const app:Express = express();
        await app.listen(PORT);
        console.log(`App listening on port ${PORT}`);
        Controller.init(app);
        await DbUtils.init();
        await MailingSystem.init();
        console.log(`Cat system up and running!`);
    }
}

Application.run();
