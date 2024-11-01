import classes from './GroupCard.module.scss'
import ButtonSmall from "../Button/ButtonSmall";
import buttonsImages from '../../static/image/buttonIcons';
import AvatarImg from '../AvatarImg/AvatarImg';
import { useNavigate } from 'react-router-dom';
import { acceptInviteGroup, deleteInviteGroup } from '../../api/groupFetch';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/actions/auth-actions';

const GroupCard = ({
    id, 
    actionToken = '',
    avatar = null,
    title,
    description,
    status,
    statusName = status,
    usersCount,
    maxCount,
    type = 'view',
    isVerificate = true
}) => {

    const navigate = new useNavigate();

    const isView = type === 'view';
    const isPrivate = status === 'private';
    const isMaxGroups = usersCount === maxCount;
    const dispatch = useDispatch();

    const submitInviteGroup = async (isAccept = true) => {
        const response = isAccept
            ? await acceptInviteGroup(actionToken)
            : await deleteInviteGroup(actionToken)
        dispatch(fetchUserInfo(navigate))
    }
    return <div className={`${classes.content} ${!isVerificate ? classes.notVerificate : ''}`}>
        <div className={classes.groupInfo}>
            <div className={classes.infoBox}>
                <div className={classes.imgBox}>
                    <AvatarImg size={'small'} src={avatar}/>
                </div>
                <div className={classes.info}>
                    <h3>{title}</h3>
                    <div className={`${classes.statusBox} ${isPrivate ? classes.private : ''}`}>
                        <div className={classes.imgBox}>
                            <img src={buttonsImages[isPrivate ? 'lockClose' : 'lockOpen']} alt='lockClose'></img>
                        </div>
                        <div className={classes.status}>{statusName.charAt(0).toUpperCase() + statusName.slice(1)}</div>
                    </div>
                </div>
                <p className={classes.description}>{description}</p>
            </div>
        </div>
        <div className={classes.groupNavigation}>
            <img></img>
            <p className={classes.userCount}>{usersCount}/{maxCount}</p>
            {isVerificate ? <ButtonSmall
                onClick={() => navigate(`/groups/info/${id}`)}
                typeColor={isView ? "green" : "darkGreen"}
                className={isView ? classes.goToButton : classes.addButton}
                centerImg={isView ? 'chevron' : 'plus'}
            /> :
            <div className={classes.buttonBox}>
                <ButtonSmall
                    onClick={() => submitInviteGroup()}
                    centerImg={'check'}
                    typeColor='green'
                    isDisable={isMaxGroups}
                />
                <ButtonSmall
                    onClick={() => submitInviteGroup(false)}
                    centerImg={'close'}
                />
            </div>}

        </div>
    </div>
}

export default GroupCard;