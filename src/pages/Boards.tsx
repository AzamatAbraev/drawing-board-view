import { useEffect, useState } from "react";
import BoardType from "../types/board";
import BoardCard from "../components/card/BoardCard";

import plusSign from "../assets/plus-sign.png"

import "./Boards.scss"
import useBoard from "../store/board";

const BoardsPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [creator, setCreator] = useState("")

  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [creatorError, setCreatorError] = useState('');
  const [lengthError, setLengthError] = useState("")

  const validate = () => {
    let isValid = true;
    if (!creator) {
      setCreatorError("Please provide your name");
      isValid = false;
    } else {
      setCreatorError("");
    }

    if (!name) {
      setNameError("Please provide board name");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!description) {
      setDescriptionError("Please provide description");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (description.length > 40 || name.length > 20 || creator.length > 20) {
      isValid = false;
      setLengthError("Input length should not be exceeded")
    } else {
      setLengthError("")
    }

    return isValid;
  }

  const { createBoard, getAllBoards, boards } = useBoard()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      try {
        const values = { name, description, creator }
        await createBoard(values);
        setOpen(false)
      } catch (error) {
        console.error('Error creating board:', error);
      }
    }
  };


  useEffect(() => {
    getAllBoards()
  }, [getAllBoards])

  return (
    <div className="container boards__container">
      <div className="boards__row">
        <div className="boards__new">
          <div className="board__card board">
            <div className="board__image">
              {!open ? <img onClick={() => setOpen(true)} src={plusSign} alt="Add New Board" /> : null}
            </div>
            {open ? <div className="board__content board__add">
              <div className="board__add__header">
                <h2 className="board__add__title">Create your board</h2>
              </div>
              <form id="createBoard" onSubmit={handleSubmit}>
                <input placeholder="Your name" className="board__input" type="text" value={creator} onChange={(e) => setCreator(e.target.value)} />
                <div className="error">{creatorError && creatorError}</div>
                <input placeholder="Board Name" className="board__input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="error">{nameError && nameError}</div>
                <textarea className="board__textarea" placeholder="Please describe your board" value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className="error">{descriptionError && descriptionError}</div>
                <div className="error">{lengthError && lengthError}</div>
                <button className="board__btn" type="submit">Create Board</button>
              </form>
            </div> : null}
          </div>
        </div>
        {boards.map((board: BoardType) => (
          <BoardCard key={board._id} {...board} />
        ))}
      </div>
    </div>
  )
}

export default BoardsPage