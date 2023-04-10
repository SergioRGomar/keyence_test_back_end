import {Router, json} from 'express';
import userDocument from '../models/userModel';
import { userInterface, dateInterface} from '../interfaces/interfaces';

const router:any = Router();


router.get('/keyence_test_api',async (req:any,res:any)=>{
    let user_id = req.query.user_id;
    let date = req.query.date;
    let status = 200; let jsonResponse = {};
 
    if(!user_id){ //find all documents
        try{
            const users:object = await userDocument.find();
            jsonResponse={message:"Usuarios obtenidos",users:users}
        }catch(error){
            jsonResponse={error:error};
        }
    }
    else{ //find one document by id
        const day = date.split('/')[0]; const month = date.split('/')[1]; const year = date.split('/')[2];

        //Fin user by date and user id
        let match = {user_id:user_id,date:{year:year,month:month,day:day}};
        const actualUser = await userDocument.find(match);

        jsonResponse = {user:actualUser};
        status = 200;
    }

    res.status(status).json(jsonResponse);

});

router.post('/keyence_test_api',async (req:any,res:any)=>{
    const {action, user} = req.body;
    let status = 200; let jsonResponse = {};


    if(action == "addUser"){

        const actualUser:userInterface = user;

        const actualUserDate:dateInterface = actualUser.date;
        
        //Buscar usuario por fecha
        let match = {date:{year:actualUserDate.year,month:actualUserDate.month,day:actualUserDate.day}};
        const usersPerDate = await userDocument.find(match);

        if(Object.entries(usersPerDate).length > 0){ //si hay usuarios con esa fecha
            
            //EVITAR REPETIR USUARIO CON UN MISMO ID
            usersPerDate.forEach((userEach:any)=>{
                if(userEach.user_id === actualUser.user_id){
                    jsonResponse = {
                                    error:1,
                                    message:`Ya existe el usuario con User ID ${actualUser.user_id} en la fecha establecida. Intente con un nuevo User ID o una nueva Fecha`
                                };
                    status = 400;
                }
            });
            if(status === 200){
                try{
                    const userAgregated = await userDocument.create(actualUser);
                    jsonResponse= {message:"Usuario agregado con exito",newUser:userAgregated};
                }catch(error){
                    jsonResponse={message:"Error insertando usuario, intente de nuevo"};
                    status = 400;
                }
            }
        }else{
            try{
                const userAgregated = await userDocument.create(actualUser);
                jsonResponse= {message:"Usuario agregado con exito",newUser:userAgregated};
            }catch(error){
                jsonResponse={message:"Error insertando usuario, intente de nuevo"};
                status = 400;
            }
        }

    } 
    
    res.status(status).json(jsonResponse);

});

router.put('/keyence_test_api',async (req:any,res:any)=>{
    const {user_id,date,user_name,punch_in,punch_out,noFueManipulado} = req.body;
    let status = 200; let jsonResponse = {};

    let match = {date:date.lastUserDate,user_id:user_id.lastUserId};
    const userActual:any = await userDocument.find(match);
    
    if(Object.entries(userActual).length != 0){

        if(!noFueManipulado){
            let match = {date:date.newUserDate,user_id:user_id.newUserId};
            const userRepeated:any = await userDocument.find(match);

            if(Object.entries(userRepeated).length === 0){
                const newUser = {
                    user_id:user_id.newUserId,
                    user_name:user_name,
                    date:date.newUserDate,
                    punch_in:punch_in,
                    punch_out:punch_out
                }
                try{        
                    let match = {date:date.lastUserDate,user_id:user_id.lastUserId};
                    const userUpdated = await userDocument.findOneAndUpdate(match,newUser,{new:true});
                    jsonResponse= {message:"Usuario actualizado con éxito"};
                }catch(error) {
                    status = 400;
                    jsonResponse= {error:1,message:"Internal server error, try again"};
                }
            }else{
                status = 400;
                jsonResponse= {error:1,message:"El User ID o la Fecha coinciden con otro usuario. Imposible actualizar. Pruebe un nuevo User ID o una nueva fecha"};
            }
        }else{
            const newUser = {
                user_id:user_id.newUserId,
                user_name:user_name,
                date:date.newUserDate,
                punch_in:punch_in,
                punch_out:punch_out
            }
            try{        
                let match = {date:date.lastUserDate,user_id:user_id.lastUserId};
                const userUpdated = await userDocument.findOneAndUpdate(match,newUser,{new:true});
                jsonResponse= {message:"Usuario actualizado con éxito"};
            }catch(error) {
                status = 400;
                jsonResponse= {error:1,message:"Internal server error, try again"};
            }

        }
    }else{
        status = 400;
        jsonResponse= {error:1,message:"El id de Usuario que intenta actualizar no existe"};
    }
    
    res.status(status).json(jsonResponse);
});

router.delete('/keyence_test_api',async (req:any,res:any)=>{
    let user_id:number = req.query.user_id;
    let date:string = req.query.date;
    let status = 200; let jsonResponse = {};

    const day = date.split('-')[2]; const month = date.split('-')[1]; const year = date.split('-')[0];

    //Buscar usuario por fecha
    let match = {user_id:user_id,date:{year:year,month:month,day:day}};

    const user:object = await userDocument.find(match); 

    if(Object.entries(user).length != 0){
        await userDocument.deleteOne(match);
        jsonResponse = {message:`Usuario con id ${user_id} de la fecha ${date} eliminado con exito`};
    }else
        jsonResponse = {error:1,message:`Usuario con User ID: ${user_id} en la fecha ${date} no existe`};
    
    res.status(status).json(jsonResponse);
});

export default router;