// src/pages/ProfilePage/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from '../../redux/actions/auth-actions';
import { authAction } from '../../redux/slices/auth-slice';

import Button from '../../UI/Button/Button';
import GroupCard from '../../UI/GroupCard/GroupCard';
import HeaderImg from '../../UI/HeaderImg/HeaderImg';
import buttonsImages from '../../static/image/buttonIcons';
import contactImages from '../../static/image/contactsIcons';
import classes from './ProfilePage.module.scss';
import NotFoundGroups from '../../components/Group/NotFoundGroups/NotFoundGroups';
import AvatarImg from '../../UI/AvatarImg/AvatarImg';
import verificateType from '../../constants/type/verificateTokenEnum';

const GroupsCards = ({ userGroups, checkInvite = false }) => {
    return userGroups.map((groupInfo) => {
        const { group } = groupInfo;
        let isVerificate = false
        if (checkInvite) {
            isVerificate = !groupInfo.actionToken && groupInfo.type === verificateType.VERIFIED_TYPE
        }
        return (<GroupCard
            key={groupInfo._id}
            id={group._id}
            title={group.name}
            description={group.description}
            status={groupInfo.type}
            usersCount={group.userCount}
            maxCount={group.parameters.usersLimit}
            statusName={groupInfo.role}
            isVerificate={isVerificate}
            actionToken={groupInfo.actionToken}
        />)
    }
    );
}

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo?.nickname) {
        return null;
    }

    const userGroups = userInfo.groups;
    const userContacts = userInfo.contacts;;

    const hasContactInfo = Object.values(userContacts).some((contactValue) => contactValue);

    const getAge = (dateString) => { 
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const userAge = getAge(userInfo.birthday);

    const handleLogout = () => {
        dispatch(authAction.logOutAuth());
        navigate('/sign?mode=signIn');
    };

    return (
        <div>
            <HeaderImg position={'absolute'} />
            <div className={classes.content}>
                <div className={classes.userBox}>
                    <AvatarImg size={'large'} />
                    <div className={classes.userInfo}>
                        <h1>{userInfo.fullName}</h1>
                        <div className={classes.userNickname}>{userInfo.nickname}</div>
                        <div className={classes.contactInfoMain}>
                            <Button beforeImg={contactImages.gmail} padding={'4px 16px'}>
                                {userInfo.email}
                            </Button>
                            <Button beforeImg='edit' padding={'4px 16px'}>
                                Вік: {userAge}
                            </Button>
                            {userInfo.phone && (
                                <Button beforeImg={contactImages.phone} padding={'4px 16px'}>
                                    {userInfo.phone}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.userContact}>
                    {hasContactInfo && <p>Про себе:</p>}
                    {Object.entries(userContacts).map(([contactType, contactValue]) => (
                        contactValue && (
                            <div key={contactType} className={classes.contactBox}>
                                <img src={contactImages[contactType.toLowerCase()]} alt={contactType} />
                                <div>{contactValue}</div>
                            </div>
                        )
                    ))}
                </div>
                <div className={classes.groupsBox}>
                    <h4>Группи ({userInfo?.groupCount}/5):</h4>
                    {userGroups.length ? (
                        <GroupsCards userGroups={userGroups} checkInvite={true}/>
                    ) : (
                        <NotFoundGroups className={classes.notFoundGroups} />
                    )}
                </div>
                <div className={classes.buttonBox}>
                    <Button onClick={handleLogout}>Вихід з акаунту</Button>
                    <Button typeColor='green'>Редагувати</Button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
