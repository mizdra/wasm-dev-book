module.exports = {
  title: 'WebAssembly 開発環境構築の本',
  description: 'WebAssembly 開発環境構築の解説書.',
  head: [
    ['link', { rel: 'icon', href: `/web-assembly-icon-256px.png` }],
    ['link', { rel: 'shortcut icon', href: `/web-assembly-icon-256px.png` }],
    ['meta', { property: 'og:title', content: 'WebAssembly 開発環境構築の本' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://wasm-dev-book.netlify.com' }],
    ['meta', { property: 'og:image', content: '/web-assembly-icon-256px.png' }],
    ['meta', { property: 'og:description', content: 'WebAssembly 開発環境構築の解説書.' }],
    ['meta', { property: 'og:locale', content: 'ja_JP' }],
    ['meta', { property: 'og:site_name', content: 'WebAssembly 開発環境構築の本' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site:id', content: '@mizdra' }],
  ],
  themeConfig: {
    nav: [
      { text: 'GitHub', link: 'https://github.com/mizdra/wasm-dev-book' },
    ],
    sidebar: [
      '/',
      '/donate',
      '/first',
      '/hello-wasm',
      '/parcel',
      '/webpack',
      '/typescript',
      '/tools-and-services'
    ],
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-footnote'))
    },
  },
  ga: 'UA-44022285-7',
}
