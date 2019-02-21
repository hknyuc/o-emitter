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
```

set type as 'pipe' if you want to get changed emitted value.

```js
let emitter = new Emitter('pipe');
emitter.hook(function () {
 return value * 2;
});

emitter.hook(function (value) {
  return value * 3;
});

let result = emitter.emit(1);
console.log(result);
//output 6
```

you can catch async result from hooks in mode pipe.

```js
let emitter = new Emitter('pipe');
emitter.hook(function () {
 return value * 2;
});

emitter.hook(async function (value) {
  return value * 3;
});

emitter.emit(1).then((result)=>{
    console.log(result);
});
//output 6
