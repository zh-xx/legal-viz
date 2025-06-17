// app/diagram/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// 这个页面将负责接收并显示图表
const DiagramPage = () => {
  const params = useParams(); // 获取URL中的动态参数，比如 id
  const id = params.id as string;

  const [diagramData, setDiagramData] = useState<any>(null);

  // 当页面加载后，从localStorage中读取数据
  useEffect(() => {
    if (id) {
      const savedData = localStorage.getItem(id);
      if (savedData) {
        setDiagramData(JSON.parse(savedData));
        // 为了安全和整洁，数据读取后可以立即从localStorage中删除
        localStorage.removeItem(id);
      }
    }
  }, [id]); // 依赖于id，当id变化时重新运行

  if (!diagramData) {
    return <div>正在加载图表数据...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">图表详情页</h1>
      <p className="text-sm text-gray-600 mb-4">图表ID: {id}</p>
      
      <div className="p-4 bg-gray-100 rounded-md">
        <h2 className="font-semibold mb-2">接收到的数据：</h2>
        {/* 我们先在这里以文本形式展示数据，验证数据传递成功 */}
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(diagramData, null, 2)}
        </pre>
      </div>
      
      {/* 下一步，我们将在这里集成Draw.io编辑器 */}
      <div className="mt-8 border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
        <p className="text-gray-500">Draw.io 编辑器将在此处渲染</p>
      </div>
    </div>
  );
};

export default DiagramPage;