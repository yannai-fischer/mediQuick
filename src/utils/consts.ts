import {DataTypes} from "sequelize";

export const DEFAULT_ID_OPTIONS: { allowNull: boolean, autoIncrement: boolean, primaryKey: boolean, type: DataTypes.IntegerDataTypeConstructor }
    = {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
}

export const DB_OPTIONS: { host: string, port: number, user: string, password: string } = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Aa123456",
};

export const DB: string = 'db';

export const SMTP_TRANSPORT = {
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'catworkshopisrael@gmail.com',
        pass: 'Aa123456!!!'
    }
}

