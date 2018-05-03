module.exports = {
  title: 'WebAssembly開発環境構築の本',
  description: 'WebAssembly開発環境構築の解説書.',
  head: [
    ['link', { rel: 'icon', href: `/web-assembly-icon-256px.png` }],
  ],
  themeConfig: {
    nav: [
      { text: 'GitHub', link: 'https://github.com/mizdra/wasm-dev-book' },
    ],
    sidebar: [
      '/',
      '/first',
      '/hello-wasm',
      '/parcel',
      '/webpack',
      '/typescript',
      '/npm-package',
      '/webassembly-studio',
    ],
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-footnote'))
    },
  },
}
