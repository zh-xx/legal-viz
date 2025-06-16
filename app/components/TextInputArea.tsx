// app/components/TextInputArea.tsx

'use client'; // 告诉 Next.js 这是一个客户端组件，因为我们需要交互

import React from 'react';

// 定义这个组件需要接收哪些参数（Props）
interface TextInputAreaProps {
  // 当文本框内容改变时，我们会调用这个函数通知父组件
  onTextChange: (text: string) => void; 
  initialText?: string; // 可选的初始文本
}

const TextInputArea: React.FC<TextInputAreaProps> = ({ onTextChange, initialText = '' }) => {
  return (
    <div>
      <label htmlFor="legal-text" className="block text-sm font-medium text-gray-700 mb-2">
        在此处粘贴法律文书：
      </label>
      <textarea
        id="legal-text"
        rows={15} // 设定一个初始高度
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="例如：将判决书、起诉状等内容粘贴于此..."
        onChange={(e) => onTextChange(e.target.value)} // 每次输入都调用 onTextChange
        defaultValue={initialText}
      />
    </div>
  );
};

export default TextInputArea;