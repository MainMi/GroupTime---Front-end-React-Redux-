import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ModalChat.module.scss';
import buttonsImages from '../../../static/image/buttonIcons';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import useInput from '../../../hooks/useInput';
import validateFn from '../../../constants/validateFn.enum';
import MessageList from '../../Schedule/MessageList/MessageList';
import messageEnum from '../../../constants/type/messageEnum';

const ModalChat = ({ modalClose, connectUserId, isGroup }) => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [messagesConnect, setMessagesConnect] = useState([]);

    let {
        value: valueMessage,
        isValidInput: isValidMessage,
        arrayError: arrayErrorMessage,
        valueChangeHandler: messageChangeHandler,
        inputBlurHandler: messageBlurHandler,
        resetFn: resetMessage,
    } = useInput(validateFn.isNotEmptyFn, 'Message');

    const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        const messageKey = isGroup 
            ? `messages-${connectUserId}` 
            : `messages-${userInfo._id}-${connectUserId}`;
        const savedMessages = JSON.parse(localStorage.getItem(`messages-${userInfo._id}-${connectUserId}`)) || [];
        const savedMessagesConnectUser = JSON.parse(localStorage.getItem(`messages-${connectUserId}-${userInfo._id}`)) || [];
        setMessages(savedMessages);
        setMessagesConnect(savedMessagesConnectUser)
    }, []);

    const handleSendMessage = async () => {
        if (!isValidMessage) {
            return;
        }
        const newMessage = { userId: userInfo._id, content: valueMessage, timestamp: new Date().toISOString() };
        const userAnswer = { userId: userInfo._id, content: valueMessage, timestamp: new Date().toISOString(), type: messageEnum.ASSISTANT_MSG_TYPE };
        
        if (isGroup) {
            localStorage.setItem(`messages-${connectUserId}`, JSON.stringify([...messages, userAnswer]));
        } else {
            localStorage.setItem(`messages-${userInfo._id}-${connectUserId}`, JSON.stringify([...messages, newMessage]));
            localStorage.setItem(`messages-${connectUserId}-${userInfo._id}`, JSON.stringify([...messagesConnect, userAnswer]));
        }
        
        setMessages([...messages, newMessage]);
    };
    

    return (
        <Modal onHiddenCart={modalClose}>
            <div className={classes.modalContent}>
                <div className={classes.titleBox}>
                    <h4>Chat</h4>
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

export default ModalChat;