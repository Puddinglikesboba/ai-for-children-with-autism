// Canvas工具函数

/**
 * 将canvas转换为Blob对象
 * @param {HTMLCanvasElement} canvas - 要转换的canvas元素
 * @param {string} type - 图片类型，默认为'image/png'
 * @param {number} quality - 图片质量，0-1之间，仅对JPEG有效
 * @returns {Promise<Blob>} 返回Blob对象
 */
export const canvasToBlob = (canvas, type = 'image/png', quality = 0.9) => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, type, quality);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 将canvas转换为File对象
 * @param {HTMLCanvasElement} canvas - 要转换的canvas元素
 * @param {string} filename - 文件名
 * @param {string} type - 图片类型，默认为'image/png'
 * @param {number} quality - 图片质量，0-1之间，仅对JPEG有效
 * @returns {Promise<File>} 返回File对象
 */
export const canvasToFile = async (canvas, filename = 'sandbox.png', type = 'image/png', quality = 0.9) => {
  const blob = await canvasToBlob(canvas, type, quality);
  return new File([blob], filename, { type });
};

/**
 * 将canvas转换为base64字符串
 * @param {HTMLCanvasElement} canvas - 要转换的canvas元素
 * @param {string} type - 图片类型，默认为'image/png'
 * @param {number} quality - 图片质量，0-1之间，仅对JPEG有效
 * @returns {string} 返回base64字符串
 */
export const canvasToBase64 = (canvas, type = 'image/png', quality = 0.9) => {
  return canvas.toDataURL(type, quality);
};

/**
 * 创建一个包含所有放置物品的canvas
 * @param {HTMLDivElement} sandboxContainer - 沙盘容器元素
 * @param {number} width - canvas宽度
 * @param {number} height - canvas高度
 * @returns {HTMLCanvasElement} 返回新的canvas元素
 */
export const createSandboxCanvas = (sandboxContainer, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 绘制背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f4e4bc');
  gradient.addColorStop(0.25, '#e6d7b8');
  gradient.addColorStop(0.5, '#d4c4a8');
  gradient.addColorStop(0.75, '#c2b280');
  gradient.addColorStop(1, '#b8a67a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 获取所有放置的物品
  const placedItems = sandboxContainer.querySelectorAll('.placed-item');
  
  placedItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const containerRect = sandboxContainer.getBoundingClientRect();
    
    // 计算相对位置
    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;
    
    // 获取物品图片
    const img = item.querySelector('.placed-image');
    if (img && img.complete) {
      // 计算缩放比例
      const scaleX = width / containerRect.width;
      const scaleY = height / containerRect.height;
      
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = rect.width * scaleX;
      const scaledHeight = rect.height * scaleY;
      
      ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
    }
  });

  return canvas;
}; 