module.exports = function ({ types: t }) {
  function resolvePath(value, alias) {
    if (!alias) return null;
    for (const key of Object.keys(alias)) {
      const target = alias[key];
      if (value === key || value.startsWith(key + '/')) {
        return target + value.slice(key.length);
      }
    }
    return null;
  }

  function updateSource(node, alias) {
    if (!node || node.type !== 'StringLiteral') return;
    const resolved = resolvePath(node.value, alias);
    if (resolved) {
      node.value = resolved;
    }
  }

  return {
    name: 'local-module-resolver',
    visitor: {
      ImportDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias);
      },
      ExportNamedDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias);
      },
      ExportAllDeclaration(path, state) {
        updateSource(path.node.source, state.opts.alias);
      },
      CallExpression(path, state) {
        const callee = path.get('callee');
        if (callee.isIdentifier({ name: 'require' })) {
          const arg = path.node.arguments[0];
          updateSource(arg, state.opts.alias);
        }
      }
    }
  };
};
