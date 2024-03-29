import {Profile} from '../models/profiles.js'

/** Обработчик ошибок при запросах в MongoDB
 * @param res Принимает ссылку ответа на клиент
 * @param error Принимает содержание ошибки, которое нужно отправить на клиент
 */
const handleError = (res, error) => {
    res.status(500).json(error.message)
};

/** Контроллер записывает профиль в MongoDB
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const setProfile = (req, res) => {
    const {
        idFirebase,
        avatar,
        dept,
        email,
        firstName,
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
    Profile
        .create({
            idFirebase,
            avatar: avatar ?? "",
            dept,
            email,
            firstName,
            isAdmin: false,
            isMinobr,
            lastName,
            middleName: middleName ?? "",
            org,
            phoneNumber: phoneNumber ?? "",
            phoneNumberMobile: phoneNumberMobile ?? "",
            position,
            prevOrg: prevOrg ?? "",
            room
        })
        .then((profile) => res.status(200).json(profile))
        .catch((error) => handleError(res, error))
}

/** Контроллер возващает все профили из MongoDB
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const getProfiles = (req, res) => {
    const id = req.params.id;

    Profile
        .findById(id)
        .then((profile) => {
            if (profile?.isAdmin) {
                Profile
                    .find()
                    .sort({createdAt: -1})
                    .then((profiles) => res.status(200).json(profiles))
                    .catch((error) => handleError(res, error))
            } else {
                res.status(200).send('Permission denied! Go away...');
            }
        })
        .catch((error) => handleError(res, error))
}

/** Контроллер возващает профиль с указанным ID из MongoDB.
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const getProfile = (req, res) => {
    const id = req.params.id;
    Profile
        .findOne({idFirebase: id})
        .then((profile) => {
            if (profile) {
                const profileToSend = {
                    id: profile._id,
                    date: profile.createdAt,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    middleName: profile.middleName,
                    dept: profile.dept,
                    isMinobr: profile.isMinobr,
                    isAdmin: profile.isAdmin,
                    org: profile.org,
                    prevOrg: profile.prevOrg,
                    phoneNumber: profile.phoneNumber,
                    phoneNumberMobile: profile.phoneNumberMobile,
                    position: profile.position,
                    room: profile.room,
                    email: profile.email,
                    avatar: profile.avatar,
                }
                res.status(200).json(profileToSend);
            } else {
                res.status(200).json('Профиль не найден в базе');
            }
        })
        .catch((error) => handleError(res, error))
}

/** Контроллер обновляет данные в профиле, хранящемся в MongoDB коллекции profiles
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const updateProfile = (req, res) => {
    const id = req.params.id;
    const profile = req.body;
    Profile
        .findByIdAndUpdate(id, profile, {new: true})
        .then((newProfile) => res.status(200).json(newProfile))
        .catch((error) => handleError(res, error))
}

/** Контроллер удаляет профиль, хранящийся в MongoDB коллекции profiles
 * @param req Запрос с клиента
 * @param res Ответ на клиент
 */
export const deleteProfile = (req, res) => {
    const id = req.params.id;
    Profile
        .findByIdAndDelete(id)
        .then(() => res.status(200).json(id))
        .catch((error) => handleError(res, error))
}



