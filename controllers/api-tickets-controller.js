import {Ticket} from '../models/tickets.js'
import {Profile} from "../models/profiles.js";

/** Обработчик исключений
 * @param res Ссылка на метод отправки ответа клиенту
 * @param error Отправляемая ошибка
 */
const handleError = (res, error) => {
    console.log("HandleError: Something went wrong: ", error);
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
    const id = req.params.id; // MongoDB id пользователя, который отправил запрос

    // Используем конструкцию try-catch для обработки исключений, которые могут возникнуть при работе с БД
    try {
        // Получаем профиль пользователя по id, деструктуризируем данные - достаем свойство isAdmin => 'true'/'false'
        const {isAdmin} = await getUserProfile(id);
        if (isAdmin) {
            Ticket
                .find() // Если польователь администратор, то получаем все тикеты
                .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                .then((tickets) => res.status(200).json(tickets)) // Отдаем тикеты
                .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
        } else {
            Ticket
                .find({authorId: id}) // Находим тикеты только этого пользователя
                .sort({createdAt: -1})  // Сортируем по дате от большего к меньшему
                .then((tickets) => res.status(200).json(tickets))   // Отдаем тикеты
                .catch((error) => handleError(res, error))  // Если возникла ошибка, обрабатываем
        }
    } catch (error) {
        // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
        handleError(res, error);
    }
};

/** Контроллер находит указанный тикет по ID.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const getTicket = async (req, res) => {
    const userId = req.params.uid;     // MongoDB id пользователя, который отправил запрос
    const ticketId = req.params.tid;   // id тикета

    // Используем конструкцию try-catch для обработки исключений, которые могут возникнуть при работе с БД
    try {
        // Получаем профиль пользователя по id, деструктуризируем данные - достаем свойство isAdmin => 'true'/'false'
        const {isAdmin} = await getUserProfile(userId); // Проверяем является ли отправитель админом
        Ticket
            .findById(ticketId) // Ищем в БД тикет по его id, который пришел в запросе
            .then((ticket) => {
                    if (isAdmin) {
                        res.status(200).json(ticket);           // Если пользователь админ, то просто отдаем тикет
                    } else if (ticket.authorId === userId) {    // Если не админ, то проверяем пользователя ли это тикет
                        res.status(200).json(ticket)            // Если тикет этого пользователя, то отдаем тикет
                    } else {
                        throw {message: 'В доступен отказано'}  // Иначе выбрасываем исключение. Обработается в следующем catch
                    }
                }
            ) // TODO Проверить, возможно тут не нужен кетч и сработает вышестоящий
            .catch((error) => handleError(res, error)); // Обработчик исключений.
    } catch (e) {
        // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
        handleError(res, r)
    }
}

// todo Дописать документацию
/** Контроллер записывает в БД новый тикет
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 */
export const setTicket = (req, res) => {
    const id = req.params.id;   // MongoDB id пользователя, который отправил запрос

    // Парсим данные из тела запроса
    const {
        ticketAuthorFirstName,  // В ticketAuthorFirstName приходит имя автора тикета
        ticketAuthorLastName,   // В ticketAuthorLastName приходит фамилия автора тикета
        ticketExecutor,         // В ticketExecutor приходит ФИО исполнителя тикета => 'Петров Иван Алексеевич'
        ticketImportance,       // todo
        ticketStatus,           // В ticketStatus приходит статус выполнения тикета => 'completed'/'processed'
        ticketText,             // В ticketText приходит текст задачи тикета
        userCompleted           // В userCompleted приходят данные о завершении тикета => 'true'/'false'
    } = req.body;
    Ticket
        .create({                   // Создаем тикет в БД, используя модель данных.
            authorId: id,
            ticketAuthorFirstName,
            ticketAuthorLastName,
            ticketExecutor,
            ticketImportance,
            ticketStatus,
            ticketText,
            userCompleted
        })
        .then((ticket) => res.status(200).json(ticket)) // Отправляем на клиент сохраненный тикет
        .catch((error) => handleError(res, error))
};

