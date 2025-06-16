// app/page.tsx

'use client'; // 声明这是客户端组件，因为有交互

import React, { useState } from 'react';
import TextInputArea from './components/TextInputArea'; 

export default function Home() {
  // 使用 useState 来“记住”用户输入的文本
  const [legalText, setLegalText] = useState<string>('');

  const handleTextChange = (newText: string) => {
    setLegalText(newText);
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">诉讼可视化工具 (MVP V0.1)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：输入和配置 */}
        <div className="flex flex-col space-y-6">
          {/* 这里我们先只使用文本输入组件 */}
          <TextInputArea onTextChange={handleTextChange} />
        </div>

        {/* 右侧：结果和可视化 */}
        <div className="bg-gray-50 p-4 rounded-md h-full border">
             <h2 className="text-lg font-semibold mb-2">分析结果</h2>
             <p className="text-gray-500">AI提取的关键信息将在此处显示</p>
        </div>
      </div>

      {/* 调试区，方便我们看到 legalText 状态的变化 */}
      <div className="mt-8 p-4 bg-slate-100 rounded">
        <h3 className="font-bold">调试区 (Page State):</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{legalText || "暂无输入"}</pre>
      </div>
    </main>
  );
}