import 'dotenv/config';
import { DataSource } from "typeorm";
import { appConfig } from '../../consts';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: appConfig.Host,
    port: appConfig.Port,
    username: appConfig.Username,
    password: appConfig.Password,
    database: appConfig.Database,
    synchronize: true,
    logging: false, 
    entities: ['src/DAL/models/**/*.ts'], 
})
