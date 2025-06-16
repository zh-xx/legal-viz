// app/components/AnalysisConfiguration.tsx

'use client';

import React, { useState } from 'react';

// 定义这个组件的“合同”：它需要从父组件接收什么
interface AnalysisConfigurationProps {
  isAnalyzing: boolean; // 父组件告诉我们当前是否正在分析中
  onAnalyzeClick: (apiKey: string) => void; // 当用户点击按钮时，我们用这个函数通知父组件，并把API Key传回去
}

const AnalysisConfiguration: React.FC<AnalysisConfigurationProps> = ({ isAnalyzing, onAnalyzeClick }) => {
  // 这个组件自己管理用户输入的API Key
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          DeepSeek API Key:
        </label>
        <input
          type="password" // 使用password类型，这样输入时会显示为星号，更安全
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="在此输入您的API Key"
        />
      </div>
      <button
        onClick={() => onAnalyzeClick(apiKey)}
        disabled={isAnalyzing} // 如果正在分析，禁用按钮防止重复点击
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? '正在分析中...' : '开始分析'}
      </button>
    </div>
  );
};

export default AnalysisConfiguration;