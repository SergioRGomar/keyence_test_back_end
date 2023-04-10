"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_1 = __importDefault(require("../models/userModel"));
const router = (0, express_1.Router)();
let status = 200;
let jsonResponse = {};
router.get('/keyence_test_api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.query.user_id;
    let date = req.query.date;
    if (!user_id) { //find all documents
        try {
            const users = yield userModel_1.default.find();
            jsonResponse = { message: "Usuarios obtenidos", users: users };
        }
        catch (error) {
            jsonResponse = { error: error };
        }
    }
    else { //find one document by id
        const day = date.split('/')[0];
        const month = date.split('/')[1];
        const year = date.split('/')[2];
        //Fin user by date and user id
        let match = { user_id: user_id, date: { year: year, month: month, day: day } };
        const actualUser = yield userModel_1.default.find(match);
        jsonResponse = { user: actualUser };
        status = 200;
    }
    res.status(status).json(jsonResponse);
}));
router.post('/keyence_test_api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, user } = req.body;
    if (action == "addUser") {
        const actualUser = user;
        const actualUserDate = actualUser.date;
        //Buscar usuario por fecha
        let match = { date: { year: actualUserDate.year, month: actualUserDate.month, day: actualUserDate.day } };
        const usersPerDate = yield userModel_1.default.find(match);
        if (Object.entries(usersPerDate).length > 0) { //si hay usuarios con esa fecha
            //EVITAR REPETIR USUARIO CON UN MISMO ID
            usersPerDate.forEach((userEach) => {
                if (userEach.user_id === actualUser.user_id) {
                    jsonResponse = {
                        error: 1,
                        message: `Ya existe el usuario con User ID ${actualUser.user_id} en la fecha establecida. Intente con un nuevo User ID o una nueva Fecha`
                    };
                    status = 400;
                }
            });
            if (status === 200) {
                try {
                    const userAgregated = yield userModel_1.default.create(actualUser);
                    jsonResponse = { message: "Usuario agregado con exito", newUser: userAgregated };
                }
                catch (error) {
                    jsonResponse = { message: "Error insertando usuario, intente de nuevo" };
                    status = 400;
                }
            }
        }
        else {
            try {
                const userAgregated = yield userModel_1.default.create(actualUser);
                jsonResponse = { message: "Usuario agregado con exito", newUser: userAgregated };
            }
            catch (error) {
                jsonResponse = { message: "Error insertando usuario, intente de nuevo" };
                status = 400;
            }
        }
    }
    res.status(status).json(jsonResponse);
}));
router.put('/keyence_test_api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, date, user_name, punch_in, punch_out, noFueManipulado } = req.body;
    let match = { date: date.lastUserDate, user_id: user_id.lastUserId };
    const userActual = yield userModel_1.default.find(match);
    if (Object.entries(userActual).length != 0) {
        if (!noFueManipulado) {
            let match = { date: date.newUserDate, user_id: user_id.newUserId };
            const userRepeated = yield userModel_1.default.find(match);
            if (Object.entries(userRepeated).length === 0) {
                const newUser = {
                    user_id: user_id.newUserId,
                    user_name: user_name,
                    date: date.newUserDate,
                    punch_in: punch_in,
                    punch_out: punch_out
                };
                try {
                    let match = { date: date.lastUserDate, user_id: user_id.lastUserId };
                    const userUpdated = yield userModel_1.default.findOneAndUpdate(match, newUser, { new: true });
                    jsonResponse = { message: "Usuario actualizado con éxito" };
                }
                catch (error) {
                    status = 400;
                    jsonResponse = { error: 1, message: "Internal server error, try again" };
                }
            }
            else {
                status = 400;
                jsonResponse = { error: 1, message: "El User ID o la Fecha coinciden con otro usuario. Imposible actualizar. Pruebe un nuevo User ID o una nueva fecha" };
            }
        }
        else {
            const newUser = {
                user_id: user_id.newUserId,
                user_name: user_name,
                date: date.newUserDate,
                punch_in: punch_in,
                punch_out: punch_out
            };
            try {
                let match = { date: date.lastUserDate, user_id: user_id.lastUserId };
                const userUpdated = yield userModel_1.default.findOneAndUpdate(match, newUser, { new: true });
                jsonResponse = { message: "Usuario actualizado con éxito" };
            }
            catch (error) {
                status = 400;
                jsonResponse = { error: 1, message: "Internal server error, try again" };
            }
        }
    }
    else {
        status = 400;
        jsonResponse = { error: 1, message: "El id de Usuario que intenta actualizar no existe" };
    }
    res.status(status).json(jsonResponse);
}));
router.delete('/keyence_test_api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.query.user_id;
    let date = req.query.date;
    const day = date.split('-')[2];
    const month = date.split('-')[1];
    const year = date.split('-')[0];
    //Buscar usuario por fecha
    let match = { user_id: user_id, date: { year: year, month: month, day: day } };
    const user = yield userModel_1.default.find(match);
    if (Object.entries(user).length != 0) {
        yield userModel_1.default.deleteOne(match);
        jsonResponse = { message: `Usuario con id ${user_id} de la fecha ${date} eliminado con exito` };
    }
    else
        jsonResponse = { error: 1, message: `Usuario con User ID: ${user_id} en la fecha ${date} no existe` };
    res.status(status).json(jsonResponse);
}));
exports.default = router;
