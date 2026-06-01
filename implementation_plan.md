# 高质感 Claude Docs 风格 Astro 博客实现计划

本项目将构建一个具备极高视觉质感、极简精致的个人博客。我们基于 Astro 框架（静态网站生成 SSG）从零自定义搭建，样式 100% 手写以完美还原 Claude Docs（`https://code.claude.com/docs`）的字体与排版美感，并完整支持 Docker 容器化部署（多阶段构建 + Nginx）。

---

## 视觉与设计规范 (Claude Docs 风格)

为了还原 Claude Docs 的高级学术与科技交融的质感，我们将定义以下设计规范：

1. **字体系统**：
   - **标题字体**：采用优雅的书卷气 Serif 字体（如 `Lora` 或 `Newsreader`），展现优雅的主标题与正文标题。
   - **正文字体**：采用高可读性、现代科技感的 Sans 字体（如 `Inter` 或 `Outfit`）。
   - **代码字体**：采用干净等宽的 `JetBrains Mono` 或 `Fira Code`。
2. **色彩搭配 (双色主题)**：
   - **暖光模式 (Warm Light Mode)**：
     - 背景色：极其温润的奶白色/温暖米黄 `#FBFBFA` 或 `#FAF8F5`。
     - 正文字体：深邃的黑褐色 `#191816`。
     - 辅助边框与线条：温和的卡其灰 `#E6E4E0`。
     - 交互高亮（Accent）：铜金色/琥珀色 `#C27803` 或深黑茶色 `#2C221E`。
   - **暗夜模式 (Warm Dark Mode)**：
     - 背景色：低调深沉的暗褐炭黑 `#131211` 或 `#1B1917`。
     - 正文字体：柔和奶白 `#F4F4F3`。
     - 辅助边框与线条：暗沉暖灰 `#2E2B28`。
     - 交互高亮（Accent）：古铜金 `#E0A96D` 或微透琥珀。
3. **微动效与质感细节**：
   - **极简网格线**：采用极其细致的 `0.5px` 浅色网格边框（Border）来分割头部、侧边栏与主内容区。
   - **交互悬浮**：Hover 链接时呈现温和的下划线展开动效，卡片悬浮呈现极其细微的位移与渐变投影。
   - **高质感 Markdown 渲染**：
     - 精美的 `Shiki` 代码高亮，配备浮动代码语言标签与 "一键复制" 按钮。
     - 现代 Callout（提示框），左侧配有一根粗色线和精致的小图标，背景采用微透的莫兰迪色系。

---

## 系统架构与目录结构

```
/Users/wyx/project/zzz/
├── package.json               # 依赖与脚本
├── tsconfig.json              # TypeScript 配置
├── astro.config.mjs           # Astro 配置文件 (配置 MDX, Tailwind, Sitemap 等)
├── tailwind.config.cjs        # Tailwind 配置文件 (定制 Claude Docs 配色与字体)
├── postcss.config.cjs         # CSS 后处理
├── Dockerfile                 # Docker 多阶段构建文件 (Node.js 构建 -> Nginx 部署)
├── nginx.conf                 # Nginx 配置文件 (包含静态缓存、Gzip、单页路由等)
├── .dockerignore              # Docker 忽略文件
├── src/
│   ├── content/
│   │   ├── config.ts          # Astro Content Collections 强类型配置
│   │   └── blog/              # Markdown / MDX 博客文章
│   │       ├── my-first-post.md
│   │       └── deploying-with-docker.md
│   ├── components/
│   │   ├── Header.astro       # 顶部导航栏 (包含 Theme 切换按钮与极细分割线)
│   │   ├── Footer.astro       # 底部信息栏
│   │   ├── Card.astro         # 博客文章卡片
│   │   ├── Search.tsx         # 纯前端模糊搜索 (Fuse.js + React/Preact 或纯 JS 实现)
│   │   ├── TOC.astro          # 文章目录 (Table of Contents，随滚动高亮当前章节)
│   │   ├── Tag.astro          # 标签组件
│   │   └── FormattedDate.astro# 日期格式化组件
│   ├── layouts/
│   │   ├── Layout.astro       # 通用页面布局基底 (SEO 元数据、字体引入、极简网格线背景)
│   │   └── PostLayout.astro   # 文章详情页专属布局 (左/右侧边目录、阅读进度、返回顶部)
│   ├── pages/
│   │   ├── index.astro        # 博客首页 (Slogan、最近文章、热门标签)
│   │   ├── posts/
│   │   │   ├── [...slug].astro# 文章详情路由 (支持草稿隐藏)
│   │   │   └── [page].astro   # 全部文章列表页 (带优雅的响应式分页)
│   │   ├── tags/
│   │   │   ├── index.astro    # 所有标签汇总页
│   │   │   └── [tag]/[page].astro # 标签过滤文章页 (支持分页)
│   │   ├── search.astro       # 独立搜索页
│   │   └── rss.xml.ts         # RSS 订阅源生成器
│   └── styles/
│       └── global.css         # 全局样式文件 (引入字体、定义 Claude Docs 风格的主题变量、优化 markdown 渲染)
└── public/
    ├── favicon.svg            # 极简矢量 Favicon
    └── robots.txt             # 搜索引擎爬虫规则
```

