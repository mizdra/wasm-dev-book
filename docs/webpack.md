# Webpack による開発環境構築

Webpack は Web フロントエンドのための拡張性の高い, 高機能なモジュールバンドラです. 現在 Web フロントエンドで使われているモジュールバンドラの中で, 最もユーザの多いのがこの Webpack です.

[^19]:

  webpack 4: released today!! – webpack – Medium: https://medium.com/webpack/webpack-4-released-today-6cdb994702d4

[^20]:

  wasm-bindgen/README.md at 0.1.0 · alexcrichton/wasm-bindgen: https://github.com/alexcrichton/wasm-bindgen/blob/0.1.0/README.md#basic-usage

2018 年 2 月末にリリースされた Webpack v4.0.0 にて, WebAssembly のサポートが入りました[^19]. これに合わせて wasm-bindgen も Webpack v4.x.x に対応し, Webpack を使って高機能な WebAssembly 開発環境を構築することができるようになりました. 試してみましょう!

wasm-bindgen は Nightly 版の Rust に依存しています[^20]. 次のコマンドで Nightly 版をインストールして下さい.

```bash
$ rustup install nightly
```

プロジェクトを作成・初期化し, プロジェクトのビルドに必要なツール群をインストールします. cargo-watch は Rust ファイルを監視ビルドする際に, wasm-bindgen-cli は JavaScript のラッパーを生成する際に必要になります.

```bash
$ cargo new --lib webpack-wasm-skeleton && cd $_
$ cargo install cargo-watch
$ cargo install wasm-bindgen-cli

$ npm init -y
$ npm install --save-dev webpack webpack-cli \
  webpack-dev-server html-webpack-plugin
```

`/src/lib.rs` を作成します.

```rust
#![feature(proc_macro)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

wasm-bindgen は Rust の実験的な機能である `proc_macro` を利用するので `feature` アトリビュートを付けています. `#` の後に `!` を付けることでアトリビュートをそれを囲むブロック全体に適応することを Rust コンパイラに指示します. ここでは `feature` アトリビュートはトップレベルに置かれているのでトップレベルを囲むブロック, つまり `/src/lib.rs` 全体で `proc_macro` が有効になります.

`add` 関数では `no_mangle` アトリビュートの代わりに `wasm_bindgen` アトリビュートを用いて関数を修飾しています. こうすることで WebAssembly-JavaScript 間で相互にやりとりしやすいように修飾された関数を変換します. また, 本来であれば `#[wasm_bindgen::prelude::wasm_bindgen]` と書くところを `use` キーワードを用いることで `#[wasm_bindgen]` と短く書けるようにしています.

次に Webpack の設定ファイル `/webpack.config.js` を作成します.

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".js", ".wasm"]
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

[^21]:

  当たり前ですがブラウザで直接 JavaScript ファイルを開いても実行されません. JavaScript を実行するには `<script>` タグで JavaScript を埋め込んだ HTML を開く必要があります.

wasm-bindgen-cli が生成する JavaScript のラッパーは WebAssembly を拡張子を付けずに import しているので `resolve.extensions` に `.wasm` を追加する必要があります. また, html-webpack-plugin を用いて Webpack でバンドルされた JavaScript を `<script>` タグで埋め込んだ HTML を出力するようにしています. この HTML をブラウザで開くことで Webpack でバンドルされた JavaScript が実行できるようになります[^21].

`/Cargo.toml` を編集してプロジェクトが wasm-bindgen に依存することを Cargo に伝わるようにします.

```ini
[package]
name = "webpack-wasm-skeleton"
version = "0.1.0"
authors = ["mizdra <pp.mizdra@gmail.com>"]

[dependencies]
wasm-bindgen = "0.1"

[lib]
crate-type = ["cdylib"]
```

プロジェクトをビルドするために `npm-scripts` にビルドコマンドを追加しましょう. `/package.json` の `scripts` フィールドを次のように書き換えます.

```json
{
  // ...
  "scripts": {
    "prebuild:wasm": "cargo +nightly check",
    "build:wasm": "cargo +nightly build --target wasm32-unknown-unknown
--release",
    "postbuild:wasm": "wasm-bindgen
target/wasm32-unknown-unknown/release/webpack_wasm_skeleton.wasm--out-dir src",
    "build:js": "webpack --mode production",
    "build": "run-s build:wasm build:js",
    "dev:wasm": "cargo watch
-i 'src/{webpack_wasm_skeleton_bg.wasm,webpack_wasm_skeleton.js}'
-s 'npm run build:wasm'",
    "dev:js": "webpack-dev-server --mode development",
    "dev": "run-p dev:wasm dev:js"
  },
  // ...
}
```

