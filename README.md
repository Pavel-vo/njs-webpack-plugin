# Webpack Plugin for [NJS](https://github.com/Pavel-vo/njs-runtime)

*****

This plugin easyly adds NJS compilation to your build process.

*****

# Getting started

## Install

```bash
npm install njs-webpack-plugin
npm install njs-runtime
```

## Hello, world

##### Create file entry.js:

```js
global.njs = require('njs-runtime');

var testRuntime = {% compileNjs %}function () {
    console.log('one');
    njs.sleep.yld(1000);
    console.log('two');
    njs.sleep.yld(1000);
    console.log('threes');
}{% endcompileNjs %};

testRuntime(); // new thread
```

##### Create webpack.config.js

```js
var NjsPlugin = require('njs-webpack-plugin');

module.exports = {
    entry: './entry.js',
    output: {
        filename: 'build/bundle.js'
    },
    plugins: [new NjsPlugin()]
};
```

##### Compile bundle (run command in terminal):

```bash
webpack
```
##### Run compiled script (run command in terminal):

```bash
node build/bundle.js 
```

##### Output:

```bash
one
two
threes
```

# API

```js
new NjsPlugin(options)
```

| option       | type       | description |
|--------------|------------|-------------|
| locals       | dictionary | locals will be passed to Swig|
| template_dir | string     | Path to templates dir, where swig will search for template files. This can be useful if you use `include` swig tag: {% include "templates/addon.js" %} |
| runtime      | string     | You can override global variable name of NJS Runtime (default: 'njs')|
| tagName      | string     | You can override swig Tag name (default: 'compileNjs')|

locals is very useful if you want to use swig as text-preprocessor.

For example, if you set locals like this:

```js
var options = {locals: {DEBUG: true, TITLE: 'MY PAGE'}}
```
Then you can preproccess your JavaScript files:

```js
{% if DEBUG %}
console.log('DEBUG', '{{ TITLE }}');
{% else %}
console.log('PRODUCTION', '{{ TITLE }}');
{% endif %}
```


# Documentation
Read more about [NJS Project](https://github.com/Pavel-vo/njs-runtime)
