module.exports = {
  title: 'WebAssembly 開発環境構築の本',
  description: 'Rust を用いた WebAssembly の開発環境を構築する手法を紹介する本.',
  head: [
    ['meta', { name: 'theme-color', content: '#222' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],

    // Open Graph Protocol
    ['meta', { property: 'og:title', content: 'WebAssembly 開発環境構築の本' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://wasm-dev-book.netlify.com' }],
    ['meta', { property: 'og:image', content: 'https://wasm-dev-book.netlify.com/icon-256x256.png?0' }],
    ['meta', { property: 'og:description', content: 'Rust を用いた WebAssembly の開発環境を構築する手法を紹介する本.' }],
    ['meta', { property: 'og:locale', content: 'ja_JP' }],
    ['meta', { property: 'og:site_name', content: 'WebAssembly 開発環境構築の本' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@mizdra' }],
    ['meta', { name: 'twitter:creator', content: '@mizdra' }],

    // Other Icons
    ['meta', { name: 'msapplication-TileColor', content: '#2d88ef' }],
    ['meta', { name: 'msapplication-TileImage', content: 'https://wasm-dev-book.netlify.com/mstile-144x144.png' }],
    ['link', { rel: 'shortcut icon', type: 'image/vnd.microsoft.icon', href: 'https://wasm-dev-book.netlify.com/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/vnd.microsoft.icon', href: 'https://wasm-dev-book.netlify.com/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '57x57', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-57x57.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '60x60', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-60x60.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '72x72', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-72x72.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '76x76', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-76x76.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '114x114', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-114x114.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '120x120', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-120x120.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '144x144', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-144x144.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '152x152', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: 'https://wasm-dev-book.netlify.com/apple-touch-icon-180x180.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '36x36', href: 'https://wasm-dev-book.netlify.com/android-chrome-36x36.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: 'https://wasm-dev-book.netlify.com/android-chrome-48x48.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '72x72', href: 'https://wasm-dev-book.netlify.com/android-chrome-72x72.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'https://wasm-dev-book.netlify.com/android-chrome-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: 'https://wasm-dev-book.netlify.com/android-chrome-128x128.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '144x144', href: 'https://wasm-dev-book.netlify.com/android-chrome-144x144.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '152x152', href: 'https://wasm-dev-book.netlify.com/android-chrome-152x152.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'https://wasm-dev-book.netlify.com/android-chrome-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '256x256', href: 'https://wasm-dev-book.netlify.com/android-chrome-256x256.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '384x384', href: 'https://wasm-dev-book.netlify.com/android-chrome-384x384.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: 'https://wasm-dev-book.netlify.com/android-chrome-512x512.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '36x36', href: 'https://wasm-dev-book.netlify.com/icon-36x36.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: 'https://wasm-dev-book.netlify.com/icon-48x48.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '72x72', href: 'https://wasm-dev-book.netlify.com/icon-72x72.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'https://wasm-dev-book.netlify.com/icon-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: 'https://wasm-dev-book.netlify.com/icon-128x128.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '144x144', href: 'https://wasm-dev-book.netlify.com/icon-144x144.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '152x152', href: 'https://wasm-dev-book.netlify.com/icon-152x152.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '160x160', href: 'https://wasm-dev-book.netlify.com/icon-160x160.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'https://wasm-dev-book.netlify.com/icon-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '196x196', href: 'https://wasm-dev-book.netlify.com/icon-196x196.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '256x256', href: 'https://wasm-dev-book.netlify.com/icon-256x256.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '384x384', href: 'https://wasm-dev-book.netlify.com/icon-384x384.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: 'https://wasm-dev-book.netlify.com/icon-512x512.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'https://wasm-dev-book.netlify.com/icon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '24x24', href: 'https://wasm-dev-book.netlify.com/icon-24x24.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'https://wasm-dev-book.netlify.com/icon-32x32.png' }],
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
