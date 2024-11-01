import AvatarImg from '../AvatarImg/AvatarImg';
import classes from './UserCard.module.scss'

const UserCard = ({ userInfo }) => {
    const { user, role, id } = userInfo;
    
    return (
        <div className={classes.userCard} id={id}>
            <AvatarImg size={'small'}></AvatarImg>
            <div className={classes.userInfo}>
                <h3>{user.fullName}</h3>
                <div className={classes.userStatus}>
                    <img></img>
                    <div>{userInfo.role}</div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;