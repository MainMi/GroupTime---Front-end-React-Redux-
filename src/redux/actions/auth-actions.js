import { authAction } from '../slices/auth-slice';
import urlEnum from '../../constants/urlEnum';
import Cookies from 'universal-cookie';
import { getFetchDispatch } from '../../api/apiFetch';
import { useSelector } from 'react-redux';

import { decryptAES, encryptAES } from '../../helper/crypto';

const cookies = new Cookies();

const refreshAuthToken = async (headers) => {
    const refreshToken = cookies.get('Refresh');
    if (!refreshToken) return null;

    try {
        const response = await fetch(urlEnum.refresh, {
            method: 'GET',
            headers: { ...headers, 'Authorization': refreshToken },
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (data.errorStatus) return null;

        const { access_token, refresh_token } = data.tokenPair;
        cookies.set('Access', access_token, { path: '/' });
        cookies.set('Refresh', refresh_token, { path: '/' });

        return data;
    } catch (error) {
        console.error('Failed to refresh auth token:', error);
        return null;
    }
};

export const fetchAuthDispatch = (responseFn, navigate, responseArgm = {}) =>
    async (dispatch, getState) => {
        const authToken = cookies.get('Access');
        const reduxAuthToken = getState().auth.userToken;
        if (!authToken || !authToken.length) {
            navigate('/sign');
            return;
        }

        if (reduxAuthToken) {
            dispatch(authAction.updateAuth({ userToken: authToken }));
        }

        try {

            let { url = urlEnum.userInfo, method = 'POST', body = null } = responseArgm;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authToken
            };

            const parameters = { url, method, headers, body };

            await dispatch(getFetchDispatch(parameters, navigate, async (data) => {
                
                const isUnauthorized = data.errorStatus === 4011 || data.errorStatus === 4012;

                if (isUnauthorized) {
                    const refreshedData = await refreshAuthToken(headers);
                    if (!refreshedData) {
                        dispatch(authAction.logOutAuth());
                        navigate('/sign');
                        return;
                    }
                    const { access_token } = refreshedData.tokenPair;
                    dispatch(authAction.updateAuth({ userToken: access_token }))
                    const newParameters = { url, method, headers: { ...headers, 'Authorization': access_token }, body };
                    dispatch(getFetchDispatch(newParameters, navigate, responseFn));
                } else {
                    if (data.status >= 400 && data.status < 600) {
                        // dispatch(authAction.logOutAuth());
                        // navigate('/sign');
                        console.error(data)
                        return;
                    }
                    responseFn(data, navigate, dispatch);
                }
            }));
        } catch (e) {
            console.log(e);
            // dispatch(authAction.logOutAuth());
            // navigate('/sign');
        }
    };

export async function fetchAuth(responseArgm = {}, navigate) {
    const authToken = cookies.get('Access');
    if (!authToken || !authToken.length) {
        navigate('/sign');
        return;
    }
    console.log('r', responseArgm);
    
    let { url = urlEnum.userInfo, method = 'POST', body = null } = responseArgm;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': authToken
    };

    let parameters = { method, headers };

    if (body) {
        parameters.body = JSON.stringify(body);
    }
    console.log(parameters);
    
    try {
        let response = await fetch(url, parameters);
        let data = await response.json();

        const isUnauthorized = data.errorStatus === 4011 || data.errorStatus === 4012;

        if (isUnauthorized) {
            const refreshedData = await refreshAuthToken(headers);
            if (!refreshedData) {
                navigate('/sign');
                return;
            }
            const { access_token } = refreshedData.tokenPair;
            headers['Authorization'] = access_token;
            parameters.headers = headers;
            response = await fetch(url, parameters);
            data = await response.json();
        }

        if (data.status >= 400 && data.status < 600) {
            console.error(data)
            return { data };
        }

        
        return { data, status: response.status, ok: response.ok };

    } catch (e) {
        console.error(e);
        // navigate('/sign');
    }
}


export const fetchRegister = (body, navigate) => {
    const parameters = {
        url: urlEnum.register,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    };

    const helpFn = (data, navigate, dispatch) => {
        console.log('Please confirm email!');
        navigate('/sign');
    };

    return async (dispatch) => {
        try {
            await dispatch(getFetchDispatch(parameters, navigate, helpFn));
        } catch (error) {
            console.error(error.message);
        }
    };
};

export const fetchLogin = (body, navigate) => {
    const parameters = {
        url: urlEnum.login,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    };
    console.log(parameters);

    const helpFn = (data, navigate, dispatch) => {
        const { user, access_token, refresh_token } = data;
        
        
        dispatch(authAction.updateAuth({
            userInfo: { ...user, password: undefined },
            userToken: access_token,
        }));

        cookies.set('Access', access_token, { path: '/' });
        cookies.set('Refresh', refresh_token, { path: '/' });

        navigate('/profile');
    };

    return async (dispatch) => {
        try {
            await dispatch(getFetchDispatch(parameters, navigate, helpFn));
        } catch (error) {
            console.error(error.message);
        }
    };
};

export const fetchUserInfo = (navigate) => {
    const responseFn = (data, navigate, dispatch) => {
        data.birthday = new Date(data.birthday).toISOString();
        dispatch(authAction.updateAuth({
            userInfo: { ...data, password: undefined },
        }));
    };

    return fetchAuthDispatch(responseFn, navigate);
};
