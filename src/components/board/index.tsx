import { Button, Layout, Modal } from 'antd';
const { Header, Content } = Layout;


import drawer from "../../assets/draw.svg";
import eraser from "../../assets/eraser.svg";

import circle from "../../assets/circle.svg";
import triangle from "../../assets/triangle.svg";
import rectangle from "../../assets/rectangle.svg"
import square from "../../assets/square.svg"
import star from "../../assets/star.svg"

import { useCallback, useEffect, useState } from 'react';
import useDraw from '../../hooks/useDraw';
import { DrawType, Point } from '../../types/typing';
import socket from '../../server/socket';
import drawLine from '../../utils/drawLine';
import useBoard from '../../store/board';
import { useNavigate, useParams } from 'react-router-dom';

import "./style.scss"
import request from '../../server/request';

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string
}

const DrawingBoard = () => {

  const { getSingleBoard, board } = useBoard()
  const { id: boardId } = useParams()
  const navigate = useNavigate()

  const [color, setColor] = useState("#000000");
  const [currentTool, setCurrentTool] = useState('draw');



  const shouldClearConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to clear the board?',
      content: 'This action will remove all drawings and cannot be undone.',
      onOk() {
        clearCanvas();
      }
    });
  };




  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  function createLine({ prevPoint, currentPoint, ctx }: DrawType) {
    socket.emit("draw_line", ({ boardId, prevPoint, currentPoint, color }))
    drawLine({ prevPoint, currentPoint, ctx, color })
  }

  const downloadCanvas = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      ctx.drawImage(canvas, 0, 0);

      const image = tempCanvas.toDataURL("image/jpeg");

      const downloadLink = document.createElement('a');
      downloadLink.download = `${board.name}.jpg`;
      downloadLink.href = image;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };


  const handleDownload = () => {
    downloadCanvas();
  };

  const captureCanvasAsDataURL = useCallback(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
      return canvas.toDataURL("image/jpeg");
    }
    return null;
  }, []);

  const updateThumbnail = useCallback(async (boardId: string | undefined, thumbnailDataUrl: string) => {
    try {
      const { data } = await request.post(`boards/${boardId}/thumbnail`, { thumbnail: thumbnailDataUrl })
      return data;
    } catch (error) {
      console.log(error);
    }
  }, []);


  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  const handleErase = useCallback(() => {
    setColor("#ffffff");
    setCurrentTool('erase')
  }, [])

  const handleDraw = () => {
    setColor("#000000")
    setCurrentTool('draw')
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');

    if (!context) return;

    const backgroundColor = '#ffffff';
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);



  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    socket.emit("clear", boardId);

    const clearedThumbnailDataUrl = captureCanvasAsDataURL();
    if (clearedThumbnailDataUrl && boardId) {
      updateThumbnail(boardId, clearedThumbnailDataUrl)
        .then(() => console.log('Thumbnail updated'))
        .catch((error) => console.error('Failed to update thumbnail after clearing:', error));
    }
  }, [boardId, canvasRef, updateThumbnail, captureCanvasAsDataURL])

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

  useEffect(() => {
    getSingleBoard(boardId)
  }, [getSingleBoard, boardId])

  const navigateToBoards = () => {
    navigate("/")
    const thumbnailDataUrl = captureCanvasAsDataURL();
    if (thumbnailDataUrl && boardId) {
      updateThumbnail(boardId, thumbnailDataUrl)
        .then(() => console.log('Thumbnail updated'))
        .catch((error) => console.error('Failed to update thumbnail:', error));
    }
  }



  return (
    <Layout className='canvas'>
      <Header className='canvas__nav'>
        <h1 className='canvas__title' style={{ color: "#fff" }}>Board: {board.name}</h1>
        <div className="canvas__nav__controls">
          <Button className={currentTool === 'draw' ? "active" : ""} onClick={handleDraw}><img src={drawer} alt="Draw" /></Button>
          {/* <Button ><img src={selector} alt="Text Select" /></Button> */}
          <Button className={`eraser__btn ${currentTool === 'erase' ? "active" : ""}`} onClick={handleErase}><img src={eraser} alt="Erase" /></Button>
        </div>
        <div className='canvas__nav__shapes'>
          <Button><img src={circle} alt="circle" /></Button>
          <Button><img src={rectangle} alt="rectangle" /></Button>
          <Button><img src={triangle} alt="triangle" /></Button>
          <Button><img src={square} alt="square" /></Button>
          <Button><img src={star} alt="star" /></Button>
        </div>
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
          <Button onClick={handleDownload} className='download__btn'>Download</Button>
          <Button onClick={shouldClearConfirm} className='download__btn'>Clear</Button>
          <Button onClick={navigateToBoards} className='download__btn'>See All Boards</Button>
        </div>
      </Header>
      <Content className='canvas__board'>
        <canvas onMouseDown={onMouseDown} style={{ border: "2px solid black" }} width={window.innerWidth - 40} height={window.innerHeight - 90} ref={canvasRef} id='canvas' className='board'></canvas>
      </Content>
    </Layout >
  );
};

export default DrawingBoard;