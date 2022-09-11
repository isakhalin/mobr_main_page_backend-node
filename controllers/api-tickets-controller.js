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

/** Возвращает все тикеты на клиент
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getAllTickets = (req, res) => {
    console.log('!!!!!!!!!!!!!')
    const id = req.params.id; // id пользователя
    Profile
        .findById(id)
        .then((profile) => {
            if (profile.isAdmin) {  // Проверяем является ли пользователь администратором
                Ticket
                    .find() // Если польователь администратор, то получаем все тикеты
                    .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                    .then((tickets) => res.status(200).json(tickets)) // Отдаем тикеты
                    .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
            } else {    // Если пользователь не админ
                console.log("NOT ADMIN")
                Ticket
                    .find({userId: id}) // Находим только его тикеты
                    .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                    .then((tickets) => res.status(200).json(tickets))   // Отдаем тикеты
                    .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
            }
        })
        .catch((error) => handleError(res, error))
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
    //     ticketDate: ticket,
    //     ticketExecutor: "Не назначен",
    //     ticketImportance: "low",
    //     ticketStatus: "В работе",
    //     ticketText: "Новая таска",
    //     userCompleted: false,
    // }
    // res.status(200).json(ticketsToSend)
};

export const setTicket = (req, res) => {
};

export const updateTicket = (req, res) => {
};

export const deleteTicket = (req, res) => {
};

