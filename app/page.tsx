// app/page.tsx

'use client';

import React, { useState } from 'react';
import TextInputArea from './components/TextInputArea';
import AnalysisConfiguration from './components/AnalysisConfiguration';
// 1. 导入我们的API调用函数
import { callDeepSeek } from './lib/llm';

export default function Home() {
  const [legalText, setLegalText] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  // 2. 新增一个state，用于存储AI的分析结果
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const handleTextChange = (newText: string) => {
    setLegalText(newText);
  };

  const handleAnalyze = async (key: string) => { // 3. 将函数标记为async
    if (!legalText.trim() || !key.trim()) {
      alert("请输入法律文书和API Key！");
      return;
    }
    
    setApiKey(key);
    setIsAnalyzing(true);
    setAnalysisResult('正在生成结果，请稍候...'); // 提供一个友好的等待提示

    // 4. 调用真实的API函数，替换掉setTimeout
    const result = await callDeepSeek(key, legalText);

    // 5. 更新状态
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">诉讼可视化工具 (MVP V0.1)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <TextInputArea onTextChange={handleTextChange} />
          <AnalysisConfiguration 
            isAnalyzing={isAnalyzing} 
            onAnalyzeClick={handleAnalyze} 
          />
        </div>

        {/* 6. 在右侧区域展示分析结果 */}
        <div className="bg-gray-50 p-4 rounded-md h-full border">
             <h2 className="text-lg font-semibold mb-2">分析结果</h2>
             <pre className="text-sm whitespace-pre-wrap font-sans">
                {analysisResult || "AI提取的关键信息将在此处显示"}
             </pre>
        </div>
      </div>
    </main>
  );
}