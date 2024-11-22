const http = require('http');
const webSocketServer = require('websocket').server;

let connections = [];

const httpServer = http.createServer()

const websocket = new webSocketServer({
    httpServer: httpServer,
});


httpServer.listen(8080, () => {
    console.log('Server is running on port 8080');
});

websocket.on('request', (request) => {
    const connection = request.accept(null, request.origin);

    connection.on('message', (message) => {

        connections.forEach(c => {
            c.send(`User ${connections.indexOf(c)} says: ${message.utf8Data}`);
        });
    });

    connections.push(connection);

    connections.forEach(c => {
        c.send(`User ${connection.remoteAddress} has connected`);
    });
});