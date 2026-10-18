/**
 * API配置文件
 * 包含API基础URL和AI问答功能所需的API参数
 */

// API基础URL配置
export const apiConfig = {
  // 后端API基础URL
  baseURL: 'http://127.0.0.1:8000',
}

// RAG_Agent_robot 后端(独立服务,AI问答页面直连,密钥由该服务通过环境变量管理)
export const ragChatConfig = {
  // RAG 后端基础URL
  baseURL: 'http://127.0.0.1:8001',
}
