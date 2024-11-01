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
import { searchGroup } from '../../../api/groupFetch';

const GroupInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [groupInfo, setGroupInfo] = useState()
    const userInfo = useSelector((state) => state.auth.userInfo)
    console.log(groupInfo);
    
    useEffect(() => {
        if (!userInfo?.nickname) {
            dispatch(
                fetchUserInfo(navigate)
            );
        }
    }, []);

    useEffect(() => {
        if (userInfo?.groups && !groupInfo?._id) {
            const findGroup = userInfo.groups.find((vl) => vl?.group?._id === groupId);
            if (findGroup) {
                setGroupInfo(findGroup.group);
            } else {
                const getData = async (groupId) => {
                    try {
                        const group = await searchGroup(groupId);
                        if (!group[0]?._id) {
                            console.error('Group not found');
                            navigate('/groups')
                        }
                        setGroupInfo(group);
                    } catch (error) {
                        console.error('Error fetching group:', error);
                        navigate('/group')
                    }
                };
                getData(groupId);
            }
        }
    }, [userInfo, groupId]);
    
    if (!userInfo?.nickname || !groupInfo?._id) {
        return <div>Loading...</div>;
    }
    
    const isPrivate = groupInfo?.type === 'private';
    return (
        <div className={classes.content}>
            <HeaderImg />
            <div className={classes.container}>
                <Button typeColor='green' beforeImg='chevron' className={classes.btn} onClick={() => navigate(-1)}>Назад</Button>
                <div className={classes.groupInfoBox}>
                    <AvatarImg size={'large'} src={groupInfo.avatar}></AvatarImg>
                    <div className={classes.groupInfo}>
                        <h1>{groupInfo.name}</h1>
                        <div className={classes.buttonBox}>
                            <div className={classes.groupInfoBtn}>
                                <img src={buttonsImages['LockClose-pink']}></img>
                                private
                            </div>
                            <div className={`${classes.groupInfoBtn} ${classes.green}`}>
                                <img src={buttonsImages['people-green']}></img>
                                {groupInfo.userCount}/{groupInfo.parameters.usersLimit}
                            </div>
                        </div>
                        <p>Опис: Утопія ґрунтується на ідеї, що гроші корумпують владу і знищують справедливість і щастя в суспільстві. Гітлодей зазначає, що навіть найбагатші люди все одно нещасливі.</p>
                        <div className={classes.buttonBox}>
                            <Button>Видалити групу</Button>
                            <Button typeColor='green'>Редагувати</Button>
                        </div>
                    </div>
                </div>
                <div className={classes.userBox}>
                    <p>Учасники групи: {groupInfo.userCount}</p>
                    <div className={classes.usersBox}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupInfo;