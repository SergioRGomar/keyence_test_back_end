"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const database_1 = require("./database");
const dotenv_1 = require("dotenv");
//init a enviromental variables
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const URL_MONGO = process.env.URL_MONGO;
const database = "keyence_test";
//Start db conection
(0, database_1.startConnection)(URL_MONGO, database);
//Start a express web server
server_1.default.listen(PORT);
console.log("server is running un port 3000");
