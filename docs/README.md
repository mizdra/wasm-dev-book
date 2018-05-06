# WebAssembly 開発環境構築の本

<div style="text-align: center;">

<img alt="WebAssembly logo" width="256px" src="./.vuepress/public/icon.svg" />

</div>

この文章は Rust を用いた WebAssembly の開発環境を構築する手法を紹介するために作成されました.

<!-- prettier-ignore -->
ハッシュタグは [#WASMの本](https://twitter.com/search?f=tweets&q=%23WASM%E3%81%AE%E6%9C%AC) です.

## 本書の目的

* Rust を用いた WebAssembly の開発環境を構築する手法を知ること
* モジュールバンドラと連携する方法を知ること
* TypeScript と連携する方法を知ること
* WebAssembly を利用していて陥りやすい罠を知ること
* WebAssembly に関する情報を調べる方法を身につけること

## 本書でやらないこと

* WebAssembly/Rust/JavaScript の文法や機能の解説が目的ではない
  * Rust からコンパイルして生成された WebAssembly を JavaScript から利用する方法を解説する
  * 文法や機能については, WebAssembly の開発環境を構築する上で抑えておく必要がある点を中心に解説する
* JavaScript のエコシステムの解説が目的ではない
  * パッケージマネージャ, モジュールバンドラ, TypeScript などの解説は目的ではない
* C/C++ を用いた WebAssembly の開発環境を構築する手法の解説は目的ではない
  * 本書では Rust のみを扱う
* WebAssembly や JavaScript の仕様変更の追従が目的ではない
  * 本書は著者が[大学のサークルで発行した部誌の記事](https://wiki.mma.club.uec.ac.jp/Booklet#A2018.2BXnQ_.2BZiVT9w-)を Web 向けに編集・加筆したものであり, 最新の情報を Web で提供することが目的ではない

## 本書の対象読者

* モダンな JavaScript を触ったことがある人
* モジュールバンドラを用いた開発経験のある人
* Rust を用いて WebAssembly を触ってみたい人
* WebAssembly を触ったことがある人

## 本書の読み方

本書は上の節から順に読んでいくことを想定して書かれています. そのため, 節を飛ばして読むことは非推奨としています.
