# Python Quest · 30 天冒险学院

把 Python 学习，玩成一场冒险。一个面向浏览器的中文 30 天 Python 工程训练营，用关卡、经验值、徽章和 Boss 战，把学习过程变成可持续推进的游戏。

## ✨ 产品体验

- **30 个每日关卡**：从 Python 语法、数据结构一路学习到 FastAPI、SQLAlchemy、asyncio、Pytest、Debug、安全、Docker 和 AI Code Review。
- **四片冒险大陆**：Python 森林、API 城堡、Debug 深渊、交付者群岛。
- **游戏化反馈**：通关获得 XP，升级称号，解锁 8 枚成就徽章。
- **每日实战**：每关都有目标、知识卡、代码示例、动手任务、交付标准和互动测验。
- **Boss 战**：Day 7、14、21、30 是阶段综合挑战。
- **学习状态本地保存**：进度、经验值、连续打卡和实战记录保存在浏览器 localStorage。
- **专注计时器**：内置 25 分钟专注模式。
- **存档导出**：可以导出 JSON 学习进度。
- **响应式 UI**：适配桌面、平板和手机，支持深色模式。

## 🚀 本地运行

这是纯静态 Web 应用，不需要安装 Node.js，也不需要后端服务。

~~~bash
git clone https://github.com/b8vipvip/python-30day.git
cd python-30day
~~~

直接用浏览器打开 index.html 即可。也可以启动一个本地静态服务器：

~~~bash
python -m http.server 8080
~~~

然后访问 http://localhost:8080。

## 🌍 部署到 GitHub Pages

仓库已经包含 GitHub Actions 工作流：.github/workflows/deploy.yml。

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。首次启用需要仓库管理员手动完成这一步；GitHub Actions 的仓库令牌无法替仓库创建 Pages 站点。
3. 推送到 main 分支，或在 Actions 页面手动运行 **Deploy Python Quest to GitHub Pages**。
4. 等待工作流成功后，通过 GitHub Pages 给出的地址访问网站。

站点是静态部署，课程内容和交互逻辑会随仓库版本更新。

## 🗺️ 30 天课程地图

| 关卡 | 主题 | 天数 |
|---|---|---:|
| Python 森林 | 语法、容器、函数、异常、生成器、装饰器、JSON 项目 | 1–7 |
| API 城堡 | FastAPI、Pydantic、SQLAlchemy、事务、HTTPX、asyncio | 8–14 |
| Debug 深渊 | Pytest、Mock、集成测试、并发、Debug、安全 | 15–21 |
| 交付者群岛 | Docker、可靠性、AI Code Review、评估系统实战与交付 | 22–30 |

## 🏗️ 文件结构

~~~text
.
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
~~~

## 🧭 进度与隐私

- 学习进度只保存在当前浏览器的 localStorage，不会上传到服务器。
- 清除浏览器站点数据会清除本地进度；建议定期使用“导出我的学习存档”备份。
- 更换设备或浏览器时，目前需要手动导出/保留存档；跨设备同步不在当前静态版本范围内。

## 🔐 关于最终项目的安全边界

课程最终项目会练习代码评估 Worker 的架构。**不要在 Web API 进程中直接执行不可信用户代码，也不要把 Docker Socket 或宿主机敏感目录暴露给执行容器。**真实执行环境应采用独立隔离、非 root 用户、禁网、只读文件系统、CPU/内存/进程数限制和超时控制。当前网站是学习平台，不会在浏览器或服务器上执行用户提交的代码。

## 📄 License

课程示例与学习站点代码按仓库实际 License 使用；若后续增加第三方素材，请在此补充对应许可信息。