/** Контроллер обновляет в БД заданный тикет.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const updateTicket = async (req, res) => {
    const id = req.params.id;   // id пользователя, который отправил запрос на обновление тикета

    // Парсим данные из тела запроса
    const {
        ticketExecutor,     // В ticketExecutor приходит ФИО исполнителя тикета => 'Петров Иван Алексеевич'
        ticketStatus,       // В ticketStatus приходит статус выполнения тикета => 'completed'/'processed'
        userCompleted,      // В userCompleted приходят данные о завершении тикета => 'true'/'false'
        _id                 // В _id приходит id самого тикета
    } = req.body;

    // Используем конструкцию try-catch для обработки исключений, которые могут возникнуть при работе с БД
    try {
        // Получаем профиль пользователя по id, деструктуризируем данные - достаем свойство isAdmin => 'true'/'false'
        const {isAdmin} = await getUserProfile(id); // Проверяем является ли отправитель админом
        if (isAdmin) {
            Ticket
                // Ищем тикет по id и обновляем его.
                // Первый аргумент id - параметр поиска.
                // Второй аргумент - объект которым заменяем (заменяются только указанные свойства)
                // Третий аргумент - опция {new: true}, возвращает новый объект, вместо старого
                .findByIdAndUpdate(_id, {ticketExecutor, ticketStatus, userCompleted}, {new: true})
                .then((updatedTicket) => res.status(200).json(updatedTicket))   // Отправляем статус и ответ на клиент
                .catch((error) => handleError(res, error))  // Обаботчик исключений
        } else {
            Ticket
                .findById(_id) // Ищем в БД тикет по _id, который пришел в запросе
                .then((ticket) => {
                    // Если id автора поста из тикета в БД совпадает с id пользователя из запроса с фронта
                    if (ticket.authorId === id) {
                        // Object.assign(target, obj) добавляет в target свойства из объекта obj, и возвращает target
                        Object.assign(ticket, {ticketExecutor, ticketStatus, userCompleted}).save()
                            .then((updatedTicket) => res.status(200).json(updatedTicket))
                            .catch((error) => handleError(res, error))
                    } else {
                        // Выбрасываем исключение. Оно обработается в catch следующего шага цепочки чейнинга.
                        throw 'Отказано в доступе на изменение тикета.'
                    }
                })
                // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
                // {message: 'Отказано в доступе'} это объект с текстом ошибки, т.к. в обработчике мы читаем error.message
                .catch((error) => handleError(res, {message: error}));
        }
    } catch (e) {
        // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
        handleError(res, e);
    }
};

/** Контроллер удаляет из БД указанный тикет от имени администратора.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const deleteTicket = async (req, res) => {
    const id = req.params.id;   // id отправителя запроса
    const {_id} = req.body; // Деструктурируем данные из бади - достаем id тикета, который нужно удалить

    // Используем конструкцию try-catch для обработки исключений, которые могут возникнуть при работе с БД
    try {
        // Получаем профиль пользователя по id, деструктуризируем данные - достаем свойство isAdmin => 'true'/'false'
        const {isAdmin} = await getUserProfile(id); // Проверяем является ли отправитель админом
        if (isAdmin) {
            Ticket
                .findById(_id)  // Ищем в БД тикет по _id, который пришел в запросе
                .then((ticket) => ticket.deleteOne()   // Удаляем найденный тикет. В ticket падает найденный выше эл-т
                    .then((ticket) => res.status(200).json(ticket)) // Если тикет не найден, обрабатываем исключение
                )
                .catch((error) => handleError(res, error))
        } else {
            // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
            // {message: 'Отказано в доступе'} это объект с текстом ошибки, т.к. в обработчике мы читаем error.message
            handleError(res, {message: 'Отказано в доступе'});
        }
    } catch (e) {
        // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
        handleError(res, e)
    }
};

/** Контроллер удаляет все тикеты пользователя от имени админа.
 * @param req Запрос от клиента
 * @param res Ответ на клиент
 * @returns {Promise<void>}
 */
export const deleteAllUserTickets = async (req, res) => {
    // senderUserId - id MongoBD отправителя
    // targetUserId - id MongoBD пользователя, тикеты которого нужно удалить
    const {senderUserId, targetUserId} = req.params;   // id отправителя запроса

    try {
        // Проверка админ ли пользователь. Используем деструктуризацию
        const {isAdmin} = await getUserProfile(senderUserId);
        if (isAdmin) {  // Если запрашивающий пользователь админ
            Ticket
                //// Реализация без возврата удаленных тикетов на клиент
                .deleteMany({authorId: targetUserId})   // Удаляем из БД все тикеты, найденные по свойству authorId
                .then((deleteResult) => res.end()) // Закрываем соединение и отдаем управление браузеру через res.end()
                .catch((error) => handleError(res, error));
            // //// Реализация с возвратом тикетов на клиент. Если на клиенте нужны будут удаленные тикеты.
            // .find({authorId: targetUserId})  // Ищем все тикеты, автором которых является удаляемый пользователь
            // .then((userTickets) => {
            //     userTickets.map((ticket) => ticket.deleteOne()); // Удаляем найденные тикеты
            //     console.log("Tickets to remove", userTickets);
            //     res.status(200).json(userTickets);
            // })
            // .catch((error) => handleError(res, error))
        } else {
            // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
            // {message: 'Отказано в доступе'} это объект с текстом ошибки, т.к. в обработчике мы читаем error.message
            handleError(res, {message: 'Отказано в доступе'});
        }
    } catch (e) {
        // Обработчик исключений. res - ссылка на response клиента. Которую мы используем для отправки ответа
        handleError(res, e);
    }
}

//// Логгер для измерения производительности
// console.log("Start time", new Date().getTime());
// console.log("End time", new Date().getTime());