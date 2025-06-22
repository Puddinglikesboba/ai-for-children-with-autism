import React, { useState, useRef, useEffect } from 'react';
import './PsychologistAgent.css';

const PsychologistAgent = ({ placedItems, onAnalysisUpdate, analysisData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Add analysis results to chat when received from backend
  useEffect(() => {
    if (analysisData && analysisData.caption && analysisData.analysis) {
      const analysisMessage = {
        id: Date.now(),
        text: `🔍 **AI Analysis Results**

**Scene Description:**
${analysisData.caption}

**Psychological Analysis:**
${analysisData.analysis}

This analysis is based on the items in your sandbox. Would you like to discuss these findings?`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, analysisMessage]);
    }
  }, [analysisData]);

  // AI psychologist response logic
  const generateAIResponse = async (userMessage, items) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    let response = '';
    
    // Analyze sandbox items
    const itemAnalysis = analyzeSandboxItems(items);
    
    // Generate response based on user message and sandbox content
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = `Hello! I'm your psychologist assistant. I can see you have ${itemAnalysis.totalItems} items in your sandbox. ${itemAnalysis.insight}`;
    } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('guide')) {
      response = `I'd be happy to help you! You can:
      • Tell me what you've placed in your sandbox
      • Share your feelings and thoughts
      • Ask questions about sandbox therapy
      • Let me analyze your sandbox layout`;
    } else if (userMessage.toLowerCase().includes('analyze') || userMessage.toLowerCase().includes('analysis')) {
      response = `Let me analyze your sandbox:
      ${itemAnalysis.detailedAnalysis}
      
      The arrangement of these items might reflect some of your inner thoughts. What would you like to talk about?`;
    } else if (userMessage.toLowerCase().includes('feel') || userMessage.toLowerCase().includes('emotion')) {
      response = `Feelings are very important! In sandbox therapy, we focus on your inner experience.
      
      When you look at these items, how do you feel? Are you calm, excited, or something else?
      
      Remember, there are no right or wrong feelings - every feeling deserves to be heard.`;
    } else {
      // Generic responses
      const genericResponses = [
        `That's an interesting thought! Can you tell me more about this?`,
        `I notice you mentioned this. In sandbox therapy, every choice has its meaning.`,
        `Thank you for sharing. How do you think this relates to the world you've created in your sandbox?`,
        `I understand your feelings. Sandbox therapy is a safe space where you can express yourself freely.`,
        `This is very insightful! Let's continue exploring your inner world.`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    setIsTyping(false);
    return response;
  };

  // Analyze sandbox items
  const analyzeSandboxItems = (items) => {
    const totalItems = items.length;
    const categories = {};
    
    items.forEach(item => {
      const category = item.name.split(' ')[0]; // Extract category
      categories[category] = (categories[category] || 0) + 1;
    });
    
    let insight = '';
    let detailedAnalysis = '';
    
    if (totalItems === 0) {
      insight = 'Your sandbox is still empty, which might indicate you are thinking or waiting for inspiration.';
      detailedAnalysis = 'An empty sandbox might represent:\n• New beginnings or possibilities\n• Need for more time to think\n• Inner peace and calmness';
    } else if (totalItems <= 3) {
      insight = 'You have chosen a few but important items, showing your focus and selectivity.';
      detailedAnalysis = 'Few items might indicate:\n• Focus on important matters\n• Clear and simple thinking\n• Inner clarity';
    } else {
      insight = 'You have created a rich scene, showing your creativity and imagination.';
      detailedAnalysis = 'Rich scenes might reflect:\n• Rich inner world\n• Diverse interests and concerns\n• Complex emotional states';
    }
    
    // Analyze item categories
    if (categories.People > 0) {
      detailedAnalysis += '\n• People items: might represent relationships or self-image';
    }
    if (categories.Building > 0) {
      detailedAnalysis += '\n• Building items: might represent safety, shelter, or goals';
    }
    if (categories.Animal > 0) {
      detailedAnalysis += '\n• Animal items: might represent instincts, freedom, or specific qualities';
    }
    if (categories.Transport > 0) {
      detailedAnalysis += '\n• Transport items: might represent movement, change, or direction';
    }
    
    return { totalItems, insight, detailedAnalysis };
  };

  // Send message
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
    
    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage, placedItems);
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // Update analysis results
    const analysis = analyzeSandboxItems(placedItems);
    onAnalysisUpdate && onAnalysisUpdate(analysis);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: `Hello! I'm your psychologist assistant.👩‍⚕️

I can help you with:
• Analyzing your sandbox creations
• Providing psychological support and advice
• Answering questions about sandbox therapy
• Having psychological conversations with you

Please feel free to share your thoughts and feelings with me!`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="psychologist-agent">
      {/* Header */}
      <div className="agent-header">
        <div className="agent-info">
          <div className="agent-avatar">👩‍⚕️</div>
          <div className="agent-details">
            <h3 className="agent-name">Psychologist Assistant</h3>
            <span className="agent-status">Online</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
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

        {/* Input area */}
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me your thoughts..."
            rows="2"
            className="message-input"
          />
          <button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychologistAgent; 