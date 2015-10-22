﻿var cc =  module.exports;
cc.log=console.log
function ClassManager(){
    //tells own name
    return arguments.callee.name || (arguments.callee.toString()).match(/^function ([^(]+)/)[1];
}
ClassManager.id=(0|(Math.random()*998));
ClassManager.instanceId=(0|(Math.random()*998));
ClassManager.compileSuper=function(func, name, id){
    //make the func to a string
    var str = func.toString();
    //find parameters
    var pstart = str.indexOf('(');
    var pend = str.indexOf(')');
    var params = str.substring(pstart+1, pend);
    params = params.trim();

    //find function body
    var bstart = str.indexOf('{');
    var bend = str.lastIndexOf('}');
    var str = str.substring(bstart+1, bend);

    //now we have the content of the function, replace this._super
    //find this._super
    while(str.indexOf('this._super')!= -1)
    {
        var sp = str.indexOf('this._super');
        //find the first '(' from this._super)
        var bp = str.indexOf('(', sp);

        //find if we are passing params to super
        var bbp = str.indexOf(')', bp);
        var superParams = str.substring(bp+1, bbp);
        superParams = superParams.trim();
        var coma = superParams? ',':'';

        //find name of ClassManager
        var Cstr = arguments.callee.ClassManager();

        //replace this._super
        str = str.substring(0, sp)+  Cstr+'['+id+'].'+name+'.call(this'+coma+str.substring(bp+1);
    }
    return Function(params, str);
};
ClassManager.compileSuper.ClassManager = ClassManager;
ClassManager.getNewID=function(){
    return this.id++;
};
ClassManager.getNewInstanceId=function(){
    return this.instanceId++;
};

(function () {
    var initializing = false, fnTest = /\b_super\b/;
    var releaseMode = null;
    if(releaseMode) {
        console.log("release Mode");
    }

    /**
     * The base Class implementation (does nothing)
     * @class
     */
    cc.Class = function () {
    };

    /**
     * Create a new Class that inherits from this Class
     * @param {object} prop
     * @return {function}
     */
    cc.Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        var classId = ClassManager.getNewID();
        ClassManager[classId] = _super;
        // Copy the properties over onto the new prototype. We make function
        // properties non-eumerable as this makes typeof === 'function' check
        // unneccessary in the for...in loop used 1) for generating Class()
        // 2) for cc.clone and perhaps more. It is also required to make
        // these function properties cacheable in Carakan.
        var desc = { writable: true, enumerable: false, configurable: true };
        for (var name in prop) {
            if(releaseMode && typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])) {
                desc.value = ClassManager.compileSuper(prop[name], name, classId);
                Object.defineProperty(prototype, name, desc);
            } else if(typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])){
                desc.value = (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-Class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]);
                Object.defineProperty(prototype, name, desc);
            } else if(typeof prop[name] == "function") {
                desc.value = prop[name];
                Object.defineProperty(prototype, name, desc);
            } else{
                prototype[name] = prop[name];
            }
        }
        prototype.__instanceId = null;

        // The dummy Class constructor
        function Class() {
            this.__instanceId = ClassManager.getNewInstanceId();
            // All construction is actually done in the init method
            if (this.ctor)
                this.ctor.apply(this, arguments);
        }

        Class.id = classId;
        // desc = { writable: true, enumerable: false, configurable: true,
        //          value: XXX }; Again, we make this non-enumerable.
        desc.value = classId;
        Object.defineProperty(prototype, '__pid', desc);

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        desc.value = Class;
        Object.defineProperty(Class.prototype, 'constructor', desc);

        // And make this Class extendable
        Class.extend = arguments.callee;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };

    Function.prototype.bind = Function.prototype.bind || function (bind) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };

})();

//my only
cc.ArrayRemoveObject = function (arr, delObj) {
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] == delObj) {
            arr.splice(i, 1);
            break;
        }
    }
};
cc.log = function (message) {
    if (!cc.IS_SHOW_DEBUG_ON_PAGE) {
        console.log.apply(console, arguments);
    } else {
        cc._logToWebPage(message);
    }
};
cc.NODE_TAG_INVALID = -1;

cc.s_globalOrderOfArrival = 1;

