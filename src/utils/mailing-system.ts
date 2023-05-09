import {Cat, User} from "./models";
import {MailingUtils} from "./mailing-utils";
import {DbUtils} from "./db-utils";

export class MailingSystem {

    static async init(): Promise<void> {
        MailingUtils.init(await DbUtils.getAdminEmails());
        console.log(`MailingSystem initialised!`);
    }

    static async sendApprovalEmail(user: User): Promise<boolean> {
        return await MailingUtils.sendApprovalEmail(user);
    }

    static async sendFosterCareEmail(user: Partial<User>, cat: Partial<Cat>): Promise<boolean> {
        return await MailingUtils.sendFosterCareEmail(user, cat);
    }
}
