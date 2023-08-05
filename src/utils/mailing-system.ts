// import {Dog, User} from "./models";
// import {MailingUtils} from "./mailing-utils";
// import {DatabaseTools} from "./database-tools";
//
// export class MailingSystem {
//
//     static async init(): Promise<void> {
//         MailingUtils.init(await DatabaseTools.getAdminEmails());
//         console.log(`MailingSystem initialised!`);
//     }
//
//     static async sendApprovalEmail(user: User): Promise<boolean> {
//         return await MailingUtils.sendApprovalEmail(user);
//     }
//
//     static async sendAdoptionEmail(user: Partial<User>, dog: Partial<Dog>): Promise<boolean> {
//         return await MailingUtils.sendAdoptionEmail(user, dog);
//     }
// }
