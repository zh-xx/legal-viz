// app/lib/llm.ts (V2 - 输出JSON)

// 这个函数现在更灵活了，它会根据分析类型，生成不同的Prompt
export const callDeepSeek = async (
  apiKey: string,
  textToAnalyze: string,
  analysisType: string // 新增参数，告诉AI我们想要什么类型的分析
): Promise<string> => {

  const API_URL = "https://api.deepseek.com/chat/completions";

  // 根据不同的分析类型，生成不同的“系统指令”
  const getSystemPrompt = (type: string) => {
    if (type === 'timeline') {
      return `你是一个专业的法律助手。你的任务是分析给定的法律文书，并以JSON格式输出案件的关键时间线。JSON对象必须包含一个名为 "events" 的数组，数组中每个对象都有 "date" 和 "event" 两个字段。不要输出任何其他解释性文字，只输出纯粹的JSON对象。
      示例:
      {
        "events": [
          { "date": "2023-05-10", "event": "原告与被告签订合同" },
          { "date": "2023-11-10", "event": "借款到期，被告未还款" },
          { "date": "2024-01-15", "event": "原告发送律师函" }
        ]
      }`;
    }
    if (type === 'relationship') {
      return `你是一个专业的法律助手。你的任务是分析给定的法律文书，并以JSON格式输出案件的关键人物及他们的关系。JSON对象必须包含 "nodes" 和 "edges" 两个数组。"nodes"中每个对象有 "id" 和 "label" 字段。"edges"中每个对象有 "from", "to", "label" 字段。不要输出任何其他解释性文字，只输出纯粹的JSON对象。
      示例:
      {
        "nodes": [
          { "id": "A", "label": "张三 (原告)" },
          { "id": "B", "label": "李四 (被告)" },
          { "id": "C", "label": "王五 (代理律师)" }
        ],
        "edges": [
          { "from": "A", "to": "B", "label": "借款" },
          { "from": "C", "to": "A", "label": "代理" }
        ]
      }`;
    }
    // 默认返回一个通用提示
    return '你是一个有用的助手，请以JSON格式回答问题。';
  }

  const systemPrompt = getSystemPrompt(analysisType);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: textToAnalyze }
        ],
        // 新增一个重要参数，强制AI输出JSON格式
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // AI返回的直接就是JSON对象，我们提取它
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // 返回这个JSON内容的字符串形式
    return content;

  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return `{"error": "分析失败，请检查API Key或网络连接，并查看控制台获取详细错误信息。"}`;
  }
};