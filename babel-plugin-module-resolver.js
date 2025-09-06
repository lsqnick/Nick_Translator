const path = require('path');

module.exports = function () {
  function resolvePath(value, alias, filename) {
    if (!alias) return null;
    for (const key of Object.keys(alias)) {
      const target = alias[key];
      if (value === key || value.startsWith(key + '/')) {
        const absoluteTarget = path.resolve(process.cwd(), target);
        const absolutePath = path.join(absoluteTarget, value.slice(key.length));
        let relativePath = path.relative(path.dirname(filename), absolutePath);
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath;
        }
        return relativePath;
      }
    }
    return null;
  }

  function updateSource(node, alias, filename) {
    if (!node || node.type !== 'StringLiteral') return;
    const resolved = resolvePath(node.value, alias, filename);
    if (resolved) {
      node.value = resolved;
    }
  }

  return {
    name: 'local-module-resolver',
    visitor: {
      ImportDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias, state.file.opts.filename);
      },
      ExportNamedDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias, state.file.opts.filename);
      },
      ExportAllDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias, state.file.opts.filename);
      },
      CallExpression(path, state) {
        const callee = path.get('callee');
        if (callee.isIdentifier({ name: 'require' })) {
          const arg = path.node.arguments[0];
          updateSource(arg, state.opts.alias, state.file.opts.filename);
        }
      }
    }
  };
};
