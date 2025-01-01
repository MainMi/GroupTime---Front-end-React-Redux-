import urlEnum from "../constants/urlEnum";
import { fetchAuth, fetchAuthDispatch } from "../redux/actions/auth-actions";
import { messagesAction } from "../redux/slices/message-slice";

export function sendMessage(data, messageHistory, navigate) {
    const url = urlEnum.messageSend;
    const body = data;
    const responseFn = (data, navigate, dispatch) => {
        dispatch(messagesAction.updateMessages([...messageHistory, ...data]));
    };
    return fetchAuthDispatch(responseFn, navigate, { url, method: 'POST', body });
}

export function getLastMessages(navigate) {
    const url = urlEnum.messageGetLast;
    const responseFn = (data, navigate, dispatch) => {
        dispatch(messagesAction.updateMessages(data));
    };
    return fetchAuthDispatch(responseFn, navigate, { url, method: 'GET' });
}