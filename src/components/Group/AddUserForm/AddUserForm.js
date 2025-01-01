import { useEffect, useRef, useState } from 'react';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import SearchDropdown from '../../../UI/Dropdown/SearchDropdown';
import ButtonSmall from '../../../UI/Button/ButtonSmall';
import roleEnum from '../../../constants/roleEnum';
import { searchUsers } from '../../../api/userFetch';
import classes from './AddUserForm.module.scss';

const AddUserForm = ({
    onAddUser,
    readyAddUsers,
    navigate,
    editUser
}) => {
    const [userInfo, setUserInfo] = useState('');
    const [role, setRole] = useState('');
    const [userNameInfo, setUserNameInfo] = useState({
        value: '',
        length: 0,
        isFound: false
    });
    const [searchVal, setSearchVal] = useState(null);
    const [usersInfo, setUsersInfo] = useState([]);

    const changeRoleHandler = (value) => setRole(value);

    const changeUserNameInfoHandler = (foundValue = '', value = '') => {
        setUserNameInfo({
            value: foundValue || value,
            length: value.length,
            isFound: !!foundValue?.id
        });
    };

    const readyAddUsersIds = readyAddUsers.map(({user}) => user.id);

    const dropdownResetRef = useRef(null);
    const searchDropdownResetRef = useRef(null);

    useEffect(() => {
        if (!editUser) {
            return;
        }
        const { user } = editUser.user;
        
        setUserNameInfo({
            value: user,
            length: 4,
            isFound: true
        });
        setUserInfo(user)
        setSearchVal(user.fullName)
        
    },  [editUser])

    useEffect(() => {
        const fetchUsers = async (userName) => {
            try {
                let { data: { data = [] }, status } = await searchUsers(userName, navigate);
                if (status !== 200) {
                    throw new Error(data)
                }
                
                data = data.length ? data.filter((user) =>
                        !readyAddUsersIds.includes(user.id)
                ) : []
                setUsersInfo(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (userNameInfo.isFound) {
            setUserInfo(userNameInfo.value);
        } else if (userNameInfo.length >= 3) {
            fetchUsers(userNameInfo.value);
        }
    }, [userNameInfo, navigate]);

    const isValidSubmit = userNameInfo.isFound && role.length;
    

    const clickAddUserHandler = (event) => {
        event.preventDefault();
        if (!isValidSubmit) return;
        
        onAddUser({ user: userNameInfo.value, role });
        setUsersInfo([])
        setUserNameInfo({ value: '', length: 0, isFound: false });
        setRole('');
        setSearchVal(null);
        dropdownResetRef.current();
        searchDropdownResetRef.current();
    };
    

    return (
        <div className={classes.addUsersForm} >
            <div className={classes.inputBox}>
                <label>Fullname користувача</label>
                <SearchDropdown
                    placeholder="Введіть Fullname користувача"
                    handleChange={changeUserNameInfoHandler}
                    options={usersInfo}
                    isUserFind
                    selectedVal={userInfo}
                    setVal={searchVal}
                    resetFn={(reset) => searchDropdownResetRef.current = reset}
                />
            </div>
            <div className={classes.inputBox}>
                <label>Роль користувача</label>
                <Dropdown
                    changeValueHandler={changeRoleHandler}
                    classNameButton={classes.dropdown}
                    color="pink"
                    borderRadius={5}
                    defaultIndex={0}
                    label="Select"
                    arrValue={Object.values(roleEnum)}
                    resetFn={(reset) => dropdownResetRef.current = reset}
                />
            </div>
            <ButtonSmall centerImg="plus" isDisable={!isValidSubmit} onClick={clickAddUserHandler} />
        </div>
    );
};

export default AddUserForm;
