import {
    validateArrayElements,
    allOfValidator,
    validateIsNonEmptyString,
    validateIsNotNull,
    validateIsNull,
    validateIsArray,
    validateIsLengthGreaterThan,
    anyOfValidator, validateObjectWithConstraints
} from 'folktale-validations';
import {validateIsEmail} from "./validator-email";
import Validation from "folktale/validation";
import ono from "ono";

const {Failure} = Validation;

let validateEmail =
    allOfValidator(
        [
            validateIsNotNull,
            validateIsNonEmptyString,
            validateIsEmail
        ]);

let validateEmailList = minSize =>
    allOfValidator([
        validateIsArray,
        validateArrayElements(validateIsNotNull),
        validateArrayElements(validateEmail),
        validateIsLengthGreaterThan(minSize - 1)
    ]);

let toFieldValidator = allOfValidator(
    [
        validateIsNotNull,
        anyOfValidator(
            [
                validateEmailList(1),
                x => validateEmail(x)
            ]
        )

    ]
);
let optionalEmailListFieldValidator = anyOfValidator(
    [
        validateIsNull,
        validateEmailList(0)
    ]);
let pureArray = a => Array.isArray(a) ? a : a != null ? [a] : [];

const messageConstraints = {
    fields: [
        {
            name: 'to',
            isRequired: true,
            validator: toFieldValidator,
            transformer: pureArray,
        },
        {
            name: 'cc',
            validator: optionalEmailListFieldValidator,
            transformer: pureArray
        },
        {
            name: 'bcc',
            validator: optionalEmailListFieldValidator,
            transformer: pureArray
        },
        {
            name: 'body',
            validator: validateIsNonEmptyString,
            isRequired: true
        },
        {
            name: 'subject',
            isRequired: true,
            validator: validateIsNonEmptyString
        }
    ]
};

const messageValidation = validateObjectWithConstraints(messageConstraints);
export const validateMessage = msg => {
    try {
        return messageValidation(msg);
    } catch (e) {
        if (e.message.startsWith("[validator]")) {
            return Failure([e.message]);
        } else {
            throw ono(e, "Error validating message");
        }

    }
};


