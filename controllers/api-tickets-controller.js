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
    const id = req.params.id;   // id пользователя, который отправил запрос
    const {
        ticketExecutor,
        ticketStatus,
        userCompleted,
        _id
    } = req.body;   // Читаем данные из тела запроса

    console.log("ID User", id);
    console.log("BODY", {_id, ticketExecutor, ticketStatus, userCompleted})

    try {
        // Получаем профиль пользователя и деструктуризируем данные, достаем свойство isAdmin и _id, переименовываем его в userId
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            Ticket
                .findByIdAndUpdate(_id, {ticketExecutor, ticketStatus, userCompleted}, {new: true})
                .then((updatedTicket) => {
                    res.status(200).json(updatedTicket)
                })
                .catch((error) => handleError(res, error))
        } else {
            // _id это идентификатор тикета
            Ticket
                .findById(_id)
                .then((ticket) => {
                    // Если id автора поста из тикета в БД совпадает с id пользователя из запроса с фронта
                    if (ticket.authorId === id) {
                        // Object.assign(target, obj) добавляет в target свойства из объекта obj, и возвращает target
                        Object.assign(ticket, {ticketExecutor, ticketStatus, userCompleted}).save()
                            .then((updatedTicket) => res.status(200).json(updatedTicket))
                            .catch((error) => handleError(res, error))
                    } else {
                        throw 'Отказано в доступе на изменение тикета.'
                    }
                })
                .catch((error) => {
                    handleError(res, {message: error})
                })
        }
    } catch (error) {
        handleError(res, error);
    }
};

/** Удаление тикета от имени администратора
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const deleteTicket = async (req, res) => {
    // console.log("Start time", new Date().getTime());
    // console.log("End time", new Date().getTime());
    const id = req.params.id;   // id отправителя запроса
    // Деструктурируем данные из бади, достаем id тикета, который нужно удалить
    const {_id} = req.body;

    try {
        const {isAdmin} = await getUserProfile(id); // Проверяем является ли отправитель админом
        if (isAdmin) {
            Ticket
                .findById(_id)
                .then((ticket) => ticket.remove()
                    .then((ticket) => res.status(200).json(ticket))
                )
                .catch((error) => handleError(res, error))
        } else {
            handleError(res, {message: 'Отказано в доступе'});
        }
    } catch (error) {
        handleError(res, error)
    }
};

/** Контроллер удаляет все тикеты пользователя от имени админа
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const deleteAllUserTickets = async (req, res) => {
    const id = req.params.id;   // id отправителя запроса
    // Деструктурируем данные, получаем id пользователя, которого удалили, и переименовываем его в deletedUser
    const {_id: deletedUserTickets} = req.body;
    console.log("admin ID: ", id)
    console.log("deleting user ID: ", deletedUserTickets)
    const {isAdmin} = await getUserProfile(id);

    try {
        if (isAdmin) {  // Если запрашивающий пользователь админ
            Ticket
                .find({authorId: deletedUserTickets})  // Ищем все тикеты, автором которых является удаляемый пользователь
                .then((userTickets) => {
                    console.log("Tickets to remove", userTickets);
                    userTickets.map((ticket) => ticket.remove())
                    res.status(200).json(userTickets);
                }) // Удаляем найденные тикеты
                //.then((deletedTickets) => res.status(200).json(deletedTickets)) // Возвращаем на клиент удаленный массив тикетов
                .catch((error) => handleError(res, error))
        } else {
            handleError(res, {message: 'Отказано в доступе'})
        }
    } catch (e) {
        handleError(res, e)
    }
}
