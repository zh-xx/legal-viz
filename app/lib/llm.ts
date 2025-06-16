// app/lib/llm.ts

// 定义我们期望从DeepSeek API收到的回复长什么样
// 我们只关心choices数组里的message.content
interface DeepSeekResponse {
    choices: {
      message: {
        content: string;
      };
    }[];
  }
  
  // 这是一个异步函数，专门负责调用DeepSeek API
  export const callDeepSeek = async (apiKey: string, textToAnalyze: string): Promise<string> => {
    // DeepSeek API的官方地址
    const API_URL = "https://api.deepseek.com/chat/completions";
  
    // 这是我们发送给AI的核心指令 (Prompt)
    const systemPrompt = `你是一个专业的法律助手。你的任务是分析给定的法律文书，并清晰、简洁地提取关键的案件时间线。请只输出时间线列表，每条一行，格式为“YYYY年MM月DD日：事件描述。”`;
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST', // 我们是发送数据，所以用POST方法
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // 在请求头中携带API Key
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 指定使用的模型
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: textToAnalyze // 用户提供的法律文书
            }
          ],
          stream: false // 我们需要等待完整回复，所以关闭流式输出
        })
      });
  
      // 如果网络请求本身就不成功（比如服务器500错误）
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
      }
  
      const data: DeepSeekResponse = await response.json();
  
      // 从返回的数据中，提取出我们真正需要的内容
      const resultText = data.choices[0]?.message?.content;
  
      if (!resultText) {
        throw new Error("AI did not return any content.");
      }
  
      return resultText.trim();
  
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      // 如果发生任何错误，都返回一条用户友好的错误信息
      return "分析失败，请检查API Key或网络连接，并查看控制台获取详细错误信息。";
    }
  };