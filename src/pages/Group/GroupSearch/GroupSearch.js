import GroupCard from '../../../UI/GroupCard/GroupCard';
import HeaderImg from '../../../UI/HeaderImg/HeaderImg';
import classes from './GroupsSearch.module.scss';

import searchIcon from '../../../static/image/inputIcons/searchIcon.svg'
import Button from '../../../UI/Button/Button';
import NotFoundGroups from '../../../components/Group/NotFoundGroups/NotFoundGroups';
import { useNavigate } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import validateFn from '../../../constants/validateFn.enum';
import Input from '../../../UI/Input/Input';
import { showErrorMsg } from '../../../error/error.validate.msg';
import { useEffect, useState } from 'react';
import { searchGroups } from '../../../api/groupFetch';
import { useDispatch, useSelector } from 'react-redux';

import urlEnum from '../../../constants/urlEnum';
import { fetchUserInfo, getFetch } from '../../../redux/actions/auth-actions';

const GroupsCards = ({ groups, userGroups }) => {
    const groupIds = userGroups.map((verificate) => verificate.group.id);
    
    return <div className={classes.groupsBox}>
        {groups.map((group, index) => 
        <GroupCard
            id={group._id}
            key={index}
            title={group.name}
            description={group.description}
            status={group.type}
            usersCount={group.userCount}
            maxCount={group.parameters.usersLimit
            }
            type = 'add'
            isView={groupIds.includes(group._id)}
        />)}
    </div>
}

const GroupSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);

    let {
        value: valueGroup,
        isValidInput: isValidGroup,
        arrayError: arrayErrorGroup,
        valueChangeHandler: groupChangeHandler,
        inputBlurHandler: groupBlurHandler,
    } = useInput(validateFn.isNotEmptyFn, 'Group');

    const [groupNameInfo, setGroupNameInfo] = useState({ value: '', length: 0 });
    const [groupsInfo, setGroupsInfo] = useState([]);

    const changeGroupNameInfoHandler = (value) => setGroupNameInfo({ value, length: value.length })

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo?.nickname) {
            dispatch(fetchUserInfo(navigate))
                .then(() => setLoading(false))
                .catch((err) => {
                    console.error(err);
                    setError('Failed to load user information.');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [dispatch, navigate, userInfo?.nickname]);

    useEffect(() => {
        const isNotFound = !groupsInfo.length && groupNameInfo.length > 5
        if (groupNameInfo.length < 3 || isNotFound) {
            return;
        }
        const getData = async (groupName) => {
            try {
                const { data: { data = [] }, ok } = await searchGroups(groupName);

                if (ok) {
                    setGroupsInfo(data);
                }
            } catch (error) {
                console.error('Error fetching group:', error);
            }
        };
        getData(groupNameInfo.value)
    }, [groupNameInfo])
    return (
        <div className={classes.content}>
            <HeaderImg/>
            <div className={classes.container}>
                <h1>Пошук группи</h1>
                <div className={classes.searchBox}>
                    <img src={searchIcon} alt='search'></img>
                    <Input
                        name='search'
                        className={classes.searchInput}
                        placeholder="Введіть Назву группи"
                        value={valueGroup}
                        onChange={(e) => {
                            groupChangeHandler(e)
                            changeGroupNameInfoHandler(e.target.value)
                        }}
                        onBlur={groupBlurHandler}
                    />
                    {showErrorMsg(arrayErrorGroup, classes.errorMsg)}
                </div>
                {groupsInfo.length
                    ? <GroupsCards groups={groupsInfo} userGroups={userInfo.groups}/>
                    : groupNameInfo.length > 2
                    && <NotFoundGroups/>
                }
                <div className={classes.buttonBox}>
                    <Button onClick={() => navigate('/groups/edit')}>Створити групу</Button>
                </div>
            </div>
        </div>
    );
};

export default GroupSearch;