cc.Node = cc.Class.extend(/** @lends cc.Node# */{
    _id:0,
    _zOrder:0,
    // children (lazy allocs),
    _children:null,
    _parent:null,
    _tag:cc.NODE_TAG_INVALID,
    _orderOfArrival:0,
    _initializedNode:false,
    _initNode:function () {
        this._id=ClassManager.getNewID()
        this._children = [];
        this._initializedNode = true;
    },
    ctor:function () {
        if (this._initializedNode === false)
            this._initNode();
        return true;
    },
    init:function () {
        if (this._initializedNode === false)
            this._initNode();
        return true;
    },
    _child:function(func){
        var arr=this._children
        if(arr.length){
            for (var i = 0; i < arr.length; i++) {
                if(false==arr[i]._child(func)){
                    return false
                }
            }
        }

        if(func.apply(this)==false){
            return false
        }
        return true
    },
    _arrayMakeObjectsPerformSelector:function (array, callbackType) {
        if (!array || array.length === 0)
            return;

        var i, len = array.length,node;
        var nodeCallbackType = cc.Node.StateCallbackType;
        switch (callbackType) {
            case nodeCallbackType.onEnter:
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node)
                        node.onEnter();
                }
                break;
            case nodeCallbackType.onExit:
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node)
                        node.onExit();
                }
                break;
            case nodeCallbackType.cleanup:
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node)
                        node.cleanup();
                }
                break;
            case nodeCallbackType.updateTransform:
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node)
                        node.updateTransform();
                }
                break;
            case nodeCallbackType.sortAllChildren:
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node)
                        node.sortAllChildren();
                }
                break;
            default :
                throw "Unknown callback function";
                break;
        }
    },

    getZOrder:function () {
        return this._zOrder;
    },

    _setZOrder:function (z) {
        this._zOrder = z;
    },

    setZOrder:function (z) {
        this._setZOrder(z);
        if (this._parent)
            this._parent.reorderChild(this, z);
    },

    reorderChild:function (child, zOrder) {
        if(!child)
            throw "cc.Node.reorderChild(): child must be non-null";
        child.setOrderOfArrival(cc.s_globalOrderOfArrival++);
        child._setZOrder(zOrder);
        this._reorderChildDirty = true;
    },

    getChildrenCount:function () {
        return this._children.length;
    },

    getChildren:function () {
        return [].concat(this._children);
    },

    isRunning:function () {
        return this._running;
    },

    getParent:function () {
        return this._parent;
    },

    setParent:function (Var) {
        this._parent = Var;
    },

    getTag:function () {
        return this._tag;
    },

    setTag:function (Var) {
        this._tag = Var;
    },

    getChildByTag:function (aTag) {
        var __children = this._children;
        if (__children != null) {
            for (var i = 0; i < __children.length; i++) {
                var node = __children[i];
                if (node && node._tag == aTag)
                    return node;
            }
        }
        //throw "not found";
        return null;
    },

    addChild:function (child, zOrder, tag) {
        if(!child)
            throw "cc.Node.addChild(): child must be non-null";
        if (child === this) {
            cc.log('cc.Node.addChild(): An Node can\'t be added as a child of itself.');
            return;
        }

        if (child._parent !== null) {
            cc.log("cc.Node.addChild(): child already added. It can't be added again");
            return;
        }

        var tmpzOrder = (zOrder != null) ? zOrder : child._zOrder;
        child._tag = (tag != null) ? tag : child._tag;
        this._insertChild(child, tmpzOrder);
        child._parent = this;

        if (this._running) {
            child.onEnter();
        }
    },

    removeFromParent:function (cleanup) {
        if (this._parent) {
            if (cleanup == null)
                cleanup = true;
            this._parent.removeChild(this, cleanup);
        }
    },

    removeChild:function (child, cleanup) {
        // explicit nil handling
        if (this._children.length === 0)
            return;

        if (cleanup == null)
            cleanup = true;
        if (this._children.indexOf(child) > -1)
            this._detachChild(child, cleanup);


    },

    removeChildByTag:function (tag, cleanup) {
        if(tag === cc.NODE_TAG_INVALID)
            cc.log("cc.Node.removeChildByTag(): argument tag is an invalid tag");

        var child = this.getChildByTag(tag);
        if (child == null)
            cc.log("cocos2d: removeChildByTag(tag = " + tag + "): child not found!");
        else
            this.removeChild(child, cleanup);
    },

    removeAllChildren:function (cleanup) {
        // not using detachChild improves speed here
        var __children = this._children;
        if (__children != null) {
            if (cleanup == null)
                cleanup = true;
            for (var i = 0; i < __children.length; i++) {
                var node = __children[i];
                if (node) {
                    // IMPORTANT:
                    //  -1st do onExit
                    //  -2nd cleanup
                    if (this._running) {
                        node.onExit();
                    }
                    if (cleanup)
                        node.cleanup();
                    // set parent nil at the end
                    node.setParent(null);
                }
            }
            this._children.length = 0;
        }
    },

    _detachChild:function (child, doCleanup) {
        // IMPORTANT:
        //  -1st do onExit
        //  -2nd cleanup
        if (this._running) {
            child.onExit();
        }

        // If you don't do cleanup, the child's actions will not get removed and the
        // its scheduledSelectors_ dict will not get released!
        if (doCleanup)
            child.cleanup();

        // set parent nil at the end
        child.setParent(null);

        cc.ArrayRemoveObject(this._children, child);
    },

    _insertChild:function (child, z) {
        this._children.push(child);
        child._setZOrder(z);
        this._reorderChildDirty = true;
    },

    setOrderOfArrival:function (Var) {
        this._orderOfArrival = Var;
    },

    sortAllChildren:function () {
        if (this._reorderChildDirty) {
            var _children = this._children;
            var i, j, length = _children.length,tempChild;

            // insertion sort
            for (i = 0; i < length; i++) {
                var tempItem = _children[i];
                j = i - 1;
                tempChild =  _children[j];

                //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
                while (j >= 0 && ( tempItem._zOrder < tempChild._zOrder ||
                    ( tempItem._zOrder == tempChild._zOrder && tempItem._orderOfArrival < tempChild._orderOfArrival ))) {
                    _children[j + 1] = tempChild;
                    j = j - 1;
                    tempChild =  _children[j];
                }
                _children[j + 1] = tempItem;
            }

            //don't need to check children recursively, that's done in visit of each child
            this._reorderChildDirty = false;
        }
    },

    onEnter:function () {
        this.sortAllChildren()
        this._running = true;//should be running before resumeSchedule
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onEnter);

    },

    onExit:function () {
        this._running = false;
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onExit);

    },
    cleanup:function () {
        // timers
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.cleanup);
    },
    updateTransform:function () {
        // Recursively iterate over children
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.updateTransform);
    },
    _data:null,
    setData:function(data){
        this._data=data;
    },
    getData:function(){
        return this._data;
    }
});

cc.Node.create = function () {
    return new cc.Node();
};

cc.Node.StateCallbackType = {onEnter:1, onExit:2, cleanup:3, updateTransform:5,  sortAllChildren:7};
