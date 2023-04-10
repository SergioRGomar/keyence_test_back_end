import server from "./server";
import { startConnection } from "./database";
import {config} from 'dotenv';

//init a enviromental variables
config();
const PORT = process.env.PORT;
const URL_MONGO = process.env.URL_MONGO;
const database = "keyence_test"
//Start db conection
startConnection(URL_MONGO,database);



//Start a express web server
server.listen(PORT);

console.log("server is running un port 3000");
