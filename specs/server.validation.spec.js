import jsc from "jsverify";
import * as arbMessage from "./arbitraries/message";
import * as api from "../lib/api";
import * as assert from "assert";


function checkArray(value) {
    return Array.isArray(value) ? true : value;
}

const passThroughFailure = JSON.stringify;

describe('Message Validation', () => {

    jsc.property("happy messages validate",
        arbMessage.message,
        msg => api.validateMessage(msg).fold(passThroughFailure, ()=> true));

    describe('to, cc, bcc transformation', () => {
        jsc.property("Valid messages have to: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).fold(
                passThroughFailure,
                ({to:value}) => checkArray(value)
                ));

        jsc.property("Valid messages have cc: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).fold(
                passThroughFailure,
                ({cc:value}) => checkArray(value)
            ));
        jsc.property("Valid messages have bcc: array of addresses",
            arbMessage.message,
            msg => api.validateMessage(msg).fold(
                passThroughFailure,
                ({bcc:value}) => checkArray(value)
            ));
    });

    it("should require 'to'/'subject/'body'", () =>
        api.validateMessage({ to: null, bcc: ["nick@here.com"], body: null, subject: null}).fold(
            f => assert.deepEqual(f, {to: 'required', body: 'required' ,subject: 'required'}),
            s => assert.fail(`${s}, Should not have validated`)
        )
    );

    jsc.property("invalid messages don't validate",
        arbMessage.badMessageSpec,
        (spec) => api.validateMessage(spec.badMsg).fold(()=> true, passThroughFailure));

});
