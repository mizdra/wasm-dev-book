# WebAssembly 入門

それでは WebAssembly の入門から始めましょう! まずは WebAssembly の動作を理解しやすいよう, 引数として受け取った 2 つの数値の和を返す単純な関数 `add` を Rust で実装して, WebAssembly にコンパイルして JavaScript から呼び出してみます. まずは Rust のインストールを行います.

```bash
## Rustをインストール (cargo, rustc, rustupコマンドなどがインストールされる)
$ curl https://sh.rustup.rs -sSf | sh
$ cat ~/.cargo/env

## toolchainを更新
$ rustup update

## WebAssemblyへのコンパイル機能を有効化
$ rustup target add wasm32-unknown-unknown
```

<!-- prettier-ignore -->
[^4]: Rust のビルドシステム, 及びパッケージマネージャ.

インストールが終わったら Cargo[^4]を用いて Rust のプロジェクトを作成しましょう.

```bash
$ cargo new --lib hello_world_wasm
$ tree hello_world_wasm
hello_world_wasm
├── Cargo.toml
└── src
    └── lib.rs

1 directory, 2 files
```

<!-- prettier-ignore -->
[^5]: [rfcs/1510-cdylib.md at master · rust-lang/rfcs](https://github.com/rust-lang/rfcs/blob/master/text/1510-cdylib.md)

Rust からコンパイルしたバイナリにはデフォルトで他の Rust プログラムからの利用する際に使われるメタデータなどが含まれています[^5]. これらのメタデータは WebAssembly では不要なので `crate-type` に `"cdylib"` を指定し, 削ぎ落とすようにしましょう. `/Cargo.toml` に以下を追加します.

```ini
// ...
[lib]
crate-type = ["cdylib"]
```

準備が整ったのでコードを書いていきます. `/src/lib.rs` を次のように書き換えます.

```rust
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

2 つの符号付き 32bit 整数を引数として受け取り, その和を返す関数です. `#[no_mangle]` はアトリビュートと言い, Java のデコレータのようにブロックやメソッドなどを修飾する構文です. `#[no_mangle]` では「Rust コンパイラに次の関数の名前をマングリングせずにコンパイルせよ」と指示します. これにより, JavaScript から `add` という名前で関数にアクセスできるようになります. また, 関数を公開して外部から呼び出せるようにするため `pub` キーワードを付けています.

Rust のプロジェクトを WebAssembly にコンパイルするには次のコマンドを実行します.

```bash
$ cargo build --target=wasm32-unknown-unknown --release
```

<!-- prettier-ignore -->
[^6]: 実のことを言うとつい最近この問題は解決されました (参考: [Support non-optimized builds on pure wasm backend · Issue #1 · rust-lang-nursery/rust-wasm](https://github.com/rust-lang-nursery/rust-wasm/issues/1)). しかしながら念には念を入れて, ここでは `release` オプションを付けています.

`release` オプションにより最適化したバイナリを生成するよう指示しています. これは Rust の WebAssembly 向けコンパイルがまだ安定しておらず, 最適化されていないバイナリにバグが含まれる可能性があるため付けています[^6]. 時が経てば `release` オプションは不要になることでしょう.

コンパイルが成功すれば `/target/wasm32-unknown-unknown/release/hello_world_wasm.wasm` が生成されているはずです. 早速これを JavaScript から実行してみましょう. `/index.html` を作成します.

```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <title>Hello, World! on WebAssembly</title>
  <script>
    const wasm = './target/wasm32-unknown-unknown/release/hello_world_wasm.wasm'
    fetch(wasm)
      .then(response => response.arrayBuffer())
      .then(bytes => WebAssembly.instantiate(bytes, {}))
      .then(results => {
        console.log(results.instance.exports.add(1, 2))
      })
  </script>
</head>

</html>
```

ここで起こっていることを順に追っていきます.

1.  Fetch API を用いて wasm ファイルを読み込む
2.  `response.arrayBuffer` でファイルのデータをバイナリ配列に変換
3.  `WebAssembly.instantiate` でバイナリ配列を WebAssembly コードとしてコンパイル・インスタンス化
4.  WebAssembly インスタンスから `add` にアクセスし, 呼び出す

<!-- prettier-ignore -->
[^8]: 厳密にはブラウザだけでなく Node.js や組み込みシステムなど様々な環境で動作します.

<!-- prettier-ignore -->
[^9]: `file:///path/to/file.ext` のようにローカルにあるファイルにアクセスするときに使う URI スキーマです.

もしかしたらこの説明に疑問を持った方がいるかもしれません. 何故なら先程 Rust コンパイラを用いて Rust から WebAssembly にコンパイルしたにも関わらず, JavaScript 上で再度コンパイルをしているからです. これは WebAssembly があくまでブラウザ[^8]が理解できるフォーマットであり, そのままではそのブラウザが動いている OS やハードウェアなどのシステムが理解できるフォーマットではないためです. WebAssembly を実行するには最初にブラウザが WebAssembly をそのブラウザが動いている OS やハードウェアが理解できる機械語にコンパイルし, それから実行する必要があります. ブラウザと WebAssembly は, ちょうど Java でいうところの JVM とバイトコードの関係のようなものです.

さて, このコードを実際にブラウザで動かしてみます. 注意点として Fetch API は `file` URI Scheme[^9]をサポートしていないため, 任意の HTTP サーバで `index.html` と `hello_world_wasm.wasm` を配信してファイルに `http` URI Scheme でアクセスできるようにする必要があります. ここでは npm パッケージの http-server を使用します.

```bash
## `npx` はnpmにバンドルされているコマンドです
$ npx http-server .
Starting up http-server, serving .
Available on:
  http://127.0.0.1:8081
  http://192.168.0.14:8081
## HTTPサーバが立ち上がるのでブラウザから `http://127.0.0.1:8081` にアクセスする
```

ブラウザの開発者ツールのコンソールを開いて `3` が出力されていれば成功です!

## WebAssembly から JavaScript の関数を呼び出す

WebAssembly から JavaScript の関数を呼び出す例も試してみましょう. 今回は WebAssembly から JavaScript の `Date.now` 関数を呼び出してタイムスタンプを返す `get_timestamp` 関数を実装します.

`/index.html` の `<script>` タグの中を次のように編集します.

```javascript
// 追加
const imports = {
  env: {
    date_now: Date.now
  }
};
const wasm = "./target/wasm32-unknown-unknown/release/hello_world_wasm.wasm";
fetch(wasm)
  .then(response => response.arrayBuffer())
  // `WebAssembly.instantiate` の引数に `imports` を追加
  .then(bytes => WebAssembly.instantiate(bytes, imports))
  .then(results => {
    const { add, get_timestamp } = results.instance.exports;
    console.log(add(1, 2));
    // 追加
    console.log(get_timestamp());
  });
```

`WebAssembly.instantiate` の引数に WebAssembly 実行環境に渡したい関数が含まれるオブジェクトを指定します. `env` プロパティでネストしていることに注意して下さい.

次に `/src/lib.rs` に以下を追加します.

```rust
// ...
extern {
    fn date_now() -> f64;
}

#[no_mangle]
pub fn get_timestamp() -> f64 {
    unsafe {
        date_now()
    }
}
```

<!-- prettier-ignore -->
[^10]: `u64` とするとランタイムエラーが出ます.

`extern` ブロックの中には Rust のコンパイラが他言語の関数を理解できるよう, 他言語の関数のシグネチャを書きます. `Date.now` 関数によって返される値は常に整数ですが, JavaScript の数値は全て IEE754 浮動小数点数なので `date_now` 関数の戻り値の型を `f64` としています[^10]. また Rust ではデフォルトで他言語関数の呼び出しはアンセーフとみなされるので, 関数を呼び出す際は `unsafe` ブロックで囲って関数が安全であることをコンパイラに約束する必要があります.

コンパイルして実行してみましょう.

```bash
$ cargo build --target=wasm32-unknown-unknown --release
$ npx http-server .
```

ブラウザのコンソールにタイムスタンプが出力されましたでしょうか? システムのタイムスタンプが出力されるため, ページを更新する度に出力内容が変わるはずです.

## Rust のサードパーティ製ライブラリの利用

最後に Rust のサードパーティ製ライブラリを利用してみます. `/Cargo.toml` に以下を追加し, Cargo にプロジェクトが `tinymt` クレートに依存していることを伝えます.

```ini
// ...
[dependencies]
tinymt = { git = "https://github.com/mizdra/rust-tinymt", tag = "0.1.0" }
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

<!-- prettier-ignore -->
[^11]: 著者がポケモンの乱数調整に関するツール製作を趣味でやっているため, 乱数生成ライブラリを例に挙げました. :P (参考: [乱数調整 入門 - mizdra's blog](https://mizdra.hatenablog.com/entry/2016/12/01/235954))

`extern crate` で `tinymt` クレートを利用することを Rust コンパイラに伝えています. `rand` 関数では `tinymt` クレートを利用して TinyMT という乱数生成方式で乱数を生成し, 得られた乱数を返しています[^11].

`/index.html` の `<script>` タグの中を編集し, JavaScript からこの関数を呼び出します.

```javascript
const imports = {
  env: {
    date_now: Date.now
  }
};
const wasm = "./target/wasm32-unknown-unknown/release/hello_world_wasm.wasm";
const toUint32 = num => num >>> 0;
fetch(wasm)
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, imports))
  .then(results => {
    const { add, get_timestamp, rand } = results.instance.exports;
    console.log(add(1, 2));
    console.log(get_timestamp());
    console.log(toUint32(rand()));
  });
```

<!-- prettier-ignore -->
[^13]: この現象は WebAssembly を `wast` 形式と呼ばれる S 式ベースのテキスト表現へと変換すると確認できます. WebAssembly の仕様に `u32` 型が存在するのにも関わらず, このように敢えて `i32` 型へと変換する理由が書いてある文献を探してみましたが, 見つけられませんでした. 何か情報をお持ちの方がいれば教えてください...

<!-- prettier-ignore -->
[^14]: この挙動は [ECMAScript® 2017 Language Specification | 7.1.5 ToInt32](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-toint32) に基づきます.

<!-- prettier-ignore -->
[^15]: 関数の戻り値の型として `u32` を期待しているのであれば, その戻り値の全てを `toUint32` 関数でラップしたほうが安全でしょう. 手間ですが...

`toUint32` 関数は JavaScript の数値を 32bit 符号無し整数として扱うためのトリックです. `rand` 関数は Rust のコードでは `u32` 型を返すことになっていますが, WebAssembly にコンパイルすると `i32` 型を返す関数へと変換されます[^13]. 戻り値を `u32` 型で表した時に `2^31` 未満であれば JavaScript 側で得られる値に変わりはありませんが, `2^31` 以上の場合は戻り値から `2^32` を引いた値が JavaScript 側で得られる値となります[^14]. 今回は `rand` 関数の戻り値は `u32` 型で表した時に `2^31` 以上となる可能性があるため, `toUint32` 関数を使って戻り値を 32bit 符号無し整数として扱っています[^15].

それでは完成したプロジェクトをビルドし, 実行してみましょう.

```bash
$ cargo build --target=wasm32-unknown-unknown --release
$ npx http-server .
```

ブラウザのコンソールの出力に `2545341989` が追加されていれば成功です!

## 本節のまとめ

これにて WebAssembly 入門は終了です. 本節で学んだことを振り返ってみましょう.

* コマンドを用いて地道に WebAssembly にコンパイルした
* WebAssembly をどのようにブラウザ上で実行するかを確認した
* WebAssembly から JavaScript の関数を呼び出した
* Rust のサードパーティ製ライブラリを使用した
* `u32` 型を返す Rust の関数を WebAssembly にコンパイルすると `i32` を返す関数に変換されることを確認し, その対処法を学んだ

本節で作成したプロジェクトは以下のリポジトリで公開しています.

* [mizdra / hello_world_wasm · GitLab](https://gitlab.mma.club.uec.ac.jp/mizdra/hello_world_wasm)

次節ではモジュールバンドラである Parcel を用いてより簡単に WebAssembly を実行できる開発環境を構築してみます.
