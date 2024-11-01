import urlEnum from "../../constants/urlEnum";
import { Cookies } from "react-cookie";
import { authAction } from "../slices/auth-slice";
import { groupInfoAction } from "../slices/group-info-slice";
import { getFetch, reFetchAuth } from "./auth-actions";

const cookies = new Cookies();

export const fetchGroupInfo = (groupId, navigate) => async (dispatch) => {
    const accessToken = cookies.get('Access');

    const params = {
        url: urlEnum.groupInfo,
        method: 'POST',
        body: { groupId },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        }
    };

    try {
        const responseFn = (data, navigate, dispatch) => {
            dispatch(groupInfoAction.setGroupInfo(data));
        }

        await dispatch(getFetch(params, navigate, responseFn));
    } catch (error) {
        if (error.errorStatus === 4012) {
            dispatch(authAction.removeUserInfo());

            const responseFn = async (data, dispatch) => {
                dispatch(authAction.updateAuth({
                    userInfo: { ...data, password: undefined }
                }));

                await fetchGroupInfo(groupId, navigate)(dispatch);
            }

            reFetchAuth(responseFn, navigate, { url: urlEnum.userInfo })(dispatch);
        }
    }
};
