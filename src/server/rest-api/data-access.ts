import {DataTypes, Sequelize} from 'sequelize';
import * as mysql from 'mysql2/promise';
import {DB_METADATA, DB_NAME, ID_METADATA} from "../../metadata/consts";
import {Status, Severity, Speciality} from "../../metadata/enums";
import {Patient, Room, Treatment, User} from "../../metadata/models";

export class DataAccess {
    private static sequelize: Sequelize;

    static async initialize(): Promise<void> {
        (await mysql.createConnection(DB_METADATA)).query('CREATE DATABASE IF NOT EXISTS ' + DB_NAME);
        DataAccess.sequelize = new Sequelize(DB_METADATA.name, DB_METADATA.user, DB_METADATA.password, {dialect: 'mysql'});
        await DataAccess.setDB();
    }

    private static async setDB(): Promise<void> {
        const User = DataAccess.sequelize.define('User',
            {
                id: ID_METADATA,
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                username: {type: DataTypes.STRING, unique: 'username'},
                password: DataTypes.STRING,
                speciality: {type: DataTypes.ENUM(...Object.values(Speciality)), allowNull: false},
                status: {type: DataTypes.ENUM(...Object.values(Status)), defaultValue: Status.ACTIVE},
            },
            {underscored: true});

        const Patient = DataAccess.sequelize.define('Patient',
            {
                id: ID_METADATA,
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                age: DataTypes.INTEGER,
                severity: {type: DataTypes.ENUM(...Object.values(Severity)), allowNull: false},
                injuryTime: DataTypes.DATE,
                injuryDescription: DataTypes.STRING,
                handled: {type: DataTypes.BOOLEAN, defaultValue: false},
                specialityNeeded: {type: DataTypes.ENUM(...Object.values(Speciality)), allowNull: false},
            },
            {underscored: true});

        const Room = DataAccess.sequelize.define('Room',
            {
                id: ID_METADATA,
                roomNumber: DataTypes.STRING,
                status: {type: DataTypes.ENUM(...Object.values(Status)), defaultValue: Status.ACTIVE},
            },
            {underscored: true});

        const Treatment = DataAccess.sequelize.define('Treatment',
            {
                id: ID_METADATA,
                residingHealthCareProfessionalId: {type: DataTypes.INTEGER, references: {model: User, key: 'id'}},
                patientId: {type: DataTypes.INTEGER, references: {model: Patient, key: 'id'}},
                roomId: {type: DataTypes.INTEGER, references: {model: Room, key: 'id'}},
            },
            {underscored: true});

        Treatment.belongsTo(DataAccess.sequelize.models.User, {as: 'residingHealthCareProfessional'});
        Treatment.belongsTo(DataAccess.sequelize.models.Patient, {as: 'patient'});
        Treatment.belongsTo(DataAccess.sequelize.models.Room, {as: 'room'});
        await DataAccess.sequelize.sync({alter: true});
    }

    static async setUser(user: Partial<User>): Promise<User> {
        return (await DataAccess.sequelize.models.User.upsert({...user}))[0] as unknown as User;
    }

    static async login(username: string, password: string): Promise<User> {
        const user: User = (await DataAccess.sequelize.models.User.findOne({
            where: {
                username,
                password
            }
        })) as unknown as User;
        return user;
    }

    static async getUserById(id: number): Promise<User> {
        return await DataAccess.sequelize.models.User.findOne({where: {id}}) as unknown as User;
    }

    public static async getAllUsers(): Promise<User[]> {
        return await DataAccess.sequelize.models.User.findAll() as unknown as User[];
    }

    public static async getLastTreatmentByProfessional(userId: number): Promise<Treatment> {
        return await DataAccess.sequelize.models.Treatment.findOne({
            where: {residingHealthCareProfessionalId: userId},
            order: [['createdAt', 'DESC']],
            include: [
                {model: DataAccess.sequelize.models.User, as: 'residingHealthCareProfessional'},
                {model: DataAccess.sequelize.models.Room, as: 'room'},
                {model: DataAccess.sequelize.models.Patient, as: 'patient'}
            ]
        }) as unknown as Treatment;
    }

    public static async getLatestTreatmentInRoom(roomId: number): Promise<Treatment> {
        return await DataAccess.sequelize.models.Treatment.findOne({
            where: {roomId: roomId},
            order: [['createdAt', 'DESC']],
        }) as unknown as Treatment;
    }

    public static async getAllTreatments(): Promise<Treatment[]> {
        return await DataAccess.sequelize.models.Treatment.findAll({
            include: [
                {model: DataAccess.sequelize.models.User, as: 'residingHealthCareProfessional'},
                {model: DataAccess.sequelize.models.Room, as: 'room'},
                {model: DataAccess.sequelize.models.Patient, as: 'patient'}
            ]
        }) as unknown as Treatment[];
    }

    public static async setTreatment(residingHealthCareProfessionalId: number, patientId: number, roomId: number): Promise<Treatment> {
        return (await DataAccess.sequelize.models.Treatment.upsert({
            residingHealthCareProfessionalId,
            patientId,
            roomId
        }))[0] as unknown as Treatment;
    }

    public static async setPatientHandled(id: number): Promise<Patient> {
        return (await DataAccess.sequelize.models.Patient.upsert({id, handled: true}))[0] as unknown as Patient;
    }

    public static async setHealthCareProfessionalActive(id: number): Promise<User> {
        return (await DataAccess.sequelize.models.User.update(
            {status: Status.ACTIVE},
            {where: {id: id}},
        ))[0] as unknown as User;
    }

    public static async setRoomActive(id: number): Promise<Room> {
        return (await DataAccess.sequelize.models.Room.upsert({id, status: Status.ACTIVE}))[0] as unknown as Room;
    }

    public static async setRoomInactive(id: number): Promise<Room> {
        return (await DataAccess.sequelize.models.Room.upsert({id, status: Status.INACTIVE}))[0] as unknown as Room;
    }

    public static async setUserInactive(id: number): Promise<User> {
        return (await DataAccess.sequelize.models.User.update(
            {status: Status.INACTIVE},
            {where: {id: id}},
        ))[0] as unknown as User;
    }

    public static async getFreeRoom(): Promise<Room> {
        return await DataAccess.sequelize.models.Room.findOne({where: {status: Status.INACTIVE}}) as unknown as Room;
    }

    public static async getFreeUser(speciality: Speciality): Promise<User> {
        return await DataAccess.sequelize.models.User.findOne({
            where: {
                status: Status.INACTIVE,
                speciality: speciality
            }
        }) as unknown as User;
    }

    public static async getPatientsToHandle(): Promise<Patient[]> {
        return await DataAccess.sequelize.models.Patient.findAll({
            where: {handled: false},
            order: [['severity', 'DESC']], // Sort by severity, assuming ENUM order reflects severity
        }) as unknown as Patient[];
    }
}
