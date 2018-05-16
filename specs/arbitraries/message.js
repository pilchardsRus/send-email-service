import jsc from "jsverify";

const emailAddress = jsc.constant("nick@test.domain");
const emailAddressList = jsc.array(emailAddress);
const nonEmptyEmailAddressList = jsc.nearray(emailAddress);
let optional = gen => jsc.oneof([jsc.constant(null), gen]);
const badEmailAddress = optional(jsc.constant("name"));

export const message = jsc.record(
    {
        to: jsc.oneof([emailAddress, nonEmptyEmailAddressList]),
        cc: optional(emailAddressList),
        bcc: optional(emailAddressList),
        body: jsc.nestring,
        subject: jsc.nestring
    }
);
const emailListProps = jsc.elements(["to", "cc", "bcc"]);
const mandatoryProps = jsc.elements(["to", "body", "subject"]);

let messageLens = key => value => msg => ({...msg, [key]: value});

const badEmailAddressList = jsc.nearray(badEmailAddress);

/*
* smap requires a bijection to work, so we store into a object, and unpack after. Destructuring in ES6 is nice.
* */

let messagesWithBadEmailLists = jsc.tuple([message, emailListProps, badEmailAddressList]).smap(
    ([goodMsg, prop, badList]) => ({goodMsg, badMsg: messageLens(prop)(badList)(goodMsg), prop, badList, reason: `Bad ${prop} list`}),
    ({goodMsg, prop, badList}) => [goodMsg, prop, badList]
);

let messagesWithBadRequiredProps = jsc.tuple([message, mandatoryProps]).smap(
    ([goodMsg, prop]) => ({goodMsg, badMsg: messageLens(prop)(null)(goodMsg), prop, reason: `Null ${prop}`}),
    ({goodMsg, prop}) => [goodMsg, prop]
);

let messageWithBadNonEmptyProps = jsc.tuple([message, jsc.constant("to")]).smap(
    ([goodMsg, prop]) => ({goodMsg, badMsg: messageLens(prop)([])(goodMsg), prop, reason: `Empty ${prop}`}),
    ({goodMsg, prop}) => [goodMsg, prop]
);

export const badMessageSpec = jsc.oneof(
    [
        messagesWithBadEmailLists,
        messagesWithBadRequiredProps,
        messageWithBadNonEmptyProps
    ]);