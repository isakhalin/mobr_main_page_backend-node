import {Application} from "../models/applications.js";

const handleError = (res, error) => {
    res.status(500).send(error.message);
};

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
        isMinobr,
        lastName,
        middleName,
        org,
        phoneNumber,
        position,
        prevOrg,
        room
    } = req.body;

    Application
        .create({
            dept,
            firstName,
            isComplete: false,
            isMinobr,
            lastName,
            middleName,
            org,
            phoneNumber,
            position,
            prevOrg,
            room
        })
        .then((application) => res.status(200).json(application))
        .catch((error) => handleError(res, error))
};

/** Контроллер получает часть апликейшена в запросе и обновляет апликейшен а БД, возвращает измененный апликейшен
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const updateApplication = (req, res) => {
    const {isComplete} = req.body;
    const id = req.params.id
    Application
        .findByIdAndUpdate(id, {isComplete}, {new: true})
        .then((application) => res.status(200).json(application))
        .catch((error) => handleError(res, error))
};

/**
 * Метод находит в БД апликейшен по его ID и удаляет его, возвращает на клиент ID удаленного апликейшена
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const deleteApplication = (req, res) => {
    if (req.params.id.length > 1) {
        Application
            .findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json(req.params.id))
            .catch((error) => handleError(res, error));
    }
};