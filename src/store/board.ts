import { NavigateFunction } from "react-router";
import { create } from "zustand";
import socket from "../server/socket";
import request from "../server/request";
import BoardType from "../types/board";

interface BoardState {
  boardId: string;
  username: string;
  board: Record<string, never>;
  boards: BoardType[];

  joinBoard: (id: string, navigate: NavigateFunction) => void;
  createBoard: (values: {
    name: string;
    description: string;
    creator: string;
  }) => void;
  getAllBoards: () => void;
  getSingleBoard: (id: string | undefined) => void;
}

const useBoard = create<BoardState>()((set, get) => ({
  boardId: "",
  username: "",
  board: {},
  boards: [],

  joinBoard: (id, navigate) => {
    if (id) {
      set({ boardId: id });
      socket.emit("join_room", id);
      navigate(`/board/${id}`);
      localStorage.setItem("BOARD_ID", id);
    }
  },
  createBoard: async (values) => {
    try {
      const { data } = await request.post("boards", values);
      set({ username: data.creator, boardId: data.id });
      get().getAllBoards();
    } catch (error) {
      console.log(error);
    }
  },
  getAllBoards: async () => {
    try {
      const { data } = await request.get("boards");
      set({ boards: data });
    } catch (error) {
      console.log(error);
    }
  },
  getSingleBoard: async (id) => {
    if (id) {
      try {
        const { data } = await request.get(`boards/${id}`);
        set({ board: data });
      } catch (error) {
        console.log(error);
      }
    }
  },
}));

export default useBoard;
