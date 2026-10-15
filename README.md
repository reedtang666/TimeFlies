# ⏱️ TimeFlies · 艾莎小公主的冰雪奇缘时光胶囊 ❄️

<div align="center">

![Disney Frozen Time Capsule](https://img.shields.io/badge/Disney%20Frozen-Time%20Capsule-70e4ff?style=for-the-badge&logo=disney&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local-10b981?style=for-the-badge&logo=lock)

<p align="center">
  <b>“做你自己的女王，勇敢去光芒亮丽闪耀吧！”</b><br>
  用心记录陪伴女儿长大的每一秒 · 极简、精致、治愈的冰雪奇缘魔法成长纪念册
</p>

[✨ 在线体验](https://time-flies-zeta.vercel.app/) · [⭐ GitHub 仓库](https://github.com/reedtang666/TimeFlies) · [📖 部署教程](#-快速上手与部署指南-getting-started--deployment)

</div>

---

## ✨ 项目特色与核心功能 (Features)

### 1. ⏱️ 精确到毫秒的成长魔法计时器 (Growth Time Tracker)
- 实时精确计算宝贝自降临星海以来的成长时长：包含**累计总天数**、**年 / 月 / 日**以及跳动的**时 / 分 / 秒**。
- 支持毫秒级平滑过渡、艾莎冰晶微光呼吸动效与动态雪花粒子系统。

### 2. 👑 圆形头像智能裁剪与全格式兼容 (Circular Avatar Cropper)
- **直接选图 / 拖拽上传**：支持从电脑或手机直接拖放照片至头像框。
- **交互式圆形裁剪器**：配有冰晶发光圆环取景框，支持鼠标/触屏拖拽平移、滑块/滚轮多维缩放与 90° 顺时针旋转。
- **苹果 iPhone .HEIC 自动解码**：内置专属解码引擎，手机拍摄的高清 `.HEIC` 实况原图可直接解析。
- **全站同步与防黑边**：首页、皇家护照、纪念海报实时同步更新，自动处理圆角边缘黑边问题。

### 3. 📸 拍立得与多模版高清海报导出器 (Polaroid & Poster Generator)
- 提供 **3 款高颜值冰雪主题海报模版**：
  1. **纯正经典拍立得 (Classic Polaroid)**：0 黑边方框相片、右下角累计天数胶囊、经典白色留白手写排版。
  2. **阿伦黛尔皇家官方证书 (Royal Certificate)**：皇室肖像金环、烫金艾莎女王皇家印章、真实编号与签发防伪标识。
  3. **极光多维数据战报 (Aurora Glow Stats)**：深邃冰雪极光渐变背景、心跳/呼吸/日出日落/奇幻梦境多维生命数据展示。
- **灵活选图制作**：支持直接从相册生活照、当前头像中一键挑选，亦可直接上传新照片制作海报。
- **寄语随心换**：内置多句深情冰雪成长寄语，支持点击一键随机刷新。
- **2.5x 超清导出**：基于 HTML Canvas 高清渲染，移动端支持长按保存至相册，电脑端一键下载高清 PNG。

### 4. 🖼️ 动态周岁成长相册 (Dynamic Photo Gallery)
- **周岁动态感知**：系统根据出生日期自动计算当前年龄，动态解锁 **1 周岁、2 周岁、3 周岁、4 周岁** 专属卡片。
- **时光封印规则**：尚未到达的周岁卡片自动置于“未完待续 · 未来魔法封印中”状态。
- **免裁剪原图直传**：支持点击上传与直接拖拽替换生活照，支持全屏高清灯箱（Lightbox）查看原图。

### 5. 💌 爸爸妈妈的时光信箱 (Time Capsule Letters)
- 封印着写给未来 **10 岁、18 岁成人礼** 小女王的深情书信。
- **时间封印规则**：未到解锁年龄时信件处于魔法封印状态，展示封印倒计时，保证未来的惊喜感；到达指定年龄后自动解锁拆封。
- **信件自由管理**：管理员可在线新增、编辑或删除信件内容，随时记录父母的心里话。

### 6. 📜 阿伦黛尔皇家小公主通行证 (Royal Passport)
- 专属皇家身份通行证，记录皇家姓名、守护者誓言、降临星海日期与独一无二的护照编号。
- 可交互点击加盖 **“艾莎女王皇家魔法金印”**，伴随五彩冰晶礼花与音效反馈。

### 7. 🎵 内置《Let It Go》背景音乐与断点记忆播放器 (Floating Music Player)
- **本地高清音轨**：默认内置并播放本地《冰雪奇缘》主题曲 `Let It Go`，零网络依赖，秒级播放。
- **断点记忆续播**：自动将当前播放进度保存至本地，刷新页面或下次访问时**自动恢复停留在上次进度**。
- **悬浮可拖拽进度条**：底部精致冰雪悬浮控制栏，支持点击/拖拽进度条快进快退、调节音量与静音。
- **一键折叠收缩**：默认收起为右下角发光唱片浮标，点击随时展开或最小化。
- **自定义音轨**：支持在设置中填入外部网络 MP3 音频直链，或一键恢复默认音乐。

### 8. 🎹 艾莎冰雪魔法音律琴 (Ice Chime Piano)
- 基于 Web Audio API 打造的八音律冰晶琴键，随手弹奏《Let It Go》主旋律音符并触发冰雪音效。

### 9. 📊 生命的奇迹维度 (Life Metrics)
- 趣味换算宝贝在地球上的**心跳次数**、**呼吸次数**、**看过的日出日落**与**奇幻梦境时长**。

### 10. ⭐ 制作同款与开源引导 (Make Your Own / Open Source)
- **顶部魔法胶囊按钮**：ElsaHeader 右上角常驻微光「制作同款」胶囊按钮，方便访客一键访问 GitHub 开源仓库。
- **底部常驻毛玻璃卡片**：页面底部常驻高颜值冰雪毛玻璃推广条，引导其他宝爸宝妈和开发者免费获取源码一键制作。

---

## 🛡️ 安全权限与管理员鉴权规则 (Admin Auth Rules)

为了防止分享给亲友或公网访客时网站数据被随意修改，本项目设计了**管理员身份验证机制**：

### 1. 权限拦截规则
- **访客权限（免密）**：
  - ✅ 浏览计时器、查看成长相册灯箱、翻看皇家通行证；
  - ✅ 聆听背景音乐、弹奏冰雪琴键、点击释放冰雪魔法；
  - ✅ 导出与保存拍立得/纪念海报。
- **管理员权限（需密码）**：
  - 🔒 更换宝宝专属头像与裁剪；
  - 🔒 修改站点配置（宝宝姓名、出生日期、父母寄语、主题配色等）；
  - 🔒 上传、替换与删除成长相册中的照片；
  - 🔒 撰写、修改与删除时光胶囊信件；
  - 🔒 进行云端同步数据的保存与拉取。

### 2. 鉴权与 Session 保持
- 敏感操作会自动唤起冰晶风格的 **管理员身份验证弹窗 (`AdminAuthModal`)**。
- 密码输入正确后，当前会话将**保持登录状态**，无需在每次操作时重复输入密码。
- 会话仅保存在当前浏览器内存/Session 中，关闭会话后安全失效。

---

## ☁️ 数据存储与云端同步规则 (Data Storage & Cloud Sync)

### 1. 默认模式：100% 纯前端本地存储（Privacy First）
- 默认无任何云端上报和数据库依赖，所有照片、寄语及个性化配置仅保存在浏览器的 `localStorage` 中。
- **宝宝的个人照片绝不会上传至第三方服务器或写入代码仓库**，确保 100% 私密安全。

### 2. 可选模式：跨设备云端同步（Vercel KV / Upstash Redis）
若需要同时在手机、iPad 和电脑上管理相册与寄语，或宝爸宝妈双方跨设备同步：
- 项目内置了 Serverless 云端同步接口（位于 `api/capsule.ts`）。
- 在设置弹窗中点击 **「保存到云端」** 即可备份数据并生成专属同步密钥；在另一台设备输入密钥后点击 **「从云端拉取」** 即可一键恢复。
- 该接口需配合 **Vercel KV** 或 **Upstash Redis** 使用，未配置时自动平滑回退至纯本地存储。

---

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 8](https://vitejs.dev/)
- **样式与设计**：[Tailwind CSS](https://tailwindcss.com/) + 手工调优 Luxury Ice Glassmorphism 冰晶磨砂质感
- **音频系统**：HTML5 Audio + Web Audio API 纯代码合成冰雪音效引擎
- **图片与海报**：HTML Canvas + [html-to-image](https://github.com/bubkoo/html-to-image) + [heic2any](https://github.com/alexcorvi/heic2any)
- **图标库**：[Lucide React](https://lucide.dev/) + 自定义 GitHub SVG 图标
- **粒子特效**：[Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Serverless API**：Vercel Serverless Function + Upstash Redis / Vercel KV

---

## 🚀 快速上手与部署指南 (Getting Started & Deployment)

### 1. 克隆项目与安装依赖
```bash
git clone https://github.com/reedtang666/TimeFlies.git
cd TimeFlies

# 安装依赖
npm install
# 或使用 yarn / pnpm
```

### 2. 配置环境变量
复制环境变量模板：
```bash
cp .env.example .env
```
在 `.env` 中修改管理员密码：
```env
# 管理员操作密码（请修改为你的专属密码）
VITE_ADMIN_PASSWORD=your_secure_password
```

### 3. 本地启动预览
```bash
npm run dev
```
打开浏览器访问 `http://localhost:5173` 即可开始预览。

### 4. 生产构建
```bash
npm run build
```
构建产物输出于 `dist/` 目录。

### 5. 一键部署到 Vercel (推荐)
1. 将本项目 Fork 到你自己的 GitHub 账号；
2. 进入 [Vercel 控制台](https://vercel.com/)，点击 **Add New Project** 并导入你的仓库；
3. 在 **Settings -> Environment Variables** 中添加环境变量：
   - `VITE_ADMIN_PASSWORD`：你设置的管理员密码（必填）
   - `KV_REST_API_URL`：Vercel KV REST URL（可选，仅在使用云端同步时配置）
   - `KV_REST_API_TOKEN`：Vercel KV REST Token（可选，仅在使用云端同步时配置）
4. 点击 **Deploy**，等待 1 分钟即可生成你的专属访问域名！

---

## 💡 URL 参数定制规则 (URL Parameters)

可通过 URL 携带参数直接生成专属分享链接（非常适合发给爷爷奶奶或朋友）：
```text
https://your-domain.com/?name=爱莎小公主&dob=2022-06-16T08:30&theme=ice-blue
```

| 参数名 | 含义 | 示例 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | 宝贝姓名 / 昵称 | `爱莎小公主` | 会同步展示在首页、护照与海报中 |
| `dob` | 出生日期与时间 | `2022-06-16T08:30` | 格式须遵循 `YYYY-MM-DDTHH:mm` |
| `quote` | 父母深情寄语 | `做你自己的女王` | 显示在每日格言与海报中 |
| `theme` | 主题视觉风格 | `ice-blue` | 可选：`ice-blue` / `aurora-purple` / `winter-rose` |

---

## 💖 致谢与开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源协议。  
愿每一个小宝贝都能在爱与温暖中无畏成长，做自己的女王，勇敢去光芒亮丽闪耀！❄️👑
