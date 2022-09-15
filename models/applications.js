// 1. Подключаем мангус
// 2. Создаем конструктор схемы из объекта мангус
// 3. Создаем объект схемы с помощью конструктора схемы
// 4. Создаем модель на основе объекта схемы

// Достаем конструктор схемы из монгуса
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//Создаем объект схемы конструктором Schema из монгуса
const applicationSchema = new Schema({
    dept: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    isComplete: {
        type: Boolean,
        required: false,
    },
    isMinobr: {
        type: Boolean,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    org: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    phoneNumberMobile: {
        type: String,
        required: false,
    },
    position: {
        type: String,
        required: true,
    },
    prevOrg: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
}, {timestamps: true});

// Создаем модель. Принимаем имя модели, объект схемы и имя коллекции (с этим именем будет создана коллекция в БД)
export const Application = mongoose.model('Application', applicationSchema);