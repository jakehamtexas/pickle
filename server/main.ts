import {
  WebSocketServer,
  WebSocket,
} from "https://deno.land/x/websocket/mod.ts";
import { v1 } from "https://deno.land/std/uuid/mod.ts";
const { generate: generateUuid } = v1;

import { WebSocketWithIdentifier, Message } from "./types.ts";

/// TODO: Add environment variable for port?
const webSocketServer = new WebSocketServer(8080);

const sendUuid = (webSocket: WebSocketWithIdentifier) =>
  () => {
    const uuidMessage = JSON.stringify({ uuid: webSocket.uuid });
    webSocket.send(uuidMessage);
  };

const parseMessage = (message: string) => JSON.parse(message) as Message;
const shareColorAndNameMessage = (webSocketServer: WebSocketServer) =>
  (message: string) => {
    const { uuid } = parseMessage(message);
    const clients = Array.from(webSocketServer.clients);
    clients.map((client: WebSocket) => client as WebSocketWithIdentifier)
      .filter((client: WebSocketWithIdentifier) => !client.isClosed)
      .filter((
        client: WebSocketWithIdentifier,
      ) => client.uuid !== uuid).forEach((
        client: WebSocketWithIdentifier,
      ) => client.send(message));
  };

webSocketServer.on("connection", (ws: WebSocket) => {
  const uuid = { uuid: generateUuid().toString() };

  const uuidMessage = JSON.stringify(uuid);

  ws.send(uuidMessage);
  Object.assign(ws, uuid);

  ws.on("open", sendUuid(ws as WebSocketWithIdentifier));
  ws.on("message", shareColorAndNameMessage(webSocketServer));
});
