import {Right as right, Left as left, Try, Some as some} from "funfix";
import * as P from "ramda-adjunct"; //some common predicates
import * as R from "ramda";
import * as V from "partial.lenses.validation";
import * as L from "partial.lenses";
import {validateIsEmailV as isEmail} from "./validator-email";
import ono from "ono";

let validateEmail =
    V.cases(
        [P.isNull, V.rejectAs("cannot be null")],
        [V.and(
            P.isNonEmptyString,
            isEmail)]
    );

let validateEmailList = minSize =>
    V.and(
        P.isArray,
        V.arrayId(validateEmail),
        P.lengthGte(minSize)
    );

let pureArray = a => Array.isArray(a) ? a : a != null ? [a] : [];
let requiredString = V.cases(
    [R.isNil, V.rejectAs("required")],
    [P.isNonEmptyString, V.accept]);

let possiblyEmptyListOfEmailAddresses = V.or(V.modifyAfter(R.isNil, pureArray), validateEmailList(0));
export const messageV = V.props(
    {
        to: V.cases(
            [R.isNil, V.rejectAs("required")],
            [Array.isArray, validateEmailList(1)],
            [V.modifyAfter(validateEmail, pureArray)]),
        cc: possiblyEmptyListOfEmailAddresses,
        bcc: possiblyEmptyListOfEmailAddresses,
        body: requiredString,
        subject: requiredString
    });

const extractErrors = R.curry(L.get)('errors');

const tryValidateMessage = (msg) =>
    Try.of(() => V.validate(messageV, msg))
        .map(right)
        .recoverWith(
            e =>
             some(extractErrors(e))
                .fold(
                    () => Try.failure(ono(e, "Error validated message")),
                    R.pipe(left, Try.success)
            )
        );

export const validateMessage = msg =>
    tryValidateMessage(msg).get();


