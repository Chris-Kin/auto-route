# auto-route

## Usage
1. import autoRoute from 'auto-route';
2. const routes = autoRoute(require.context('@/view', true, /index\.vue$/), /\/component\//);
3. put the routes into vue-router
```js
new Router({
  mode: 'history',
  base: ROUTER_PREFIX,
  routes: [
    ...routes,
  ],
});
```

## API

autoRoute(requiredFiles, excludeRegExp, isForceLowercase)

1. requiredFiles: must generate by [require.context](https://webpack.js.org/guides/dependency-management/#require-context)
2. excludeRegExp: files path RegExp which you don't want to put into router
3. if a route has nested routes(multi-level nesting is supported), you should write them in vue instance:
```js
export default {
  nestedRoutes: [
    // the string is child route folder name(case sensitive).
    'childRoute1',
    'childRoute2',
  ],
  name: 'AFatherRoute',
  data() {
    return {
      ...
    };
  },
}
```
4. when use nestedRoutes, you can alse write a 'redirect' property
```js
export default {
  nestedRoutes: [
    // the string is child route folder name(case sensitive).
    'childRoute1',
    'childRoute2',
  ],
  redirect: 'path/to/fatherroute/childroute2'
  name: 'AFatherRoute',
  data() {
    return {
      ...
    };
  },
}
```

## Tips
1. route'name is token from vue instance's name, please make sure that every vue component has a name;
2. Route which nests other child routes should be plat with child routes, like this:
```js
├── config.js
├── fatherRoute.vue
├── childRoute1
│   └── index.vue
│   └── config.js
├── childRoute2
│   └── index.vue
│   └── config.js
```