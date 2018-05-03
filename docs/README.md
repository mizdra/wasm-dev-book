# WebAssembly 開発環境構築

この文章は WebAssembly の開発環境を構築する手法を紹介するために作成されました.

## 本書でやらないこと

* WebAssembly や JavaScript の仕様変更の追従が目的ではない
  * 本書は著者が[大学のサークルで発行した部誌の記事](https://wiki.mma.club.uec.ac.jp/Booklet#A2018.2BXnQ_.2BZiVT9w-)を Web 向けに編・加筆したものであり, 最新の情報を Web で提供することが目的ではない
* Rust の全ての文法や機能の解説が目的ではない
  * WebAssembly の開発環境を構築する上で抑えておく必要がある点を中心に解説する
* モダンな JavaScript の文法や機能, エコシステムの解説が目的ではない
  * パッケージマネージャ, モジュールバンドラ, TypeScript などの解説は目的ではない

## 本書の目的

* WebAssembly の開発環境を構築する手法を知ること
* モジュールバンドラと連携する方法を知ること
* TypeScript と連携する方法を知ること
* WebAssembly を書いていて陥りやすい罠を知ること
* WebAssembly に関する情報を調べる方法を身につけること

## 本書の対象読者

* モダンな JavaScript を触ったことがある人
* モジュールバンドラを用いた開発経験のある人
* Rust を用いて WebAssembly を触ってみたい人
* WebAssembly を触ったことがある人
