import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth-slice";
import scheduleReducer from "./slices/schedule-slice";
import groupsInfoReducer from "./slices/group-info-slice"
import messagesReducer from "./slices/message-slice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        schedule: scheduleReducer,
        group: groupsInfoReducer,
        messages: messagesReducer,
    }
});

export default store;
