module.exports = {
  title: 'WebAssembly開発環境構築',
  description: 'WebAssembly開発環境構築の解説書.',
  head: [
    ['link', { rel: 'icon', href: `/web-assembly-icon-256px.png` }],
  ],
  themeConfig: {
    nav: [
      { text: 'GitHub', link: 'https://github.com/mizdra/wasm-dev-env-construction' },
    ],
    sidebar: [
      '/',
      '/first',
      '/hello-wasm',
      '/parcel',
      '/webpack',
    ],
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-footnote'))
    },
  },
}
