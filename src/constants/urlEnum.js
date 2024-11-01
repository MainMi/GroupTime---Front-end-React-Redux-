const api = process.env.REACT_APP_API_URL;
const urlEnum = {
    // auth
    api,
    register: `${api}/users/create`,
    login: `${api}/auth/login`,
    refresh: `${api}/auth/refresh`,

    // user
    userInfo: `${api}/auth/userInfo`,
    userSearch: `${api}/users/find`,

    // group
    createGroup: `${api}/group/create`,
    groupInfo: `${api}/group/info`,
    groupSearch: `${api}/group/search`,
    inviteUsers: `${api}/group/invite/users`,
    acceptInvite: `${api}/group/confirm/invite`,
    deleteInvite: `${api}/group/delete/invite`,
    
    // schedule
    scheduleWeekInfo: `${api}/schedule/week/info`
};

export default urlEnum;
