import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';

const initialState = {
    userInfo: {}, 
    userToken: null,
    groups: []
};

const cookies = new Cookies();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuth: (state, action) => ({ ...state, ...action.payload }),
        updateGroups: (state, action) => {
            const { id } = action.payload;
            const idx = state.groups.findIndex(group => group.id === id);
    
            return {
                ...state,
                groups: idx !== -1
                    ? state.groups.map((group, index) =>
                        index === idx ? action.payload : group
                    )
                    : [...state.groups, action.payload],
            };
        },
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
