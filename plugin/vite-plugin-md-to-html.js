// vite-plugin-md-to-html.js
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

// 注意：这里的 markdown-it 是开发依赖，不会打包到最终产物中
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
});

export default function vitePluginMdToHtml() {
  return {
    name: 'vite-plugin-md-to-html',
    enforce: 'pre', // 在其他插件之前执行
    
    // 转换 .md 文件
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      
      // 如果文件以 ?raw 结尾，跳过处理（保留原始文本）
      if (id.includes('?raw')) return null;
      
      // 读取文件内容
      const filePath = id.split('?')[0];
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 使用 markdown-it 编译
      const html = md.render(content);
      
      // 返回一个 JS 模块，导出 HTML 字符串
      return {
        code: `export default ${JSON.stringify(html)};`,
        map: null,
      };
    },
  };
}