import {connect} from "mongoose";

export const startConnection:Function = async (URL_MONGO:string,database:string) => {
    try{
        const cluster = await connect(URL_MONGO,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: database, useFindAndModify: false });
        console.log(`database "${cluster.connection.name}" already connected`);
    }
    catch (error){
        console.error(error);
    }
};

