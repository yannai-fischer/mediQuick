import {DataTypes, Op, Sequelize} from 'sequelize';
import {DB, DB_OPTIONS, DEFAULT_ID_OPTIONS} from "./consts";
import {Cat, FosterCare, Ride, User} from "./models";
import mysql = require('mysql2/promise');

export class DbUtils {
    private static sequelize: Sequelize;

    static async init(): Promise<void> {
        const connection: mysql.Connection = await mysql.createConnection(DB_OPTIONS);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);
        DbUtils.sequelize = new Sequelize(DB, DB_OPTIONS.user, DB_OPTIONS.password, {dialect: 'mysql'});
        await DbUtils.syncDb();
        console.log(`Initialized db successfully`);
    }

    static async getRides(): Promise<Ride[]> {
        return await DbUtils.sequelize.models.Ride.findAll({where: {timeOfDeparture: {[Op.gt]: new Date()}}}) as unknown as Ride[];
    }

    static async upsertRide(ride: Partial<Ride>): Promise<Ride> {
        return (await DbUtils.sequelize.models.Ride.upsert({...ride}))[0] as unknown as Ride;
    }

    static async getCats(): Promise<Cat[]> {
        return await DbUtils.sequelize.models.Cat.findAll({where: {isAdopted: false}}) as unknown as Cat[];
    }

    static async getCatById(id: number): Promise<Cat> {
        return await DbUtils.sequelize.models.Cat.findOne({where: {id}}) as unknown as Cat;
    }

    static async upsertCat(cat: Partial<Cat>): Promise<Cat> {
        return (await DbUtils.sequelize.models.Cat.upsert({...cat}))[0] as unknown as Cat;
    }

    static async getUserById(id: number): Promise<User> {
        return await DbUtils.sequelize.models.User.findOne({where: {id}}) as unknown as User;
    }

    static async getAdminEmails(): Promise<string[]> {
        return (await DbUtils.sequelize.models.User.findAll({
            attributes: ['email'],
            where: {isAdmin: true}
        })).map(user => user.dataValues.email);
    }

    static async upsertUser(user: Partial<User>): Promise<User> {
        return (await DbUtils.sequelize.models.User.upsert({...user}))[0] as unknown as User;
    }

    static async createUser(user: User): Promise<User> {
        return (await DbUtils.sequelize.models.User.create({...user})) as unknown as User;
    }

    static async login(username: string, password: string): Promise<User> {
        return (await DbUtils.sequelize.models.User.findOne({
            where: {
                username,
                password,
                isApproved: true
            }
        })) as unknown as User;
    }

    static async getPendingUserApplications(): Promise<User[]> {
        return await DbUtils.sequelize.models.User.findAll({where: {isApproved: false}}) as unknown as User[];
    }

    static async getUsers(): Promise<User[]> {
        return await DbUtils.sequelize.models.User.findAll({where: {isApproved: true}}) as unknown as User[];
    }

    static async deleteUser(id: number): Promise<number> {
        return await DbUtils.sequelize.models.User.destroy({where: {id}});
    }

    static async deleteRideById(id: number): Promise<number> {
        return await DbUtils.sequelize.models.Ride.destroy({where: {id}});
    }

    static async deleteRideByCatId(catId: number): Promise<number> {
        return await DbUtils.sequelize.models.Ride.destroy({where: {catId}});
    }

    static async getPendingFosterCareApplications(): Promise<FosterCare[]> {
        return await DbUtils.sequelize.models.FosterCare.findAll({where: {isApproved: false}}) as unknown as FosterCare[];
    }

    static async upsertFosterCare(fosterCare: Partial<FosterCare>): Promise<FosterCare> {
        return (await DbUtils.sequelize.models.FosterCare.upsert({
            ...fosterCare, catId: fosterCare?.cat?.id, userId: fosterCare?.user?.id
        }))[0] as unknown as FosterCare;
    }

    static async deleteFosterCare(id: number): Promise<number> {
        return await DbUtils.sequelize.models.FosterCare.destroy({where: {id}});
    }

    static async deleteFosterCareByCatId(catId: number): Promise<number> {
        return await DbUtils.sequelize.models.FosterCare.destroy({where: {catId}});
    }

    private static async syncDb(): Promise<void> {
        const Cat = DbUtils.sequelize.define('Cat',
            {
                id: DEFAULT_ID_OPTIONS,
                name: {type: DataTypes.STRING},
                age: {type: DataTypes.INTEGER},
                sex: {type: DataTypes.CHAR},
                dateOfArrival: {type: DataTypes.DATE},
                illnesses: {
                    type: DataTypes.STRING, get() {
                        return this.getDataValue('illnesses').split(';')
                    },
                    set(val: string) {
                        this.setDataValue('illnesses', val?.length ? JSON.parse(val).join(';') : '');
                    }
                },
                isVaccinated: {type: DataTypes.BOOLEAN},
                isNeutered: {type: DataTypes.BOOLEAN},
                isVetted: {type: DataTypes.BOOLEAN},
                hasWorms: {type: DataTypes.BOOLEAN},
                isAdopted: {type: DataTypes.BOOLEAN, defaultValue: false}
            },
            {underscored: true}
        );

        const User = DbUtils.sequelize.define('User',
            {
                id: DEFAULT_ID_OPTIONS,
                username: {type: DataTypes.STRING, unique: 'username'},
                password: DataTypes.STRING,
                isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
                isApproved: {type: DataTypes.BOOLEAN, defaultValue: false},
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                address: DataTypes.STRING,
                email: DataTypes.STRING,
                phone: DataTypes.STRING
            },
            {underscored: true});

        const Ride = DbUtils.sequelize.define('Ride',
            {
                id: DEFAULT_ID_OPTIONS,
                timeOfDeparture: DataTypes.DATE,
                source: DataTypes.STRING,
                destination: DataTypes.STRING,
                catId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: Cat,
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
            {underscored: true});

        const FosterCare = DbUtils.sequelize.define('FosterCare',
            {
                id: DEFAULT_ID_OPTIONS,
                startDate: DataTypes.DATE,
                finishDate: DataTypes.DATE,
                isApproved: {type: DataTypes.BOOLEAN, defaultValue: false},
                catId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: Cat,
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

        Ride.belongsTo(Cat);
        Ride.belongsTo(User);
        FosterCare.belongsTo(Cat);
        FosterCare.belongsTo(User);

        await DbUtils.sequelize.sync({alter: true});
    }
}
