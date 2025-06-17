// app/components/DataEditor.tsx (V2 - 交互式表单编辑器)

'use client';
import React from 'react';

// 1. 导入我们在page.tsx中定义的类型
// (在更大型的项目中，我们会把这个类型定义放到一个单独的 .ts 文件中)
interface TimelineEvent {
  id: string;
  date: string;
  event: string;
}

// 2. 定义这个组件需要从父组件接收哪些东西
interface DataEditorProps {
  events: TimelineEvent[]; // 不再是字符串，而是一个事件对象数组
  onEventChange: (id: string, field: 'date' | 'event', value: string) => void;
  onDeleteEvent: (id: string) => void;
  onAddEvent: () => void;
}

const DataEditor: React.FC<DataEditorProps> = ({ 
  events, 
  onEventChange, 
  onDeleteEvent, 
  onAddEvent 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        AI生成的结构化数据 (可编辑)
      </h3>
      <div className="space-y-3">
        {/* 3. 使用 .map() 遍历数组，为每个事件对象生成一行编辑UI */}
        {events.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-md bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">事件 {index + 1}</span>
              <button
                onClick={() => onDeleteEvent(item.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                删除
              </button>
            </div>
            
            <div>
              <label htmlFor={`date-${item.id}`} className="text-xs font-medium text-gray-500">日期</label>
              <input
                type="text"
                id={`date-${item.id}`}
                value={item.date}
                onChange={(e) => onEventChange(item.id, 'date', e.target.value)}
                className="block w-full mt-1 p-1 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor={`event-${item.id}`} className="text-xs font-medium text-gray-500">事件描述</label>
              <textarea
                id={`event-${item.id}`}
                value={item.event}
                rows={2}
                onChange={(e) => onEventChange(item.id, 'event', e.target.value)}
                className="block w-full mt-1 p-1 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* 4. 新增事件的按钮 */}
      <button
        onClick={onAddEvent}
        className="w-full mt-4 py-2 px-4 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
      >
        + 新增事件
      </button>
    </div>
  );
};

export default DataEditor;