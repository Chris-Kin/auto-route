export default function (requiredFiles, excludeRegExp) {
  if (typeof requiredFiles.keys !== 'function') {
    throw new Error('auto-route only accept function exported by require.context');
  }

  // 存储结果
  const routes = [];

  // 对文件数组按层深排序，保证父级容器早于嵌套路由被处理
  const keys = requiredFiles.keys().sort((pre, cur) => {
    return pre.split('/').length - cur.split('/').length;
  });

  // 搜集所有嵌套的子路由，以防止重复添加路由
  const allNestedRoutes = [];
  keys.forEach(el => {
    const nestedRoutes = requiredFiles(el).default.nestedRoutes;
    if (!Array.isArray(nestedRoutes)) {
      return;
    }
    const fatherPath = el.slice(1, el.lastIndexOf('/'));
    nestedRoutes.forEach(el => {
      const nestedRoutePath = `${fatherPath}/${el}`;
      allNestedRoutes.push(nestedRoutePath.toLowerCase());
    });
  });

  // 处理文件数组，生成routes
  keys.forEach(el => {
    // 排除指定目录
    if (excludeRegExp && excludeRegExp.test(el)) {
      return;
    }

    /**
     * el: ./A/B/index.vue
     * path: /A/B
     * name: AB
     */
    const path = el.slice(1, el.lastIndexOf('/')).toLowerCase();
    const name = path.replace(/\//g, '');

    // 处理嵌套路由
    const children = [];
    const nestedRoutes = requiredFiles(el).default.nestedRoutes;
    if (Array.isArray(nestedRoutes)) {
      nestedRoutes.forEach(nestedRoute => {
        const nestedRouteFilePath = `${el.slice(1, el.lastIndexOf('/'))}/${nestedRoute}`;
        const key = keys.find(el => el.includes(nestedRouteFilePath));
        // 如果指定的嵌套路由在文件目录中不存在，则忽略
        if (!key) {
          return;
        }
        children.push({
          path: nestedRoute.toLowerCase(),
          name: requiredFiles(key).default.name,
          component: requiredFiles(key).default,
        });
      });
    }

    // 处理嵌套路由的父级路径重定向
    const redirect = requiredFiles(el).default.redirect;

    // 生成当前的路由
    const route = {
      path: path,
      name: requiredFiles(el).default.name || name,
      component: requiredFiles(el).default,
      children,
    };
    if (redirect) {
      route.redirect = redirect;
    }

    // 被嵌套的路由页面已存在于某个路由的children中
    if (allNestedRoutes.includes(path)) {
      return;
    }

    routes.push(route);
  });
  return routes;
}
