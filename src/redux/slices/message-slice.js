import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [],
    status: 'idle',
    error: null,
};

const saveToLocalStorage = (state) => {
    localStorage.setItem('messageHistory', JSON.stringify(state.history));
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        updateMessages: (state, action) => {
            state.history = action.payload;
            saveToLocalStorage(state);
        },
        addMessage: (state, action) => {
            state.history.push(action.payload);
            saveToLocalStorage(state);
        },
        clearMessages: (state) => {
            state.history = [];
            saveToLocalStorage(state);
        },
    }
});

export const messagesAction = messageSlice.actions;

export default messageSlice.reducer;
