const currentYear = new Date().getFullYear()

const constants = {
    weeksArr: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekFullArr: ['Monday', 'Tuesday', 'Wensday', 'Thuesday', 'Friday', 'Saturday', 'Sunday'],
    monthArr: [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    shortMonthArr: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    currentYear,
    minBirthdayYear: currentYear - 100,
    maxBirthdayYear: currentYear - 14,
    defaultTimesheet: 60
};

export default constants;
