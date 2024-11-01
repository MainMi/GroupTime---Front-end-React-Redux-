import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groupInfo: null,
};

const groupInfoSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setGroupInfo: (state, action) => ({ ...state, ...action.payload }),
    },
    extraReducers: {},
});


export const groupInfoAction = groupInfoSlice.actions;
export default groupInfoSlice.reducer;
