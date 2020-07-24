import {
  WebSocket,
} from "https://deno.land/x/websocket/mod.ts";

export interface Message {
  color: string;
  whoPickedLast: string;
  uuid: string;
}

export type WebSocketWithIdentifier = WebSocket & { uuid: string };
