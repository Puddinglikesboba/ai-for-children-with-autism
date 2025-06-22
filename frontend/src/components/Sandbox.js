// src/components/Sandbox.js
import React, { useState, useRef } from 'react';
import PsychologistAgent from './PsychologistAgent';
import apiService from '../services/api';
import { createSandboxCanvas, canvasToFile } from '../utils/canvasUtils';
import './Sandbox.css';

// --- Main Sandbox Component ---
const SandplayTherapy = () => {
  /* ------------------------ 状态 ------------------------ */
  const [placedItems, setPlacedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('People');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeItem, setResizeItem] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, size: 0 });
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const sandboxRef = useRef(null);

  /* ---------------------- 物品分类 ---------------------- */
  const itemCategories = {
    'People': [
      { id: 'people-1', image: '/assets/item/people/1.png', name: 'Person 1' },
      { id: 'people-2', image: '/assets/item/people/2.png', name: 'Person 2' },
      { id: 'people-3', image: '/assets/item/people/3.png', name: 'Person 3' },
      { id: 'people-4', image: '/assets/item/people/4.png', name: 'Person 4' },
      { id: 'people-5', image: '/assets/item/people/5.png', name: 'Person 5' },
      { id: 'people-6', image: '/assets/item/people/6.png', name: 'Person 6' },
    ],
    'Buildings': [
      { id: 'building-1', image: '/assets/item/building/1.png', name: 'Building 1' },
      { id: 'building-2', image: '/assets/item/building/2.png', name: 'Building 2' },
      { id: 'building-3', image: '/assets/item/building/3.png', name: 'Building 3' },
      { id: 'building-4', image: '/assets/item/building/4.png', name: 'Building 4' },
      { id: 'building-5', image: '/assets/item/building/5.png', name: 'Building 5' },
      { id: 'building-6', image: '/assets/item/building/6.png', name: 'Building 6' },
      { id: 'building-7', image: '/assets/item/building/7.png', name: 'Building 7' },
      { id: 'building-8', image: '/assets/item/building/8.png', name: 'Building 8' },
      { id: 'building-9', image: '/assets/item/building/9.png', name: 'Building 9' },
      { id: 'building-11', image: '/assets/item/building/11.png', name: 'Building 11' },
      { id: 'building-12', image: '/assets/item/building/12.png', name: 'Building 12' },
      { id: 'building-13', image: '/assets/item/building/13.png', name: 'Building 13' },
      { id: 'building-14', image: '/assets/item/building/14.png', name: 'Building 14' },
    ],
    'Animals': [
      { id: 'animal-1', image: '/assets/item/animal/1.png', name: 'Animal 1' },
      { id: 'animal-2', image: '/assets/item/animal/2.png', name: 'Animal 2' },
    ],
    'Transport': [
      { id: 'transport-1', image: '/assets/item/transport/1.png', name: 'Transport 1' },
      { id: 'transport-2', image: '/assets/item/transport/2.png', name: 'Transport 2' },
      { id: 'transport-3', image: '/assets/item/transport/3.png', name: 'Transport 3' },
      { id: 'transport-4', image: '/assets/item/transport/4.png', name: 'Transport 4' },
    ]
  };

  /* ----------------------- 事件 ----------------------- */
  const handleDragStart = (e, item) => {
    setIsDragging(true);
    const itemData = {
      id: item.id,
      name: item.name,
      image: item.image
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(itemData));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = sandboxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const itemData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // 根据原始物品数据重建物品
    const originalItem = Object.values(itemCategories).flat().find(item => item.id === itemData.id);
    
    const newItem = {
      id: `${itemData.id}-${Date.now()}`,
      name: itemData.name,
      image: itemData.image,
      x: x - 25,
      y: y - 25,
      size: 50 // 默认大小
    };
    
    setPlacedItems(prev => [...prev, newItem]);
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePlacedItemMouseDown = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = sandboxRef.current.getBoundingClientRect();
    setDraggedItem(item);
    setDragOffset({
      x: e.clientX - rect.left - item.x,
      y: e.clientY - rect.top - item.y
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (draggedItem && isDragging && !isResizing) {
      const rect = sandboxRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      // 边界检查
      const maxX = rect.width - draggedItem.size;
      const maxY = rect.height - draggedItem.size;
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      setPlacedItems(prev => 
        prev.map(item => 
          item.id === draggedItem.id 
            ? { ...item, x: boundedX, y: boundedY }
            : item
        )
      );
    } else if (resizeItem && isResizing) {
      const rect = sandboxRef.current.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const delta = Math.max(deltaX, deltaY);
      
      const newSize = Math.max(30, Math.min(200, resizeStart.size + delta));
      
      setPlacedItems(prev => 
        prev.map(item => 
          item.id === resizeItem.id 
            ? { ...item, size: newSize }
            : item
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setIsResizing(false);
    setResizeItem(null);
    setResizeStart({ x: 0, y: 0, size: 0 });
  };

  const handleResizeStart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeItem(item);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      size: item.size
    });
  };

  const removeItem = (e, itemId) => {
    e.stopPropagation();
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearSandbox = () => {
    setPlacedItems([]);
  };

  const saveScene = () => {
    const sceneData = JSON.stringify(placedItems, null, 2);
    const blob = new Blob([sceneData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sandbox-scene.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 分析沙盘
  const analyzeSandbox = async () => {
    if (placedItems.length === 0) {
      setAnalysisError('Please place some items in the sandbox before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // 创建sandbox canvas
      const container = sandboxRef.current;
      const rect = container.getBoundingClientRect();
      const canvas = createSandboxCanvas(container, rect.width, rect.height);
      
      // 转换为文件
      const imageFile = await canvasToFile(canvas, 'sandbox.png');
      
      // 发送到backend进行分析，包含放置的物品数据
      const result = await apiService.analyzeSandbox(imageFile, 'user-123', placedItems);
      
      // 更新分析数据
      setAnalysisData({
        caption: result.caption,
        analysis: result.analysis,
        timestamp: result.timestamp
      });
      
      console.log('Analysis result:', result);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(error.message || 'Failed to analyze sandbox. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 处理心理医生agent的分析更新
  const handleAnalysisUpdate = (analysis) => {
    setAnalysisData(analysis);
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="sandbox-container">
      <div className="sandbox-content">
        {/* 中间沙盘区域 */}
        <div className="sandbox-area">
          <h2 className="area-title">Sandbox</h2>
          <div
            ref={sandboxRef}
            className={`sandbox-container-inner ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 物品层 */}
            <div className="items-layer">
              {placedItems.map(item => (
                <div
                  key={item.id}
                  className="placed-item"
                  style={{ left: item.x, top: item.y }}
                >
                  <div
                    className="item-wrapper"
                    onMouseDown={(e) => handlePlacedItemMouseDown(e, item)}
                    title="Drag to move, double-click to delete"
                    onDoubleClick={(e) => removeItem(e, item.id)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="placed-image"
                      style={{ width: item.size, height: item.size }}
                      draggable={false}
                    />
                    <button
                      className="delete-button"
                      onClick={(e) => removeItem(e, item.id)}
                      title="Delete"
                    >
                      ×
                    </button>
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => handleResizeStart(e, item)}
                      title="Drag to resize"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 提示文字 */}
            {placedItems.length === 0 && (
              <div className="sandbox-hint">
                <div className="hint-content">
                  <p className="hint-title">Drag items here</p>
                  <p className="hint-text">Start creating</p>
                </div>
              </div>
            )}

            {/* 拖拽提示 */}
            {isDragging && (
              <div className="drag-hint">
                <div className="drag-text">
                  Drop item
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="right-panel">
          {/* 工具栏 */}
          <div className="sandbox-panel">
            <div className="panel-content">
              <h2 className="panel-title">Tools</h2>
              
              {/* 分类标签 */}
              <div className="category-tabs">
                {Object.keys(itemCategories).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-tab ${selectedCategory === category ? 'active' : 'inactive'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* 物品列表 */}
              <div className="items-grid">
                {itemCategories[selectedCategory].map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className="item-card"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="item-image"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="action-buttons">
                <button
                  onClick={clearSandbox}
                  className="action-button clear-button"
                >
                  Clear
                </button>
                <button
                  onClick={saveScene}
                  className="action-button save-button"
                >
                  Save
                </button>
                <button
                  onClick={analyzeSandbox}
                  disabled={isAnalyzing || placedItems.length === 0}
                  className="action-button analyze-button"
                  style={{
                    background: 'linear-gradient(135deg, #17a2b8, #138496)',
                    color: 'white',
                    opacity: (isAnalyzing || placedItems.length === 0) ? 0.6 : 1
                  }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {/* 错误提示 */}
              {analysisError && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  {analysisError}
                </div>
              )}
            </div>
          </div>

          {/* 心理医生区域 */}
          <div className="psychologist-section">
            <PsychologistAgent 
              placedItems={placedItems}
              onAnalysisUpdate={handleAnalysisUpdate}
              analysisData={analysisData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandplayTherapy;
