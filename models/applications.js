// 1. Подключаем мангус
// 2. Создаем конструктор схемы из объекта мангус
// 3. Создаем объект схемы с помощью конструктора схемы
// 4. Создаем модель на основе объекта схемы

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
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
        required: true,
    },
    isMinobr: {
        type: Boolean,
        required: true,
    },
    lastName: "Сидоров",
    middleName: "Борисович",
    org: "Министерство образования Сахалинской области",
    phone: "phoneNumber",
    phoneNumber: 465959,
    phoneNumberMobile: 89241888266,
    position: "Инженер",
    prevOrg: "ОЦВВР",
    room: 31
}, {timestamps: true});

export const Application = mongoose.model('Application', applicationSchema);