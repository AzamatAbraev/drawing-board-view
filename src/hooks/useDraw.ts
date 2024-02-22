import { useState, useRef, useEffect } from "react";
import { Point, DrawType } from "../types/typing";

const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: DrawType) => void,
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [startPoint, setStartPoint] = useState<null | Point>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  // const drawShape = ({
  //   ctx,
  //   startPoint,
  //   endPoint,
  //   currentTool,
  // }: {
  //   ctx: CanvasRenderingContext2D;
  //   startPoint: Point;
  //   endPoint: Point;
  //   currentTool: string;
  // }) => {
  //   if (currentTool == "rectangle") {
  //     const width = endPoint.x - startPoint.x;
  //     const height = endPoint.y - startPoint.y;
  //     ctx.beginPath();
  //     ctx.rect(startPoint.x, startPoint.y, width, height);
  //     ctx.stroke();
  //   } else if (currentTool === "circle") {
  //     const radius = Math.sqrt(
  //       Math.pow(endPoint.x - startPoint.x, 2) +
  //         Math.pow(endPoint.y - startPoint.y, 2),
  //     );
  //     ctx.beginPath();
  //     ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
  //     ctx.stroke();
  //   }
  // };

  const computePointInCanvas = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(true);
    const point = computePointInCanvas(e.nativeEvent);
    if (point) {
      setStartPoint(point);
      prevPoint.current = point;
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // const drawShapePreview = useCallback(
  //   (ctx: CanvasRenderingContext2D, endPoint: Point) => {
  //     if (!startPoint) return;
  //     clear();
  //     drawShape({ ctx, startPoint, endPoint, currentTool });
  //   },
  //   [currentTool, startPoint],
  // );

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!mouseDown || !startPoint) return;
      const currentPoint = computePointInCanvas(e);
      if (!currentPoint) return;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
      setStartPoint(null);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [mouseDown, onDraw, startPoint]);

  return { canvasRef, onMouseDown, clear };
};

export default useDraw;
