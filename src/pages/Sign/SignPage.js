import classes from './SignPage.module.scss'
import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input';

import patternBig from '../../static/image/pattern/patternBig.svg';
import { Link, useSearchParams } from 'react-router-dom';
import ModalPassword from '../../components/Sign/ModalPassword/ModalPassword';
import HeaderImg from '../../UI/HeaderImg/HeaderImg';
import React, { useState, useEffect } from 'react';
import useInput from '../../hooks/useInput';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchRegister, fetchLogin, fetchUserInfo } from '../../redux/actions/auth-actions';
import ButtonSmall from '../../UI/Button/ButtonSmall';
import validateFn from '../../constants/validateFn.enum';
import { showErrorMsg } from '../../error/error.validate.msg';

const SignPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUserInfo(navigate));
    }, []);

    const [ searchParam ] = useSearchParams();
    const isSignUp = searchParam.get('mode') === 'signUp';
    const signClass = `${classes.signBox} ${isSignUp ? '' : classes.signIn}`;
    const [ isModalPassword, setIsModalPassword ] = useState(false);
    const [ vlPassword, setPasswordValue ] = useState('');

    const passwordChanger = (newValue) => setPasswordValue(newValue);

    const clickPasswordHandler = (ev) => {
        ev.preventDefault();
        setIsModalPassword((prevState) => !prevState);
    }

    let {
        value: valueEmail,
        isValidInput: isValidEmail,
        arrayError: arrayErrorEmail,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
    } = useInput((value) => {
        const arrValidEmpty = validateFn.isNotEmptyFn(value)
        const arrValidEmail = validateFn.isEmailFn(value);
        return [...arrValidEmpty, ...arrValidEmail]
    }, 'Email');

    let {
        value: valuePassword,
        isValidInput: isValidPassword,
        arrayError: arrayErrorPassword,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
    } = useInput((value) => {
        const arrValidEmpty = validateFn.isNotEmptyFn(value)
        const arrValidPassword = validateFn.isPasswordFn(value);
        return [...arrValidEmpty, ...arrValidPassword]
    }, 'Password');



    let {
        value: valueFirstName,
        isValidInput: isValidFirstName,
        arrayError: arrayErrorFirstName,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurHandler: firstNameBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'FirstName');

    let {
        value: valueLastName,
        isValidInput: isValidLastName,
        arrayError: arrayErrorLastName,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurHandler: lastNameBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'LastName');
    let {
        value: valueNickname,
        isValidInput: isValidNickname,
        arrayError: arrayErrorNickname,
        valueChangeHandler: nicknameChangeHandler,
        inputBlurHandler: nicknameBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Nickname');
    let {
        value: valueBirthday,
        isValidInput: isValidBirthday,
        arrayError: arrayErrorBirthday,
        valueChangeHandler: birthdayChangeHandler,
        inputBlurHandler: birthdayBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Birthday');

    const isValid = isValidFirstName &&
        isValidLastName &&
        isValidNickname &&
        isValidBirthday &&
        isValidEmail &&
        valuePassword
    const isLoginValid = isValidEmail && isValidPassword;

    const registerHandler = async (ev) => {
        ev.preventDefault();
        console.log('r');
        if (isValid) {
            const registrationData = {
                firstName: valueFirstName,
                lastName: valueLastName,
                nickname: valueNickname,
                birthday: valueBirthday,
                email: valueEmail,
                password: valuePassword,
            };

            dispatch(fetchRegister(registrationData, navigate));
        }
    };

    const loginHandler = async (ev) => {
        ev.preventDefault();
        console.log('l');
        

        if (isLoginValid) {
            const loginData = {
                email: valueEmail,
                password: valuePassword,
            };

            dispatch(fetchLogin(loginData, navigate));
        }
    };

    return <div className={classes.content}>
        {isModalPassword && <ModalPassword value={vlPassword} passwordChanger={passwordChanger} onHiddenCart={clickPasswordHandler}/>}
        <div className={signClass}>
            <form className={classes.registerForm} onSubmit={registerHandler}>
                <HeaderImg className={classes.headerImg} left={0} top={0} position={'absolute'}/>
                <h2 className={classes.mobileTitle}>Реєстрація</h2>
                <div className={classes.buttonBox}>
                    <Button active={true}>Реєстрація</Button>
                    <Link to={'/sign?mode=signIn'}><Button type="noBorder">Вхід</Button></Link>
                </div>
                <div className={classes.inputBox}>
                    <Input
                        label="Ім'я"
                        placeholder="Введіть Ім'я"
                        value={valueFirstName}
                        onChange={firstNameChangeHandler}
                        onBlur={firstNameBlurHandler}
                    />
                    {showErrorMsg(arrayErrorFirstName, classes.errorMsg)}
                    <Input
                        label="Прізвище"
                        placeholder="Введіть Прізвище"
                        value={valueLastName}
                        onChange={lastNameChangeHandler}
                        onBlur={lastNameBlurHandler}
                    />
                    {showErrorMsg(arrayErrorLastName, classes.errorMsg)}
                    <Input
                        label="Нікнейм"
                        placeholder="Введіть Нікнейм"
                        value={valueNickname}
                        onChange={nicknameChangeHandler}
                        onBlur={nicknameBlurHandler}
                    />
                    {showErrorMsg(arrayErrorNickname, classes.errorMsg)}
                    <Input
                        label="День народження"
                        placeholder="Введіть День народження"
                        value={valueBirthday}
                        onChange={birthdayChangeHandler}
                        onBlur={birthdayBlurHandler}
                    />
                    {showErrorMsg(arrayErrorBirthday, classes.errorMsg)}
                    <Input
                        id="email"
                        label="Пошта"
                        placeholder="Введіть Пошта"
                        value={valueEmail}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                    />
                    <Input
                        id="password"
                        type="password"
                        onClick={clickPasswordHandler}
                        value={vlPassword}
                        readOnly={true}
                        label="Пароль"
                        placeholder="Введіть Пароль"
                    />
                    {showErrorMsg(arrayErrorEmail, classes.errorMsg)}
                </div>
                <Button height={'fit-content'} disabled={!isValid}>Зареєструватися</Button>
                <div className={classes.mobileButtonBox}>
                    <p>Уже маєте аккаунт?</p>
                    <Link to={'/sign?mode=signIn'} >Увійти</Link>
                </div>
            </form>
            <form className={classes.loginForm} onSubmit={loginHandler}>
                <h2 className={classes.mobileTitle}>Увійти</h2>
                <div className={classes.buttonBox}>
                    <Button active={true}>Вхід</Button>
                    <Link to={'/sign?mode=signUp'}><Button type="noBorder">Реєстрація</Button></Link>
                </div>
                <div className={classes.inputBox}>
                    <Input
                        id="email"
                        label="Пошта"
                        placeholder="Введіть Пошта"
                        value={valueEmail}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                    />
                    {showErrorMsg(arrayErrorEmail, classes.errorMsg)}
                    <Input
                        type="password"
                        label="Пароль"
                        placeholder="Введіть Пароль"
                        value={valuePassword}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                    />
                    <a className={classes.forgetPassword}>Забули пароль?</a>
                </div>
                <Button height={'fit-content'} disabled={!isLoginValid}>Увійти</Button>
                <div className={classes.mobileButtonBox}>
                    <p>Не маєте акаунту?</p>
                    <Link to={'/sign?mode=signUp'}>Зареєструватися</Link>
                </div>
            </form>
            <div className={classes.imgBox}>
                <img src={patternBig} alt=""></img>
            </div>
        </div>
    </div>
}

export default SignPage;
