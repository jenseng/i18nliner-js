# i18nliner-js

[i18nliner](https://github.com/jenseng/i18nliner), but for js :)

can either be used with [i18n_js](https://github.com/fnando/i18n-js)
or [i18next](https://github.com/jamuhl/i18next)

using handlebars? check out [i18nliner-handlebars](https://github.com/fivetanley/i18ninliner-handlebars)

## TODO

* more key inference options (underscore, underscore+hash)
* i18n_js gem (so that people don't have to manually add it to assets or
  worry about versions)
* [i18next](https://github.com/jamuhl/i18next) support
  * simpler arity (key optional)
  * wrapper support
  * audit html-escaping code, PR or monkeypatch if insufficient
* extractor/checker cli so that i18nliner(.rb) can merge translations
