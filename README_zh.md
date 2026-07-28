<p align="center">
    <a href="https://github.com/chocho-1115/vue-admin" target="_blank">
        <img src="https://cn.vuejs.org/images/logo.png" width="100">
    </a>
</p>
<p align="center">
    <a href="https://github.com/vitejs/vite">
        <img src="https://img.shields.io/badge/vite-8.1.4-brightgreen.svg">
    </a>
    <a href="https://github.com/vuejs/core">
        <img src="https://img.shields.io/badge/vue-3.5.39-brightgreen.svg">
    </a>
    <a href="https://github.com/element-plus/element-plus">
        <img src="https://img.shields.io/badge/element--plus-2.14.2-brightgreen.svg">
    </a>
    <a href="https://github.com/axios/axios">
        <img src="https://img.shields.io/badge/axios-1.18.1-brightgreen.svg">
    </a>
    <a href="https://github.com/mswjs/msw">
        <img src="https://img.shields.io/badge/msw-2.15.0-brightgreen.svg">
    </a>
    <a href="https://github.com/faker-js/faker">
        <img src="https://img.shields.io/badge/faker-10.5.0-brightgreen.svg">
    </a>
    <a href="https://github.com/chocho-1115/vue-admin">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg">
    </a>
</p>

<p align="center">
  <a href="./README.md">English</a> | <b>中文</b>
</p>

## 简介

本项目提供一个轻量级、UI极简的 Vue admin 后台，依赖最新稳定版本，减少升级维护成本，让开发者更专注于业务逻辑。

**Demo:** <https://chocho-1115.github.io/vue-admin/>

> [!NOTE]
> 项目前期UI参考了 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

## ✨ 功能特性

- 📦 基于 Vue 3 + Vite 8 + Element Plus 构建
- 🎨 极简UI设计，开箱即用
- 🔐 登录/登出功能
- 📄 动态路由与权限控制
- 🧩 嵌套菜单布局
- 📊 表格、表单、图标等常用组件示例
- 🌐 使用 MSW + Faker.js 模拟API数据
- 🎯 SVG图标雪碧图支持
- 🚀 支持 staging / production 多环境构建

## 🎉 技术栈

**项目使用 [create-vue 3.x](https://github.com/vuejs/create-vue) 从零开始创建，基于 `vite 8.x` 进行构建，要求 [Node.js](https://nodejs.org/) >= 22.16.0。**

主要包含以下技术栈：

- 💪 [vue3](https://vuejs.org/) + [vite8](https://vite.dev/)
- 💅 [vue-router](https://router.vuejs.org/)
- 💅 [element plus](https://element-plus.org/zh-CN/)
- 🌍 [mswjs](https://mswjs.io/) + [fakerjs](https://fakerjs.dev/)
- 👏 [axios](http://www.axios-js.com/)
- 🥳 [sass](https://sass-lang.com/)
- 🚀 [ES6](http://es6.ruanyifeng.com/)
- 📦️ [element plus icon](https://icon-sets.iconify.design/ep/) + 自定义 [svg icon 雪碧图](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/)（建议优先使用 element plus icon）

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 22.16.0
- [npm](https://www.npmjs.com/) / [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### 安装运行

```bash
# 克隆项目
git clone https://github.com/chocho-1115/vue-admin.git

# 进入项目目录
cd vue-admin

# 安装依赖
npm install

# 启动开发服务
npm run dev
```

### 其他命令

```bash
# 构建生产版本
npm run build:prod

# 构建测试版本
npm run build:stage

# 预览构建结果
npm run preview

# 代码格式化
npm run format

# 代码检查与修复
npm run lint
```

## License

[MIT](https://github.com/chocho-1115/vue-admin/blob/main/LICENSE)

Copyright (c) 2025-2026 chocho-1115
