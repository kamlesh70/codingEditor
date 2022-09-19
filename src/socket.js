import { io } from "socket.io-client";

export const initSocket = async () => {
  console.log("this is called");
  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 1000,
    transport: ["websocket"],
  };
  return io(process.env.REACT_APP_BACKEND_URL, options);
};
