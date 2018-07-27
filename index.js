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
        const nestedRouteFilePath = `${el.slice(1, el.lastIndexOf('/'))}/${nestedRoute}/`;
        const key = keys.find(el => el.includes(nestedRouteFilePath));
        // 如果指定的嵌套路由在文件目录中不存在，则忽略
        if (!key) {
          return;
        }
        children.push({
          path: nestedRoute.toLowerCase(),
          name: requiredFiles(key).default.name,
          component: requiredFiles(key).default,
          children: [],
        });
      });
    }

    // 生成当前的路由
    const route = {
      path: path,
      name: requiredFiles(el).default.name || name,
      component: requiredFiles(el).default,
      children,
    };
    // 处理嵌套路由的父级路径重定向
    const redirect = requiredFiles(el).default.redirect;
    if (redirect) {
      route.redirect = redirect;
    }

    // 判断当前路由是否已存在于routes中
    const currentRouteInRoutes = findExistRouteByName(routes, route.name);
    if (currentRouteInRoutes) {
      currentRouteInRoutes.children = children;
      if (redirect) {
        currentRouteInRoutes.redirect = redirect;
      }
    } else {
      routes.push(route);
    }
  });
  return routes;
}

function findExistRouteByName(routes, name) {
  var target = null;
  for (var i = 0; i < routes.length; i++) {
    if (routes[i].name === name) {
      target = routes[i];
      return target;
    } else if (routes[i].children.length) {
      target = findExistRouteByName(routes[i].children, name);
      if (target) return target;
    }
  }
  return target;
}