---

## 核心实现步骤

### 第一阶段：初始化与基础配置 (Foundations)
1. **项目初始化**：在本地目录初始化 Astro 项目，安装必要的依赖：
   - `@astrojs/tailwind` (用于 CSS 样式)
   - `@astrojs/mdx` (支持更丰富的交互式文章)
   - `@astrojs/sitemap` (自动生成站点地图)
   - `fuse.js` (用于纯前端快速模糊搜索)
2. **样式基础设施**：
   - 创建 `src/styles/global.css`，配置 Google Fonts 导入（`Lora` 和 `Inter`）。
   - 配置 `tailwind.config.cjs`，加入温润暖色调背景、优雅边框和定制字体家族。
   - 实现无闪烁（Flash-free）的本地存储双色主题切换脚本，嵌入 HTML 头部。

### 第二阶段：内容 Collections 与数据源
1. **强类型配置**：编写 `src/content/config.ts`，定义博客文章的 Frontmatter Schema：
   - `title`: 标题 (string)
   - `description`: 描述 (string)
   - `pubDate`: 发布日期 (date)
   - `updatedDate`: 更新日期 (date, 可选)
   - `tags`: 标签数组 (array of strings)
   - `draft`: 是否草稿 (boolean, 默认 false)
   - `heroImage`: 文章封面图 (string, 可选)
2. **示例 Markdown 文章**：创建两篇具有代表性的 Markdown 示例，包含代码块、引用块、列表等，以展示高质感的渲染排版效果。

### 第三阶段：核心组件与页面开发
1. **基础骨架**：完成 `Header.astro`、`Footer.astro` 及通用布局 `Layout.astro`。
2. **首页与文章列表**：
   - `pages/index.astro`：精心排版的 Hero Section，采用精美 Serif 大字号，右下角配以精细网格线。
   - `pages/posts/[page].astro`：实现基于 Astro 标准的响应式分页文章列表。
3. **文章详情与目录**：
   - `layouts/PostLayout.astro`：主内容区域结合两栏布局，右侧展示浮动的目录树（TOC）。
   - `src/components/TOC.astro`：读取 Markdown 的 `headings` 数据，生成结构化目录，并附带 JS 监听器实现随滚动高亮当前标题。
   - 集成 `Shiki` 的内置代码高亮，通过 CSS 伪元素和 JS 添加复制按钮与语言类型展示。
4. **前端搜索**：
   - `src/components/Search.tsx`：利用 Fuse.js 进行多字段匹配，支持快捷键 `Ctrl + K` / `Cmd + K` 唤醒或在独立搜索页展示，完美还原 Spotlight 质感。
5. **RSS & Sitemap**：配置 `rss.xml.ts` 输出，并在构建时自动生成 XML 站点文件。

### 第四阶段：Docker 部署设计
1. **Dockerfile (多阶段构建)**：
   - **Stage 1 (Build)**：使用官方轻量级 `node:20-alpine` 镜像，执行 `npm install` 与 `npm run build` 生成 `/dist` 目录。
   - **Stage 2 (Serve)**：使用官方轻量级 `nginx:alpine` 镜像，将生成的静态文件拷贝至 `/usr/share/nginx/html`。
2. **Nginx 配置 (`nginx.conf`)**：
   - 优化静态资源缓存（针对 JS, CSS, Font 等文件设置 `Cache-Control`）。
   - 开启 Gzip 压缩，显著提升加载速度。
   - 正确配置 Clean URLs (例如访问 `/about` 不需要加 `.html`)。
3. **`.dockerignore`**：排除 `node_modules`, `.astro`, `dist` 等无关文件，确保镜像构建高效。

---

## 验证与测试方案

### 自动与本地验证
1. **代码质量验证**：
   - 运行本地构建命令 `npm run build`，确保无 TS 或 Astro 模板错误。
   - 本地启动测试服务 `npm run preview` 检查全局路由、分页与搜索。
2. **Docker 构建与运行验证**：
   - 运行 `docker build -t astro-claude-blog .` 进行容器构建。
   - 运行 `docker run -d -p 8080:80 astro-claude-blog` 在本地 `http://localhost:8080` 验证 Nginx 服务、Gzip、缓存以及路由响应。

### 视觉与体验微调 (手动验证)
- 检查移动端响应式布局（侧边栏目录是否在移动端优雅收起）。
- 验证双色主题切换时，无 CSS 闪烁或排版错位。
- 确认 Markdown 代码块的复制按钮能正常工作。

---

## 待 alignment 事项 & 建议

> [!NOTE]
> 1. **搜索组件方案**：我们将使用纯 JS / Preact 实现极简且性能极佳的搜索输入框，无需引入大型 React 包，保证最终生成的静态页面极度轻量。
> 2. **演示图片**：如果您的文章需要占位封面或插图，我们将使用本地图片或我们为您特别生成的艺术图片，绝不使用简陋的线上 URL 占位图。

如果您对上述实施方案、设计规范和技术架构表示满意，请予以批准。我们将在收到您的批准后立即进入开发阶段，并实时更新 `task.md` 来向您汇报开发进度！
