// 1. Подключаем мангус
// 2. Создаем конструктор схемы из объекта мангус
// 3. Создаем объект схемы с помощью конструктора схемы
// 4. Создаем модель на основе объекта схемы

// Достаем конструктор схемы из монгуса
import mongoose from 'mongoose';

// Достаем конструктор схемы из монгуса
const Schema = mongoose.Schema;

//Создаем объект схемы конструктором Schema из монгуса
const profileSchema = new Schema({
    idFirebase: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    dept:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isMinobr: {
        type: Boolean,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    org: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    phoneNumberMobile: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true
    },
    prevOrg: {
        type: String,
        required: false
    },
    room: {
        type: String,
        required: true
    }
}, {timestamps: true});

// Создаем модель. Принимаем имя модели, объект схемы и имя коллекции (с этим именем будет создана коллекция в БД)
export const Profile = mongoose.model('Profile', profileSchema, 'profiles');