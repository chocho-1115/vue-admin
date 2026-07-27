### 

* npm create vue@latest

### sass

node-sass编译器被弃用。

去官方查看推荐的编译器：

> The Sass team maintains two Node.js packages for Sass, both of which support the standard JavaScript API. The sass package is pure JavaScript, which is a little slower but can be installed on all platforms Node.js supports. The sass-embedded package wraps a JS API around the Dart VM, so it’s faster but only supports Windows, Mac OS, and Linux.

因此，官方维护的包有2个，sass和sass-embedded，两者选其一即可。

sass和sass-embedded都是同样的js api接口，sass全部用js实现，sass-embedded底层使用 Dart VM包装了JS API。

因此sass-embedded编译速度优势明显，在大项目建议使用sass-embedded。

在`npm create vue@latest`新建的项目里，直接导入scss文件，也会提示安装sass-embedded。

[sass弃用import，用use、forward替代](https://sass-lang.com/documentation/breaking-changes/import/)
[sass弃用import](https://sass-lang.com/blog/import-is-deprecated/)
[@use & @forward in SASS](https://mr-alien.medium.com/use-forward-in-sass-70b9cd44218b)

### svg雪碧图

在之前的webpack项目中，使用svg-sprite-loader来实现svg的雪碧图，他在vite的替代方案有：

* vite-svg-loader svg当模块导入,非svg雪碧图方案
* vite-plugin-svg-icons 不再更新，安装后也有一些警告,[持续关注](https://github.com/vbenjs/vite-plugin-svg-icons/issues/107)
* vite-plugin-svg-spritemap
* @spiriit/vite-plugin-svg-spritemap 

[综合对比后2个方案](https://npmpackage.info/)后，选择了`@spiriit/vite-plugin-svg-spritemap`，它文档完整，下载量更多，发布版本多。它的[文档](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/)

- 因为引入了element ui 所以尽量优先使用该框架的Icon图标，而且svg雪碧图会加载所有图片，而本项目里的element icon是按需加载的。

### 数据模拟方案：msw+faker

mockjs已经不再维护了，替代方案如下：
* [faker-js](https://github.com/faker-js/faker) 生成数据
* [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) API请求模拟库
* [msw](https://mswjs.io/) API请求模拟库

msw在本地执行`npx msw init ./mack --save`命令，生成mockServiceWorker.js[Managing the worker](https://mswjs.io/docs/best-practices/managing-the-worker/)
在浏览器中设置msw[Browser integration](https://mswjs.io/docs/integrations/browser)

之后更新了msw后，会自动生成mockServiceWorker.js

