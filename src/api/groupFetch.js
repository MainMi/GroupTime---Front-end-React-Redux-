import urlEnum from "../constants/urlEnum";
import { fetchAuth } from "../redux/actions/auth-actions";
import { getFetch } from "./apiFetch";

export function createGroup (data) {
    const { name, type, description } = data;
    const url = urlEnum.createGroup
    const body = { name, type, description };
    return fetchAuth({ url, body })
}

export function searchGroup (groupId) {
    const url = `${urlEnum.groupSearch}?groupId=${groupId}`
    return getFetch({ url })
}

export function searchGroups (query) {
    const url = `${urlEnum.groupSearch}?query=${query}`
    return getFetch({ url })
}

export function inviteUsersToGroup (data) {
    const { usersId, roles, groupId } = data;
    const url = urlEnum.inviteUsers
    const body = { usersId, roles, groupId };
    
    return fetchAuth({ url, body })
}
export function acceptInviteGroup (actionToken) {
    const url = urlEnum.acceptInvite
    const headers = { Authorization: actionToken };
    return getFetch({ url, headers })
}
export function deleteInviteGroup (actionToken) {
    const url = urlEnum.deleteInvite
    const headers = { Authorization: actionToken };
    return getFetch({ url, headers })
}