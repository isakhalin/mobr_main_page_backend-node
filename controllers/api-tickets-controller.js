import {Ticket} from '../models/tickets.js'
import {Profile} from "../models/profiles.js";

/** Обработчик ошибок
 * @param res Ссылка на метод отправки ответа клиенту
 * @param error Отправляемая ошибка
 */
const handleError = (res, error) => {
    console.log("HandleError: Something went wrong: ", error);
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

const getUserProfile = async (id) => {
    return await Profile
        .findById(id)
        .then((userProfile) => userProfile)
}

/** Возвращает все тикеты на клиент
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getAllTickets = async (req, res) => {
    const id = req.params.id; // MongoDB id пользователя

    try {
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
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

export const updateTicket = async (req, res) => {
    console.log("Start time", new Date().getTime());
    console.log("Controller started")
    const id = req.params.id;   // id пользователя, который отправил запрос
    console.log("ID пользователя запроса ", id)
    const {
        ticketExecutor,
        ticketStatus,
        userCompleted,
        _id
    } = req.body;   // Читаем данные из тела запроса

    console.log("Тело запроса: ", {_id, ticketExecutor, ticketStatus, userCompleted});

    //Todo Нужно проверить - является ли отправитель запроса автором тикета, либо является ли он админом

    try {
        // Получаем профиль пользователя и деструктуризируем данные, достаем свойство isAdmin и _id, переименовываем его в userId
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            console.log("Выполняем обновление тикета под админом")
            Ticket
                .findByIdAndUpdate(_id, {ticketExecutor, ticketStatus, userCompleted}, {new: true})
                .then((updatedTicket) => {
                    res.status(200).json(updatedTicket)
                    console.log("End time", new Date().getTime());
                })
                .catch((error) => handleError(res, error))
        } else {
            console.log("Выполняем обновление тикета под юзером")
            // _id это идентификатор тикета
            Ticket
                .findById(_id)
                .then((ticket) => {
                    // Если id автора поста из тикета в БД совпадает с id пользователя из запроса с фронта
                    if (ticket.authorId === id) {
                        console.log("Юзер идентифицирован успешно как автор тикета")
                        // todo Возможно можно как-то сделать апдейт прям тут без повторного запроса findByIdAndUpdate,
                        // todo вроде этого: ticket.setUpdate({ticketExecutor, ticketStatus, userCompleted}, {new: true})
                        Ticket
                            .findByIdAndUpdate(_id, {ticketExecutor, ticketStatus, userCompleted}, {new: true})
                            .then((updatedTicket) => {
                                res.status(200).json(updatedTicket)
                                console.log("End time", new Date().getTime());
                            })
                            .catch((error) => handleError(res, error))
                    } else {
                        console.log('Юзер не автор тикета, должен выкинуться THROW');
                        throw 'Отказано в доступе на изменение тикета.'
                    }
                })
                .catch((error) => {
                    console.log("THROW выкинулся в кетч чейнинга")
                    handleError(res, {message: error})
                    console.log("End time", new Date().getTime());
                })
        }
    } catch (error) {
        console.log("Сработал кетч в трай")
        handleError(res, error);
        console.log("End time", new Date().getTime());
    }

};

export const deleteTicket = async (req, res) => {
    console.log("Start time", new Date().getTime());
    const id = req.params.id;   // id отправителя запроса
    const {isAdmin} = await getUserProfile(id); // Проверяем является ли отправитель админом
    console.log("User is admin? ", isAdmin)
    console.log("End time", new Date().getTime());
    res.end();
};

