import {DataTypes} from "sequelize";

export const DB_NAME: string = 'mediQuick';

export const DB_METADATA = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Aa123456",
    name: 'mediquick'
};

export const ID_METADATA = {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
}
