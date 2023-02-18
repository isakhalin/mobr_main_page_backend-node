import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

export const Profile = mongoose.model('Profile', profileSchema, 'profiles');