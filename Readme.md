Approach

We have a HTTP server that validates income JSON payloads, and 
attempts to invoke backend services.

Example backends are: SendMail, MailChimp.

I've chosen node as my platform/blue code.  Since it's been a while 
since I wrote with either, the surface area of SpringBoot is too much
for me to learn in the time.

ES6, while also a learning curve, is more incremental.

### Components:

For incoming http stack, I'm using ```restify``` + ```node```.  This should not be a big 
commitment, as long as it can handle async/non-blocking elements.

For back-pressure, rate limiting, and such, I'm trying ```hystrix``` for 
node. Not sure yet...

For configuration, I'm using the ```config``` npm package

### Testing:

Unit testing with property/generative testing via ```jsverify```  the 
```specs/arbritraries.js``` file contains code to generate well 
formed messages, and then mutate those messages in to bad ones.
The ES6 destructuring syntax makes this quite clean.


### Composition:

I've mostly been following along with fantasy-land typeclasses,
and using folktale as the implementation.  So that means:
  
  + Validation (e.g. Success | Failure ) 
    (applicative only - which led me to folktale-validations, for richer 
    combinators)
  
  + Result (e.g. Ok | Error )
  
  + not using async/await - using fluture instead.
  
### Control flow...

Mostly, we'll be taking requests off 
the REST -api chain, and passing them to the gateway. 

### Exclusions

How much persistence do we need here? - none right now.

How much idempotence?
Do we need to blacklist email addresses?

