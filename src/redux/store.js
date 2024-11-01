import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth-slice";
import scheduleReducer from "./slices/schedule-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        schedule: scheduleReducer
    }
});

export default store;
