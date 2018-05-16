import {predicateValidator, configureRenderers} from 'folktale-validations';
import {constant} from "folktale/core/lambda/index";

const UID = `validateIsEmail`;
const newMessageFunction = constant(`Should be an email address`);
import * as isEmail from 'isemail';

configureRenderers({
    validatorMessages: {
        [UID]: newMessageFunction,
    },
});
let predicate = value => isEmail.validate(value);

export let validateIsEmail = predicateValidator(
    predicate,
    UID);