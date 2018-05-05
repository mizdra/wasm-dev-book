# 関連ツール・サービスの紹介

Rust 及び WebAssembly に関連するツール・サービスを軽く紹介します. 本書ではこれらの使い方について解説しませんが, ここまで本書を読んだ読者であれば使いこなすことは容易でしょう.

## alexcrichton/wasm-gc

* <https://github.com/alexcrichton/wasm-gc>

WebAssembly バイナリの圧縮ツール. バイナリに含まれる不要なコードを削除してバイナリサイズを抑えることができます. [Webpack の利用](/webpack.md) の節で使用した wasm-bindgen は, 内部でこのツールを用いて生成する WebAssembly バイナリを自動で圧縮しています.

## ashleygwilliams/wasm-pack

* <https://github.com/ashleygwilliams/wasm-pack>
* [Hello wasm-pack! – Mozilla Hacks – the Web developer blog](https://hacks.mozilla.org/2018/04/hello-wasm-pack)

WebAssembly の npm package を作成するツール. wasm-bindgen で Rust から WebAssembly 及び JavaScript ラッパーを作成し, npm package として公開できるよう package.json などを自動生成します.

## WebAssembly Studio

* <https://webassembly.studio>
* [Sneak Peek at WebAssembly Studio – Mozilla Hacks – the Web developer blog](https://hacks.mozilla.org/2018/04/sneak-peek-at-webassembly-studio)

<!-- prettier-ignore -->
[^1]: 拡張子は `.wat` です. 基本的には `.wast` と同じ WebAssembly の S 式ベースのテキスト表現ですが, `.wast` と異なり特別なテストコマンドを持ちません (参考: [WebAssembly テキストフォーマットから wasm に変換する - WebAssembly | MDN](https://developer.mozilla.org/ja/docs/WebAssembly/Text_format_to_wasm)).

<!-- prettier-ignore -->
[^2]: WebAssembly に コンパイルできる TypeScript のサブセット.

WebAssembly のオンライン IDE です. 言語として C/C++/Wat[^1]/AssemblyScript[^2]/Rust をサポートするほか, WebAssembly のために最適化された Binary Explorer や関数呼び出しをグラフとして可視化する機能などが含まれます.

## koute/cargo-web

* <https://github.com/koute/cargo-web>

Rust でクライアントサイド Web アプリケーションを構築するための CLI ツール群. Rust を WebAssembly にコンパイルする機能のほか, Auto Reload が有効化されたデバッグサーバの起動やデプロイ, Headless Chrome によるテストなどを行うコマンドが提供されています.

## DenisKolodin/yew

* <https://github.com/DenisKolodin/yew>

Rust で実装された Web フロントエンド向けの View フレームワーク. Elm や Redux のような MVC アーキテクチャを採用しており, React のような JSX-like な文法で コンポーネントを記述できます. DOM の更新は独自の Virtual DOM エンジンにより最適化されます.
