// app/components/AnalysisConfiguration.tsx (升级版，带记忆功能)

'use client';

import React, { useState, useEffect } from 'react';

interface AnalysisConfigurationProps {
  isAnalyzing: boolean;
  onAnalyzeClick: (apiKey: string) => void;
}

const AnalysisConfiguration: React.FC<AnalysisConfigurationProps> = ({ isAnalyzing, onAnalyzeClick }) => {
  const [apiKey, setApiKey] = useState<string>('');

  // 关键改动1：当组件第一次加载时，尝试从localStorage读取已保存的key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []); // 空数组[]意味着这个effect只在组件“挂载”时运行一次

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    // 关键改动2：当用户输入key时，立刻将其保存到localStorage
    localStorage.setItem('deepseek_api_key', key);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          DeepSeek API Key (将保存在您的浏览器中):
        </label>
        <input
          type="password"
          id="api-key"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)} // 改为调用新函数
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="在此输入您的API Key"
        />
      </div>
      <button
        onClick={() => onAnalyzeClick(apiKey)}
        disabled={isAnalyzing || !apiKey} // 当没有API Key时也禁用按钮
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? '正在分析中...' : '开始分析'}
      </button>
    </div>
  );
};

export default AnalysisConfiguration;