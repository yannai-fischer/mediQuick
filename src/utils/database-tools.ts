import {DataTypes, Op, Sequelize} from 'sequelize';
import {Dog, Adoption, Drive, User} from "./interfaces";
import * as mysql from 'mysql2/promise';

export const DEFAULT_ID_OPTIONS: {
    allowNull: boolean,
    autoIncrement: boolean,
    primaryKey: boolean,
    type: DataTypes.IntegerDataTypeConstructor
}
    = {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
}

export const DATABASE_METADATA: { host: string, port: number, user: string, password: string } = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "abcd1234",
};

export const DATABASE: string = 'database';

export class DatabaseTools {
    private static sequelize: Sequelize;

    static async init(): Promise<void> {
        const databaseConnection: mysql.Connection = await mysql.createConnection(DATABASE_METADATA);
        await databaseConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\`;`);
        DatabaseTools.sequelize = new Sequelize(DATABASE, DATABASE_METADATA.user, DATABASE_METADATA.password, {dialect: 'mysql'});
        await DatabaseTools.sync();
        console.log(`Initialized database successfully`);
    }

    static async getDrives(): Promise<Drive[]> {
        return await DatabaseTools.sequelize.models.Drive.findAll({where: {timeOfDeparture: {[Op.gt]: new Date()}}}) as unknown as Drive[];
    }

    static async upsertDrive(drive: Partial<Drive>): Promise<Drive> {
        return (await DatabaseTools.sequelize.models.Drive.upsert({...drive}))[0] as unknown as Drive;
    }

    static async getDogs(options?: Partial<Dog>): Promise<Dog[]> {
        return await DatabaseTools.sequelize.models.Dog.findAll({where: options}) as unknown as Dog[];
    }

    static async getDogsToVaccinate(date:Date): Promise<Dog[]> {
        return await DatabaseTools.sequelize.models.Dog.findAll({where: {lastVaccination: {[Op.lte]: date}}}) as unknown as Dog[];
    }

    static async upsertDog(dog: Partial<Dog>): Promise<Dog> {
        return (await DatabaseTools.sequelize.models.Dog.upsert({...dog}))[0] as unknown as Dog;
    }

    static async upsertUser(user: Partial<User>): Promise<User> {
        return (await DatabaseTools.sequelize.models.User.upsert({...user}))[0] as unknown as User;
    }

    static async login(username: string, password: string): Promise<User> {
        return (await DatabaseTools.sequelize.models.User.findOne({
            where: {
                username,
                password
            }
        })) as unknown as User;
    }

    static async getUsers(): Promise<User[]> {
        return await DatabaseTools.sequelize.models.User.findAll() as unknown as User[];
    }

    static async deleteDriveById(id: number): Promise<number> {
        return await DatabaseTools.sequelize.models.Drive.destroy({where: {id}});
    }

    static async deleteDriveByDogId(dogId: number): Promise<number> {
        return await DatabaseTools.sequelize.models.Drive.destroy({where: {dogId}});
    }

    static async getPendingAdoptionApplications(): Promise<Adoption[]> {
        return await DatabaseTools.sequelize.models.Adoption.findAll() as unknown as Adoption[];
    }

    static async upsertAdoption(adoption: Partial<Adoption>): Promise<Adoption> {
        return (await DatabaseTools.sequelize.models.Adoption.upsert({
            ...adoption, dogId: adoption?.dog?.id, userId: adoption?.user?.id
        }))[0] as unknown as Adoption;
    }

    static async deleteAdoption(id: number): Promise<number> {
        return await DatabaseTools.sequelize.models.Adoption.destroy({where: {id}});
    }

    static async deleteAdoptionByDogId(dogId: number): Promise<number> {
        return await DatabaseTools.sequelize.models.Adoptcion.destroy({where: {dogId}});
    }

    static async deleteDogById(id: number): Promise<number> {
        return await DatabaseTools.sequelize.models.Dog.destroy({where: {id}});
    }

    private static async sync(): Promise<void> {
        const Dog = DatabaseTools.sequelize.define('Dog',
            {
                id: DEFAULT_ID_OPTIONS,
                name: {type: DataTypes.STRING},
                colour: {type: DataTypes.STRING},
                breed: {type: DataTypes.STRING},
                gender: {type: DataTypes.CHAR},
                birthday: {type: DataTypes.DATE},
                lastVaccination: {type: DataTypes.DATE},
                hasBeenNeutered: {type: DataTypes.BOOLEAN},
                dateOfArrival: {type: DataTypes.DATE},
                sicknesses: {
                    type: DataTypes.STRING, get() {
                        return this.getDataValue('sicknesses').split(';')
                    },
                    set(val: string) {
                        this.setDataValue('sicknesses', val?.length ? JSON.parse(val).join(';') : '');
                    }
                },
            },
            {underscored: true}
        );

        const User = DatabaseTools.sequelize.define('User',
            {
                id: DEFAULT_ID_OPTIONS,
                username: {type: DataTypes.STRING, unique: 'username'},
                password: DataTypes.STRING,
                isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                address: DataTypes.STRING,
                email: DataTypes.STRING,
                phone: DataTypes.STRING
            },
            {underscored: true});

        const Drive = DatabaseTools.sequelize.define('Drive',
            {
                dogId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: Dog,
                        key: 'id'
                    }
                },
                userId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: User,
                        key: 'id'
                    }
                },
                id: DEFAULT_ID_OPTIONS,
                timeOfDeparture: DataTypes.DATE,
                startingPoint: DataTypes.STRING,
                destination: DataTypes.STRING,
            },
            {underscored: true});

        const Adoption = DatabaseTools.sequelize.define('Adoption',
            {
                id: DEFAULT_ID_OPTIONS,
                adoptionDate: DataTypes.DATE,
                dogId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: Dog,
                        key: 'id'
                    }
                },
                userId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: User,
                        key: 'id'
                    }
                }
            },
            {underscored: true}
        );

        Drive.belongsTo(Dog);
        Drive.belongsTo(User);
        Adoption.belongsTo(Dog);
        Adoption.belongsTo(User);

        await DatabaseTools.sequelize.sync({alter: true});
    }
}
