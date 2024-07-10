import WebSocket from 'ws';


export interface iwebsocket extends WebSocket{
    id:string
}
interface WebSocketClients extends Set<iwebsocket> {
    id?:string
}
export interface iwebsocketServer extends WebSocket.Server {
    clients: WebSocketClients
}


