import React, { useState, useRef, useEffect } from 'react';
import './PsychologistAgent.css';

const PsychologistAgent = ({ placedItems, onAnalysisUpdate, analysisData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 当收到backend分析结果时，添加到聊天中
  useEffect(() => {
    if (analysisData && analysisData.caption && analysisData.analysis) {
      const analysisMessage = {
        id: Date.now(),
        text: `🔍 **AI分析结果**

**场景描述：**
${analysisData.caption}

**心理分析：**
${analysisData.analysis}

这个分析基于你沙盘中的物品排列。你想讨论一下这些发现吗？`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, analysisMessage]);
    }
  }, [analysisData]);

  // 心理医生AI回复逻辑
  const generateAIResponse = async (userMessage, items) => {
    setIsTyping(true);
    
    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    let response = '';
    
    // 分析沙盘中的物品
    const itemAnalysis = analyzeSandboxItems(items);
    
    // 根据用户消息和沙盘内容生成回复
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = `你好！我是你的心理医生助手。我看到你的沙盘中有${itemAnalysis.totalItems}个物品。${itemAnalysis.insight}`;
    } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('指导')) {
      response = `我很乐意帮助你！你可以：
      • 告诉我你在沙盘中放置了什么
      • 分享你的感受和想法
      • 询问关于沙盘治疗的问题
      • 让我分析你的沙盘布局`;
    } else if (userMessage.toLowerCase().includes('分析') || userMessage.toLowerCase().includes('分析')) {
      response = `让我分析一下你的沙盘：
      ${itemAnalysis.detailedAnalysis}
      
      这些物品的排列可能反映了你内心的某些想法。你想谈谈什么吗？`;
    } else if (userMessage.toLowerCase().includes('感觉') || userMessage.toLowerCase().includes('感受')) {
      response = `感受是很重要的！在沙盘治疗中，我们关注的是你的内心体验。
      
      当你看到这些物品时，你有什么感觉？是平静、兴奋、还是其他什么？
      
      记住，没有对错的感觉，每一种感受都值得被倾听。`;
    } else {
      // 通用回复
      const genericResponses = [
        `很有趣的想法！你能告诉我更多关于这个的吗？`,
        `我注意到你提到了这个。在沙盘治疗中，每个选择都有其意义。`,
        `谢谢你的分享。你觉得这个想法与你在沙盘中创造的世界有什么联系吗？`,
        `我理解你的感受。沙盘治疗是一个安全的空间，你可以自由表达。`,
        `这很有启发性！让我们继续探索你的内心世界。`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    setIsTyping(false);
    return response;
  };

  // 分析沙盘物品
  const analyzeSandboxItems = (items) => {
    const totalItems = items.length;
    const categories = {};
    
    items.forEach(item => {
      const category = item.name.split(' ')[0]; // 提取类别
      categories[category] = (categories[category] || 0) + 1;
    });
    
    let insight = '';
    let detailedAnalysis = '';
    
    if (totalItems === 0) {
      insight = '你的沙盘还很空，这可能是你正在思考或等待灵感的表现。';
      detailedAnalysis = '空白的沙盘可能代表：\n• 新的开始或可能性\n• 需要更多时间思考\n• 内心的平静状态';
    } else if (totalItems <= 3) {
      insight = '你选择了少量但重要的物品，这显示了你的专注和选择性。';
      detailedAnalysis = '少量物品可能表示：\n• 对重要事物的关注\n• 简洁的思维方式\n• 内心的清晰度';
    } else {
      insight = '你创造了一个丰富的场景，这显示了你的创造力和想象力。';
      detailedAnalysis = '丰富场景可能反映：\n• 丰富的内心世界\n• 多样的兴趣和关注点\n• 复杂的情感状态';
    }
    
    // 分析物品类别
    if (categories.People > 0) {
      detailedAnalysis += '\n• 人物物品：可能代表人际关系或自我形象';
    }
    if (categories.Building > 0) {
      detailedAnalysis += '\n• 建筑物品：可能代表安全、庇护或目标';
    }
    if (categories.Animal > 0) {
      detailedAnalysis += '\n• 动物物品：可能代表本能、自由或特定品质';
    }
    if (categories.Transport > 0) {
      detailedAnalysis += '\n• 交通工具：可能代表移动、变化或方向';
    }
    
    return { totalItems, insight, detailedAnalysis };
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // 生成AI回复
    const aiResponse = await generateAIResponse(inputMessage, placedItems);
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // 更新分析结果
    const analysis = analyzeSandboxItems(placedItems);
    onAnalysisUpdate && onAnalysisUpdate(analysis);
  };

  // 处理回车键
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: `你好！我是你的心理医生助手。👩‍⚕️

我可以帮助你：
• 分析你的沙盘创作
• 提供心理支持和建议
• 回答关于沙盘治疗的问题
• 与你进行心理对话

请随时与我分享你的想法和感受！`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="psychologist-agent">
      {/* 头部 */}
      <div className="agent-header">
        <div className="agent-info">
          <div className="agent-avatar">👩‍⚕️</div>
          <div className="agent-details">
            <h3 className="agent-name">心理医生助手</h3>
            <span className="agent-status">在线</span>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="告诉我你的想法..."
            rows="2"
            className="message-input"
          />
          <button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="send-button"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychologistAgent; 