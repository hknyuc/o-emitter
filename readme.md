# o-emitter
#####  Event emitter library.
***

## Install
### npm
```
npm install o-emitter --save
```

## Usage

```js
var Emitter = require('o-emitter').Emitter;
let emitter = new Emitter('async');
emitter.hook(function (arg1,arg2){
    //
});

emitter.emit('hello world','from emitter');
```
İf you want to emit data synchronously. Can use

```js
var Emitter = require('o-emitter').Emitter;
let emitter = new Emitter('sync');
emitter.hook(function (arg1,arg2){
    console.log('calling 1');
});

emitter.hook(function (arg1,arg2){
    console.log('calling 2');
})

emitter.emit('hello world','from emitter');
//output : calling 1
//output : calling 2
```

You can cut off emitting from hook callback function. 

```js
emitter.hook(function () {
 console.log('calling 1');
 return false;
});

emitter.hook(function () {
 console.log('calling 2');
});

//output : calling 1

