import React, { useState } from 'react';
import classes from './EventHour.module.scss';
import Modal from '../../../UI/Modal/Modal';
import Button from '../../../UI/Button/Button';
import eventsConst from '../../../constants/type/eventEnum';

const EventIcon = ({ events, colorFn, showModalFn, addEventInfoFn }) => {
    const orderClasses = ['first', 'second', 'third']
    return <div className={classes.eventIcon}>
        {orderClasses.map((vl, idx) => {
            if (idx === events.length) {
                return null;
            }
            return (<div onClick={() => {
                showModalFn()
                addEventInfoFn(events)
            }} className={`${classes.event} ${classes[colorFn(events[idx])]} ${classes[vl]}`} key={vl + idx}>
                {(idx === events.length - 1 || idx === orderClasses.length - 1) && <h4>{events.length} події</h4>}
            </div>)
        })}
    </div>
}

const EventsHour = React.memo(({ events, showModalFn, addEventInfoFn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!events || events.length === 0) {
        return <div className={classes.eventHour}></div>;
    }

    const handleIconClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const classesArr = ['pink', 'lightGreen', 'green', 'red']

    const getColorByType = (event) => {
        const type = event.eventInfo.type;
        const typeId = eventsConst.type.findIndex((vl) => vl === type);
        return classesArr[typeId % classesArr.length]
    }
    
    return (
        <div className={classes.eventHour}>
            {events.length === 1 ? (
                <div onClick={() => {
                    showModalFn()
                    addEventInfoFn(events)
                }} className={`${classes.event} ${classes[getColorByType(events[0])]}`}>
                    <span className={classes.title}>{events[0].eventInfo.name}</span>
                    <span className={classes.time}>{events[0].intervalTime}</span>
                    <Button className={classes.button}>{events[0].eventInfo.type}</Button>
                </div>
            ) : (
                <>
                    <EventIcon addEventInfoFn={addEventInfoFn} showModalFn={showModalFn} events={events} colorFn={getColorByType} />
                </>
            )}
        </div>
    );
});

export default EventsHour;
