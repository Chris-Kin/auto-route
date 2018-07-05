export default function (requiredFiles, excludeRegExp) {
  if (typeof requiredFiles.keys !== 'function') {
    throw new Error('auto-route only accept function exported by require.context');
  }

  const routes = [];
  const keys = requiredFiles.keys();

  // 搜集所有嵌套的子路由，以防止重复添加路由
  const allNestedRoutes = [];
  keys.forEach(el => {
    const nestedRoutes = requiredFiles(el).default.nestedRoutes;
    if (Array.isArray(nestedRoutes)) {
      const fatherPath = el.slice(1, el.lastIndexOf('/')).replace('/Home', '');
      nestedRoutes.forEach(el => {
        const nestedRoutePath = `${fatherPath}/${el}`;
        allNestedRoutes.push(nestedRoutePath.toLowerCase());
      });
    }
  });
  keys.forEach(el => {
    if (excludeRegExp.test(el)) {
      return;
    }
    const path = el.slice(1, el.lastIndexOf('/')).toLowerCase();
    const name = path.replace(/\//g, '');

    const children = [];
    const nestedRoutes = requiredFiles(el).default.nestedRoutes;
    if (nestedRoutes) {
      nestedRoutes.forEach(nestedRoute => {
        const nestedRouteFilePath = `${el.slice(1, el.lastIndexOf('/')).replace('/Home', '')}/${nestedRoute}`;
        const key = keys.find(el => el.includes(nestedRouteFilePath));
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
    if (allNestedRoutes.includes(path)) {
      return;
    }
    routes.push({
      path: path,
      name: requiredFiles(el).default.name || name,
      component: requiredFiles(el).default,
      children,
    });
  });
  return routes;
}
