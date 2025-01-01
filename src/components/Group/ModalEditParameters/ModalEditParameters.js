import { useEffect, useState } from "react";
import roleEnum from "../../../constants/roleEnum";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Dropdown from "../../../UI/Dropdown/Dropdown";
import HeaderImg from "../../../UI/HeaderImg/HeaderImg";
import Input from "../../../UI/Input/Input";
import Modal from "../../../UI/Modal/Modal"
import classes from './ModalEditParameters.module.scss'
import useInput from "../../../hooks/useInput";
import validateFn from "../../../constants/validateFn.enum";
import groupEmun from "../../../constants/groupEnum";
import { showErrorMsg } from "../../../error/error.validate.msg";
import Button from "../../../UI/Button/Button";

const ModalEditParameters = ({ modalClose, parameters, parametersHandler }) => {
    const {
        usersLimit,
        createEventInfosRole,
        viewSchedule = roleEnum.STUDENT_ROLE,
        notifacionFromEmail
    } = parameters;

    let {
        value: valueUsersLimit,
        isValidInput: isValidUsersLimit,
        arrayError: arrayErrorUsersLimit,
        valueChangeHandler: usersLimitChangeHandler,
        inputBlurHandler: usersLimitBlurHandler,
    } = useInput(
        (vl) => validateFn.isNumberFn(vl, ...groupEmun.usersLimit),
        'UsersLimit',
        usersLimit
    );

    const [valueCreateEvent, setValueCreateEvent] = useState(createEventInfosRole)
    const [valueViewSchedule, setViewSchedule] = useState(createEventInfosRole)
    const [
        valueNotifacionFromEmail,
        setNotifacionFromEmail
    ] = useState(notifacionFromEmail)
    
    const changeCreateEventHandler = (value) => setValueCreateEvent(value);
    const changeViewScheduleHandler = (value) => setViewSchedule(value);
    const changeNotifacionFromEmailHandler = () => setNotifacionFromEmail((prevState) => !prevState);

    const checkIsRoleFn = (value) => Object.values(roleEnum).indexOf(value)

    const submitHandler = (ev) => {
        ev.preventDefault()
        parametersHandler({
            usersLimit: valueUsersLimit,
            createEventInfosRole: valueCreateEvent,
            viewSchedule: valueViewSchedule,
            notifacionFromEmail: valueNotifacionFromEmail
        })
        modalClose(false)
    }

    return <Modal onHiddenCart={modalClose} >
        <div className={classes.modal}>
            <HeaderImg className={classes.pattern}/>
            <form className={classes.content} onSubmit={submitHandler}>
                <h2>Параметри группи</h2>
                <div className={classes.sectionBox}>
                    <label htmlFor='teacher'>Кількість учасників в группі</label>
                    <Input
                        placeholder="Введіть кількість учасників в группі"
                        id="userCount"
                        type="number"
                        min={groupEmun.usersLimit[0]}
                        max={groupEmun.usersLimit[1]}
                        value={valueUsersLimit}
                        onChange={usersLimitChangeHandler}
                        onBlur={usersLimitBlurHandler}
                    />
                    {showErrorMsg(arrayErrorUsersLimit, classes.errorMsg)}

                    <label htmlFor='type'>Перегляд розкладу</label>
                    <Dropdown
                        classNameButton={classes.dropdown}
                        color="pink"
                        borderRadius={15}
                        defaultIndex={checkIsRoleFn(viewSchedule)}
                        label="Select"
                        arrValue={Object.values(roleEnum)}
                        changeValueHandler={changeCreateEventHandler}
                    />
                    <label htmlFor='type'>Створення/Видалення подій</label>
                    <Dropdown
                        classNameButton={classes.dropdown}
                        color="pink"
                        borderRadius={15}
                        defaultIndex={checkIsRoleFn(createEventInfosRole)}
                        label="Select"
                        arrValue={Object.values(roleEnum)}
                        changeValueHandler={changeViewScheduleHandler}
                    />
                    <label htmlFor='notifacionFromEmail'>Повідомлення на пошту</label>
                    <Checkbox
                        value={valueNotifacionFromEmail}
                        typeColor='green'
                        onChange={changeNotifacionFromEmailHandler}
                    />
                </div>
                <div className={classes.buttonBox}>
                    <Button typeColor="red" onClick={() => modalClose()}>Закрити</Button>
                    <Button typeColor="green" type="submit">Зберегти</Button>
                </div>
            </form>
        </div>
    </Modal>
}

export default ModalEditParameters;