import './App.css';
import React, { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import generateImage from './image';
import captionImage from './caption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [oldColor, setOldColor] = useState('#444'); 
  const [color, setColor] = useState('#444'); 
  const [size, setSize] = useState(7); 
  const canvasRef = useRef(null);
  const [eraserEnabled, setEraserEnabled] = useState(false);
  const [image, setImage] = useState('')
  const [extras, setExtras] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const stopGenerationRef = useRef(false);

  const clearCanvas = () => {
    canvasRef.current.clear();
  };

  const toggleEraser = () => {
    setOldColor(color);
    setEraserEnabled(!eraserEnabled);
    setColor(eraserEnabled ? oldColor : '#FFFFFF');
  };

  const undoLastAction = () => {
    canvasRef.current.undo();
  };

  const closeModal = () => {
    stopGenerationRef.current = true;
    setIsGenerating(false);
    setImage(null)
    setExtras('')
  };

  const closeImage = () => {
    setIsGenerating(false);
    setImage(null)
    setExtras('')
  };

  const generateResult = async () => {
    try {
      stopGenerationRef.current = false;
      setIsGenerating(true);
      const dataUrl = canvasRef.current.getDataURL(); 
      const summaryData = await captionImage(dataUrl)
      if (!summaryData || stopGenerationRef.current) {return;}
      const summary = JSON.parse(summaryData).result
      if (stopGenerationRef.current) {return;}
      const resultImage = await generateImage(summary, extras);
      if (stopGenerationRef.current) {return;}
      if (resultImage) {
          setImage(resultImage);
      } else {
          alert("Something went wrong. Please try again.")
          return;
      }

    } catch (error) {
      alert(error)
    }
    setIsGenerating(false);
  };

  return (
    <div className="App">
      <header>
        <h1 className="header-title">AI Sketch 2 Image</h1>
      </header>
      {(!image && !isGenerating) && (
        <div>
          <div className="tools">
            <div className="left-tools">
              <button onClick={clearCanvas} className="tool-button">Clear</button>
              <button onClick={undoLastAction} className="tool-button">Undo</button>
            </div>
            
            <div className="canvasContainer">
              <CanvasDraw ref={canvasRef} lazyRadius={0} hideGrid={true} brushColor={color} brushRadius={size} canvasHeight={550} canvasWidth={550} className="canvasStyle" />
            </div>
            
            <div className="right-tools">
              <button onClick={toggleEraser} className="tool-button">
                <FontAwesomeIcon icon={eraserEnabled ? faPencilAlt : faEraser} />
              </button>
              {!eraserEnabled && (
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="color-picker" />
              )}
              <div className="size-adjuster-container">
                <input type="range" min="1" max="20" orient="vertical" value={size} onChange={e => setSize(e.target.value)} className="size-adjuster" />
              </div>
            </div>
          </div>
          <input
            type="text"
            value={extras}
            onChange={e => setExtras(e.target.value)}
            maxLength="50"
            placeholder="Enter optional keywords..."
            className="keyword-input"
          />
          <button onClick={generateResult} className="generate-btn">Generate Image</button>
        </div>
      )}
      {(isGenerating && !image) && (
        <div className="gen-modal">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
            <p>Generating...</p>
            <button onClick={closeModal} className="back-button">Back</button>
          </div>
        </div>
      )}
      {image && (
          <div className="img-modal">
            <div>
              <a href={image} target="_blank" rel="noopener noreferrer">
                <img src={image} alt="Generated Content" />
              </a>
            </div>
            <button onClick={closeImage} className="generate-btn">Back</button>
          </div>
      )}
    </div>
  );
}

export default App;
