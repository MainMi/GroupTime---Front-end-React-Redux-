import { capitalizeText } from "../../helper/textHelper";

const groupTypeEnum = {
    PUBLIC_TYPE: 'public',
    PRIVATE_TYPE: 'private',
    STRONG_PRIVATE_TYPE: 'strong private'
};

const groupTypeForDropdown = Object.values(groupTypeEnum).map((role) => ({ title: capitalizeText(role), value: capitalizeText(role)}))

export default groupTypeEnum;
