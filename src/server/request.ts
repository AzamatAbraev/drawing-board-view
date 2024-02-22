import axios from "axios";

const request = axios.create({
  baseURL: "https://drawing-board.up.railway.app/api/",
  timeout: 10000,
});

export default request;
