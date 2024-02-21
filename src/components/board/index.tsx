import { Button, Layout, Modal } from 'antd';
const { Header, Content } = Layout;


import selector from "../../assets/select.svg";
import drawer from "../../assets/draw.svg";
import eraser from "../../assets/eraser.svg";

import circle from "../../assets/circle.svg";
import triangle from "../../assets/triangle.svg";
import rectangle from "../../assets/rectangle.svg"
import square from "../../assets/square.svg"
import star from "../../assets/star.svg"

import "./style.scss"
import { useCallback, useEffect, useState } from 'react';
import useDraw from '../../hooks/useDraw';
import { DrawType, Point } from '../../types/typing';
import socket from '../../server/socket';
import drawLine from '../../utils/drawLine';
// import useBoard from '../../store/board';

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string
}

const DrawingBoard = () => {
  const [color, setColor] = useState("#000000");
  const boardId = localStorage.getItem("BOARD_ID");

  const shouldClearConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to clear the board?',
      content: 'This action will remove all drawings and cannot be undone.',
      onOk() {
        clearCanvas();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };


  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  function createLine({ prevPoint, currentPoint, ctx }: DrawType) {
    socket.emit("draw_line", ({ boardId, prevPoint, currentPoint, color }))
    drawLine({ prevPoint, currentPoint, ctx, color })
  }


  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    socket.emit("clear", boardId);
  }, [boardId, canvasRef])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (boardId) {
      socket.emit("join_room", boardId);
    }

    socket.on("clear", () => {
      if (!ctx) return;
      clearCanvas();
    });

    socket.on("draw_line", ({ prevPoint, currentPoint, color }: DrawLineProps) => {
      if (!ctx) return;
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on("drawing_history", (drawingHistory) => {
      drawingHistory.forEach(({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return;
        drawLine({ prevPoint, currentPoint, ctx, color });
      });
    });

    return () => {
      socket.off("draw_line");
      socket.off("clear");
      socket.off("drawing_history");
    }

  }, [canvasRef, clear, boardId, clearCanvas])



  return (
    <Layout className='canvas'>
      <Header className='canvas__nav'>
        <h1 style={{ color: "#fff" }}>Board: {boardId}</h1>
        <div className="canvas__nav__controls">
          <Button><img src={drawer} alt="Draw" /></Button>
          <Button ><img src={selector} alt="Text Select" /></Button>
          <Button><img src={eraser} alt="Erase" /></Button>
        </div>
        <div className='canvas__nav__shapes'>
          <Button><img src={circle} alt="circle" /></Button>
          <Button><img src={rectangle} alt="rectangle" /></Button>
          <Button><img src={triangle} alt="triangle" /></Button>
          <Button><img src={square} alt="square" /></Button>
          <Button><img src={star} alt="star" /></Button>
        </div>
        {/* <div>
          <input type="text" placeholder='Board Id' onChange={(e) => setBoardId(e.target.value)} />
          <button onClick={() => joinBoard()}>Join</button>
        </div> */}
        <div className='canvas__nav__colors'>
          <div className="canvas__nav__colorpicker">
            <input onChange={(e) => handleColorChange(e.target.value)} value={color} type="color" />
          </div>
          <div className='canvas__nav__colorpicker'>
            <button className='color-active' style={{ backgroundColor: color }}></button>
          </div>
          <div className='canvas__colors'>
            <button onClick={() => handleColorChange("red")} style={{ backgroundColor: "red" }} className="color"></button>
            <button onClick={() => handleColorChange("black")} style={{ backgroundColor: "black" }} className="color"></button>
            <button onClick={() => handleColorChange("blue")} style={{ backgroundColor: "blue" }} className="color"></button>
            <button onClick={() => handleColorChange("yellow")} style={{ backgroundColor: "yellow" }} className="color"></button>
            <button onClick={() => handleColorChange("orange")} style={{ backgroundColor: "orange" }} className="color"></button>
            <button onClick={() => handleColorChange("brown")} style={{ backgroundColor: "brown" }} className="color"></button>
            <button onClick={() => handleColorChange("grey")} style={{ backgroundColor: "grey" }} className="color"></button>
            <button onClick={() => handleColorChange("purple")} style={{ backgroundColor: "purple" }} className="color"></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className='canvas__nav__download'>
          <Button className='download__btn'>Download</Button>
          <Button onClick={shouldClearConfirm} className='download__btn'>Clear</Button>
        </div>
      </Header>
      <Content className='canvas__board'>
        <canvas onMouseDown={onMouseDown} style={{ border: `2px solid black` }} width={window.innerWidth - 40} height={window.innerHeight - 90} ref={canvasRef} id='canvas' className='board'></canvas>
      </Content>
    </Layout >
  );
};

export default DrawingBoard;