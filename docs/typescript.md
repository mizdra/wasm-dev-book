# TypeScript との連携

TypeScript は JavaScript に静的型を導入し, 実行する前に型レベルで多くの問題を検出してランタイムエラーを防いでくれます. アプリケーションが複雑になっていくにつれ, 静的型の重要性は増すことでしょう.

ここでは, これまでの節で作成したプロジェクトに TypeScript を導入する方法を解説します.

:::tip

本節で作成するプロジェクトは以下のリポジトリで公開しています.

* [mizdra/wasm-dev-book-webpack-typescript](https://github.com/mizdra/wasm-dev-book-webpack-typescript)

:::

## Webpack プロジェクトへの導入

[Webpack の利用](/webpack.md)の節で作成したプロジェクトに対して TypeScript を導入してみます.

はじめに, [Webpack の利用](/webpack.md)の節で作成したリポジトリをコピーし, プロジェクト名を変更します.

```bash
$ cp -r wasm-dev-book-webpack wasm-dev-book-webpack-typescript
$ cd wasm-dev-book-webpack-typescript

## プロジェクト名の変更 (エディタの置換機能でやっても良い)
$ find . -type f | xargs sed -i "s/wasm-dev-book-webpack/wasm-dev-book-webpack-typescript/g"
$ find . -type f | xargs sed -i "s/wasm_dev_book_webpack/wasm_dev_book_webpack_typescript/g"
```

TypeScript のトランスパイルに必要な npm パッケージをインストールします.

```bash
$ npm install --save-dev typescript ts-loader
```

TypeScript の設定ファイル `/tsconfig.json` を次のように作成します.

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",
    "lib": ["esnext", "dom"],
    "declaration": false,

    /* Module Options */
    "module": "esnext",
    "moduleResolution": "node",

    /* Strict Type-Checking Options */
    "strict": true,

    /* Debug Options */
    "sourceMap": true,
    "pretty": true,
    "locale": "ja"
  }
}
```

TypeScript のトランスパイルが通るように Webpack の設定を書き換えます.

<!-- prettier-ignore-start -->
```js{4-9,11-12}
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // `module` オプションを追加
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
  },
  resolve: {
    // `resolve.extensions` オプションに '.ts'を追加
    extensions: ['.ts', '.js', '.wasm'],
  },
  plugins: [new HtmlWebpackPlugin()],
}
```
<!-- prettier-ignore-end -->

`/src/index.js` を `/src/index.ts` にリネームします.

```bash
$ mv ./src/index.js ./src/index.ts
```

最後に wasm-bindgen コマンドで TypeScript の型定義ファイルを作成するように, ビルドスクリプトを書き換えます. ただし, そのままだと開発用ビルド時に生成された型定義ファイルに cargo-watch が反応して Rust のコンパイル処理が走ってしまうため, cargo-watch コマンドの監視対象から TypeScript の型定義ファイルを除外しておきます.

```json{4,7}
  // ...
  "scripts": {
    "build:wasm": "cargo build --target wasm32-unknown-unknown --release",
    "postbuild:wasm": "wasm-bindgen target/wasm32-unknown-unknown/release/wasm_dev_book_webpack_typescript.wasm --out-dir src",
    "build:js": "webpack --mode production",
    "build": "run-s build:wasm build:js",
    "dev:wasm": "cargo watch -i 'src/{wasm_dev_book_webpack_typescript_bg.wasm,wasm_dev_book_webpack_typescript.js,wasm_dev_book_webpack_typescript.d.ts}' -s 'npm run build:wasm'",
    "dev:js": "webpack-dev-server --mode development",
    "dev": "run-p dev:wasm dev:js"
  },
  // ...
```

これで準備完了です! 早速実行してみましょう.

```bash
$ npm run dev
...
ERROR in ./src/index.ts
./src/index.ts
[tsl] ERROR in ./src/index.ts(1,19)
      TS7006: Parameter 'num' implicitly has an 'any' type.
```

おっと, TypeScript のコンパイルエラーが出てしまいました. でも心配しないで下さい. コンパイルエラーが出ているということは正しく TypeScript の静的型検査が働いている証です! ですから落ち着いてエラーを修正することにしましょう :smile:

エラーメッセージを読むと, `toUint32` 関数の引数の型が明示されていなかったことが原因だと分かります. 以下のように `toUint32` 関数の引数の型を明示します.

<!-- prettier-ignore-start -->
```typescript{1-2}
// 引数の型を明示
const toUint32 = (num: number) => num >>> 0

export const date_now = Date.now
export const console_log = console.log
// ...
```
<!-- prettier-ignore-end -->

それでは気を取り直して再度実行してみます.

```bash
$ npm run dev
...
ℹ ｢wdm｣: Compiled successfully.
```

ブラウザのコンソールを開いて出力を確認してみましょう. [Webpack の利用](/webpack.md)の節と同じように `3`, `タイムスタンプ`, `2545341989`, `30`, `Hello, World!` が出力されていれば成功です!

## 本節のまとめ

本節では次のことを学びました.

* 既存の WebAssembly プロジェクトに TypeScript を導入する方法を学んだ
* wasm-bindgen で TypeScript の型定義ファイルを生成する方法を学んだ
* 作成したプロジェクトで TypeScript の静的型検査が動作することを確認した
