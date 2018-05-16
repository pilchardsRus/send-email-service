import jsc from "jsverify";
import * as arbMessage from "./arbitraries/message";
import * as api from "../lib/api";

describe('Messages', () => {
    jsc.property("Validation of happy message",
        arbMessage.message,
        msg => api.validateMessage(msg).matchWith({
            Success: () => true,
            Failure: f => f
        }));
    describe('to, cc, bcc transformation', () => {
        jsc.property("Valid messages have to: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).matchWith({
                Success: ({value}) => Array.isArray(value.to) ? true : value.to,
                Failure: f => f
            }));
        jsc.property("Valid messages have cc: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).matchWith({
                Success: ({value}) => Array.isArray(value.bcc) ? true : value.to,
                Failure: f => f
            }));
        jsc.property("Valid messages have bcc: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).matchWith({
                Success: ({value}) => Array.isArray(value.cc) ? true : value.to,
                Failure: f => f
            }));
    });

    jsc.property("Validation of invalid message",
        arbMessage.badMessageSpec,
        (spec) =>
            api.validateMessage(spec.badMsg).matchWith({
                Success: s => s,
                Failure: () => true,
            }));

});
