import React, { useState, useEffect, useCallback, memo } from 'react';
import constants from '../../constants/constantEnum';
import ButtonSmall from '../Button/ButtonSmall';
import classes from './Calendar.module.scss';
import DayTable from './DayInfo/DayTable';
import Input from '../Input/Input';

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const selectButtonTypes = {
    month_type: 'month',
    year_type: 'year',
    period_type: 'period',
};

const selectButtonTypesVal = Object.values(selectButtonTypes);
const selectButtonTypesKeys = Object.keys(selectButtonTypes);

const selectChangeFn = (
    selectType,
    changeMonthHandler,
    changeYearHandler,
    changePeriodHandler,
    changeYear,
    isNext = false,
    minYear,
    maxYear
) => {
    const { month_type, year_type, period_type } = selectButtonTypes;
    switch (selectType) {
        case month_type:
            return changeMonthHandler(isNext, changeYear);
        case year_type:
            return changeYearHandler(isNext, minYear, maxYear);
        case period_type:
            return changePeriodHandler(isNext, minYear, maxYear);
        default:
            break;
    }
};

const YearColumn = memo(({ currentYear, changeYearHandler, minYear, maxYear }) => {
    const canDecrease = currentYear > minYear;
    const canIncrease = currentYear < maxYear;

    return (
        <div className={classes.yearInfo}>
            <ButtonSmall
                centerImg={'chevron'}
                size={16}
                className={classes.monthButton}
                onClick={() => changeYearHandler(false)}
                disabled={!canDecrease}
            />
            <h5>{currentYear}</h5>
            <ButtonSmall
                centerImg={'chevron'}
                size={16}
                className={classes.monthButton}
                onClick={() => changeYearHandler(true)}
                disabled={!canIncrease}
            />
        </div>
    );
});

const MonthColumn = memo(({
    color,
    currentType,
    selectType,
    currentMonth,
    currentYear,
    changeSelectTypeHandler,
    changeMonthHandler,
    changeYear,
    changeYearHandler,
    changePeriodHandler,
    minYear,
    maxYear
}) => {
    const { month_type, year_type, period_type } = selectButtonTypes;

    const selectFn = useCallback(
        (isNext) =>
            selectChangeFn(
                selectType,
                changeMonthHandler,
                changeYearHandler,
                changePeriodHandler,
                changeYear,
                isNext,
                minYear,
                maxYear
            ),
        [selectType, changeMonthHandler, changeYearHandler, changePeriodHandler, changeYear, minYear, maxYear]
    );

    const periodStartYear = Math.floor(currentYear / 10) * 10;
    const periodEndYear = periodStartYear + 9;
    const canDecreasePeriod = periodStartYear - 1 >= minYear;
    const canIncreasePeriod = periodEndYear + 1 <= maxYear;

    return (
        <div className={classes.monthInfo}>
            <ButtonSmall
                typeColor={color}
                centerImg={'chevron'}
                size={12}
                className={classes.monthButton}
                onClick={() => selectFn(false)}
                disabled={
                    (selectType === selectButtonTypes.period_type && !canDecreasePeriod) ||
                    (selectType === selectButtonTypes.year_type && currentYear <= minYear)
                }
            />

            <h6 className={classes.title} onClick={changeSelectTypeHandler}>
                {!currentType && constants.monthArr[currentMonth]}{' '}
                {currentType !== 2 && currentYear}{' '}
                {currentType === 2 && `${periodStartYear}-${periodStartYear + 9}`}
            </h6>

            <ButtonSmall
                typeColor={color}
                centerImg={'chevron'}
                size={12}
                className={classes.monthButton}
                onClick={() => selectFn(true)}
                disabled={
                    (selectType === selectButtonTypes.period_type && !canIncreasePeriod) ||
                    (selectType === selectButtonTypes.year_type && currentYear >= maxYear)
                }
            />
        </div>
    );
});

const WeekColumn = memo(() => (
    <div className={classes.weekInfo}>
        {constants.weeksArr.map((vl, index) => (
            <div key={index} className={classes.week}>
                {vl}
            </div>
        ))}
    </div>
));

const MonthTable = memo(({ currentMonth, setCurrentMonth, setSelectType }) => {
    const clickItemHandler = useCallback((_, index) => {
        setCurrentMonth(index);
        setSelectType(selectButtonTypes.month_type);
    }, [setCurrentMonth, setSelectType]);

    return (
        <div className={classes.monthTable}>
            {constants.shortMonthArr.map((vl, index) => (
                <div key={index} className={`${classes.item} ${currentMonth === index ? classes.selected: ''}`} onClick={() => clickItemHandler(vl, index)}>
                    {vl}
                </div>
            ))}
        </div>
    );
});

const YearTable = memo(({ currentYear, setCurrentYear, setSelectType, minYear, maxYear }) => {
    const periodStartYear = Math.floor(currentYear / 10) * 10;
    const yearArr = Array.from({ length: 10 }, (_, i) => periodStartYear + i).filter(
        year => year >= minYear && year <= maxYear
    );

    const clickItemHandler = useCallback((vl) => {
        setCurrentYear(vl);
        setSelectType(selectButtonTypes.year_type);
    }, [setCurrentYear, setSelectType]);

    return (
        <div className={classes.yearTable}>
            {yearArr.map((vl, index) => (
                <div key={index} className={`${classes.item} ${currentYear === vl ? classes.selected: ''}`} onClick={() => clickItemHandler(vl)}>
                    {vl}
                </div>
            ))}
        </div>
    );
});

