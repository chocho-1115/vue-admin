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

## 为什么做这个项目

理想的前端后台管理系统应该是：

- 依赖全部为最新稳定版本，安装时看到 "All dependencies match the latest package versions :)"
- 每个依赖都处于活跃维护期，减少升级维护成本
- 只包含必要的依赖，没有冗余
- 功能与UI设计极简
- 广泛适用于各种业务场景

本项目正是为了实现这些目标而创建的。

## ✨ 功能特性

轻量级、UI极简、开箱即用。基于 Vue 3 + Vite 8 + Element Plus 构建。

- 🚀 依赖全部为最新稳定版本
- 🎨 极简UI设计
- 🔐 内置认证与权限控制
- 🌐 使用 MSW + Faker.js 模拟API

| 关键词 | 说明 |
|--------|------|
| **认证** | 登录/登出、Token管理、localStorage持久化、路由权限守卫 |
| **布局** | 侧边栏折叠/展开、移动端抽屉适配、面包屑、标签页视图(右键菜单) |
| **主题** | 深色/浅色切换、localStorage缓存 |
| **路由** | 嵌套路由(3层)、白名单、KeepAlive缓存、404兜底 |
| **HTTP** | Axios封装、统一错误处理、EventBus解耦 |
| **Mock** | MSW + Faker.js、统一响应状态码 |
| **图标** | SVG雪碧图 + Element Plus图标双方案 |
| **其他** | NProgress进度条、Markdown渲染 |

> 💬 有功能想法？[参与讨论](https://github.com/chocho-1115/vue-admin/discussions/14)，分享你的建议！

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
