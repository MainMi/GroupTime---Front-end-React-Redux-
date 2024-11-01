import React, { useState, useCallback } from 'react';
import classes from './ModalCreateEvent.module.scss';
import Button from '../../../UI/Button/Button';
import ButtonSmall from '../../../UI/Button/ButtonSmall';
import Input from '../../../UI/Input/Input';
import Modal from '../../../UI/Modal/Modal';
import { useDispatch } from 'react-redux';
import useInput from '../../../hooks/useInput';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import eventsConst from '../../../constants/type/eventEnum';
import validateFn from '../../../constants/validateFn.enum';
import Textarea from '../../../UI/Textarea/Textarea';
import DatePicker from '../../../UI/DatePicker/DatePicker';

const ModalCreateEvent = ({ modalOpen, modalClose }) => {
    const dispatch = useDispatch();
    let {
        value: valueTeacher,
        isValidInput: isValidTeacher,
        arrayError: arrayErrorTeacher,
        valueChangeHandler: teacherChangeHandler,
        inputBlurHandler: teacherBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Teacher');

    let {
        value: valueName,
        isValidInput: isValidName,
        arrayError: arrayErrorName,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Name');

    const [valueType, setValueType] = useState('');
    const changeTypeHandler = (value) => setValueType(value);
    const isValidType = valueType && valueType.length;

    let {
        value: valuePlace,
        isValidInput: isValidPlace,
        arrayError: arrayErrorPlace,
        valueChangeHandler: placeChangeHandler,
        inputBlurHandler: placeBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Place');

    const [valuePlatform, setValuePlatform] = useState('');
    const changePlatformHandler = (value) => setValuePlatform(value);
    const isValidPlatform = valuePlatform && valuePlatform.length;

    let {
        value: valueLink,
        isValidInput: isValidLink,
        arrayError: arrayErrorLink,
        valueChangeHandler: linkChangeHandler,
        inputBlurHandler: linkBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Link');

    const [valueTag, setValueTag] = useState('');
    const changeTagHandler = (value) => setValueTag(value);
    const isValidTag = valuePlatform && valuePlatform.length;

    const isValid = isValidTeacher &&
        isValidName &&
        isValidType &&
        isValidPlace &&
        isValidPlatform &&
        isValidLink &&
        isValidTag

    const submitHandler = useCallback((ev) => {
        ev.preventDefault();
        if (isValid) {
            const eventData = {
                eventInfo: {
                    teacherName: valueTeacher,
                    name: valueName,
                    type: valueType,
                    place: valuePlace,
                    platform: valuePlatform,
                    link: valueLink,
                    tag: valueTag,
                },
                // eventDate: {
                //     countWeek: countWeekInput.value,
                //     day: dayInput.value,
                //     time: timeInput.value,
                //     duration: durationInput.value,
                //     // data: [] // Можна додати завантаження файлів пізніше
                // }
            };
            console.log(eventData);
            
            modalClose();
        }
    }, [isValid, valueTeacher, valueName, valueType, valuePlace, valuePlatform, valueLink, valueTag, modalClose]);

    if (!modalOpen) return null;

    return (
        <Modal onHiddenCart={modalClose} modalClassname={classes.modal}>
            <div className={classes.modalContent}>
                <form className={classes.form} onSubmit={submitHandler}>
                    <div className={classes.header}>
                        <Input
                            label="Назва Події"
                            placeholder="Введіть Назву Події"
                            value={valueName}
                            onChange={nameChangeHandler}
                            onBlur={nameBlurHandler}
                            id="eventName"
                        />
                    </div>
                    <div className={classes.sectionBox}>
                        
                            <label htmlFor='teacher'>Викладач</label>
                            <Input
                            placeholder="Введіть Ім'я Викладача"
                            value={valueTeacher}
                            onChange={teacherChangeHandler}
                            onBlur={teacherBlurHandler}
                            id="teacher"
                            />
                        
                            <label htmlFor='type'>Тип</label>
                            <Dropdown 
                                changeValueHandler={changeTypeHandler} arrValue={eventsConst.type}
                                color='green'
                                borderRadius={15}/>
                        
                            <label htmlFor='place'>Місце Проведення</label>
                            <Input
                                placeholder="Введіть Місце Проведення"
                                value={valuePlace}
                                onChange={placeChangeHandler}
                                onBlur={placeBlurHandler}
                                id='place'
                            />
                        
                            <label htmlFor='platform'>Платформа</label>
                            <Dropdown 
                                changeValueHandler={changePlatformHandler} arrValue={eventsConst.platform}
                                color='green'
                                borderRadius={15}/>
                        
                            <label htmlFor='link'>Посилання</label>
                            <Input
                                placeholder="Введіть Посилання"
                                value={valueLink}
                                onChange={linkChangeHandler}
                                onBlur={linkBlurHandler}
                                id='link'
                            />
                        
                            <label htmlFor='tag'>Теги</label>
                            <Dropdown 
                                changeValueHandler={changeTagHandler} arrValue={eventsConst.tag}
                                type='checkbox'
                                color='green'
                                borderRadius={15}/>
                            <label>Дата</label>
                            <DatePicker isTime={true}/>
                        
                        
                    </div>
                    <div className={classes.section}>
                        <label htmlFor='tag'>Опис події</label>
                        <Textarea id='tag' />
                    </div>
                    <div className={classes.buttonGroup}>
                        <Button type="button" onClick={modalClose} typeColor="noBorder">Скасувати</Button>
                        <Button typeColor='green' type="submit" disabled={!isValid}>Створити</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalCreateEvent;
