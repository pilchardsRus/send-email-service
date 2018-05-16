import restify from "restify";


function messageGet(req, res, next){
    next();
}
function messagePost(req, res, next){
    next();
}

export function server(){
    let server = restify.createServer();

    server.post('messages/', messagePost);
    server.get('messages/:id', messageGet);
    return server;
}

function log_startup(server){
    console.log(`${server.serverName} listening at ${server.url}`);
}

// noinspection JSUnusedGlobalSymbols
export function start(options){
    let server = server();
    const { port = 8080, on_start = function(){log_startup(server);}} = options;
    server.listen(
        port,
        on_start
    );
}