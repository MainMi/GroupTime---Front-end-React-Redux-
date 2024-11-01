import { useCallback, useEffect, useState } from 'react';
import EventTable from '../../components/Schedule/EventTable/EventTable';
import ModalCreateEvent from '../../components/Schedule/ModalCreateEvent/ModalCreateEvent';
import Button from '../../UI/Button/Button';
import ButtonSmall from '../../UI/Button/ButtonSmall';
import Calendar from '../../UI/Calendar/Calendar';
import Checkbox from '../../UI/Checkbox/Checkbox';
import Dropdown from '../../UI/Dropdown/Dropdown';
import classes from './Schedule.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from '../../redux/actions/auth-actions';
import { getISOWeekNumber } from '../../helper/dateHelper';
import { getScheduleWeekInfo } from '../../api/scheduleFetch';

const SchedulePage = () => {
    const today = new Date('September 25 2024');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const schedules = useSelector((state) => state.schedule.schedules);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeSheet, setTimeSheet] = useState(90);
    const [date, setDate] = useState(today);
    const [existingItem, setExistingItem] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(0);

    const toggleModal = useCallback(() => {
        setIsModalOpen((prevState) => !prevState);
    }, []);

    useEffect(() => {
        if (!userInfo?.nickname) {
            dispatch(fetchUserInfo(navigate));
            return;
        }

        const { _id: groupId } = userInfo.groups[selectedGroup].group;
        const isoWeek = getISOWeekNumber(date);
        const foundItem = schedules.find(
            (item) => item.isoWeek === isoWeek && item.groupId === groupId
        );

        if (!foundItem) {
            dispatch(getScheduleWeekInfo({ date, groupId }, navigate)).then((data) => {
                setExistingItem(data);
            });
        } else {
            setExistingItem(foundItem);
        }
    }, [userInfo, date, dispatch, navigate, schedules]);
    if (!existingItem && schedules.length === 1) {
        setExistingItem(schedules[0])
    }
    
    if (!userInfo?.nickname) {
        return <div>Loading...</div>;
    }

    const {
        group: groupInfo,
        role: userRole,
    } = userInfo.groups[selectedGroup];
    const {
        parameters: { periodStartEvent = '8:00', periodEndEvent = '21:00' },
    } = groupInfo;

    const groupsNames = userInfo.groups.map((group, idx) => ({ title: group.group.name, value: idx }))
    console.log(groupsNames);
    

    return (
        <div className={classes.schedule}>
            <div className={classes.filterBar}>
                <Dropdown color="green" borderRadius={5} defaultIndex={0} label='Select' arrValue={groupsNames} type='index'/>
                <Calendar color="green" />
                <div className={classes.filterBox}>
                    <Checkbox defaultChecked>Всі фільтри</Checkbox>
                    <Checkbox>Мій власний фільтр</Checkbox>
                    <Checkbox>Мій власний фільтр</Checkbox>
                    <Checkbox>Мій власний фільтр</Checkbox>
                </div>
            </div>
            <div className={classes.eventTable}>
                <h1 className={classes.title}>Назва групи</h1>
                <div className={classes.settingBar}>
                    <div className={classes.monthHandler}>
                        <h3 className={classes.monthTitle}>Вересень</h3>
                        <ButtonSmall centerImg="chevron-pink" className={classes.button} />
                        <ButtonSmall centerImg="chevron-pink" className={classes.button} />
                    </div>
                    <Button afterImg="plus" onClick={toggleModal}>
                        Створити подію
                    </Button>
                </div>
                {existingItem && <EventTable
                    timeSheet={timeSheet}
                    periodStartEvent={periodStartEvent}
                    periodEndEvent={periodEndEvent}
                    scheduleWeek={existingItem}
                />}
                <ModalCreateEvent modalOpen={isModalOpen} modalClose={toggleModal} />
            </div>
        </div>
    );
};

export default SchedulePage;
