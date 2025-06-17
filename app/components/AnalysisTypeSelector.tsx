// app/components/AnalysisTypeSelector.tsx (修正版)

'use client';

import React from 'react';

interface AnalysisTypeSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const AnalysisTypeSelector: React.FC<AnalysisTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="analysis-type" className="block text-sm font-medium text-gray-700 mb-2">
        选择分析类型:
      </label>
      <select
        id="analysis-type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {/* 已严格按照您指定的名称修改 */}
        <option value="timeline">时间图</option>
        <option value="relationship">关系图</option>
        <option value="data" disabled>数据图 (开发中)</option>
        <option value="other" disabled>其他图 (开发中)</option>
      </select>
    </div>
  );
};

export default AnalysisTypeSelector;