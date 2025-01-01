import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groupsInfo: [],
};

const groupInfoSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setGroupsInfo: (state, action) => ({ ...state, ...action.payload }),
        addGroupInfo: (state, action) => {
            const { id } = action.payload;
            
            const idx = state.groupsInfo.findIndex(group => group.id === id);

            if (idx !== -1) {
                state.groupsInfo[idx] = action.payload;
                return;
            } 
            state.groupsInfo.push(action.payload);
        }
    },
    extraReducers: {},
});


export const groupInfoAction = groupInfoSlice.actions;

export default groupInfoSlice.reducer;
