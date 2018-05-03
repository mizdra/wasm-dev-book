# Parcel の利用

## Parcel を試す

Parcel は Web フロントエンドのための高速でゼロコンフィグレーション(設定ファイルが不要)なモジュールバンドラです. 少し前に以下の記事にて話題になったかと思います.

* [webpack 時代の終わりと parcel 時代のはじまり - Qiita](https://qiita.com/bitrinjani/items/b08876e0a2618745f54a)

<!-- prettier-ignore -->
[^16]: [Parcel v1.5.0 released: Source Maps, WebAssembly, Rust, and more!](https://medium.com/@devongovett/parcel-v1-5-0-released-source-maps-webassembly-rust-and-more-3a6385e43b95)

2018 年 1 月末にリリースされた Parcel v1.5.0 では WebAssembly と Rust がサポートされました[^16]. これにより, 現時点で最も WebAssembly を試しやすい開発環境を Parcel を用いて構築することができるようになりました. 早速試してみましょう.

まずプロジェクトを作成, npm プロジェクトとして初期化して Parcel をインストールします.

```bash
$ mkdir parcel-wasm-skeleton && cd $_
$ npm init -y
$ npm install --save-dev parcel
```

`/src/lib.rs` を作成します.

```rust
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

[前節](/hello-wasm.md)で書いたコードと全く同じですね. 次にこの Rust の関数を WebAssembly として呼び出す JavaScript `/src/index.js` を作成します.

```javascript
import { add } from "./lib.rs";

console.log(add(1, 2));
```

ES Modules の `import` 構文を用いて `lib.rs` を読み込もうとしています. Parcel はこの構文を見つけると自動で Rust を WebAssembly にコンパイルし, [前節](/hello-wasm.md)で解説したような JavaScript コードへと変換します. このように Parcel によって WebAssembly の fetch やコンパイル, インスタンス化といったプロセスが隠蔽され, Rust の関数を WebAssembly として呼び出すという本質的な作業に集中できるようになります.

続いてプロジェクトのエントリポイントとなる `/src/index.html` を作成します.

```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <title>parcel-wasm-skeleton</title>
  <script src="./index.js"></script>
</head>

</html>
```

プロジェクトをビルドするために `npm-scripts` にビルドコマンドを追加しましょう. `/package.json` の `scripts` フィールドを次のように書き換えます.

```json
{
  // ...
  "scripts": {
    "start": "npm run dev",
    "build": "parcel build --no-cache src/index.html",
    "dev": "parcel src/index.html",
    "predev": "npm run build"
  }
  // ...
}
```

準備が整ったので `npm run dev` で実行してみます. このコマンドでプロジェクトのビルドが行われ, 開発用の HTTP サーバが立ち上がります.

```bash
$ npm run dev

> parcel-wasm-skeleton@1.0.0 dev /Users/mizdra/src/gomi/parcel-wasm-skeleton
> parcel src/index.html

Server running at http://localhost:1234
Built in 2.95s.
```

ブラウザの開発者ツールのコンソールを開いて `3` が出力されていれば成功です! 開発用ビルドではなくプロダクションビルドを行いたい場合は `npm run build` コマンドを使いましょう.

## Rust のサードパーティ製ライブラリの利用

ひとまず Parcel でどのように WebAssembly を動かすかを確認できたので, 次は[前節](/hello-wasm.md)で行っていたような外部ライブラリの呼び出しを Parcel を使って実現してみましょう. `/Cargo.toml` を作成し, 依存する Rust ライブラリを Parcel に伝わるようにします.

```ini
[package]
name = "parcel_wasm_skeleton"
version = "0.1.0"
authors = ["mizdra <pp.mizdra@gmail.com>"]

[dependencies]
tinymt = { git = "https://github.com/mizdra/rust-tinymt", tag = "0.1.0" }

[lib]
crate-type = ["cdylib"]
```

`/src/lib.rs` に以下を追加します.

```rust
// ...
extern crate tinymt;

use tinymt::tinymt32;

#[no_mangle]
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
import { add, rand } from "./lib.rs";

const toUint32 = num => num >>> 0;

console.log(add(1, 2));
console.log(toUint32(rand()));
```

<!-- prettier-ignore -->
[^17]: モジュールが更新されたら変更されたモジュールのみをビルドし, 自動でブラウザのページを更新する機能のことです.

Hot module replacement[^17]により編集内容を保存すればブラウザのページが更新されるはずです! コンソールに `3`, `2545341989` が出力されていれば成功です!

## Parcel を採用する際のデメリット

さて, このように Parcel を使えば WebAssembly の開発環境が簡単に構築できることが分かりました. しかしながら, Parcel による開発環境ではデメリットがあります. ここでは 2 つ例を挙げます.

1 つ目は[前節](/hello-wasm.md)で行った, WebAssembly からの JavaScript の関数の呼び出しができないことです. [前節](/hello-wasm.md)では WebAssembly から呼び出したい JavaScript の関数を `WebAssembly.instantiate` に渡すことでこれを実現していました. しかし Parcel では Parcel 自身が自動で WebAssrmbly のコンパイルやインスタンス化を行うコードを生成してしまうため, 開発者が `WebAssembly.instantiate` に JavaScript の関数を渡す余地がありません. こちらの問題は現在 [Parcel の Issue](https://github.com/parcel-bundler/parcel/issues/647) にて議論されています.

2 つ目は WebAssembly が基本的な数値型しか扱うことができないことです. 次の例を見て下さい.

```rust
#[no_mangle]
pub fn sum(slice: &[i32]) -> i32 {
  slice.iter().sum()
}
```

符号付き整数のスライスを受け取り, その和を返す Rust の関数です. これを JavaScript 側から呼び出してみます.

```javascript
import { sum } from "./lib.rs";

console.log(sum(new Int32Array([1, 2, 3, 4, 5]))); // 0
```

なんと `15` ではなく `0` と出力されてしまいました. これは WebAssembly が引数や戻り値として `i32`, `u32`, `f32`, `i64`, `u64`, `f64` などの基本的な数値型以外をサポートしていないことに起因しています. 現状では, 配列や文字列といった数値型以外を扱いたい場合は JavaScript, WebAssembly 双方からアクセス可能なメモリ `WebAssembly.Memory` を利用する必要があります. JavaScript 側形メモリに配列を配置し, WebAssembly がメモリ上のバイト列をスライスとして読み込む... といったようにすれば先程の関数は動作しますが, 何だか面倒ですね... よくよく考えてみるとメモリに配置したデータはいつ解放するのか, どのデータをメモリ上のどの位置に配置するのか, などなど色々なことを意識しなければならないことが分かります. 文字列や配列くらいメモリを意識せずにやり取りする方法は無いのでしょうか...

<!-- prettier-ignore -->
[^18]: [Use Rust WASM bindgen · Issue #775 · parcel-bundler/parcel](https://github.com/parcel-bundler/parcel/issues/775)

そこで wasm-bindgen というライブラリが登場します. このライブラリはメモリに関連する処理をラッパーで覆い隠し, JavaScript, WebAssembly 間でメモリを意識せず文字列や配列などをやりとりすることが出来るようにします. しかしながら現時点で Parcel からはこのライブラリを利用することができません[^18]. もし wasm-bindgen を利用するのであれば Parcel 以外のモジュールバンドラを使うか, [前節](/hello-wasm.md)のようにモジュールバンドラを使わずに開発する必要があります.

## 本節のまとめ

さて, 本節で学んだことを振り返ります.

* Parcel を使って簡単に WebAssembly の開発環境を構築した
* Parcel を使って Rust のサードパーティ製ライブラリを利用した
* Parcel では解決できない問題があることを学んだ

本節で作成したプロジェクトは以下のリポジトリで公開しています.

* [mizdra / parcel-wasm-skeleton · GitLab](https://gitlab.mma.club.uec.ac.jp/mizdra/parcel-wasm-skeleton)

次節では Webpack という別のモジュールバンドラを用いて wasm-bindgen を利用した開発環境を構築してみます.
