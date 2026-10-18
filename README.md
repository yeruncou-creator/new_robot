# 新闻资讯 App(xwzx-news)

基于 **FastAPI + Vue 3** 的全栈移动端新闻资讯应用,并集成了基于 **RAG + ReAct Agent** 的 AI 智能问答服务。

> 本项目为一个练习性质的全栈项目,包含新闻后端、移动端前端、AI 问答服务三部分,适合学习 FastAPI / Vue3 / RAG 的完整实践。

## ✨ 功能特性

- **新闻浏览**:分类导航、新闻列表(分页加载)、新闻详情(浏览量统计、相关推荐)
- **用户系统**:注册 / 登录(Token 鉴权)、个人中心、修改密码、编辑个人简介
- **收藏与历史**:新闻收藏(本地 + 服务端同步)、浏览历史
- **国际化**:中 / 英文界面切换(vue-i18n)
- **AI 问答**:集成 [RAG_Agent_robot](RAG_Agent_robot/)(RAG + ReAct Agent 智能客服),支持 SSE 流式输出、Markdown 渲染、打字动画

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3、Vite、Vant 4、Pinia、Vue Router、vue-i18n、axios、marked |
| 后端 | FastAPI、SQLAlchemy 2(异步)、MySQL 8、Redis(缓存)、passlib(bcrypt 加密) |
| AI 问答 | LangChain 1.x、LangGraph(ReAct Agent)、ChromaDB 向量库、通义千问 qwen-max + text-embedding-v4(阿里云 DashScope) |

## 📁 项目结构

```
├── news-headline-backend/        # FastAPI 新闻后端(端口 8000)
│   ├── routers/                  # 路由:news / users / favorite
│   ├── crud/                     # 数据库操作层
│   ├── models/                   # SQLAlchemy ORM 模型
│   ├── schemas/                  # Pydantic 模型
│   ├── config/                   # 数据库、Redis 缓存配置
│   ├── utils/                    # Token 鉴权、统一响应、异常处理
│   └── database.sql              # 建库建表脚本(含测试数据)
├── news-headline-frontend/       # Vue3 移动端前端(默认端口 5173)
│   └── src/
│       ├── views/                # 页面:首页/分类/详情/收藏/历史/AI问答/我的...
│       ├── store/                # Pinia 状态管理
│       ├── router/               # 路由配置
│       ├── config/               # API 地址等配置
│       └── i18n/                 # 中英文语言包
└── RAG_Agent_robot/              # AI 问答服务(独立 FastAPI,端口 8001)
    ├── backend/main.py           # 入口,提供 POST /api/chat(SSE 流式)
    ├── agent/                    # ReAct Agent + 工具(天气、使用报告等)
    ├── rag/                      # Chroma 向量检索服务
    ├── config/ prompts/ data/    # 配置、提示词、知识库文件(txt/pdf)
    └── frontend/                 # 它自己的前端(本项目未使用,可忽略)
```

## 🚀 快速开始

### 环境要求

- Python 3.10+(每个 Python 项目使用各自的 venv)
- Node.js 18+
- MySQL 8、Redis(默认 localhost:3306 / 6379)

### 1. 初始化数据库

```bash
# 创建数据库并导入建表脚本(含分类、新闻、测试账号等种子数据)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS news_app DEFAULT CHARSET utf8mb4;"
mysql -u root -p news_app < news-headline-backend/database.sql
```

> 数据库账号密码在 `news-headline-backend/config/db_conf.py` 中修改(默认 `root/123456`,库名 `news_app`)。

### 2. 启动新闻后端(端口 8000)

```bash
cd news-headline-backend
python -m venv .venv
.venv\Scripts\activate          # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. 启动前端(端口 5173)

```bash
cd news-headline-frontend
npm install
npm run dev
```

浏览器打开 `http://127.0.0.1:5173` 即可访问。

### 4. 启动 AI 问答服务(端口 8001,可选)

```bash
cd RAG_Agent_robot
python -m venv .venv
.venv\Scripts\activate          # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# 设置阿里云 DashScope API Key(必填,前端不再保存密钥)
set DASHSCOPE_API_KEY=sk-xxxx   # Linux/macOS: export DASHSCOPE_API_KEY=sk-xxxx

python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
```

不启动 AI 服务时,新闻浏览、用户、收藏等功能不受影响,仅"AI 问答"页不可用。
AI 服务的地址配置在 `news-headline-frontend/src/config/api.js` 的 `ragChatConfig` 中。

## 👤 默认测试账号

| 用户名 | 密码 |
|---|---|
| admin | 123456 |

(在 `database.sql` 中预置,首次启动即可登录)

## 🔌 主要接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/news/categories` | 新闻分类 |
| GET | `/api/news/list` | 新闻列表(分页,参数 categoryId/page/pageSize) |
| GET | `/api/news/detail` | 新闻详情(参数 id) |
| POST | `/api/user/register` | 注册 |
| POST | `/api/user/login` | 登录(返回 Token) |
| GET | `/api/user/info` | 用户信息(需 Authorization) |
| PUT | `/api/user/update` | 更新个人资料(需 Authorization) |
| PUT | `/api/user/password` | 修改密码(需 Authorization) |
| GET | `/api/favorite/check` | 收藏状态(参数 newsId) |
| POST | `/api/favorite/add` | 添加收藏 |
| DELETE | `/api/favorite/remove` | 取消收藏(参数 newsId) |
| GET | `/api/favorite/list` | 收藏列表(分页) |
| DELETE | `/api/favorite/clear` | 清空收藏 |
| POST | `/api/chat` | AI 对话(SSE 流式,由 RAG_Agent_robot 服务提供,端口 8001) |

除登录/注册/新闻接口外,均需在请求头携带 `Authorization: <登录返回的 Token>`。

## 🤖 关于 AI 问答(RAG_Agent_robot)

`RAG_Agent_robot` 原为独立项目 **robot-vacuum-cs**——基于 RAG + ReAct Agent 的扫地机器人智能客服,支持流式对话、天气环境适配与个性化使用报告生成。

集成方式为**独立服务**:它保持自己的代码、依赖和知识库,单独跑在 8001 端口,新闻前端直连它的 SSE 接口,双方互不侵入(详见 [RAG_Agent_robot/README.md](RAG_Agent_robot/README.md))。

知识库管理:将 txt / pdf 放入 `RAG_Agent_robot/data/` 目录即可,服务会自动切片并写入 Chroma 向量库(按文件 MD5 去重,重复文件不会重复处理)。

## ⚠️ 常见问题

- **启动后端报 `WinError 10048`(端口占用)**:多为 `uvicorn --reload` 留下的僵尸进程,用
  `powershell Get-NetTCPConnection -LocalPort 8000` 查到 PID 后 `taskkill //F //PID <pid>`。
- **启动报 `ModuleNotFoundError: passlib`**:必须使用项目自带 venv 的 Python 启动,不要用全局 Python。
- **AI 问答报 "Failed to fetch"**:检查 8001 端口的 AI 服务是否已启动、`DASHSCOPE_API_KEY` 是否设置。
- **数据库连接失败**:确认 MySQL 已启动,且 `config/db_conf.py` 中的账号密码与本机一致。
