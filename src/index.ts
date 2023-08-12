// @ts-ignore
import express, {Express} from 'express';
import {Controller} from "./api/controller";
import {DatabaseTools} from "./utils/database-tools";

const PORT:number = 3000;

class Application {
    static async run() {
        const app:Express = express();
        await app.listen(PORT);
        console.log(`App listening on port ${PORT}`);
        Controller.init(app);
        await DatabaseTools.init();
        console.log(`Dog system up and running!`);
    }
}

Application.run();
