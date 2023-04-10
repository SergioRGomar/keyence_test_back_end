import {Types } from "mongoose";

export interface userInterface{
    user_id:number;
    user_name:string;
    date:dateInterface;
    punch_in:timeInterface;
    punch_out:timeInterface;
}

export interface dateInterface{
    year:string;
    month:string;
    day:string;
    dateInterface: Types.ObjectId;
}

export interface timeInterface{
    hour:string;
    minutes:string;
    timeInterface: Types.ObjectId;
}