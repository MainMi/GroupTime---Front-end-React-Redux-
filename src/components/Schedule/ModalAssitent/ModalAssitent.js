import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { messagesAction } from '../../../redux/slices/message-slice';
import MessageList from '../MessageList/MessageList';
import classes from './ModalAssitent.module.scss';
import buttonsImages from '../../../static/image/buttonIcons';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import { getLastMessages, sendMessage } from '../../../api/messageFetch';
import Modal from '../../../UI/Modal/Modal';
import useInput from '../../../hooks/useInput';
import validateFn from '../../../constants/validateFn.enum';

const Modalassistant = ({ modalClose }) => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);

    let {
        value: valueMessage,
        isValidInput: isValidMessage,
        arrayError: arrayErrorMessage,
        valueChangeHandler: messageChangeHandler,
        inputBlurHandler: messageBlurHandler,
        resetFn: resetMessage,
    } = useInput(validateFn.isNotEmptyFn, 'Message');

    const messageHistory = useSelector((state) => state.messages.history);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const groupInfo = useSelector((state) => state.group.groupsInfo);
    const scheduleInfo = useSelector((state) => state.schedule.schedules);

    useEffect(() => {
        const fetchMessages = async () => {
            const localStorageMessages = localStorage.getItem('messageHistory');
            const parsedMessages = JSON.parse(localStorageMessages);
            if (parsedMessages?.length) {
                dispatch(messagesAction.updateMessages(parsedMessages));
                setMessages(parsedMessages);
            } else {
                try {
                    const response = await dispatch(getLastMessages());
                    if (response.payload) {
                        localStorage.setItem('messageHistory', JSON.stringify(response.payload));
                        setMessages(response.payload);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [messageHistory.length, dispatch]);

    const handleSendMessage = async () => {
        if (!isValidMessage) {
            return;
        }
        const data = {
            message: valueMessage,
            groundData: {
                user: userInfo,
                group: groupInfo,
                schedule: scheduleInfo,
            }
        };

        try {
            const response = await dispatch(sendMessage(data, messageHistory));
            if (response.payload) {
                const newMessages = [...messages, response.payload];
                setMessages(newMessages);
                localStorage.setItem('messageHistory', JSON.stringify(newMessages));
                resetMessage();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Modal onHiddenCart={modalClose}>
            <div className={classes.modalContent}>
                <div className={classes.titleBox}>
                    <h4>AI Assistant</h4>
                    <img src={buttonsImages['close-pink']} alt='close-pink' onClick={modalClose} />
                </div>
                {!!messages?.length && <MessageList messages={messages} />}
                <div className={classes.buttonBox}>
                    <Input
                        value={valueMessage}
                        onChange={messageChangeHandler}
                        onBlur={messageBlurHandler}
                    />
                    <Button
                        typeColor='green'
                        onClick={handleSendMessage}
                        disabled={!isValidMessage}
                    >Відправити</Button>
                </div>
            </div>
        </Modal>
    );
};

export default Modalassistant;