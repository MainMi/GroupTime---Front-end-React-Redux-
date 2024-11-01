import urlEnum from "../constants/urlEnum";
import { fetchAuthDispatch } from "../redux/actions/auth-actions";
import { schedulehAction } from "../redux/slices/schedule-slice";

export function getScheduleWeekInfo(data, navigate) {
    let { date, groupId } = data;
    const responseFn = (data, navigate, dispatch) => {
        dispatch(schedulehAction.addSchedule({ data, date, groupId }));
    };
    return fetchAuthDispatch(responseFn, navigate, { url: urlEnum.scheduleWeekInfo, body: { date, groupId } })
}