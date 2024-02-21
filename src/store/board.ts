import { NavigateFunction } from "react-router";
import { create } from "zustand";
import socket from "../server/socket";

interface BoardState {
  boardId: string;
  username: string;

  joinBoard: (id: string, navigate: NavigateFunction) => void;
}

const useBoard = create<BoardState>()((set) => ({
  boardId: "",
  username: "",

  joinBoard: (id, navigate) => {
    if (id) {
      set({ boardId: id });
      socket.emit("join_room", id);
      localStorage.setItem("BOARD_ID", id);
    }

    navigate("/board");
  },
}));

export default useBoard;
