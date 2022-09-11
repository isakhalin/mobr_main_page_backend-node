import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
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

export const Ticket = mongoose.model('Ticket', ticketSchema, 'tickets');