`npm run dev` で開発用ビルド, `npm run build` でプロダクションビルドです. プロジェクトをビルドすると wasm-bindgen-cli により `src` ディレクトリ配下に WebAssembly ファイル `webpack_wasm_skeleton_bg.wasm` とその JavaScript ラッパーの`webpack_wasm_skeleton.js` が生成されます. WebAssembly を利用する場合は WebAssembly を直接読み込むのではなく, この JavaScript ラッパーを読み込んでラッパー経由で WebAssembly を利用します.

それではラッパーを経由して WebAssembly の関数を呼び出す `/src/index.js` を作成しましょう.

```javascript
import("./webpack_wasm_skeleton").then(module => {
  const { add } = module;
  console.log(add(1, 2));
});
```

[^22]: ES Modules による import のこと.
[^23]:

  Synchronously importing wasm modules in the main chunk · Issue #6615 · webpack/webpack: https://github.com/webpack/webpack/issues/6615

[^24]:

  dynamic import は ECMAScript の正式な仕様ではなく, 現在 Stage 3 の Proposal です (参考: https://github.com/tc39/proposal-dynamic-import).

今のところ Webpack では WebAssembly の synchronously import[^22]がサポートされていない[^23]ので, ここでは dynamic import を使っています[^24].

準備が整ったので実行してみましょう. `npm run dev` コマンドでプロジェクトのビルドが行われ, 開発用の HTTP サーバが立ち上がります. ここで注意してほしいのですが, Cargo によるビルドが終わる前に Webpack によるビルドが実行されるのでビルドの途中でエラーが出ますが, 無視して暫く放置して下さい. Cargo によるビルドが完了した時に Webpack がそれを検知して再度ビルドが掛かるので無事ビルドが成功するはずです.

```bash
$ npm run dev
...
i 「wdm」: Compiled successfully.
```

[^26]:

  Unable to import WebAssembly modules bigger than 4KB · Issue #6475 · webpack/webpack: https://github.com/webpack/webpack/issues/6475

ブラウザのコンソールに `3` が出力されていれば成功です. ただ, もしかするとブラウザのコンソールに次のエラーが出ている人がいるかもしれません.

```bash
Uncaught (in promise) RangeError: WebAssembly.Instance is disallowed on the
main thread, if the buffer size is larger than 4KB.
Use WebAssembly.instantiate.
    at eval (webpack_wasm_skeleton_bg.wasm:4)
    at Object../src/webpack_wasm_skeleton_bg.wasm (0.js:22)
    at __webpack_require__ (main.js:58)
    at eval (webpack_wasm_skeleton.js:25)
    at Object../src/webpack_wasm_skeleton.js (0.js:11)
    at __webpack_require__ (main.js:58)
```

これは WebAssembly を含むプロジェクトをビルドした時に Google Chrome で実行できないコードが出力されるという Webpack のバグに起因しています[^26]. もし上記のエラーが出た場合は Google Chrome の代わりに Mozilla Firefox を使って下さい.

## WebAssembly から JavaScript の関数を呼び出す

Webpack でどのように WebAssembly を動かすかを確認できたので, 次は WebAssembly から JavaScript の関数の呼び出しに挑戦してみましょう.

`/src/lib.rs` に以下のコードを追加します.

```rust
// ...
#[wasm_bindgen(module = "./index")]
extern {
    fn date_now() -> f64;
}

#[wasm_bindgen]
pub fn get_timestamp() -> f64 {
    date_now()
}
```

`/src/index.js` は次のように編集します.

```javascript
export const date_now = Date.now;

import("./webpack_wasm_skeleton").then(module => {
  const { add, get_timestamp } = module;
  // ...
  console.log(get_timestamp());
});
```

[^27]:

  バインディングされるアイテムを静的に解析することが容易という理由で「宣言的」と表現しています.

ここでのポイントは `extern` ブロックを `#[wasm_bindgen(module = "./index")]` で修飾していることです. こうすると wasm-bindgen は `/src/index.js` で export されているアイテムを `extern` ブロックで定義されるアイテムへとバインディングします. やっていることは 2 節のものと同じですが, こちらの手法の方がより宣言的でモジュール指向です[^27]. JavaScript 側では ES Modules の `export` キーワードを用いて Rust 側からアイテムが参照できるようにしています. また, wasm-bindgen が JavaScript の関数を呼び出している箇所を自動で `unsafe` で囲ってくれるので `unsafe` ブロックを使用していないことにも注意して下さい.

Hot module replacement により編集内容を保存すればブラウザのページが更新されるはずです! コンソールにタイムスタンプが出力されましたか? リロードする度に出力される値が変わっていれば成功です!

## Rust のサードパーティ製ライブラリの利用

続けて外部ライブラリの呼び出しを Webpack を使って実現してみましょう. `/Cargo.toml` の `dependencies` に tinymt クレートを追加しましょう.

```ini
// ...
[dependencies]
wasm-bindgen = "0.1"
tinymt = { git = "https://github.com/mizdra/rust-tinymt", tag = "0.1.0" }
// ...
```

`/src/lib.rs` に次のコードを追加します.

```rust
// ...
extern crate tinymt;

use tinymt::tinymt32;

#[wasm_bindgen]
pub fn rand() -> u32 {
    let param = tinymt32::Param {
        mat1: 0x8F7011EE,
        mat2: 0xFC78FF1F,
        tmat: 0x3793fdff,
    };
    let seed = 1;
    tinymt32::from_seed(param, seed).gen()
}
```

`/src/index.js` を `rand` 関数を呼び出すよう編集します.

```javascript
// ...
const toUint32 = num => num >>> 0;

import("./webpack_wasm_skeleton").then(module => {
  const { add, get_timestamp, rand } = module;
  // ...
  console.log(toUint32(rand()));
});
```

特に前節でやったことと変わりはありませんね. 編集内容を保存してブラウザのコンソールを見てみましょう. 出力に `2545341989` が追加されていれば成功です!

## コレクション, 文字列の受け渡し

さて, ここから wasm-bindgen の本領が発揮されます. まずは wasm-bindgen を使って前節で出てきた `sum` 関数を実装してみましょう. `/src/lib.rs` に以下を追加します.

```rust
// ...
#[wasm_bindgen]
pub fn sum(slice: &[i32]) -> i32 {
    slice.iter().sum()
}
```

そして `/src/index.js` から `sum` 関数を呼び出します.

```javascript
// ...
import("./webpack_wasm_skeleton").then(module => {
  const { add, get_timestamp, rand, sum } = module;
  // ...
  console.log(sum(new Int32Array([1, 2, 3, 4, 5])));
});
```

注意点としては Rust 側の関数の仮引数では配列型ではなくスライス型を使用し, JavaScript 側の関数呼び出しの実引数では通常の配列ではなく対応する TypedArray を使用することです.

Rust の関数からコレクションを返したい場合は `std::vec::Vec` を使うと, JavaScript 側で対応する TypedArray で受け取れます. 以下はコレクションの各要素を 2 倍した新しいコレクションを返す `twice` 関数の実装例です.

```rust
// ...
#[wasm_bindgen]
pub fn twice(slice: &[i32]) -> Vec<i32> {
    slice.iter().map(|x| x * 2).collect()
}
```

JavaScript から呼び出す場合はこうです.

```javascript
// ...
import("./webpack_wasm_skeleton").then(module => {
  const { add, get_timestamp, rand, sum, twice } = module;
  // ...
  // console.log(sum(new Int32Array([1, 2, 3, 4, 5])))
  console.log(sum(twice(new Int32Array([1, 2, 3, 4, 5]))));
});
```

文字列の受け渡しはどうでしょうか. 文字列をブラウザのコンソールに出力する `hello` 関数を作成してみます.

```rust
// ...
#[wasm_bindgen(module = "./index")]
extern {
    // ...
    fn console_log(s: &str);
}

#[wasm_bindgen]
pub fn hello() {
    console_log("Hello, World!");
}
```

JavaScript 側ではバインディングするアイテムを export して `hello` 関数を呼び出すコードを追加するだけです.

```javascript
// ...
export const console_log = console.log;

import("./webpack_wasm_skeleton").then(module => {
  const { add, get_timestamp, rand, sum, twice, hello } = module;
  // ...
  hello();
});
```

ブラウザのコンソールを開いて出力を確認してみましょう. 正しくコードが書けていれば `30` と `Hello, World!` が出力に追加されているはずです. `"Hello, World!"` が出力できたのでこれで本当の WebAssembly 入門が終わったと言えそうですね! ハハハ...

## 本節のまとめ

本節では次のことを学びました.

* Webpack と wasm-bindgen を使って高機能な WebAssembly の開発環境を構築した
* Webpack と wasm-bindgen を使って Rust のサードパーティ製ライブラリを利用した
* Webpack と wasm-bindgen を使ってコレクションや文字列をやり取りする方法を学んだ
* `"Hello, World!"` を出力して本当の WebAssembly 入門を終えた

本節で作成したプロジェクトは以下のリポジトリで公開しています.

* mizdra / webpack-wasm-skeleton · GitLab
  * https://gitlab.mma.club.uec.ac.jp/mizdra/webpack-wasm-skeleton
