import classes from './DatePicker.module.scss'
import { useCallback, useState } from "react";
import Input from "../Input/Input";
import Calendar from "../Calendar/Calendar";


const DateModal = ({ resultFn, currentDate, isTime }) => {
    return <div className={classes.modal}>
        <Calendar currentDate={currentDate} isTime={isTime} resultFn={resultFn}/>
    </div>
}

const DatePicker = ({
    placeholder = 'Select date',
    isTime = false
}) => {

    const formatDateTime = useCallback((date, isTime = false) => {
        
        if (!(date instanceof Date) || isNaN(date)) return '';
        
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, dateOptions);
        
        if (isTime) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            return `${formattedDate} ${formattedTime}`;
        }
        
        return formattedDate;
    }, []);
    
    

    const [isModal, setIsModal] = useState(false);

    const clickModalHandler = useCallback((ev) => {
        ev.preventDefault();
        setIsModal((prevState) => !prevState);
    }, []);
    

    const [date, setDate] = useState('')

    const changeDateHandler = useCallback((vl) => {
        setDate(formatDateTime(vl, isTime))
        setIsModal((prevState) => !prevState);
    }, []);
    

    return <div className={classes.datePicker}>
        <Input value={date} placeholder={placeholder} readOnly={true} onClick={clickModalHandler}/>
        {isModal && <DateModal currentDate={date} isTime={isTime} resultFn={changeDateHandler} />}
    </div>
}

export default DatePicker;