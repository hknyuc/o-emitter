
export class Emitter {
    type;
    _events;
    _async;
    _sync;
    _pipe;
    _strategy;
    _getStrategy;
    _isPromise;
    _anyAsync;
    _pipeAsync;
    _pipeSync;
    /**
     * 
     * @param {string} type is determine strategy of emitter.
     */
    constructor(type: 'async' | 'sync' | 'pipe') {
        this.type = type;
        this._events = [];
        this._async = async (events, args) => {
            let allPromise = [];
            events.forEach(function (event) {
                setTimeout(function () {
                    allPromise.push(event.apply({}, args));
                }, 0);
            });
            return Promise.all(allPromise);
        }

        this._sync = (events, args) => {
            for(let i=0;i<events.length;i++){
                let event = events[i];
                if(event.apply({},args) === false) return false;
            }
            return true;
        }

        this._isPromise = function (promisable){
            return promisable instanceof Promise;
        }

        this._anyAsync = function (funcs:Array<Function>){
            return funcs.some(a=>a.name === "asyncFunc");
        }

        this._pipe = function (events, args) {
            if(this._anyAsync(events)) return this._pipeAsync(events,args);
            return this._pipeSync(events,args);
        }

        this._pipeSync = function (events,args){
            let result = args;
            let firstLoop = false;
            for (let i = 0; i < events.length; i++) {
                firstLoop = i === 0;
                let event = events[i];
                result = event.apply({}, firstLoop?args:[result]);
            }
            return result;
        }

        this._pipeAsync = async function (events,args){
            let result = args;
            let firstLoop = false;
            for (let i = 0; i < events.length; i++) {
                firstLoop = i === 0;
                let event = events[i];
                let newResult = event.apply({}, firstLoop?args:[result]);
                newResult = this._isPromise(newResult)? newResult : Promise.resolve(newResult);
                result = await newResult;
            }
            return result;
        }

        this._getStrategy = function (type) {
            if (type === 'sync') return this._sync;
            if (type === 'async') return this._async;
            return this._pipe;
        }

        this._strategy = this._getStrategy(type);
    }
    /**
     * hooks to actions
     * @param {Function} callbackFn 
     */
    hook(callbackFn) {
        if (typeof callbackFn !== "function") throw new Error('callbackFn is not function');
        this._events.push(callbackFn);
    }

    /**
     * Creates new emitter builder for observing.
     * @param {Object} obj object to be watched
     */
    for(obj) {
        return new EmitterObjectBuilder(obj, this);
    }

    /**
     * emits to all observers . if strategy is sync, result can break value. if returns false it must be break
     * @returns {Boolean | Promise<any>}  break value. if true continue otherwise break.
     */
    emit(...params: Array<any>): boolean | Promise<any> {
        return this._strategy(this._events, arguments);
    }
}

export class EmitterObjectBuilder {
    emitter;
    obj;
    /**
     * 
     * @param {Object} obj 
     * @param {Emitter} emitter 
     */
    constructor(obj, emitter) {
        this.obj = obj;
        this.emitter = emitter;
    }

    /**
     * When props change. It emits changed object
     * @param {Array} props properties
     */
    peek(props) {
        if (!Array.isArray(props)) throw new Error('EmitterObjectBuilder in on method : argument is not valid');
        let self = this;
        props.forEach((prop) => {
            Object.defineProperty(this.obj, prop, {
                get: () => {
                    return self.obj[prop];
                },
                set: (newValue) => {
                    self.obj[prop] = newValue;
                    self.emitter.emit(self.obj);
                }
            });
        });
    }
}
