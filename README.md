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

## Tips
1. route'name is token from vue instance's name, please make sure that every vue component has a name;
