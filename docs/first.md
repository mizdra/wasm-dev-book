# はじめに

最近 Web フロントエンド界隈で話題になっているキーワードに「[WebAssembly(wasm)](http://webassembly.org)」があります. WebAssembly とはブラウザ上で動作することを目的とした低水準言語のことです. 事前にコンパイルされたバイナリ形式で高速に実行できるよう設計されているため, ブラウザ上で動く代表的な言語である JavaScript に比べて高速に実行できます[^1]. WebAssembly は以下を目標に定めて作成されています.

<!-- prettier-ignore -->
[^1]: [WebAssembly はなぜ速いのか | POSTD](https://postd.cc/what-makes-webassembly-fast)

<!-- prettier-ignore -->
[^2]: [Portability - WebAssembly](http://webassembly.org/docs/portability/#assumptions-for-efficient-execution)

> * 高速で、高効率であり、ポータブルである事 — WebAssembly のコードは 共通ハードウェア対応環境[^2] を利用して異なるプラットフォーム間でネイティブ水準の速度で実行可能です。
> * 可読性を持ちデバッグ可能である事 — WebAssembly は低水準のアセンブリ言語ですが、人間が読めるテキストフォーマットを持ちます（その仕様策定は終わっていないものの）。このフォーマットは人の手で読み書きできて、デバッグもできます。
> * 安全である事 — WebAssembly は安全でサンドボックス化された実行環境上で動作するように設計されています。他のウェブ言語と同様に、ブラウザに対して same-origin および権限ポリシーの確認を強制します。
> * ウェブを破壊しない事 — WebAssembly は他のウェブ技術と協調し、後方互換性を維持するように設計されます。
>
> [WebAssembly のコンセプト - WebAssembly | MDN](https://developer.mozilla.org/ja/docs/WebAssembly/Concepts) より引用

現状 C/C++や Rust などの言語から WebAssembly へのコンパイルがサポートされています. 本文章では Rust を用いて WebAssembly の環境構築を行う方法を紹介します.

## 本文章を読むにあたって

本文章では Rust/WebAssembly/JavaScript の書き方や仕様, 関連するツール・ライブラリなどが出てきます. WebAssembly の話に焦点を当てて解説していくため, 足りない知識は以下のサイトを参考に各自補完していって下さい.

* 言語を学ぶ
  * [プログラミング言語 Rust](https://rust-lang-ja.github.io/the-rust-programming-language-ja/1.6/book/README.html)
    * Rust の始め方, 書き方について丁寧に解説されています
    * Rust を初めて書くなら必読です
    * 日本語訳は原文よりも古いバージョンとなっているので英語が読めるなら原文を読むと良いです
  * [最速で知る！ プログラミング言語 Rust の基本機能とメモリ管理【第二言語としての Rust】](https://employment.en-japan.com/engineerhub/entry/2017/07/10/110000)
  * [実践的なアプリケーションを書いてみよう！ Rust の構造化プログラミング【第二言語としての Rust】](https://employment.en-japan.com/engineerhub/entry/2017/07/19/110000)
  * [Rust の標準ライブラリのドキュメント](https://doc.rust-lang.org/std)
  * [Rust Playground](https://play.rust-lang.org)
  * [Learn ES2015 · Babel](https://babeljs.io/learn-es2015)
    * ES2015 で導入された構文や機能について解説されています
  * [You Don't Know ES Modules](https://www.slideshare.net/teppeis/you-dont-know-es-modules)
    * ES Modules について解説されています
  * [Babel · The compiler for writing next generation JavaScript](https://babeljs.io/repl)
* 言語の仕様書
  * [ECMAScript® 2017 Language Specification](http://www.ecma-international.org/ecma-262/8.0/index.html)
  * [WebAssembly Specifications](http://webassembly.github.io/spec)
* モジュールバンドラのドキュメント
  * [Parcel Documentation](https://parceljs.org/getting_started.html)
  * [Webpack Documentation](https://webpack.js.org/concepts)

## 開発環境について

以下は著者の開発環境です. 出来る限りこれらより高いバージョンのツール・ソフトウェアを使用するようにして下さい.

* Node.js v10.0.0
* npm v6.0.0
* rustup 1.11.0 (e751ff9f8 2018-02-13)
* rustc 1.25.0 (84203cac6 2018-03-25)
* rustc 1.27.0-nightly (e82261dfb 2018-05-03)
* Mozilla Firefox v59.0.2
* Google Chrome v66.0.3359.117
