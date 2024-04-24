import {DataAccess} from "./data-access";
import {Patient} from "../metadata/models";
import {Service} from "./service";

const POLLING_CONSTANT: number = 30000;

export class DatabasePoller {
    public static async initialize(): Promise<void> {
        await DatabasePoller.handlePatients()
        setInterval(DatabasePoller.handlePatients, POLLING_CONSTANT);
    }

    private static async handlePatients(): Promise<void> {
        const unhandledPatients: Patient[] = await DataAccess.getPatientsToHandle();
        if (unhandledPatients?.length) {
            await Service.handlePatients(unhandledPatients);
        }
    }
}
