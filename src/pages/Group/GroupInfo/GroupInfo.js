import { useNavigate, useParams } from 'react-router-dom';
import AvatarImg from '../../../UI/AvatarImg/AvatarImg';
import Button from '../../../UI/Button/Button';
import HeaderImg from '../../../UI/HeaderImg/HeaderImg';
import UserCard from '../../../UI/UserCard/UserCard';
import buttonsImages from '../../../static/image/buttonIcons';
import classes from './GroupInfo.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchUserInfo } from '../../../redux/actions/auth-actions';
import { deleteGroup, editGroup, getGroupInfo, leaveGroup, searchGroup } from '../../../api/groupFetch';
import roleEnum from '../../../constants/roleEnum';
import Textarea from '../../../UI/Textarea/Textarea';
import useInput from '../../../hooks/useInput';
import validateFn from '../../../constants/validateFn.enum';
import { showErrorMsg } from '../../../error/error.validate.msg';
import Input from '../../../UI/Input/Input';
import ModalEditParameters from '../../../components/Group/ModalEditParameters/ModalEditParameters';

const GroupInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { groupId } = useParams();

    const userInfo = useSelector((state) => state.auth.userInfo);
    const groupsInfo = useSelector((state) => state.group.groupsInfo);

    const [isModal, setIsModal] = useState(false);
    const [groupInfo, setGroupInfo] = useState([]);
    const [role, setRole] = useState(roleEnum.STUDENT_ROLE);

    const onModalCloseHandler = (resetValue = true) => {
        setIsModal(false)
        if (resetValue) {
            setParameters(null)
        }
    }
    const onModalOpenHandler = () => setIsModal(true)

    let {
        value: valueTitle,
        isValidInput: isValidTitle,
        arrayError: arrayErrorTitle,
        setValueHandler: setTitleHandler,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Title');
    let {
        value: valueDescription,
        isValidInput: isValidDescription,
        arrayError: arrayErrorDescription,
        setValueHandler: setDescriptionHandler,
        valueChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Description');

    const [parameters, setParameters] = useState(null)

    const parametersChangeHandler = (value) => setParameters(value)

    const [isEdit, setIsEdit] = useState(false);

    const toggleIsEditHandler = (title, description, toggle = true) => {
        setIsEdit(toggle);
        if (valueTitle !== title) {
            setTitleHandler(title);
        }
        if (valueDescription !== description) {
            setDescriptionHandler(description);
        }
    };

    const submitHandler = (ev) => {
        ev.preventDefault()
        const data = {
            name: valueTitle,
            description: valueDescription,
            groupId,
            ...(parameters && { parameters })
        }
        dispatch(editGroup(data))
        setIsEdit(false)
    }
    
    useEffect(() => {
        if (!userInfo?.nickname) {
            dispatch(
                fetchUserInfo(navigate)
            );
        }
    }, []);

    useEffect(() => {
        if (userInfo?.groups && groupsInfo.length > 0) {
            const groupFromState = groupsInfo.find(({ id }) => id === groupId);
            
            if (groupFromState) {
                setGroupInfo({ group: groupFromState, isFullInfo: true });
                const groupFromUser = userInfo?.groups?.find(vl => vl?.group?._id === groupId);
                setRole(groupFromUser.role);
                return;
            }
        }

        const groupFromUser = userInfo?.groups?.find(vl => vl?.group?._id === groupId);

        if (groupFromUser) {
            dispatch(getGroupInfo(groupId, navigate));
            
            setRole(groupFromUser.role)
            setTitleHandler(groupFromUser.group.name)
            setDescriptionHandler(groupFromUser.group.description)
            return;
        }

        const fetchData = async () => {
            try {
                const group = await searchGroup(groupId);
                
                if (!group.data[0]?._id) {
                    console.error('Group not found');
                    navigate('/profile');
                    return;
                }
                setGroupInfo({ group: group[0], isFullInfo: false });
            } catch (error) {
                console.error('Error fetching group:', error);

            }
        };

        fetchData();
    }, [userInfo, groupInfo.id, groupInfo.length, groupsInfo, groupId, dispatch]);

    
    if (!userInfo?.nickname || !groupInfo?.group?.id) {
        return <div>Loading...</div>;
    }

    const { group } = groupInfo;
    
    const { users } = group;
    console.log(group, users);
    
    

    const isAdmin = role === roleEnum.ADMIN_ROLE;

    const deleteGroupHandler = async () => {
        const response = isAdmin
            ? await deleteGroup(groupId)
            : await leaveGroup(groupId);
        if (response.ok) {
            navigate('/profile');
            dispatch(fetchUserInfo(navigate));
            dispatch(getGroupInfo(groupId, navigate));
        }
    }

    
    
    const isPrivate = groupInfo?.type === 'private';
    return (
        <div className={classes.content}>
            <HeaderImg />
            <div className={classes.container}>
                <Button typeColor='green' beforeImg='chevron' className={classes.btn} onClick={() => navigate(-1)}>Назад</Button>
                <div className={classes.groupInfoBox}>
                    <AvatarImg size={'large'} src={group.avatar}></AvatarImg>
                    <div className={classes.groupInfo}>
                        {!isEdit 
                            ?<h1>{group.name}</h1>
                            : <div>
                                <Input
                                    value={valueTitle}
                                    onChange={titleChangeHandler}
                                    onBlur={titleBlurHandler}
                                    inputClassName={classes.inputTitle}
                                />
                                {showErrorMsg(arrayErrorTitle, classes.errorMsg)}
                            </div>
                        }
                        <div className={classes.buttonBox}>
                            <div className={classes.groupInfoBtn}>
                                <img src={buttonsImages[isPrivate ? 'LockClose-pink' : 'lockOpen-green']}></img>
                                {group.type}
                            </div>
                            <div className={`${classes.groupInfoBtn} ${classes.green}`}>
                                <img src={buttonsImages['people-green']}></img>
                                {group.userCount}/{group.parameters.usersLimit}
                            </div>
                        </div>
                        {!isEdit 
                            ? <p>Опис: {group.description}</p>
                            : <div>
                                <Textarea
                                    value={valueDescription}
                                    onChange={descriptionChangeHandler}
                                    onBlur={descriptionBlurHandler}
                                    inputClassName={classes.inputDescription}
                                />
                                {showErrorMsg(arrayErrorDescription, classes.errorMsg)}
                            </div>
                        }
                        <div className={classes.buttonBox}>
                            {!isEdit
                                ? <Button
                                    onClick={() => deleteGroupHandler()}
                                >{isAdmin ? 'Видалити групу' : 'Вийти з группи'}</Button>
                                : <Button
                                    onClick={() => toggleIsEditHandler(
                                        group.name,
                                        group.description,
                                        false,
                                    )}
                                >Скасувати</Button>
                            }
                            {isAdmin && <>
                                {!isEdit
                                ? <Button
                                    typeColor='green'
                                    onClick={() => toggleIsEditHandler(
                                        group.name,
                                        group.description
                                )}
                                >Редагувати</Button>
                                : <div className={classes.buttonBox}>
                                    <Button
                                        typeColor='green'
                                        onClick={() => onModalOpenHandler()}
                                    >Налаштувати параметри группи</Button>
                                    <Button
                                        typeColor='green'
                                        onClick={submitHandler}
                                    >Застосувати</Button>
                                </div>
                            }</>}
                        </div>
                    </div>
                </div>
                <div className={classes.userBox}>
                    <p>Учасники групи: {group.userCount}</p>
                    <div className={classes.users}>
                        {users.map((user) => <UserCard id={userInfo.id} userInfo={user} ifSelf={user.user._id === userInfo._id}/>)}
                    </div>
                </div>
            </div>
            {isModal && <ModalEditParameters
                modalClose={onModalCloseHandler}
                parameters={group.parameters}
                parametersHandler={parametersChangeHandler}
            />}
        </div>
    );
};

export default GroupInfo;