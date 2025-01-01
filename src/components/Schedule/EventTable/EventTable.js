import React, { useMemo, useState } from 'react';
import classes from './EventTable.module.scss';
import generateTimeArray, { getEventIntervals, addTime } from '../../../helper/dateHelper';
import EventsHour from '../EventHour/EventHour';
import ModalShowEvents from '../ModalShowEvents/ModalShowEvents';
import calendarEnum from '../../../constants/calendarEnum';

const EventTable = ({
    timeSheet,
    date,
    periodStartEvent,
    periodEndEvent,
    scheduleWeek,
}) => {

    const [isShowEvent, setIsShowEvent] = useState(false);
    const [eventsInfo, setEventsInfo] = useState(null);

    const toggleShowEventHandler = () => setIsShowEvent((prevState) => !prevState);
    const addEventsInfoHandler = (events) => setEventsInfo(events);

    const timeSchedule = generateTimeArray(
        periodStartEvent,
        periodEndEvent,
        timeSheet
    );

    const parsingDate = useMemo(() => {
        const result = {};
        const interval = timeSheet;

        Object.values(scheduleWeek.data).forEach(typeWeek => {
            typeWeek.forEach(daySchedule => {
                const day = daySchedule.day;
                if (!result[day]) {
                    result[day] = {};
                }
                daySchedule.events.forEach(event => {
                    const intervals = getEventIntervals(event, timeSchedule, interval);
                    const { time, duration } = event.eventDate;
                    const [hour, minute] = time.split(':');
                    const intervalTimeString = `${hour}:${minute}-${addTime(time, duration)}`;
                    
                    const eventWithIntervalTime = {
                        ...event,
                        intervalTime: intervalTimeString,
                    };
                    
                    intervals.forEach(intervalTime => {
                        if (!result[day][intervalTime]) {
                            result[day][intervalTime] = [];
                        }
                        result[day][intervalTime].push(eventWithIntervalTime);
                    });
                });
            });
        });

        return result;
    }, [scheduleWeek, timeSchedule]);
    
    return (
        <>
            <div className={classes.weekInfo}>
                {calendarEnum.weekFullArr.map((day, idx) => (
                    <div key={day} className={classes.weekButton}>
                        <span>{day}</span>
                        <span>{10 + idx}</span>
                    </div>
                ))}
            </div>

            <div className={classes.tableBox}>
                <div className={classes.timeColumn}>
                    {timeSchedule.map((time, idx) => (
                        <div key={time + idx}>{time}</div>
                    ))}
                </div>
                <div className={classes.table}>
                    {Object.keys(parsingDate).map(day => (
                        <div className={classes.eventRows} key={day}>
                            {timeSchedule.map((time, idx) => {
                                return (
                                    <EventsHour
                                        showModalFn={toggleShowEventHandler}
                                        addEventInfoFn={addEventsInfoHandler}
                                        key={time + idx}
                                        events={parsingDate[day][time]}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            {isShowEvent && (
                <ModalShowEvents
                    events={eventsInfo}
                    onHiddenCart={toggleShowEventHandler}
                />
            )}
        </>
    );
};

export default EventTable;
