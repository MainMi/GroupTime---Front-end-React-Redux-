import classes from './AboutPage.module.scss'
import HeaderImg from "../../UI/HeaderImg/HeaderImg";
import logoIcon from '../../static/image/globalcons/logo.svg'
import ContactInfo from '../../components/About/ContantInfo/ContactInfo';
import Calendar from '../../UI/Calendar/Calendar';
import Button from '../../UI/Button/Button';


const AboutPage = () => {
    const resultFn = (vl) => console.log(vl);
    return <>
    <HeaderImg/>
    <div className={classes.content}>
        <div className={classes.gridBox}>
        <div className={classes.aboutBox}>
            <div className={classes.imgBox}>
                <img src={logoIcon} alt='Logo'></img>
            </div>
            <div className={classes.textBox}>
                <h1>GroupTime</h1>
                <p><span>GroupTime</span> - це не просто платформа для організації розкладу та спілкування, це ціла екосистема можливостей, що надає користувачам безмежні можливості для спільної діяльності.</p>

                <p>Кожен користувач може налаштовувати свій особистий простір, використовуючи ряд функціональних інструментів, що полегшують організацію подій та спільність. За допомогою інтуїтивно зрозумілих інструментів, користувачі можуть додавати оголошення, створювати завдання, обмінюватися новинами та багато іншого.</p>

                <p>GroupTime пропонує широкий спектр можливостей для командної роботи, дозволяючи вам взаємодіяти з вашими колегами чи друзями у найефективніший спосіб. Все це з метою створення затишного та продуктивного середовища для досягнення ваших цілей та планів.</p>

                <p>За допомогою GroupTime, кожен день може бути заповнений новими можливостями, де ви зможете долучити себе до захоплюючих проектів та подій. Приєднуйтеся до нас і давайте разом створимо спільноту, що надихає та розвиває!</p>
            </div>
        </div>
        {/* <div className={classes.teamBox}>
            <h2>Наша Команда</h2>
            <div className={classes.teamGrid}>
                <ContactInfo teamName='Mykyta' isContact={true}/>
                <ContactInfo teamName='Maxim' isContact={true}/>
                <ContactInfo teamName='Anna' isContact={true}/>
                <ContactInfo teamName='Uliana' isContact={true}/>
            </div>
        </div> */}
        </div>
    </div>
    </>
}

export default AboutPage;