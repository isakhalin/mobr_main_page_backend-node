import {Ticket} from '../models/tickets.js'
import {Profile} from "../models/profiles.js";

/** Обработчик исключений
 * @param res Ссылка на метод отправки ответа клиенту
 * @param error Отправляемая ошибка
 */
const handleError = (res, error) => {
    res.status(500).json(error.message);
};

// TODO Возможно нужно перенести в контроллер профилей
/** Метод возвращает указанный профиль пользователя из БД
 * @param id id пользователя
 * @returns {Promise<any>}
 */
const getUserProfile = async (id) => {
    return await Profile
        .findById(id)
        .then((userProfile) => userProfile)
}

/** Контроллер возвращает все тикеты на клиент
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getAllTickets = async (req, res) => {
    const id = req.params.id;

    try {
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            Ticket
                .find()
                .sort({createdAt: -1})
                .then((tickets) => res.status(200).json(tickets))
                .catch((error) => handleError(res, error))
        } else {
            Ticket
                .find({authorId: id})
                .sort({createdAt: -1})
                .then((tickets) => res.status(200).json(tickets))
                .catch((error) => handleError(res, error))
        }
    } catch (error) {
        handleError(res, error);
    }
};

/** Контроллер находит указанный тикет по ID.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getTicket = async (req, res) => {
    const userId = req.params.uid;
    const ticketId = req.params.tid;

    try {
        const {isAdmin} = await getUserProfile(userId);
        Ticket
            .findById(ticketId)
            .then((ticket) => {
                    if (isAdmin) {
                        res.status(200).json(ticket);
                    } else if (ticket.authorId === userId) {
                        res.status(200).json(ticket)
                    } else {
                        throw {message: 'В доступен отказано'}
                    }
                }
            )
            .catch((error) => handleError(res, error));
    } catch (e) {
        handleError(res, e)
    }
}

// todo Дописать документацию
/** Контроллер записывает в БД новый тикет
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const setTicket = (req, res) => {
    const id = req.params.id;

    const {
        ticketAuthorFirstName,
        ticketAuthorLastName,
        ticketExecutor,
        ticketImportance,
        ticketStatus,
        ticketText,
        userCompleted
    } = req.body;
    Ticket
        .create({
            authorId: id,
            ticketAuthorFirstName,
            ticketAuthorLastName,
            ticketExecutor,
            ticketImportance,
            ticketStatus,
            ticketText,
            userCompleted
        })
        .then((ticket) => res.status(200).json(ticket))
        .catch((error) => handleError(res, error))
};

/** Контроллер обновляет в БД заданный тикет.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const updateTicket = async (req, res) => {
    const id = req.params.id;

    const {
        ticketExecutor,
        ticketStatus,
        userCompleted,
        _id
    } = req.body;

    try {
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            Ticket
                .findByIdAndUpdate(_id, {ticketExecutor, ticketStatus, userCompleted}, {new: true})
                .then((updatedTicket) => res.status(200).json(updatedTicket))
                .catch((error) => handleError(res, error))
        } else {
            Ticket
                .findById(_id)
                .then((ticket) => {
                    if (ticket.authorId === id) {
                        Object.assign(ticket, {ticketExecutor, ticketStatus, userCompleted}).save()
                            .then((updatedTicket) => res.status(200).json(updatedTicket))
                            .catch((error) => handleError(res, error))
                    } else {
                        throw 'Отказано в доступе на изменение тикета.'
                    }
                })
                .catch((error) => handleError(res, {message: error}));
        }
    } catch (e) {
        handleError(res, e);
    }
};

/** Контроллер удаляет из БД указанный тикет от имени администратора.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const deleteTicket = async (req, res) => {
    const id = req.params.id;
    const {_id} = req.body;

    try {
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            Ticket
                .findById(_id)
                .then((ticket) => ticket.deleteOne()
                    .then((ticket) => res.status(200).json(ticket))
                )
                .catch((error) => handleError(res, error))
        } else {
            handleError(res, {message: 'Отказано в доступе'});
        }
    } catch (e) {
        handleError(res, e)
    }
};

/** Контроллер удаляет все тикеты пользователя от имени админа.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const deleteAllUserTickets = async (req, res) => {
    const {senderUserId, targetUserId} = req.params;

    try {
        const {isAdmin} = await getUserProfile(senderUserId);
        if (isAdmin) {
            Ticket
                .deleteMany({authorId: targetUserId})
                .then((deleteResult) => res.end())
                .catch((error) => handleError(res, error));
        } else {
            handleError(res, {message: 'Отказано в доступе'});
        }
    } catch (e) {
        handleError(res, e);
    }
}
