# WebAssembly 開発環境構築の本

Rust を用いた WebAssembly の開発環境を構築する手法を紹介する本.

## Requirements

* Node.js
* npm
* yarn

## Recommended

* VSCode

## Setup

```bash
# Setup
$ git clone https://github.com/mizdra/wasm-dev-book.git && cd $_
$ yarn install

# Start dev-server
$ yarn run dev
```

## npm-scripts

* `yarn run dev`: Start dev-server
* `yarn run build`: Build for production
  * If necessary, you can serve production: `npx http-server docs/.vuepress/dist/`
