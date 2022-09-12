import {Ticket} from '../models/tickets.js'
import {Profile} from "../models/profiles.js";

/** Обработчик ошибок
 * @param res Ссылка на метод отправки ответа клиенту
 * @param error Отправляемая ошибка
 */
const handleError = (res, error) => {
    console.log("Something went wrong: ", error);
    res.status(500).json(error.message);
};

/** Функция проверяет является ли пользователь админом. Возвращает true если пользователь является админом
 *  и false если пользователь не является админом
 * @param id Идентификатор пользователя в MongoDB
 * @returns {Promise<any>} true - если пользователь админ, false - если пользователь не админ
 */
const userIsAdmin = async (id) => {
    return await Profile
        .findById(id)
        .then((profile) => profile?.isAdmin)
}

/** Возвращает все тикеты на клиент
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getAllTickets = async (req, res) => {
    const id = req.params.id; // MongoDB id пользователя

    try {
        const findUser = await userIsAdmin(id);
        if (findUser) {
            Ticket
                .find() // Если польователь администратор, то получаем все тикеты
                .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                .then((tickets) => res.status(200).json(tickets)) // Отдаем тикеты
                .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
        } else {
            Ticket
                .find({authorId: id}) // Находим только его тикеты
                .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                .then((tickets) => res.status(200).json(tickets))   // Отдаем тикеты
                .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
        }
    } catch (error) {
        handleError(res, error);
    }
};

export const getTicket = (req, res) => {
    const userId = req.params.uid;       // id пользователя
    const ticketId = req.params.tid;   // id тикета
    Ticket
        .findById(tid)
        .then((ticket) => res.status(200).json(ticket))
        .catch((error) => handleError(res, error))

    // const ticketsToSend = {
    //     ticketAuthorFirstName: "Роман",
    //     ticketAuthorLastName: "Степанов",
    //     //ticketDate: ticket,
    //     ticketExecutor: "Не назначен",
    //     ticketImportance: "low",
    //     ticketStatus: "В работе",
    //     ticketText: "Новая таска",
    //     userCompleted: false,
    // }
    // res.status(200).json(ticketsToSend)
};

export const setTicket = (req, res) => {
    const id = req.params.id;   // MongoDB id пользователя, который отправил запрос


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

export const updateTicket = (req, res) => {
};

export const deleteTicket = (req, res) => {
};

