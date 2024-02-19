import { Button, Layout } from 'antd';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
const { Header, Content } = Layout;


import selector from "../../assets/select.svg";
import drawer from "../../assets/draw.svg";
import eraser from "../../assets/eraser.svg";

import circle from "../../assets/circle.svg"
import triangle from "../../assets/triangle.svg"
import rectangle from "../../assets/rectangle.svg"
import square from "../../assets/square.svg"
import star from "../../assets/star.svg"

import "./style.scss"
import { useRef, useState } from 'react';


const DrawingBoard = () => {
  const [color, setColor] = useState("#000000");

  const canvasRef = useRef<ReactSketchCanvasRef>(null);


  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current?.undo();
    }
  };

  return (
    <Layout className='canvas'>
      <Header className='canvas__nav'>
        <div className="canvas__nav__controls">
          <Button><img src={drawer} alt="Draw" /></Button>
          <Button ><img src={selector} alt="Text Select" /></Button>
          <Button onClick={handleUndo}><img src={eraser} alt="Erase" /></Button>
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
        <div className='canvas__nav__download'>
          <Button className='download__btn'>Download</Button>
        </div>
      </Header>
      <Content className='canvas__board'>
        <ReactSketchCanvas ref={canvasRef} eraserWidth={5} allowOnlyPointerType="all" width='100%' height='100%' strokeColor={color} />
      </Content>
    </Layout>
  );
};

export default DrawingBoard;