# Pigeon
[![Build Status](https://travis-ci.org/avxto/pigeon-js.svg)](https://travis-ci.org/avxto/pigeon-js)
[![Dependency Status](https://david-dm.org/avxto/pigeon-js.svg)](https://david-dm.org/avxto/pigeon-js)

[![NPM](https://nodei.co/npm/pigeon-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pigeon-js/)

Pigeon is an HTML preprocessor / template engine written in Javascript.

# Installation
```npm install pigeon-js```

# About 
Pigeon is an HTML preprocessor. However, you do not need to learn a new language — you can stick to Javascript. Pigeon is an alternative to Absurd's HTML preprocessor.

# Usage 

``` javascript
var pigeon = require('pigeon-js');

var data = {
    content: 'Content'
};

var convert = {
    
    _: 'html',
    
    html: {
        head: {
            style: '.example {display: block;}',
            title: 'My title',
            script: 'function helloWorld () { console.log("Hello World"); }',
        },

        body: {
            '.main#ID': {
                '.child.child': 'Content',
                '.anotherchild': 'Content',
                '.lastchild': data.content

            },
        },
    }

};

pigeon.render(convert, function(err, html) {
    console.log(html);
});
```

### Displays 

``` html
<!DOCTYPE html>
<html>

<head>
    <style>
        .example {
            display: block;
        }
    </style>
    <title>My title</title>
    <script>
        function helloWorld() {
            console.log("Hello World");
        }
    </script>
</head>

<body>
    <div id="ID" class="main">
        <div class="child">Content</div>
        <div class="anotherchild">Content</div>
        <div class="lastchild">Content</div>
    </div>
</body>

</html>

```

# Usage: YAML 

Template file:

```yaml

_: 'html'
html:
  head: 
    script[src="/somewhereovertherainbow.js"]: ''
    title: 'My title'
  body:
    .class#id: '{{content}}'
    .anotherclass: 
      - .class: 'Content'
      - .anotherclass: '{{name}} is {{age}} today!'
      - .lastclass: 'Content'
    footer.footer:
      span: 
        a[href="/signup"]: 'Sign up'
```

Javascript:

``` javascript

var pigeon = require('pigeon-js');

var data = {content: 'Content', name: 'John', age: '20'};

var html = pigeon.renderFromYAML('/home/user/path/to/template.yml', {data: data});

console.log(html);

```

### Displays 

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="/somewhereovertherainbow.js"></script>
        <title>My title</title>
    </head>
    <body>
        <div id="id" class="class">Content</div>
        <div class="anotherclass">
            <div class="class">Content</div>
            <div class="anotherclass">John is 20 today!</div>
            <div class="lastclass">Content</div>
        </div>
        <footer class="footer"><span><a  href="/signup">Sign up</a></span></footer>
    </body>
</html>

```

# Todo

- [x] Support for YAML (Cleaner syntax, no quotation marks and braces)

- [x] Support same properties

- [ ] Support for attributes other than classes and id's. 

# License
The MIT License is a free software license originating at the Massachusetts Institute of Technology (MIT). It is a permissive free software license, meaning that it permits reuse within proprietary software provided all copies of the licensed software include a copy of the MIT License terms and the copyright notice.

