import classes from './ModalPassword.module.scss'

import Checkbox from "../../../UI/Checkbox/Checkbox"
import Input from "../../../UI/Input/Input"
import Modal from "../../../UI/Modal/Modal"
import Button from '../../../UI/Button/Button'
import useInput from '../../../hooks/useInput'
import regex from '../../../constants/regex.enum'

const ModalPassword = (props) => {

    const {
        value,
        passwordChanger,
        onHiddenCart
    } = props;
    console.log(value);
    
    const {
        value: passwordValue,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler
    } = useInput('', 'password', value);
    const isRegex = (pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(passwordValue);
    }
    const isLenghtChar = isRegex(regex.REGEX_LENGTH_CHAR);
    const isLowerChar = isRegex(regex.REGEX_LOWER_CHAR);
    const isUpperChar = isRegex(regex.REGEX_UPPER_CHAR);
    const isNumberChar = isRegex(regex.REGEX_NUMBER_CHAR);
    const isSpecialChar = isRegex(regex.REGEX_SPECIAL_CHAR);
    const isPassword = isLenghtChar
        && isLowerChar
        && isUpperChar
        && isNumberChar
        && isSpecialChar;

    return <Modal onHiddenCart={onHiddenCart}>
        <div className={classes.content}>
            <Input value={passwordValue} onChange={passwordChangeHandler} onBlur={passwordBlurHandler} label='Пароль' type='password' placeholder='Введіть пароль'></Input>
            <div className={classes.checkBoxList}>
                <Checkbox
                    checked={isLenghtChar}
                    readOnly={true}
                >Мінімум 8 символів</Checkbox>
                <Checkbox
                    checked={isLowerChar}
                    readOnly={true}
                >Принаймні одна маленька літера</Checkbox>
                <Checkbox
                    checked={isUpperChar}
                    readOnly={true}
                >Принаймні одна велика літера</Checkbox>
                <Checkbox
                    checked={isNumberChar}
                    readOnly={true}
                >Принаймні одна цифра</Checkbox>
                <Checkbox
                    checked={isSpecialChar}
                    readOnly={true}
                >Принаймні один спеціальний символ</Checkbox>
                <Checkbox
                    checked={isSpecialChar}
                    readOnly={true}
                >Лише дозволені символи (@$!%*#?&)</Checkbox>
            </div>
            <div className={classes.buttonBox}>
                <Button onClick={onHiddenCart}>Вийти</Button>
                <Button typeColor='green' active={isPassword} disabled={!isPassword} onClick={(ev) => {
                    passwordChanger(passwordValue);
                    onHiddenCart(ev);
                }}>Пітвердити</Button>
            </div>
        </div>
    </Modal>
}

export default ModalPassword;