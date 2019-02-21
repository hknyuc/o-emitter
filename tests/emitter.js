var assert = require('assert');
var Emitter = require('./../dist/Emitter.js').Emitter;
describe('sync', function () {
    it('true emitting agruments',function (done) {
        let emitter = new Emitter('sync');
        emitter.hook(function (arg, arg2) {
            assert.equal(arg, 'hello');
            assert.equal(arg2, 'from emitter');
            done();
        });

        emitter.emit('hello', 'from emitter');
    });

    it('work more than works', function (done) {
        let emitter = new Emitter('sync');
            let results = [];
            emitter.hook(function (arg, arg2) {
                results.push({ arg, arg2 });
                if(results.length == 2){
                    done();
                }
             
            });

            emitter.hook(function (arg, arg2) {
                results.push({ arg, arg2 });
                if(results.length == 2){
                  done();
                }
            });
            emitter.emit('hello','from emitter');
    });


    it('break works',function (){
            let emitter = new Emitter('sync');
            let results = [];
            emitter.hook(function (){
                results.push('hi');
                return false;
            });
            emitter.hook(function (){
                results.push('hi2'); 
            });

            let result = emitter.emit();
            assert.equal(results[0],'hi');
            assert.notEqual(results.length,2);
            assert.equal(result,false);
    });



});

describe('async',function (){
    it('true emitting agruments', function (done) {
        let emitter = new Emitter('async');
        emitter.hook(function (arg, arg2) {
            assert.equal(arg, 'hello');
            assert.equal(arg2, 'from emitter');
            done();
        });

        emitter.emit('hello', 'from emitter');
    });

    it('work more than works', function (done) {
        let emitter = new Emitter('sync');
        emitter.hook(function (arg, arg2) {
            assert.equal(arg, 'hello');
            assert.equal(arg2, 'from emitter');
            done();
        });

        emitter.emit('hello', 'from emitter');
    });
});


describe('pipe',function (){
    it('true emitting agruments', function (done) {
        let emitter = new Emitter('pipe');
        emitter.hook(function (arg, arg2) {
            assert.equal(arg, 'hello');
            assert.equal(arg2, 'from emitter');
            done();
        });

        emitter.emit('hello', 'from emitter');
    });

    it('work more than works', function (done) {
        let emitter = new Emitter('sync');
        emitter.hook(function (arg, arg2) {
            assert.equal(arg, 'hello');
            assert.equal(arg2, 'from emitter');
            done();
        });

        emitter.emit('hello', 'from emitter');
    });

    it('get result from hooks sync', function (){
       let emitter = new Emitter('pipe');
       emitter.hook(function (value){
            return value * 2;
       });

       emitter.hook(function (value){
            return value * 3;
       });

        let result = emitter.emit(1);
        assert.equal(result,6);
    });

    
    it('get result from hooks async', function (done){
        let emitter = new Emitter('pipe');
        emitter.hook(function (value){
             return value * 2;
        });
 
        emitter.hook(async function (value){
             return value * 3;
        });
 
         emitter.emit(1).then((result)=>{
             assert.equal(result,6);
             done();
         });
     });
});