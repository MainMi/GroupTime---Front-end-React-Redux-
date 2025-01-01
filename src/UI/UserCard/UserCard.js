import { useDispatch } from 'react-redux';
import verificateType from '../../constants/type/verificateTokenEnum';
import AvatarImg from '../AvatarImg/AvatarImg';
import ButtonSmall from '../Button/ButtonSmall';
import classes from './UserCard.module.scss'
import { deleteInviteGroup, getGroupInfo } from '../../api/groupFetch';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalChat from '../../components/Group/ModalChat/ModalChat';

const UserCard = ({ userInfo, ifSelf }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, role, id, actionToken, groupId } = userInfo;
    const isVerificate = userInfo.type === verificateType.VERIFIED_TYPE;

    const modalToggleHandler = () => setIsModalOpen(!isModalOpen)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deleteInviteGroupHandler = async () => {
        await deleteInviteGroup(actionToken);
        dispatch(getGroupInfo(groupId, navigate));
    };
    return (
        <div className={`${classes.userCard } ${!isVerificate ? classes.notVerify : ''}`} id={id}>
            <AvatarImg size={'small'}></AvatarImg>
            <div className={classes.userInfo}>
                <h3>{user.fullName}<span className={classes.nickname}>(@{user.nickname})</span></h3>
                <div className={classes.userStatus}>
                    <img></img>
                    <div>{userInfo.role}</div>
                </div>
                
            </div>
            {!ifSelf && <ButtonSmall className={classes.btn} centerImg={'message'} onClick={() => modalToggleHandler()} />}
            {isModalOpen && <ModalChat modalClose={modalToggleHandler} connectUserId={user._id} />}
            {!isVerificate && actionToken && <ButtonSmall className={classes.btn}
                    onClick={() => deleteInviteGroupHandler()}
                    centerImg={'close'}
                />}
            
        </div>
    );
};

export default UserCard;