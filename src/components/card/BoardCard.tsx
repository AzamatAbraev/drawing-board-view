import BoardType from "../../types/board";

import notFound from "../../assets/not-found.jpg"

import "./style.scss";
import { useNavigate } from "react-router-dom";
import useBoard from "../../store/board";
import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";

const BoardCard = (board: BoardType) => {
  const [open, setOpen] = useState(false)

  const { joinBoard } = useBoard()
  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
  }

  const onFinish = (values: { username: string }) => {
    joinBoard(board._id, navigate)
    message.success(`Welcome ${values.username}`);
  };


  return (
    <div className="board__card board">
      <div className="board__image">
        <img src={board.thumbnail || notFound} alt={`Board ID: ${board.description}`} />
      </div>
      <div className="board__content">
        <h3 className="board__name">{board?.name} by {board.creator}</h3>
        <p className="board__desc">{board?.description}</p>
        <button onClick={showModal} className="board__btn">Join Board</button>
      </div>
      <Modal
        title="Join Board"
        open={open}
        footer={null}
        onCancel={hideModal}
      >
        <Form onFinish={onFinish} name="Username input">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your guestname' }]}
          >
            <Input placeholder="Your guestname" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BoardCard