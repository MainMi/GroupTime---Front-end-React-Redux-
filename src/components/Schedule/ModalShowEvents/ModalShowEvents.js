import buttonsImages from "../../../static/image/buttonIcons";
import Button from "../../../UI/Button/Button";
import Modal from "../../../UI/Modal/Modal";
import classes from './ModalShowEvents.module.scss'

const ModalShowEvents = ({ events, onHiddenCart}) => {
    return <Modal modalClassname={classes.modalContent} onHiddenCart={onHiddenCart}>
        <div className={classes.events}>
        {events && events.map((ev, idx) => {
            const { eventInfo, eventDate, intervalTime
            } = ev;
            
            return (
                <div className={classes.eventInfo} key={eventInfo.name + idx}>
                        <div className={classes.titleBox}>
                            <h4>{eventInfo.name}</h4>
                            <img onClick={() => onHiddenCart()} src={buttonsImages["close-pink"]} alt="close" />
                        </div>
                        <div className={classes.sectionBox}>
                            <label htmlFor='teacher'>Викладач</label>
                            <span>Викладача</span>

                            <label htmlFor='type'>Тип</label>
                            <Button>{eventInfo.type}</Button>

                            <label htmlFor='place'>Місце</label>
                            <span>Онлайн</span>

                            <label htmlFor='platform'>Платформа</label>
                            <span>Zoom</span>

                            <label htmlFor='link'>Посилання</label>
                            <span className={classes.link}>https://google.com</span>

                            <label htmlFor='tag'>Теги</label>
                            <span className={classes.tag}>{eventInfo.tag}</span>
                            <label>Час</label>
                            <span>{intervalTime}</span>
                        </div>
                        <div className={classes.description}>
                            <label htmlFor='tag'>Опис події</label>
                            <span>Опис</span>
                        </div>
                        <div className={classes.buttonBox}>
                            <Button typeColor="red">Видалити</Button>
                            <Button beforeImg="edit" typeColor="green">Редагувати</Button>
                        </div>
                    </div>
            )})
        }
        </div>
        
    </Modal>
}

export default ModalShowEvents;