# ⏱️ TimeFlies · 艾莎小公主的冰雪奇缘时光胶囊 ❄️

<div align="center">

![Disney Frozen Time Capsule](https://img.shields.io/badge/Disney%20Frozen-Time%20Capsule-70e4ff?style=for-the-badge&logo=disney&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local-10b981?style=for-the-badge&logo=lock)

<p align="center">
  <b>“做你自己的女王，勇敢去光芒亮丽闪耀吧！”</b><br>
  用心记录陪伴女儿长大的每一秒 · 极简、精致、治愈的冰雪奇缘魔法成长纪念册
</p>

</div>

---

## ✨ 项目特色与核心功能 (Features)

### 1. ⏱️ 精确到秒的成长魔法计时器 (Growth Time Tracker)
- 实时精确计算宝贝自降临星海以来的成长时长：包含**总天数**、**年 / 月 / 日**以及跳动的**时 / 分 / 秒**。
- 支持毫秒级平滑过渡与艾莎冰雪粒子动画。

### 2. 👑 圆形头像智能裁剪与全格式兼容 (Circular Avatar Cropper)
- **直接选图 / 拖拽上传**：支持从电脑或手机直接拖放照片至头像框。
- **交互式圆形裁剪器**：配有冰晶发光圆环取景框，支持鼠标/触屏拖拽平移、滑块/滚轮多维缩放与 90° 顺时针旋转。
- **苹果 iPhone .HEIC 自动解码**：内置专属解码引擎，手机拍摄的高清 `.HEIC` 实况原图可直接解析。
- **全站同步**：首页、皇家护照、纪念海报实时同步更新。

### 3. 🖼️ 1-4 周岁成长魔法相册 (1-4 Years Photo Album)
- 定制 **1 周岁、2 周岁、3 周岁、4 周岁** 专属四维成长卡片。
- 每张照片卡片配有专属的冰雪深情**成长祝福语**。
- **免裁剪直接上传**：保留原图完整比例，支持点击上传与直接拖拽替换，并可在灯箱模式下查看高清原图。

### 4. 🎵 内置《Let It Go》背景音乐与断点记忆播放器 (Floating Music Player)
- **本地高清音轨**：默认内置并播放本地《冰雪奇缘》主题曲 `Let It Go`，零网络依赖，秒级播放。
- **刷新断点记忆**：自动将当前播放进度保存至本地，刷新页面或下次访问时**自动恢复停留在上次进度**，无缝续播。
- **悬浮可拖拽进度条**：底部精致冰雪悬浮控制栏，支持点击/拖拽进度条快进快退、调节音量与静音。
- **一键折叠收缩**：默认收起为右下角发光唱片浮标，点击随时展开或最小化。
- **支持自定义音轨**：可在设置中填入外部网络 MP3 链接，或一键恢复默认本地音乐。

### 5. 📜 阿伦黛尔皇家小公主通行证 (Royal Passport)
- 专属皇家身份通行证，记录皇家姓名、守护者誓言、降临星海日期与独一无二的护照编号。
- 可交互点击加盖 **“艾莎女王皇家魔法金印”**，伴随五彩冰晶礼花特效。

### 6. 🎹 艾莎冰雪魔法音律琴 (Ice Chime Piano)
- 基于 Web Audio API 打造的八音律冰晶琴键，随手弹奏《Let It Go》主旋律音符并触发冰雪音效。

### 7. 💌 爸爸妈妈的时光寄语信箱 (Time Capsule Letters)
- 封印着写给未来 10 岁、18 岁成人礼小女王的深情书信，时光未到将处于魔法封印状态。

### 8. 📊 生命的奇迹维度 (Life Metrics)
- 趣味换算宝贝在地球上的**心跳次数**、**呼吸次数**、**看过的日出日落**与**奇幻梦境时长**。

### 9. 📲 一键生成高清冰雪海报 (Poster Generator)
- 一键将当前成长数据、头像与父母寄语导出为 2x 高清冰雪纪念海报，长按即可保存至手机相册或电脑。

---

## 🔒 隐私安全与数据保护声明 (Privacy & Security)

- 🛡️ **100% 纯前端本地存储（Zero Cloud Tracking）**：
  - 本项目为纯前端静态应用，**不包含任何后端数据库或数据追踪接口**。
  - 用户上传的头像、照片与个人配置仅存在于用户自身的**浏览器本地缓存（`localStorage`）与内存**中。
  - **任何个人私照均不会上传到云端或写入 GitHub 代码仓库**，请放心使用与分享！

---

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 8](https://vitejs.dev/)
- **样式与动画**：[Tailwind CSS](https://tailwindcss.com/) + 手工调优 Luxury Glassmorphism 冰晶磨砂质感
- **音频系统**：HTML5 Audio + Web Audio API 纯代码合成音效引擎
- **图片与海报**：HTML Canvas + [html-to-image](https://github.com/bubkoo/html-to-image) + [heic2any](https://github.com/alexcorvi/heic2any)
- **图标库**：[Lucide React](https://lucide.dev/)
- **粒子特效**：[Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 快速开始 (Getting Started)

### 1. 克隆项目
```bash
git clone https://github.com/reedtang666/TimeFlies.git
cd TimeFlies
```

### 2. 安装依赖
```bash
npm install
# 或 yarn / pnpm install
```

### 3. 本地开发
```bash
npm run dev
```
在浏览器中打开 `http://localhost:5173` 即可体验。

### 4. 生产构建
```bash
npm run build
```
构建产物将输出在 `dist` 目录中，可直接部署在 GitHub Pages、Vercel、Netlify 或任何静态网页托管平台上。

---

## 💡 个性化定制小技巧 (URL Parameters)

可通过 URL 参数直接生成专属分享链接，例如：
```text
https://your-domain.com/?name=爱莎小公主&dob=2022-06-16T08:30&theme=ice-blue
```

- `name`：宝贝姓名 / 昵称
- `dob`：出生日期与时间（格式：`YYYY-MM-DDTHH:mm`）
- `quote`：父母寄语
- `theme`：主题配色（`ice-blue` / `aurora-purple` / `winter-rose`）

---

## 💖 致谢与开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源协议。  
愿每一个小宝贝都能在爱与温暖中无畏成长，成为自己生命中闪闪发光的女王！❄️👑
