# IPAfy

[Homepage on Terbium.io](https://terbium.io/2017/07/ipafy/)

IPAfy is a Firefox extension that lets you convert Enlish-language web pages pages to International Phonetic Alphabet, or IPA. Find it on [GitHub](https://github.com/MattX/ipafy) and [🦊 Firefox addons](https://addons.mozilla.org/en-US/firefox/addon/ipafy/). It’s coming to Chrome soon!

## Development

Install dependencies with

```
npm install
```

Build using

```
npm run-script build(-prod)
```

The extension is built in the `dist/` directory, from which you can run [`web-ext`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext) for Firefox or load it into Chrome.
