import { io } from "socket.io-client";

const URL = "https://drawing-board.up.railway.app/api/";
const socket = io(URL);

export default socket;
