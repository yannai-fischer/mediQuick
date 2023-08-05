// import {Dog, User} from "./models";
// import {createTransport, Transporter} from "nodemailer";
// import {SMTP_TRANSPORT} from "./consts";
// import * as SMTPTransport from "nodemailer/lib/smtp-transport";
//
// export class MailingUtils {
//
//     private static transporter: Transporter<SMTPTransport.SentMessageInfo>;
//     private static adminEmails: string[];
//
//     static init(adminEmails: string[]):void {
//         MailingUtils.transporter = createTransport(SMTP_TRANSPORT);
//         console.error(adminEmails);
//         MailingUtils.adminEmails = adminEmails;
//     }
//
//     static async sendApprovalEmail(user: User):Promise<boolean> {
//         const info = await MailingUtils.transporter.sendMail({
//             from: SMTP_TRANSPORT.auth.user,
//             to: MailingUtils.adminEmails.join(`, `),
//             subject: "אישור פתיחת חשבון משתמש",
//             text: '',
//             html: `
//       <p dir="rtl">שלום,</p>
//       <p dir="rtl">התקבלה בקשה לאישור משתמש חדש</p>
//       <p dir="rtl">פרטי המשתמש:</p>
//       <ul dir="rtl">
//         <li>שם פרטי: ${user.firstName}</li>
//         <li>שם משפחה: ${user.lastName}</li>
//         <li>אימייל: ${user.email}</li>
//         <li>טלפון: ${user.phone}</li>
//       </ul>
//       <p dir="rtl">תודה רבה,</p>
//       <p dir="rtl">צוות המערכת</p>
//     `,
//         });
//         console.log("User approval message sent: %s", info.messageId);
//         return !!info.messageId;
//     }
//
//     static async sendAdoptionEmail(user: Partial<User>, dog:Partial<Dog>):Promise<boolean> {
//         const info = await MailingUtils.transporter.sendMail({
//             from: SMTP_TRANSPORT.auth.user,
//             to: MailingUtils.adminEmails.join(`, `),
//             subject: `אישור אומנה`,
//             text: '',
//             html: `
//       <p dir="rtl">שלום,</p>
//       <p dir="rtl">התקבלה בקשה לאישור אומנה</p>
//       <p dir="rtl">פרטי המתנדב:</p>
//       <ul dir="rtl">
//         <li>שם פרטי: ${user.firstName}</li>
//         <li>שם משפחה: ${user.lastName}</li>
//         <li>אימייל: ${user.email}</li>
//         <li>טלפון: ${user.phone}</li>
//       </ul>
//       <p dir="rtl">פרטי החתול:</p>
//       <ul dir="rtl">
//         <li>שם: ${dog.name}</li>
//         <li>מזהה: ${dog.id}</li>
//       </ul>
//       <p dir="rtl">תודה רבה,</p>
//       <p dir="rtl">צוות המערכת</p>
//     `,
//         });
//         console.log("Foster care message sent: %s", info.messageId);
//         return !!info.messageId;
//     }
// }
