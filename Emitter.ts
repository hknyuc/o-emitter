
export class Emitter {
    type;
    _events;
    _async;
    _sync;
    _pipe;
    _strategy;
    _getStrategy;
    /**
     * 
     * @param {string} type is determine strategy of emitter.
     */
    constructor(type: 'async' | 'sync' | 'pipe') {
        this.type = type;
        this._events = [];
        this._async = (events, args) => {
            events.forEach(function (event) {
                setTimeout(function () {
                    event.apply(window, args);
                }, 0);
            });
            return true;
        }

        this._sync = (events, args) => {
            let result = true;
            events.forEach(function (event) {
                if (event.apply(window, args) === false) {
                    result = false;
                    return false;
                }
                return true;
            });
            return result;
        }

        this._pipe = function (events,args){
           let result = args;
           events.forEach(function (event){
                 result = event.apply(window,args);
           });
           return result;
        }

        this._getStrategy = function (type){
            if(type === 'sync') return this._sync;
            if(type === 'async') return this._async;
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
     * @returns {Boolean}  break value. if true continue otherwise break.
     */
    emit(...params: Array<any>): boolean {
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
