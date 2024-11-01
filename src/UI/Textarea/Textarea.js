import classes from './Textarea.module.scss'

const Textarea = (props) => {
    const {
        label = false,
        id,
        error = '',
        size = 14,
        type = 'text',
        style,
        inputClassName,
        labelClassName, 
        ...otherProps
    } = props;

    const className = `${classes.input} ${labelClassName} ${error ? classes.error : ''}`
    const styleSize = { fontSize: `${size}px`};
    const inputSize = { ...styleSize, height: `${size + 18}px`, ...style};
    return <div className={classes.labelBox}>
        {label && <label htmlFor={id} style={styleSize} className={labelClassName}>{label}</label>}
        <textarea
            id={id}
            type={type}
            className={className}
            style={inputSize}
            {...otherProps}
        >
        </textarea>
        {!!error.lenght || <div className={classes.error}>{error}</div>}
    </div>
}

export default Textarea;