const Calendar = ({
    changeYear = true,
    color = 'pink',
    calendarClassname,
    resultFn = () => {},
    currentDate = '',
    isTime = false,
    minYear = constants.minBirthdayYear,
    maxYear = constants.currentYear
}) => {
    const today = currentDate ? new Date(currentDate) : new Date();
    const [selectType, setSelectType] = useState(selectButtonTypes.month_type);
    const [currentYear, setCurrentYear] = useState(constants.currentYear);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentDay, setCurrentDay] = useState(today.getDate());
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const [currentTime, setCurrentTime] = useState(`${hours}:${minutes}`);

    const maxDayOfMonth = getDaysInMonth(currentYear, currentMonth);
    const prevMaxDayOfMonth = getDaysInMonth(currentYear, currentMonth - 1);
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const currentType = selectButtonTypesVal.indexOf(selectType);

    useEffect(() => {
        if (!isTime) {
            const safeDay = currentDay > maxDayOfMonth ? maxDayOfMonth : currentDay;
            resultFn(new Date(currentYear, currentMonth, safeDay));
        }
    }, [currentDay, resultFn]);

    const changeSelectTypeHandler = useCallback(() => {
        let index = selectButtonTypesVal.indexOf(selectType) + 1;
        if (index >= selectButtonTypesVal.length) {
            index = 0;
        }

        const value = selectButtonTypesKeys[index];
        setSelectType(selectButtonTypes[value]);
    }, [selectType]);

    const changeMonthHandler = useCallback((isNext = true, changeYearFlag = true) => {
        setCurrentMonth((prevMonth) => {
            let newMonth = isNext ? prevMonth + 1 : prevMonth - 1;
            let newYear = currentYear;

            if (newMonth > 11) {
                if (changeYearFlag && currentYear < maxYear) {
                    newMonth = 0;
                    newYear += 1;
                    setCurrentYear(newYear);
                } else {
                    newMonth = 11;
                }
            } else if (newMonth < 0) {
                if (changeYearFlag && currentYear > minYear) {
                    newMonth = 11;
                    newYear -= 1;
                    setCurrentYear(newYear);
                } else {
                    newMonth = 0;
                }
            }

            return newMonth;
        });
    }, [currentYear, changeYear, minYear, maxYear]);

    const changeYearHandler = useCallback((isNext = true, minYearBound, maxYearBound) => {
        setCurrentYear((prevYear) => {
            const newYear = isNext ? prevYear + 1 : prevYear - 1;
            if (newYear >= minYearBound && newYear <= maxYearBound) {
                return newYear;
            }
            return prevYear;
        });
    }, []);

    const changePeriodHandler = useCallback((isNext = true, minYearBound, maxYearBound) => {
        setCurrentYear((prevYear) => {
            const periodStartYear = Math.floor(prevYear / 10) * 10;
            const newPeriodStartYear = isNext ? periodStartYear + 10 : periodStartYear - 10;

            if (newPeriodStartYear + 9 < minYearBound || newPeriodStartYear > maxYearBound) {
                return prevYear;
            }
            return newPeriodStartYear;
        });
    }, []);

    const changeDayHandler = useCallback((value) => setCurrentDay(value), []);
    const changeTimeHandler = useCallback((ev) => {
        ev.preventDefault();
        setCurrentTime(ev.target.value)
    }, []);

    const isGreen = color === 'green';
    const newCalendarClassName = `${classes.calendar} ${isGreen ? classes.green : ''} ${calendarClassname}`;
    const submitDateAndTime = () => {
        if (currentTime) {
            const safeDay = currentDay > maxDayOfMonth ? maxDayOfMonth : currentDay;
            resultFn(new Date([currentYear, currentMonth + 1, safeDay, currentTime].join(', ')))
        }
    }

    return (
        <div className={newCalendarClassName}>
            <MonthColumn
                    color={color}
                    currentType={currentType}
                    selectType={selectType}
                    changeYear={changeYear}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    changeMonthHandler={changeMonthHandler}
                    changeYearHandler={changeYearHandler}
                    changePeriodHandler={changePeriodHandler}
                    changeSelectTypeHandler={changeSelectTypeHandler}
                    minYear={minYear}
                    maxYear={maxYear}
            />
            <div>
                    
                {currentType === 0 && <WeekColumn />}
                {currentType === 0 && (
                    <DayTable
                        isGreen={isGreen}
                        currentDay={currentDay > maxDayOfMonth ? maxDayOfMonth :currentDay}
                        maxDayOfMonth={maxDayOfMonth}
                        prevMaxDayOfMonth={prevMaxDayOfMonth}
                        startDayOfWeek={firstDayOfWeek}
                        changeDayHandler={changeDayHandler}
                    />
                )}
            </div>
            {currentType === 1 && (
                <MonthTable currentMonth={currentMonth} setSelectType={setSelectType} setCurrentMonth={setCurrentMonth} />
            )}
            {currentType === 2 && (
                <YearTable
                    currentYear={currentYear}
                    setSelectType={setSelectType}
                    setCurrentYear={setCurrentYear}
                    minYear={minYear}
                    maxYear={maxYear}
                />
            )}
            {isTime && <div className={classes.timePicker}>
                <Input value={currentTime} onChange={changeTimeHandler} type='time'/>
                <ButtonSmall
                    size={14}
                    typeColor={color}
                    centerImg={'check'}
                    className={classes.confirmTime}
                    isDisable={!currentTime}
                    onClick={submitDateAndTime}
                />
            </div>}
        </div>
    );
};

export default Calendar;
