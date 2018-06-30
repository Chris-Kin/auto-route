const routes = [];
const files = require.context('@/view', true, /index\.vue$/);
const keys = files.keys();
for (let i = 0, l = keys.length; i < l; i += 1) {
  const key = keys[i];
  // 忽略组件
  if (/\/component\//.test(key)) continue;

  const path = key.replace(/\.|\/index\.vue$/g, '');
  const name = path.replace(/\.|\//g, '');
  routes.push({
    name,
    path: path.toLowerCase(),
    component: files(key).default,
  });
}
