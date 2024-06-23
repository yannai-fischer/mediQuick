
import {DataAccess} from "./rest-api/data-access";
import {Patient} from "../metadata/models";
import {BusinessLogic} from "./rest-api/business-logic";

const POLLING_CONSTANT: number = 30000;

export class DatabasePoller {
    public static async initialize(): Promise<void> {
        setInterval(DatabasePoller.handlePatients, POLLING_CONSTANT);
    }

    private static async handlePatients(): Promise<void> {
        console.log('Seeking patients to handle!');
        const unhandledPatients: Patient[] = await DataAccess.getPatientsToHandle();
        if (unhandledPatients?.length) {
            await BusinessLogic.handlePatients(unhandledPatients);
        } else {
            console.log('No patients found...');
        }
    }
}
