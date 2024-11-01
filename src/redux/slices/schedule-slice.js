import { createSlice } from '@reduxjs/toolkit';
import { getISOWeekNumber } from '../../helper/dateHelper';

const initialState = {
    schedules: [
    ],
    date: new Date()
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        addSchedule: (state, action) => {
            const newSchedule = action.payload;
            const isoWeek = getISOWeekNumber(newSchedule.date);
            const date = new Date(newSchedule.date).toISOString()
            const existingItem = state.schedules.find(item => item.isoWeek === isoWeek && item.groupId === newSchedule?.groupId);
            if (existingItem) {
                return;
            }
            state.schedules.push({ data: newSchedule.data, isoWeek, groupId: newSchedule.groupId })
        },
        updateSchedule: (state, action) => {
            const newSchedule = action.payload;
            const isoWeek = getISOWeekNumber(newSchedule.date);
            const existingItemId = state.schedules.findIndex(item => item.isoWeek === isoWeek && item.groupId === newSchedule?.groupId);
            if (!existingItemId) {
                return;
            }
            state.schedules[existingItemId] = { ...state.schedules[existingItemId], ...newSchedule}
        },
    },
    extraReducers: {},
});


export const schedulehAction = scheduleSlice.actions;

export default scheduleSlice.reducer;
