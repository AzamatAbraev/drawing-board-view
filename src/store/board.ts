import { NavigateFunction } from "react-router";
import { create } from "zustand";
import socket from "../server/socket";
import request from "../server/request";
import BoardType from "../types/board";
import { message } from "antd";

interface BoardState {
  boardId: string;
  username: string;
  board: Record<string, never>;
  boards: BoardType[];
  loading: boolean;

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
  loading: false,

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
      message.success("Board created successfully");
      get().getAllBoards();
    } catch (error) {
      message.error("Error: Please try again or contact IT department");
    }
  },
  getAllBoards: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("boards");
      set({ boards: data });
    } catch (error) {
      message.error(
        "Server error: please try again later or contact IT department",
      );
    } finally {
      set({ loading: false });
    }
  },
  getSingleBoard: async (id) => {
    if (id) {
      try {
        const { data } = await request.get(`boards/${id}`);
        set({ board: data });
      } catch (error) {
        message.error("Error: please try again later or contact IT department");
      }
    }
  },
}));

export default useBoard;
