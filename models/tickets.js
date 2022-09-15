// 1. Подключаем мангус
// 2. Создаем конструктор схемы из объекта мангус
// 3. Создаем объект схемы с помощью конструктора схемы
// 4. Создаем модель на основе объекта схемы

// Достаем конструктор схемы из монгуса
import mongoose from 'mongoose';

// Достаем конструктор схемы из монгуса
const Schema = mongoose.Schema;

//Создаем объект схемы конструктором Schema из монгуса
const ticketSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
    ticketAuthorFirstName: {
        type: String,
        required: true
    },
    ticketAuthorLastName: {
        type: String,
        required: true
    },
    ticketExecutor: {
        type: String,
        required: true
    },
    ticketImportance: {
        type: String,
        required: true
    },
    ticketStatus: {
        type: String,
        required: true
    },
    ticketText: {
        type: String,
        required: true
    },
    userCompleted: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

// Создаем модель. Принимаем имя модели, объект схемы и имя коллекции (с этим именем будет создана коллекция в БД)
export const Ticket = mongoose.model('Ticket', ticketSchema, 'tickets');