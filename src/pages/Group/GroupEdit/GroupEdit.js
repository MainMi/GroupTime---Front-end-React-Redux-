import { useRef, useState } from 'react';
import AvatarImg from '../../../UI/AvatarImg/AvatarImg';
import Button from '../../../UI/Button/Button';
import HeaderImg from '../../../UI/HeaderImg/HeaderImg';
import Input from '../../../UI/Input/Input';
import Textarea from '../../../UI/Textarea/Textarea';
import UserCard from '../../../UI/UserCard/UserCard';
import buttonsImages from '../../../static/image/buttonIcons';
import classes from './GroupEdit.module.scss';
import { useNavigate } from 'react-router-dom';
import ButtonSmall from '../../../UI/Button/ButtonSmall';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import AddUserForm from '../../../components/Group/AddUserForm/AddUserForm';
import groupTypeEnum from '../../../constants/type/groupTypeEnum';
import validateFn from '../../../constants/validateFn.enum';
import useInput from '../../../hooks/useInput';
import { showErrorMsg } from '../../../error/error.validate.msg';
import { useDispatch } from 'react-redux';
import { createGroup, inviteUsersToGroup } from '../../../api/groupFetch';
import { fetchUserInfo } from '../../../redux/actions/auth-actions';

const GroupEdit = () => {
    const navigate = useNavigate();

    const [readyAddUsers, setReadyAddUsers] = useState([]);
    const [privateType, setPrivateType] = useState(groupTypeEnum.PUBLIC_TYPE)
    const changePrivateTypeHandler = (value) => setPrivateType(value);

    let {
        value: valueGroupName,
        isValidInput: isValidGroupName,
        arrayError: arrayErrorGroupName,
        valueChangeHandler: groupNameChangeHandler,
        inputBlurHandler: groupNameBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'GroupName');
    
    let {
        value: valueDescription,
        isValidInput: isValidDescription,
        arrayError: arrayErrorDescription,
        valueChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Description');

    const handleAddUser = (newUser) => {
        setReadyAddUsers([...readyAddUsers, newUser]);
    };

    const dispatch = useDispatch();

    const isValidSubmit = isValidGroupName && isValidDescription;
    const submitCreateGroupHandler = async (ev) => {
        ev.preventDefault();
        if (!isValidSubmit) {
            return;
        }
        const users = [];
        const roles = [];
        const isEmptyUsers = !readyAddUsers.length;

        const { data: createGroupData, ok: createGroupOk = false } = await createGroup({
            name: valueGroupName,
            description: valueDescription,
            type: privateType
        });

        if (!createGroupOk) {
            console.error(createGroupData)
            return;
        }
        if (!isEmptyUsers) {
            const groupId = createGroupData.id;
            for (let i = 0; i < readyAddUsers.length; i++) {
                users.push(readyAddUsers[i].user);
                roles.push(readyAddUsers[i].role);
            }
            const { data: inviteUsersData, ok: inviteUsersOk = false } = await inviteUsersToGroup({
                usersId: users,
                roles,
                groupId
            });
            if (!inviteUsersOk) {
                console.error(inviteUsersData)
                return;
            }
        }
        dispatch(fetchUserInfo(navigate));
        navigate('/profile');

        console.log({
            name: valueGroupName,
            description: valueDescription,
            type: privateType,
            users,
            roles
        });
    };

    const deleteUserHandler = (id) => setReadyAddUsers((prevState) =>
        prevState.filter(({ user }) => user.id !== id)
    );

    return (
        <div className={classes.content}>
            <HeaderImg />
            <form className={classes.container} onSubmit={submitCreateGroupHandler}>
                <div className={classes.groupInfoBox}>
                    <div className={classes.groupAvatar}>
                        <AvatarImg size="large" />
                        <Button typeColor="green" beforeImg="plus" className={classes.btn}>
                            Додати
                        </Button>
                    </div>
                    <div className={classes.groupInfo}>
                        <h1>Створення групи</h1>
                        <Input
                            label="Назва групи"
                            placeholder="Введіть назву групи"
                            labelBoxClassName={classes.labelBox}
                            value={valueGroupName}
                            onChange={groupNameChangeHandler}
                            onBlur={groupNameBlurHandler}
                        />
                        {showErrorMsg(arrayErrorGroupName, classes.errorMsg)}
                        <div className={classes.inputBox}>
                            <label htmlFor="typeGroup">Оберіть тип групи</label>
                            <Dropdown
                                id="typeGroup"
                                label="Оберіть тип групи"
                                arrValue={Object.values(groupTypeEnum)}
                                defaultIndex={0}
                                changeValueHandler={changePrivateTypeHandler}
                            />
                        </div>
                        <Textarea
                            label="Опис групи"
                            labelClassName={classes.labelBox}
                            value={valueDescription}
                            onChange={descriptionChangeHandler}
                            onBlur={descriptionBlurHandler}
                        />
                        {showErrorMsg(arrayErrorDescription, classes.errorMsg)}
                    </div>
                </div>
                <div className={classes.usersForm}>
                    <div className={classes.addUsers}>
                        <p>Додання користувачів</p>
                        <AddUserForm readyAddUsers={readyAddUsers} onAddUser={handleAddUser} navigate={navigate} />
                    </div>
                    <div className={classes.usersBox}>
                        {readyAddUsers.map((userInfo, idx) => <div className={classes.userCardBox} id={userInfo.user.id}>
                            <UserCard userInfo={userInfo} id={userInfo.user.id}></UserCard>
                            <div className={classes.buttonBox}>
                                <ButtonSmall
                                    typeColor='green'
                                    borderRadius={'50%'}
                                    centerImg={buttonsImages.edit}
                                    className={classes.btn}
                                />
                                <ButtonSmall
                                    typeColor='pink'
                                    borderRadius={'50%'}
                                    centerImg={buttonsImages.trash}
                                    className={classes.btn}
                                    onClick={() => deleteUserHandler(userInfo.user.id)}
                                />

                            </div>
                        </div>)}
                    </div>
                </div>
                <Button typeColor="green" disabled={!isValidSubmit}>Створити групу</Button>
            </form>
        </div>
    );
};

export default GroupEdit;
