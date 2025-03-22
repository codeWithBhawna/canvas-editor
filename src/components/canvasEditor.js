import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Elements from "./elements"; // Importing Elements component
import "./canvasEditor.css";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [draggedType, setDraggedType] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 1200,
        backgroundColor: "#f3f3f3",
      });
    }

    return () => {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Function to prevent overlapping
  const preventOverlap = (newObject, canvas) => {
    const objects = canvas.getObjects();

    for (let obj of objects) {
      if (obj === newObject) continue; // Skip itself

      if (
        !(newObject.left + newObject.width < obj.left || 
          newObject.left > obj.left + obj.width || 
          newObject.top + newObject.height < obj.top || 
          newObject.top > obj.top + obj.height)
      ) {
        // Move the new object to avoid overlap
        newObject.set({
          left: newObject.left + 50,
          top: newObject.top + 50,
        });

        // Recheck again after moving
        preventOverlap(newObject, canvas);
      }
    }
  };

  // Drag Start
  const handleDragStart = (event, type) => {
    setDraggedType(type);
  };

  // Drop Object on Canvas
  const handleDrop = (event) => {
    event.preventDefault();
    if (!fabricCanvasRef.current || !draggedType) return;

    const canvas = fabricCanvasRef.current;
    const x = 400;
    const y = 200 + canvas.getObjects().length * 50;
    let newObject;

    switch (draggedType) {
      case "text":
        newObject = new fabric.Textbox("Drag me!", {
          left: x,
          top: y,
          fontSize: 20,
          fill: "black",
          textAlign: "center",
        });
        break;

      case "rectangle":
        newObject = new fabric.Rect({
          left: x - 50,
          top: y,
          width: 100,
          height: 50,
          fill: "blue",
        });
        break;

      case "image":
        fabric.Image.fromURL("/image-icon.png", (img) => {
          img.set({
            left: x - img.width / 4,
            top: y,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          canvas.add(img);
          canvas.renderAll();
        });
        return;

      case "button":
        newObject = new fabric.Rect({
          left: x - 50,
          top: y,
          width: 100,
          height: 50,
          fill: "green",
          rx: 10,
          ry: 10,
        });
        break;

      case "oval":
        newObject = new fabric.Ellipse({
          left: x,
          top: y,
          rx: 50,
          ry: 30,
          fill: "purple",
        });
        break;

      case "circle":
        newObject = new fabric.Circle({
          left: x,
          top: y,
          radius: 40,
          fill: "yellow",
        });
        break;

      case "icon":
        fabric.Image.fromURL("/icon-icon.png", (img) => {
          img.set({
            left: x,
            top: y,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          canvas.add(img);
          canvas.renderAll();
        });
        return;

      default:
        return;
    }

    // Prevent overlapping before adding
    preventOverlap(newObject, canvas);

    canvas.add(newObject);
    canvas.renderAll();
    setDraggedType(null);
  };

  // Allow Drop
  const allowDrop = (event) => event.preventDefault();

  // Save Canvas
  const handleSave = () => {
    if (!fabricCanvasRef.current) return;
    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "canvas.json";
    link.click();
  };

  // Load Canvas from JSON
  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current.renderAll();
      });
    };
    reader.readAsText(file);
  };

  // Zoom In/Out
  const handleZoom = (factor) => {
    if (!fabricCanvasRef.current) return;
    let newZoom = Math.min(Math.max(zoomLevel + factor, 0.5), 2);
    const canvas = fabricCanvasRef.current;
    const center = canvas.getCenter();
    canvas.zoomToPoint({ x: center.left, y: center.top }, newZoom);
    setZoomLevel(newZoom);
  };

  return (
    <div className="canvas-editor">
      <h2>Canvas Editor</h2>

      <div className="canvas-wrapper">
        {/* Sidebar for Elements */}
        <Elements handleDragStart={handleDragStart} />

        {/* Canvas */}
        <div className="canvas-container" onDrop={handleDrop} onDragOver={allowDrop}>
          <canvas ref={canvasRef} id="canvas" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={handleSave}>Save</button>
        <input type="file" accept=".json" onChange={handleLoad} />

        {/* Zoom Buttons */}
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => handleZoom(-0.1)}>-</button>
          <span className="zoom-display">{Math.round(zoomLevel * 100)}%</span>
          <button className="zoom-btn" onClick={() => handleZoom(0.1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
