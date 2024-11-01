import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';

const initialState = {
    userInfo: {}, 
    userToken: null,
};

const cookies = new Cookies();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuth: (state, action) => ({ ...state, ...action.payload }),
        removeUserInfo: () => {
            return { userInfo: {}, userToken: cookies.get('Access') };
        },
        logOutAuth: () => {
            cookies.remove('Access');
            cookies.remove('Refresh');
            return { userInfo: {}, userToken: null };
        }
    },
    extraReducers: {},
});


export const authAction = authSlice.actions;

export default authSlice.reducer;
