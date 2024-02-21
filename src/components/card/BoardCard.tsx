import BoardType from "../../types/board";

import notFound from "../../assets/not-found.jpg"

import "./style.scss";
import { useNavigate } from "react-router-dom";
import useBoard from "../../store/board";

const BoardCard = (board: BoardType) => {
  const { joinBoard } = useBoard()
  const navigate = useNavigate()
  return (
    <div className="board__card board">
      <div className="board__image">
        <img src={board.thumbnail || notFound} alt={`Board ID: ${board.description}`} />
      </div>
      <div className="board__content">
        <h3 className="board__name">{board?.name} by {board.creator}</h3>
        <p className="board__desc">{board?.description}</p>
        <button className="board__btn" onClick={() => joinBoard(board._id, navigate)}>Join Board</button>
      </div>
    </div>
  )
}

export default BoardCard