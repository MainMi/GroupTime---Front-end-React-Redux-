import urlEnum from "../constants/urlEnum";
import { fetchAuth } from "../redux/actions/auth-actions";


export function searchUsers (username, navigate) {
    const url = `${urlEnum.userSearch}?text=${username}`
    return fetchAuth({ url, method: 'GET' }, navigate)
}