import { useEffect, useState } from "react";
import request from "../server/request";
import BoardType from "../types/board";
import { useNavigate } from "react-router-dom";
import useBoard from "../store/board";

const BoardsPage = () => {
  const { joinBoard } = useBoard()
  const navigate = useNavigate()

  const [boards, setBoards] = useState<BoardType[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("hello");

      const { data } = await request.post('boards', { name, description });
      console.log('Board created:', { data });
      navigate("/board");
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };


  useEffect(() => {
    const getBoards = async () => {
      try {
        const { data } = await request.get("boards");
        setBoards(data)
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    getBoards()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Board Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description (optional):
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Create Board</button>
      </form>
      <h2>Select a Board to Join</h2>
      <ul>
        {boards.map((board: BoardType) => (
          <li key={board._id}>
            {board.name} - <button onClick={() => joinBoard(board._id, navigate)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BoardsPage