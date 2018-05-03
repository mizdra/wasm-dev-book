module.exports = {
  title: 'WebAssembly開発環境構築',
  description: 'WebAssembly開発環境構築の解説書.',
  themeConfig: {
    sidebar: [
      '/',
      '/first',
      '/hello-wasm',
    ],
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-footnote'))
    },
  },
}
