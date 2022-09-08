// В контроллер нужно подключить модели
import {Application} from "../models/applications.js";

const handleError = (res, error) => {
    console.log('Something wrong: ', error);
    res.status(500).send(error.message);
};

// Получаем все апликейшоны из MongoDB
export const getAllApplications = (req, res) => {
    Application
        .find()
        .sort({createdAt: -1})
        .then((applications) => {
            res.status(200).json(applications)
        })
        .catch((error) => handleError(res, error))
};

export const postApplication = (req, res) => {
    const {
        dept,
        firstName,
        //isComplete,
        isMinobr,
        lastName,
        middleName,
        org,
        phoneNumber,
        phoneNumberMobile,
        position,
        prevOrg,
        room
    } = req.body;
    const application = new Application({
        dept,
        firstName,
        isComplete: false,
        isMinobr,
        lastName,
        middleName,
        org,
        phoneNumber,
        phoneNumberMobile,
        position,
        prevOrg,
        room
    })
    application
        .save()
        .then((application) => res.status(200).json(application))
        .catch((error) => handleError(res, error))
};

/**
 * Метод находит в БД апликейшен по его ID и удаляет его, возвращает на клиент ID удаленного апликейшена
 * @param req - Запрос от клиента
 * @param res - Ответ на клиент
 */
export const deleteApplication = (req, res) => {
    Application
        .findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json(req.params.id))
        .catch((error) => handleError(res, error));
};