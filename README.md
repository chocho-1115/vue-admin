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
  <b>English</b> | <a href="./README_zh.md">中文</a>
</p>

## Introduction

A lightweight, minimalist Vue admin dashboard built with the latest stable dependencies, reducing upgrade and maintenance costs so developers can focus on business logic.

**Demo:** <https://chocho-1115.github.io/vue-admin/>

> [!NOTE]
> UI design is inspired by [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

## Why This Project?

The ideal frontend admin dashboard should be:

- All dependencies are the latest stable versions, so you'll see "All dependencies match the latest package versions :)" when installing
- Every dependency is actively maintained, reducing upgrade and maintenance costs
- Only necessary dependencies are included, no bloat
- Minimalist functionality and UI design
- Wide applicability

This project was built to meet these goals.

## ✨ Features

Lightweight, minimal UI, ready to use out of the box. Built with Vue 3 + Vite 8 + Element Plus.

| Keyword | Description |
|---------|-------------|
| **Authentication** | Login/Logout, Token management, localStorage persistence, Route permission guards |
| **Layout** | Sidebar collapse/expand, Mobile drawer adaptation, Breadcrumbs, Tab view with right-click menu |
| **Theme** | Dark/Light mode switching, localStorage caching |
| **Router** | Nested routes (3 levels), Whitelist, KeepAlive caching, 404 fallback |
| **HTTP** | Axios encapsulation, Unified error handling, EventBus decoupling |
| **Mock** | MSW + Faker.js, Unified response status codes |
| **Icons** | Dual solution: SVG sprite + Element Plus icons |
| **Others** | NProgress loading bar, Markdown rendering |

> 💬 Have ideas for features? [Join the discussion](https://github.com/chocho-1115/vue-admin/discussions/14) to share your thoughts!

## 🎉 Tech Stack

**Created from scratch using [create-vue 3.x](https://github.com/vuejs/create-vue), built with `vite 8.x`, requires [Node.js](https://nodejs.org/) >= 22.16.0.**

Main dependencies:

- 💪 [Vue 3](https://vuejs.org/) + [Vite 8](https://vite.dev/)
- 💅 [Vue Router](https://router.vuejs.org/)
- 💅 [Element Plus](https://element-plus.org/zh-CN/)
- 🌍 [MSW](https://mswjs.io/) + [Faker.js](https://fakerjs.dev/)
- 👏 [Axios](http://www.axios-js.com/)
- 🥳 [Sass](https://sass-lang.com/)
- 🚀 [ES6](http://es6.ruanyifeng.com/)
- 📦️ [Element Plus Icon](https://icon-sets.iconify.design/ep/) + Custom [SVG Icon Sprite](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/) (Element Plus Icon recommended)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22.16.0
- [npm](https://www.npmjs.com/) / [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/chocho-1115/vue-admin.git

# Enter project directory
cd vue-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

### Other Commands

```bash
# Build for production
npm run build:prod

# Build for staging
npm run build:stage

# Preview build output
npm run preview

# Format code
npm run format

# Lint and fix code
npm run lint
```

## License

[MIT](https://github.com/chocho-1115/vue-admin/blob/main/LICENSE)

Copyright (c) 2025-2026 chocho-1115
