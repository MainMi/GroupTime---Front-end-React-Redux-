import { useState } from 'react';
import classes from './Checkbox.module.scss'

const  Checkbox = ({
    typeColor,
    labelClassName = '', 
    size = 22,
    error = false,
    readOnly = false,
    defaultChecked = false,
    children,
    ...otherParameters
}) => {

    const [ checked, setChehecked ] = useState(defaultChecked);

    const clickChangeHandler = () => !readOnly
        ? setChehecked((prevState) => !prevState)
        : () => {};

    const inputClassName = `${classes.checkBox} ${typeColor === 'green' ? classes.green : ''} ${error ? classes.error : ''}`;
    const labelClassname = `${classes.labelBox} ${labelClassName}`;

    return <label className={labelClassname}>
        <input type="checkbox" className={inputClassName} onChange={clickChangeHandler} checked={checked} {...otherParameters }  />
        <span>{children}</span>
    </label>
        
}

export default Checkbox;