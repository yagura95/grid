import { Socket } from "socket.io";

export function authentication(socket: Socket, next: any) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication token required"));
  }

  try {
    // Validation logic
    // Not a normal/correct way to it, but since there is no login panel
    // this was a simple way to show I can implement it
    if (token !== process.env.TOKEN) new Error("Invalid token");
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}
