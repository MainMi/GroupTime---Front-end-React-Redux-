import classes from './MessageList.module.scss'
import logo from '../../../static/image/globalcons/logo.svg'
import messageEnum from '../../../constants/type/messageEnum';

const MessageList = ({ messages }) => {
    
    return <div className={classes.messageList}>
        {messages.map((vl) => <div className={`${classes.message} ${vl.type === messageEnum.ASSISTANT_MSG_TYPE ? classes.ai : ''}`} key={vl._id}>
            <img className={classes.image} src={logo} alt='avatar' />
            <div className={classes.messageBox}>{vl.content}</div>
        </div>)}
    </div>
}
export default MessageList;