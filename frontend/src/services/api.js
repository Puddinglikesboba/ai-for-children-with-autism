// API服务文件 - 用于与backend通信

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 健康检查
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // 分析沙盘
  async analyzeSandbox(imageFile, userId = null, placedItems = []) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      if (userId) {
        formData.append('user_id', userId);
      }
      // 添加放置的物品数据
      formData.append('placed_items', JSON.stringify(placedItems));

      const response = await fetch(`${this.baseURL}/analyze_sandbox/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sandbox analysis failed:', error);
      throw error;
    }
  }

  // 获取API文档URL
  getDocsUrl() {
    return `${this.baseURL}/docs`;
  }

  // 获取ReDoc URL
  getRedocUrl() {
    return `${this.baseURL}/redoc`;
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService; 