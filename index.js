
export default function (requiredFiles, excludeRegExp, isForceLowercase = true) {
  if (typeof requiredFiles.keys !== 'function') {
    throw new Error('auto-route only accept function exported by require.context');
  }

  const routes = [];
  const keys = requiredFiles.keys();
  keys.forEach(el => {
    if (excludeRegExp.test(el)) {
      return;
    }
    let path = el.slice(1, el.lastIndexOf('/'))
    if (isForceLowercase) {
      path = path.toLowerCase();
    }
    const name = path.replace(/\//g, '');
    routes.push({
      name,
      path,
      component: requiredFiles(el).default,
    });
  });
  return routes;
}
