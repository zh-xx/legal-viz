// app/page.tsx (V0.6 - 实现页面跳转功能)

'use client';

// 1. [新增] 从 next/navigation 导入 useRouter，这是实现页面跳转的关键
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// 导入所有需要的组件
import TextInputArea from './components/TextInputArea';
import AnalysisTypeSelector from './components/AnalysisTypeSelector';
import AnalysisConfiguration from './components/AnalysisConfiguration';
import DataEditor from './components/DataEditor';
// 我们在这个页面不再需要直接显示图表了，所以可以安全地移除 DiagramDisplay
// import DiagramDisplay from './components/DiagramDisplay'; 
import { callDeepSeek } from './lib/llm';

// 定义我们的数据结构
interface TimelineEvent {
  id: string;
  date: string;
  event: string;
}

export default function Home() {
  // 2. [新增] 在组件顶部初始化 router 实例
  const router = useRouter();

  // === 状态管理区 (保持不变) ===
  const [legalText, setLegalText] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<string>('timeline');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [structuredData, setStructuredData] = useState<TimelineEvent[]>([]); 
  // analysisResult state 在这个页面也不再需要了，因为结果将在新页面显示
  // const [analysisResult, setAnalysisResult] = useState<string>('');

  
  // === 核心逻辑区 ===

  // handleAnalyze 函数保持不变
  const handleAnalyze = async (apiKey: string) => {
    if (!legalText.trim()) {
      alert("请输入法律文书！");
      return;
    }
    setIsAnalyzing(true);
    setStructuredData([]);
    // setAnalysisResult(''); // 不再需要
    const resultJsonString = await callDeepSeek(apiKey, legalText, analysisType);
    try {
      const parsedData = JSON.parse(resultJsonString);
      if (analysisType === 'timeline' && parsedData.events && Array.isArray(parsedData.events)) {
        const dataWithIds: TimelineEvent[] = parsedData.events.map((item: any, index: number) => ({
          id: `event-${Date.now()}-${index}`,
          date: item.date || '',
          event: item.event || ''
        }));
        setStructuredData(dataWithIds);
      } else {
        console.log("收到了其他类型的数据:", parsedData);
      }
    } catch (e) {
      console.error("解析AI返回的JSON失败:", e);
      alert("AI返回的数据格式有误，无法解析。");
    }
    setIsAnalyzing(false);
  };

  // 数据编辑的操作函数保持不变
  const handleEventChange = (id: string, field: 'date' | 'event', value: string) => {
    setStructuredData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const handleDeleteEvent = (id: string) => {
    setStructuredData(prevData => prevData.filter(item => item.id !== id));
  };
  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      date: '',
      event: ''
    };
    setStructuredData(prevData => [...prevData, newEvent]);
  };

  // 3. [核心改造] "生成图表"按钮的逻辑被完全重写
  const handleGenerateDiagram = () => {
    if (structuredData.length === 0) {
      alert("没有可用于生成图表的数据！");
      return;
    }
    
    try {
      // 1. 创建一个唯一的ID作为key
      const diagramId = `diagram-data-${Date.now()}`;

      // 2. 将当前编辑好的数据（转换回JSON字符串）存入浏览器的localStorage
      localStorage.setItem(diagramId, JSON.stringify({
        type: analysisType,
        data: structuredData
      }));

      // 3. 使用router跳转到新的图表页面，并将ID作为URL的一部分
      router.push(`/diagram/${diagramId}`);

    } catch (error) {
      console.error("存储或跳转失败:", error);
      alert("生成图表链接失败，请重试。");
    }
  };


  // === 界面渲染区 (布局调整) ===
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">诉讼可视化工具 (V0.6)</h1>
      {/* 4. [布局优化] 既然图表区移除了，我们改为更宽敞的两列布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- 第一列：输入与控制 --- */}
        <div className="flex flex-col space-y-6">
          <TextInputArea onTextChange={setLegalText} />
          <AnalysisTypeSelector value={analysisType} onChange={setAnalysisType} />
          <AnalysisConfiguration isAnalyzing={isAnalyzing} onAnalyzeClick={handleAnalyze} />
        </div>
        
        {/* --- 第二列：数据编辑区 --- */}
        <div className="flex flex-col space-y-4">
          <DataEditor 
            events={structuredData}
            onEventChange={handleEventChange}
            onDeleteEvent={handleDeleteEvent}
            onAddEvent={handleAddEvent}
          />
          <button
            onClick={handleGenerateDiagram}
            disabled={structuredData.length === 0 || isAnalyzing}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            生成图表并打开新页面
          </button>
        </div>
        
        {/* 第三列的图表区已移除 */}
      </div>
    </main>
  );
}
