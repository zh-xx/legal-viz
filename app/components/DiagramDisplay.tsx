// app/components/DiagramDisplay.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// 定义这个组件接收的参数
interface DiagramDisplayProps {
  chartCode: string; // 将接收AI生成的Mermaid代码字符串
}

// 初始化Mermaid的配置，可以设置主题等
mermaid.initialize({
  startOnLoad: false, // 我们将手动控制渲染，所以关闭自动渲染
  theme: 'default', // 'default', 'neutral', 'dark', 'forest'
  securityLevel: 'loose',
});

const DiagramDisplay: React.FC<DiagramDisplayProps> = ({ chartCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // useEffect是React的关键，用于处理组件渲染后的“副作用”
  // 在这里，我们的“副作用”就是调用Mermaid库来绘制图表
  useEffect(() => {
    // 确保chartCode有内容，并且containerRef已经绑定到div元素上
    if (chartCode && containerRef.current) {
      // 异步渲染图表
      const renderDiagram = async () => {
        try {
          // 使用Mermaid API来渲染图表
          // 它会寻找一个带有 "mermaid" class的元素并把图表注入进去
          // 但为了更精确控制，我们直接操作DOM
          const { svg } = await mermaid.render('mermaid-diagram', chartCode);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            // 如果Mermaid代码本身有语法错误，显示错误信息
            containerRef.current.innerHTML = '无法渲染图表，请检查AI生成的代码。';
          }
        }
      };

      renderDiagram();
    }
  }, [chartCode]); // 这个数组告诉React：只有当chartCode变化时，才重新运行上面的effect

  // 如果没有图表代码，就显示提示信息
  if (!chartCode) {
    return <p className="text-gray-500">AI提取的关键信息将在此处以图表形式显示</p>;
  }

  // 返回一个div作为Mermaid渲染图表的容器
  return <div ref={containerRef} className="mermaid-container" />;
};

export default DiagramDisplay;