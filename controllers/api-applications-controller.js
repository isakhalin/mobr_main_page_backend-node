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