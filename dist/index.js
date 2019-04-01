module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (requiredFiles, excludeRegExp) {\n  if (typeof requiredFiles.keys !== 'function') {\n    throw new Error('auto-route only accept function exported by require.context');\n  }\n\n  // 存储结果\n  const routes = [];\n\n  // 对文件数组按层深排序，保证父级容器早于嵌套路由被处理\n  const keys = requiredFiles.keys().sort((pre, cur) => {\n    return pre.split('/').length - cur.split('/').length;\n  });\n\n  // 处理文件数组，生成routes\n  keys.forEach(el => {\n    // 排除指定目录\n    if (excludeRegExp && excludeRegExp.test(el)) {\n      return;\n    }\n\n    /**\n     * el: ./A/B/index.vue\n     * path: /A/B\n     * name: AB\n     */\n    const path = el.slice(1, el.lastIndexOf('/')).toLowerCase();\n    const name = path.replace(/\\//g, '');\n\n    // 处理嵌套路由\n    const children = [];\n    const nestedRoutes = requiredFiles(el).default.nestedRoutes;\n    if (Array.isArray(nestedRoutes)) {\n      nestedRoutes.forEach(nestedRoute => {\n        const nestedRouteFilePath = `${el.slice(1, el.lastIndexOf('/'))}/${nestedRoute}/`;\n        const key = keys.find(el => el.includes(nestedRouteFilePath));\n        // 如果指定的嵌套路由在文件目录中不存在，则忽略\n        if (!key) {\n          return;\n        }\n        children.push({\n          path: nestedRoute.toLowerCase(),\n          name: requiredFiles(key).default.name,\n          component: requiredFiles(key).default,\n          children: []\n        });\n      });\n    }\n\n    // 生成当前的路由\n    const route = {\n      path: path,\n      name: requiredFiles(el).default.name || name,\n      component: requiredFiles(el).default,\n      children\n    };\n\n    // 处理嵌套路由的父级路径重定向\n    const redirect = requiredFiles(el).default.redirect;\n    if (redirect) {\n      route.redirect = redirect;\n    }\n\n    // 处理路由别名\n    const alias = requiredFiles(el).default.alias;\n    if (alias) {\n      route.alias = alias;\n    }\n\n    // 处理meta\n    const meta = requiredFiles(el).default.routeMeta;\n    if (meta) {\n      route.meta = meta;\n    }\n\n    // 判断当前路由是否已存在于routes中\n    const currentRouteInRoutes = findExistRouteByName(routes, route.name);\n    if (currentRouteInRoutes) {\n      currentRouteInRoutes.children = children;\n      if (redirect) {\n        currentRouteInRoutes.redirect = redirect;\n      }\n    } else {\n      routes.push(route);\n    }\n  });\n  return routes;\n});\n\nfunction findExistRouteByName(routes, name) {\n  var target = null;\n  for (var i = 0; i < routes.length; i++) {\n    if (routes[i].name === name) {\n      target = routes[i];\n      return target;\n    } else if (routes[i].children.length) {\n      target = findExistRouteByName(routes[i].children, name);\n      if (target) return target;\n    }\n  }\n  return target;\n}\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });