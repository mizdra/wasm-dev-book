# Webpack の利用

:::tip

本節で作成するプロジェクトは以下のリポジトリで公開しています.

* [mizdra/wasm-dev-book-webpack](https://github.com/mizdra/wasm-dev-book-webpack)

:::

## Webpack を試す

Webpack は Web フロントエンドのための拡張性の高い, 高機能なモジュールバンドラです.

<!-- prettier-ignore -->
[^19]: [🎼webpack 4: released today!!✨ – webpack – Medium](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)

<!-- prettier-ignore -->
[^20]: [wasm-bindgen/README.md at 0.1.0 · rustwasm/wasm-bindgen](https://github.com/rustwasm/wasm-bindgen/blob/0.1.0/README.md#basic-usage)

2018 年 2 月末にリリースされた Webpack v4.0.0 にて, WebAssembly のサポートが入りました[^19]. これに合わせて wasm-bindgen も Webpack v4.x.x に対応し, Webpack を使って高機能な WebAssembly 開発環境を構築することができるようになりました. 試してみましょう!

wasm-bindgen は Nightly 版の Rust に依存しています[^20]. 次のコマンドで Nightly 版をインストールして下さい.

```bash
$ rustup install nightly-2018-05-04
$ rustup target add wasm32-unknown-unknown --toolchain nightly-2018-05-04
```

:::warning

`rustup install nightly` と実行すればその時点で最新の Nightly 版の Rust がインストールされますが, ここでは説明のため toolchain のバージョンを指定してインストールしています.

:::

プロジェクトを作成・初期化し, プロジェクトのビルドに必要なツール群をインストールします. cargo-watch は Rust ファイルを監視ビルドする際に, wasm-bindgen-cli は JavaScript のラッパーを生成する際に必要になります.

```bash
$ cargo new --lib wasm-dev-book-webpack && cd $_
$ cargo install cargo-watch
$ cargo install wasm-bindgen-cli

$ npm init -y
$ npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin npm-run-all
```

`/rust-toolchain` を作成し, ビルド時に利用する Rust の toolchain のバージョンを指定します.

```bash
$ echo nightly-2018-05-04 > rust-toolchain
```

:::tip

`rust-toolchain` ファイルはそのファイルが配置されているディレクトリ及びサブディレクトリで有効です. また, コマンドの後ろに `+nightly-2018-05-04` などのように使用したいバージョンを加えることで, `rustc` や `cargo` などのコマンドで使用する toolchain のバージョンを上書き指定できます.

```bash
## テストプロジェクトの作成
$ mkdir /tmp/rust-toolchain-test
$ cd /tmp/rust-toolchain-test
$ echo nightly-2018-05-04 > rust-toolchain
$ mkdir sub

## `rust-toolchain` があるディレクトリでは `rust-toolchain` の内容が優先される
$ rustc --version
rustc 1.27.0-nightly (e82261dfb 2018-05-03)

## サブディレクトリにおいても `rust-toolchain` の内容が優先される
$ cd sub
$ rustc --version
rustc 1.27.0-nightly (e82261dfb 2018-05-03)

## `rust-toolchain` がカレントディレクトリにも親ディレクトリにも無い場合は `rustup default` で指定したバージョンが優先される
$ cd ../../
$ rustc --version
rustc 1.25.0 (84203cac6 2018-03-25)

## コマンドの後ろに使用したいバージョンを加えると, そのバージョンが優先される
$ rustc +nightly-2018-05-04 --version
rustc 1.27.0-nightly (e82261dfb 2018-05-03)
```

その他の toolchain のバージョン指定方法は [rustup の README](https://github.com/rust-lang-nursery/rustup.rs/blob/master/README.md) を参照して下さい.

:::

`/src/lib.rs` を次のように編集します.

```rust
#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

wasm-bindgen は `proc_macro`, `wasm_custom_section`, `wasm_import_module` の 3 つの Rust の実験的な機能を利用するので `feature` アトリビュートを付けています. `#` の後に `!` を付けることでアトリビュートをそれを囲むブロック全体に適応することを Rust コンパイラに指示します. ここでは `feature` アトリビュートはトップレベルに置かれているのでトップレベルを囲むブロック, つまり `/src/lib.rs` 全体で これらの機能が有効になります.

`add` 関数では `no_mangle` アトリビュートの代わりに `wasm_bindgen` アトリビュートを用いて関数を修飾しています. こうすることで WebAssembly-JavaScript 間で相互にやりとりしやすいように修飾された関数を変換します. また, 本来であれば `#[wasm_bindgen::prelude::wasm_bindgen]` と書くところを `use` キーワードを用いることで `#[wasm_bindgen]` と短く書けるようにしています.

次に Webpack の設定ファイル `/webpack.config.js` を作成します.

<!-- prettier-ignore-start -->
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.js', '.wasm'],
  },
  plugins: [new HtmlWebpackPlugin()],
}
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore -->

wasm-bindgen-cli が生成する JavaScript のラッパーは WebAssembly を拡張子を付けずに import しているので `resolve.extensions` に `.wasm` を追加する必要があります. また, html-webpack-plugin を用いて Webpack でバンドルされた JavaScript を `<script>` タグで埋め込んだ HTML を出力するようにしています. この HTML をブラウザで開くことで Webpack でバンドルされた JavaScript が実行できるようになります.

`/Cargo.toml` を編集してプロジェクトが wasm-bindgen に依存することを Cargo に伝わるようにします.

```ini{7-10}
[package]
name = "wasm-dev-book-webpack"
version = "0.1.0"
authors = ["mizdra <pp.mizdra@gmail.com>"]

[dependencies]
wasm-bindgen = "0.2"

[lib]
crate-type = ["cdylib"]
```

プロジェクトをビルドするために `npm-scripts` にビルドコマンドを追加しましょう. `/package.json` の `scripts` フィールドを次のように書き換えます.

<!-- prettier-ignore-start -->
```json
{
  // ...
  "scripts": {
    "build:wasm": "cargo build --target wasm32-unknown-unknown --release",
    "postbuild:wasm": "wasm-bindgen target/wasm32-unknown-unknown/release/wasm_dev_book_webpack.wasm --out-dir src --no-typescript",
    "build:js": "webpack --mode production",
    "build": "run-s build:wasm build:js",
    "dev:wasm": "cargo watch -i 'src/{wasm_dev_book_webpack_bg.wasm,wasm_dev_book_webpack.js}' -s 'npm run build:wasm'",
    "dev:js": "webpack-dev-server --mode development",
    "dev": "run-p dev:wasm dev:js"
  },
  // ...
}
```
<!-- prettier-ignore-end -->

[Parcel の利用](/parcel.md) の節で出てきた npm-scripts と比べると随分と複雑です :weary: 本書は開発環境の構築に焦点を当てているので, 利用しているコマンド (`wasm-bindgen`, `cargo watch`, `webpack-dev-server` など) の機能やオプションの解説は行いませんが, ここではそれぞれの npm-scripts の役割について簡単に補足しておきます.

| スクリプト名          | 役割                                                                                                                         |
| :--------------: | :--------------------------------------------------------------------------------------------------------------------------- |
| `build:wasm`     | Rust のソースコードを WebAssembly にコンパイルする.                                                                                          |
| `postbuild:wasm` | `build:wasm` コマンドが実行された直後に, 生成された WebAssembly を元に JavaScript ラッパーを生成する.                                             |
| `build:js`       | Webpack で JavaScript のビルド (モジュールの依存解決など) をする.                                                                            |
| `build`          | 本番用ビルドを行う. `build:wasm`, `postbuild:wasm`, `build:js` コマンドを順番に実行する.                                                  |
| `dev:wasm`       | プロジェクトのファイル (Rust のソースコード以外も含む) が変更されたら `build:wasm` コマンドを実行する. ただし `wasm-bindgen` コマンドで生成されるファイルは監視対象から除外する. |
| `dev:js`         | JavaScript ファイルが更新されたら Webpack で JavaScript のビルドをする.                                                                       |
| `dev`            | 開発用ビルドを行う. `dev:wasm`, `dev:js` コマンドを並列に実行する.                                                                        |

:::warning

`dev:wasm` コマンドにおいて更新の監視対象から `wasm-bindgen` コマンドで生成されるファイルを除外しているのは, `dev:js` コマンドの監視対象とコンフリクトして `dev` コマンドのビルドが終わらない問題を回避するためです.

:::

プロジェクトをビルドすると wasm-bindgen-cli により `src` ディレクトリ配下に WebAssembly ファイル `wasm_dev_book_webpack_bg.wasm` とその JavaScript ラッパーの`wasm_dev_book_webpack.js` が生成されます. WebAssembly を利用する場合は WebAssembly を直接読み込むのではなく, この JavaScript ラッパーを読み込んでラッパー経由で WebAssembly を利用します.

それではラッパーを経由して WebAssembly の関数を呼び出す `/src/index.js` を作成しましょう.

<!-- prettier-ignore-start -->
```javascript
import('./wasm_dev_book_webpack').then(module => {
  const { add } = module
  console.log(add(1, 2))
})
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore -->
[^23]: Webpack では将来的に Parcelと同様の WebAssembly の synchronously import (ES Modules による import のこと) がサポートされる予定です (参考: [webpack/webpack#6615](https://github.com/webpack/webpack/issues/6615)).

<!-- prettier-ignore -->
[^24]: dynamic import は現在 ECMAScript の正式な仕様ではなく, Stage 3 の Proposal です.

Webpack で WebAssembly を読み込むには [dynamic import](https://github.com/tc39/proposal-dynamic-import) [^24]を使います [^23]. dynamic import の `import` 関数は `Promise` を返すので, `fetch` 関数と同様に `then` メソッドで処理を囲む必要があります.

準備が整ったので実行してみましょう. `npm run dev` コマンドでプロジェクトのビルドが行われ, 開発用の HTTP サーバが立ち上がります. ここで注意してほしいのですが, Cargo によるビルドが終わる前に Webpack によるビルドが実行されるのでビルドの途中でエラーが出ますが, 無視して暫く放置してみて下さい. Cargo によるビルドが完了した時に Webpack がそれを検知して再度ビルドが掛かるので無事ビルドが成功するはずです.

```bash
$ npm run dev
...
i 「wdm」: Compiled successfully.
```

ブラウザのコンソールに `3` が出力されていれば成功です.

::: danger
もしかするとブラウザのコンソールに次のエラーが出ている人がいるかもしれません.

```
Uncaught (in promise) RangeError: WebAssembly.Instance is disallowed on the
main thread, if the buffer size is larger than 4KB.
Use WebAssembly.instantiate.
    at eval (wasm_dev_book_webpack_bg.wasm:4)
    at Object../src/wasm_dev_book_webpack_bg.wasm (0.js:22)
    at __webpack_require__ (main.js:58)
    at eval (wasm_dev_book_webpack.js:25)
    at Object../src/wasm_dev_book_webpack.js (0.js:11)
    at __webpack_require__ (main.js:58)
```

これは WebAssembly を含むプロジェクトをビルドした時に Google Chrome で実行できないコードが出力されるという Webpack のバグに起因しています (参考: [webpack/webpack#6475](https://github.com/webpack/webpack/issues/6475)).

もし上記のエラーが出た場合は Google Chrome の代わりに Mozilla Firefox を使って下さい.
:::

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

<!-- prettier-ignore-start -->
```javascript{1,4,6}
export const date_now = Date.now

import('./wasm_dev_book_webpack').then(module => {
  const { add, get_timestamp } = module
  console.log(add(1, 2))
  console.log(get_timestamp())
})
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore -->
[^27]: バインディングされるアイテムを静的に解析することが容易という理由で「宣言的」と表現しています.

ここでのポイントは `extern` ブロックを `#[wasm_bindgen(module = "./index")]` で修飾していることです. こうすると wasm-bindgen は `/src/index.js` で export されているアイテムを `extern` ブロックで定義されるアイテムへとバインディングします. やっていることは[WebAssembly 入門](/hello-wasm.md)の節のものと同じですが, こちらの手法の方がより宣言的でモジュール指向です[^27]. JavaScript 側では ES Modules の `export` キーワードを用いて Rust 側からアイテムが参照できるようにしています. また, wasm-bindgen が JavaScript の関数を呼び出している箇所を自動で `unsafe` で囲ってくれるので `unsafe` ブロックを使用していないことにも注意して下さい.

[Hot module replacement](https://webpack.js.org/concepts/hot-module-replacement) により編集内容を保存すればブラウザのページが更新されるはずです! コンソールにタイムスタンプが出力されましたか? リロードする度に出力される値が変わっていれば成功です!

## Rust のサードパーティ製ライブラリの利用

続けて外部ライブラリの呼び出しを Webpack を使って実現してみましょう. `/Cargo.toml` の `dependencies` に tinymt クレートを追加しましょう.

```ini
// ...
[dependencies]
wasm-bindgen = "0.2"
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

<!-- prettier-ignore-start -->
```javascript{1,6,9}
const toUint32 = num => num >>> 0

export const date_now = Date.now

import('./wasm_dev_book_webpack').then(module => {
  const { add, get_timestamp, rand } = module
  console.log(add(1, 2))
  console.log(get_timestamp())
  console.log(toUint32(rand()))
})
```
<!-- prettier-ignore-end -->

特に[前節](/parcel.md)でやったことと変わりはありませんね. 編集内容を保存してブラウザのコンソールを見てみましょう. 出力に `2545341989` が追加されていれば成功です!

## コレクション, 文字列の受け渡し

さて, ここから wasm-bindgen の本領が発揮されます. まずは wasm-bindgen を使って[前節](/parcel.md)で出てきた `sum` 関数を実装してみましょう. `/src/lib.rs` に以下を追加します.

```rust
// ...
#[wasm_bindgen]
pub fn sum(slice: &[i32]) -> i32 {
    slice.iter().sum()
}
```

そして `/src/index.js` から `sum` 関数を呼び出します.

<!-- prettier-ignore-start -->
```javascript{6,10}
const toUint32 = num => num >>> 0

export const date_now = Date.now

import('./wasm_dev_book_webpack').then(module => {
  const { add, get_timestamp, rand, sum } = module
  console.log(add(1, 2))
  console.log(get_timestamp())
  console.log(toUint32(rand()))
  console.log(sum(new Int32Array([1, 2, 3, 4, 5])))
})
```
<!-- prettier-ignore-end -->

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

<!-- prettier-ignore-start -->
```javascript{6,10-11}
const toUint32 = num => num >>> 0

export const date_now = Date.now

import('./wasm_dev_book_webpack').then(module => {
  const { add, get_timestamp, rand, sum, twice } = module
  console.log(add(1, 2))
  console.log(get_timestamp())
  console.log(toUint32(rand()))
  // console.log(sum(new Int32Array([1, 2, 3, 4, 5])))
  console.log(sum(twice(new Int32Array([1, 2, 3, 4, 5]))))
})
```
<!-- prettier-ignore-end -->

文字列の受け渡しはどうでしょうか. 文字列をブラウザのコンソールに出力する `hello` 関数を作成してみます.

```rust{5,8-11}
// ...
#[wasm_bindgen(module = "./index")]
extern {
    fn date_now() -> f64;
    fn console_log(s: &str);
}
// ...
#[wasm_bindgen]
pub fn hello() {
    console_log("Hello, World!");
}
```

JavaScript 側ではバインディングするアイテムを export して `hello` 関数を呼び出すコードを追加するだけです.

<!-- prettier-ignore-start -->
```javascript{4,7,12}
const toUint32 = (num) => num >>> 0

export const date_now = Date.now
export const console_log = console.log

import('./wasm_dev_book_webpack').then(module => {
  const { add, get_timestamp, rand, sum, twice, hello } = module
  console.log(add(1, 2))
  console.log(get_timestamp())
  console.log(toUint32(rand()))
  console.log(sum(twice(new Int32Array([1, 2, 3, 4, 5]))))
  hello()
})
```
<!-- prettier-ignore-end -->

ブラウザのコンソールを開いて出力を確認してみましょう. 正しくコードが書けていれば `30` と `Hello, World!` が出力に追加されているはずです. `"Hello, World!"` が出力できたのでこれで本当の WebAssembly 入門が終わったと言えそうですね :P

:::tip

wasm-bindgen では関数や配列, 文字列以外にもクラスやクロージャなどをサポートしています. 詳細は [wasm-bindgen のリポジトリ](https://github.com/rustwasm/wasm-bindgen) を参照して下さい.

:::

## 本節のまとめ

本節では次のことを学びました.

* Webpack と wasm-bindgen を使って高機能な WebAssembly の開発環境を構築した
* Webpack と wasm-bindgen を使って Rust のサードパーティ製ライブラリを利用した
* Webpack と wasm-bindgen を使ってコレクションや文字列をやり取りする方法を学んだ
* `"Hello, World!"` を出力して本当の WebAssembly 入門を終えた

## 参考文献
* [🎼webpack 4: released today!!✨ – webpack – Medium](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)
* [rustwasm/wasm-bindgen: Interoperating JS and Rust code](https://github.com/rustwasm/wasm-bindgen)
