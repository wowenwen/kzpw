if (window.Cmd == null) {
    /*
    * Cmd
    * @Author:     yulianghuang
    * @CreateDate  2012/11/5
    */
    (function () {
        var _cmd = {};
        //jsonp的时候回调函数用
        _cmd.JsonPData = undefined,
        /*
        * Ajax Mode     internal
        * @param  {string}         url
        * @param  {string}         requestType:post,get...
        * @param  {string|null}    arguments
        * @param  {function|null}  callback function
        */
            _cmd.ajax = function (url, content, callback) {
                var xmlVer = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], xmlObj;
                try {
                    xmlObj = new XMLHttpRequest();
                } catch (e) {
                    for (var i = 0; i < xmlVer.length; i++)
                        try {
                            xmlObj = new ActiveXObject(xmlVer[i]);
                            break;
                        } catch (e) { }
                }
                if (!xmlObj)
                    return;
                xmlObj.open(content ? "POST" : "GET", url || location.href, !!callback);
                //xmlObj.setRequestHeader("Content-Type", "text/javascript");
                xmlObj.setRequestHeader("Content-Type", "application\/x-www-form-urlencoded");
                //xmlObj.setRequestHeader("Content-Type", "application\/x-javascript");
                xmlObj.setRequestHeader("If-Modified-Since", new Date(0));
                function getReturnValue() {
                    return (xmlObj.status == 200 ? (/xml/i.test(xmlObj.getResponseHeader("content-type")) ? xmlObj.responseXML : xmlObj.responseText) : null);
                }
                if (callback)
                    xmlObj.onreadystatechange = function () {
                        if (xmlObj.readyState == 4) {
                            var txt = getReturnValue();
                            if (callback(txt) === true) {
                                setTimeout(function () {
                                    _cmd.ajax(url, content, callback);
                                }, 1000);
                            }
                        }
                    };
                xmlObj.send(content || "");
                return callback ? xmlObj : getReturnValue();
            };
        /*
        * convert string to json
        * @param     {string}      the json string
        * @param     {object}      the json object
        */
        _cmd.fromJson = function (pData) {
            var variable;
            try {
                variable = eval("(" + pData + ")");
            } catch (e) { };
            return variable;
        };
        /*
        * Cookie Mode
        * @Author:     yulianghuang
        * @CreateDate  2012/11/5
        */
        _cmd.Cookie = new function () {
            var _obj = {};
            /*
            * transform the cookie string to the javascript object
            * @return {object} cookie object
            */
            this.GetCookieObj = function () {
                var cookies = document.cookie.split("; "),
                    _temp;
                _obj = {};
                for (var i = cookies.length - 1; i !== -1; i--) {
                    _temp = cookies[i].split("=");
                    if (_temp.length > 1) {
                        var _key = _temp[0];
                        _temp.shift();
                        _obj[_key] = _temp.join("=");
                    }
                }
                return _obj;
            };
            /*
            * get the cookie value by key
            * @param   {string}        key
            * @return  {string|null}   value
            */
            this.GetCookie = function (key) {
                this.GetCookieObj();
                return _obj[key];
            };
            /*
            * set the cookie value (temp use)
            */
            this.SetCookie = function (key, value) {
                document.cookie = key + "=" + value;
            };

        };

        /*
        * add event
        * @param   {dom}      the dom which you bind event to
        * @param   {string}   the tpye name of the function
        * @param   {function} the function
        */
        _cmd.addEvent = function (obj, type, fn) {
            if (obj.addEventListener) obj.addEventListener(type, fn, false);
            else if (obj.attachEvent) {
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () { obj["e" + type + fn](window.event); }
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        };
        /*
        * remove event
        * @param   {dom}      the dom which you bind event to
        * @param   {string}   the tpye name of the function
        * @param   {function} the function
        */
        _cmd.removeEvent = function (obj, type, fn) {
            if (obj.removeEventListener) obj.removeEventListener(type, fn, false);
            else if (obj.detachEvent) {
                obj.detachEvent("on" + type, obj[type + fn]);
                obj[type + fn] = null;
                obj["e" + type + fn] = null;
            }
        }

        /*
        * Cookie Mode
        * @Author:     yulianghuang
        * @CreateDate  2012/12/19
        * @param      {string}             the link address of the iframe
        * @param      {function|null}      the callBack function
        * @param      {function|null}      this function will be executed before the iframe starts to load
        * @param      {string|null}        the charset of the iframe
        * @param      {dom|null}           the node which the iframe will be appended to,null refers to body
        */
        _cmd.addIFrame = function (pSrc, pCallBack, pSetIframe, pCharset, pParentNode) {
            var _iframe = document.createElement("IFRAME"),
                _parent = pParentNode || document.getElementsByTagName("BODY")[0];
            _iframe.src = pSrc;
            _iframe.charset = pCharset || "UTF-8";
            typeof pSetIframe === "function" && pSetIframe(_iframe);
            _cmd.addEvent(_iframe, "load", function () {
                typeof pCallBack === "function" && pCallBack(_iframe);
            });
            _parent.appendChild(_iframe);
        };


        /*
        * the script load mode
        * @Author:     yulianghuang
        * @CreateDate  2012/11/5
        */
        _cmd.Load = new function () {
            //variable
            var _jCookie = _cmd.Cookie.GetCookie("privateJs") || "",
            //cookieValue
                _jCookieArray = _jCookie.split(","),
            //is debug
                _isDebug = _jCookieArray.length > 1,

            //addList use
                _toDo = 0;
            this.ReleaseNo = undefined;
            this.MergeUrl = undefined;
            //write
            this.IsCreateMerge = false;
            //read

            this.IsLoadMerge = false;
            //method
            var addItem = function (pObj, pIndex) {
                var me = this,
                        _self = arguments.callee;
                if (pIndex < pObj.length) {
                    var _obj = pObj[pIndex];
                    if (Object.prototype.toString.call(_obj) === '[object Array]') {
                        var l = _toDo = _obj.length;
                        for (var i = 0; i < l; i++) {
                            me.addJs.call(me, _obj[i], function (pObj, pIndex) {
                                _toDo--;
                                if (_toDo === 0) {
                                    _self.call(me, pObj, pIndex + 1);
                                }
                            }, pObj, pIndex);
                        }
                    } else if (typeof _obj === "string") {
                        me.addJs.call(me, _obj, function () {
                            _self.call(me, pObj, pIndex + 1);
                        });
                    } else {
                        _self.call(me, pObj, pIndex + 1);
                    }
                }
            },
                createMerge = function (pSrcList) {
                    var _arr = [];
                    for (var i = 0; i < pSrcList.length; i++) {
                        _arr = _arr.concat(pSrcList[i]);
                    }
                    var _source = _arr.join(","),
                        _ajaxUrl = "http://localhost/webresource/MergeHandler.ashx",
                        _ajaxParam = ["newFile=", this.MergeUrl, "&source=", _source].join("");
                    Cmd.ajax(_ajaxUrl, _ajaxParam, function (data) {

                    });
                },
                config = function () {
                    var _temp = _cmd.Cookie.GetCookie("MergeUrl");
                    if (_temp) {
                        this.MergeUrl = _temp;
                        this.IsLoadMerge = true;
                    }
                };
            //window.CMD.Load.addList(["/r1.js","/r2.js","/ir3.js"],"/ir3.js","/ir3.js");
            this.addList = function () {
                var me = this;
                if (this.IsLoadMerge && this.MergeUrl !== undefined) {
                    this.addJs.call(me, this.MergeUrl);
                } else {
                    var _srcs = Array.prototype.slice.call(arguments);
                    addItem.call(this, _srcs, 0);
                    if (this.MergeUrl !== undefined && this.IsCreateMerge) {
                        createMerge.call(me, _srcs);
                    }
                }
            };

            /*
            * get javascripts from a merge page     window.CMD.Load.mergeJs("/r1.js,/r2.js,r3.js","merge.js?src=");
            * @param  {string}         srcs
            * @param  {string}         mergePage
            * @param  {function|null}  callback function,arguments followed
            */
            this.mergeJs = function (pSrcs, pMergeUrl, callBack) {
                var _arguments = Array.prototype.slice.call(arguments, 3),
                    me = this;
                this.addJs.call(me, pMergeUrl + pSrcs, callBack, _arguments)
            };

            /*
            * add one javascript
            * @param    {string}      src
            * @param    {object|null} callback function,arguments followed
            * @param    {boolen}      not use releaseNo
            */
            this.addJs = function (osrc, callBack, isJsonP, pCharset) {
                var js = document.createElement("script"),
                    _arguments = Array.prototype.slice.call(arguments, 2);
                if (_isDebug) {
                    osrc.replace(_jCookieArray[0], _jCookieArray[1]);
                }
                js.charset = pCharset || "UTF-8";
                js.src = (this.ReleaseNo === undefined || isJsonP) ? osrc : osrc + "?releaseno=" + this.ReleaseNo;
                js.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(js);
                js.onload = js.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                        if (callBack != null) {
                            callBack.apply(this, _arguments)
                        }
                        js.onload = js.onreadystatechange = null;
                    }
                };
            };
            config();
        };

        window.Cmd = _cmd;
    })();
    /*
    * Core Simple
    * @Author:     yulianghuang
    * @CreateDate  2012/11/5
    */
    (function () {
        /*
        * Repair the setInterval and the setTimeout Bug in IE
        * @Author:     yulianghuang
        * @CreateDate  2012/10/18
        */
        /*
        (function (f) {
        window.setTimeout = f(window.setTimeout);
        window.setInterval = f(window.setInterval);
        })(function (f) {
        return function (c, t) {
        var a = [].slice.call(arguments, 2);
        return f(function () {
        c.apply(this, a)
        }, t)
        }
        });
        */

        /*
        * @namespace   Core
        * @Author:     yulianghuang
        * @CreateDate  2012/10/18
        */
        var _core = {
            /*
            * Is pObj Array?
            * @param   {object|number|string|array|boolen...}
            * @return  {boolean}
            */
            isArray: function (pObj) {
                return Object.prototype.toString.call(pObj) === '[object Array]';
            },
            newDate: function (pStr) {
                var _arr = pStr.split("-");
                return new Date(+_arr[0], +_arr[1] - 1, +_arr[2]);
            },
            /*
            * deep clone the obj
            * @para   {object} source object
            * @return {object} the new obect
            */
            clone: function (pObj) {
                var o;
                if (typeof pObj === "object") {
                    if (pObj === null) {
                        o = null;
                    } else {
                        if (_core.isArray(pObj)) {
                            o = [];
                            for (var i = 0, len = pObj.length; i < len; i++) {
                                o.push(arguments.callee(pObj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in pObj) {
                                o[j] = arguments.callee(pObj[j]);
                            }
                        }
                    }
                } else {
                    o = pObj;
                }
                return o;
            },
            addJs: function (osrc, callBack, arguments) {
                var js = document.createElement("script");
                js.src = osrc;
                js.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(js);
                js.onload = js.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                        if (callBack != null) {
                            callBack.apply(this, arguments)
                        }
                        js.onload = js.onreadystatechange = null;
                    }
                };
            },
            /*
            * replace the pSouce's propreties with pAddition's propreties,deep clone when pIsDeep is true;
            * @param {object}  the source object
            * @param {object}  the addition
            * @param {boolean} if use the deep clone
            */
            extend: function (pSource, pAddition, pIsDeep) {
                if (pIsDeep) {
                    for (var p in pAddition) {
                        pSource[p] = _core.clone(pAddition[p]);
                    }
                } else {
                    for (var p in pAddition) {
                        pSource[p] = pAddition[p];
                    }
                }
            },
            /*
            * don't use this to get a new guid
            */
            _guid: 1,
            /*
            * get GUID
            * @return {number}
            */
            getGuid: function () {
                return this._guid++;
            },
            /*
            * bind dom event
            */
            bind: function (pElement, pType, pHandler) {
                var me = this;
                //Set the guid of pHandler
                if (!pHandler.$$guid) pHandler.$$guid = me.getGuid();

                //Append Events to pHandler
                if (!pElement.events) pElement.events = {};

                //Get the handler of current event
                var _handlers = pElement.events[pType];

                //If Empty,new handlers and save the preview handler
                if (!_handlers) {

                    _handlers = pElement.events[pType] = {};

                    //Save the preview handler
                    if (pElement["on" + pType]) {
                        _handlers[0] = pElement["on" + pType];
                    }
                }
                //Record the function
                _handlers[pHandler.$$guid] = pHandler;
                //Proxy excute
                pElement["on" + pType] = me.handleEvent;
            },
            /*
            * unbind dom event
            * @param {dom}
            * @param {string}
            * @param {function}
            */
            unbind: function (pElement, pType, pHandler) {
                if (pElement.events && pElement.events[pType]) {
                    delete pElement.events[pType][pHandler.$$guid];
                }
            },
            unbindAll: function (pElement) {
                if (pElement.events) {
                    for (var _tpye in pElement.events) {
                        pElement.events[_tpye] = {};
                    }
                }
            },
            /*
            * handle the event
            * @param {dom}
            * @param {string}
            * @param {function}
            */
            handleEvent: function (event) {
                var returnValue = true;
                //fix event
                event = event || _core.fixEvent(window.event);
                //_core.fixEventAddition(event);
                var _handlers = this.events[event.type];
                for (var i in _handlers) {
                    this.$$handleEvent = _handlers[i];
                    if (this.$$handleEvent(event) === false) {
                        returnValue = false;
                    }
                }
                return returnValue;
            },
            fixEventAddition: function (event) {
                var type = event.type.toLowerCase();
                switch (type) {
                    case "mouseover":
                        event.fromElement = event.fromElement || event.srcElement || event.relatedTarget;
                        break;
                    case "mouseout":
                        event.toElement = event.toElement || event.srcElement || event.relatedTarget;
                        break;
                }
            },
            getFromElement: function (event) {
                var node;
                if (event.type == "mouseover") node = event.relatedTarget || event.fromElement;
                else if (event.type == "mouseout") node = event.target;
                if (!node) return;
                while (node.nodeType != 1)
                    node = node.parentNode;
                return node;
            },
            getToElement: function (event) {
                var node;
                if (event.type == "mouseout") node = event.relatedTarget || event.toElement;
                else if (event.type == "mouseover") node = event.target;
                if (!node) return;
                while (node.nodeType != 1)
                    node = node.parentNode;
                return node;
            },
            /*
            * fix mouseover mouseout
            */
            fixMouseEvent: function (event, target) {
                var related,
                    type = event.type.toLowerCase(); //这里获取事件名字
                if (type === 'mouseover') {
                    related = event.relatedTarget || event.fromElement;
                } else if (type === 'mouseout') {
                    related = event.relatedTarget || event.toElement;
                } else return true;
                return related && related.prefix != 'xul' && !Core.contains(target, related) && related !== target;
            },
            /*
            * fix event
            */
            fixEvent: function (event) {
                event.target = event.srcElement;
                event.preventDefault = this.fixEvent.preventDefault;
                event.stopPropagation = this.fixEvent.stopPropagation;
                return event;
            },
            max: function (pArray) {
                var _maxNo = -Infinity;
                for (var i = pArray.length - 1; i !== -1; i--) {
                    if (pArray[i] != null && _maxNo < pArray[i]) {
                        _maxNo = pArray[i];
                    }
                }
                return _maxNo;
            },
            contains: function (root, el) {
                if (root.compareDocumentPosition)
                    return root === el || !!(root.compareDocumentPosition(el) & 16);
                if (root.contains && el.nodeType === 1) {
                    return root.contains(el) && root !== el;
                }
                while ((el = el.parentNode))
                    if (el === root) return true;
                return false;
            },
            random: function (pStart, pEnd) {
                return Math.random() * (pEnd - pStart + 1) >> 0 + pStart;
            },
            Cache: {}
        };

        _core.fixEvent.preventDefault = function () {
            this.returnValue = false;
        };
        _core.fixEvent.stopPropagation = function () {
            this.cancelBubble = true;
        };

        /*
        * test browser
        * @namespace   Browser
        * @Author:     yulianghuang
        * @CreateDate  2012/10/18
        */
        _core.Browser = new function () {
            //Regular
            var _regConfig = {
                Chrome: {
                    Reg: /.*(chrome)\/([\w.]+).*/,
                    Core: "Webkit"
                },
                Firefox: {
                    Reg: /.*(firefox)\/([\w.]+).*/,
                    Core: "Moz"
                },
                Opera: {
                    Reg: /(opera).+version\/([\w.]+)/,
                    Core: "O"
                },
                Safari: {
                    Reg: /.*version\/([\w.]+).*(safari).*/,
                    Core: "Webkit"
                },
                Ie: {
                    Reg: /.*(msie) ([\w.]+).*/,
                    Core: "Ms"
                }
            },
                _userAgent = navigator.userAgent.toLowerCase();
            /*
            * Get the detail information of browser
            * @return {object}
            */
            this.getDetail = function () {
                for (var _o in _regConfig) {
                    var _result = _regConfig[_o].Reg.exec(_userAgent);
                    if (_result != null) {
                        return { Browser: _result[1] || "", Version: _result[2] || "0", Core: _regConfig[_o].Core };
                    }
                }
                return { Browser: "UNKNOWN", Version: "UNKNOWN", Core: "UNKNOWN" };
            };

            this.isChrome = function () {
                return _regConfig.Chrome.Reg.test(_userAgent);
            };
            this.isFirefox = function () {
                return _regConfig.Firefox.Reg.test(_userAgent);
            };
            this.isOpera = function () {
                return _regConfig.Opera.Reg.test(_userAgent);
            };
            this.isSafari = function () {
                return _regConfig.Safari.Reg.test(_userAgent);
            };
            this.isIe = function () {
                return _regConfig.Ie.Reg.test(_userAgent);
            };
        };
        _core.Storage = new function () {
            var _canuse = !!window.sessionStorage,
                hasData = function (pData) {
                    return pData && pData !== "" && pData !== "null"
                },
            /*
            * get data from ajax
            */
                ajaxData = function (pKey, pUrl, pArg, pCallBack, pIsLoacl, pCharset) {
                    var me = this;
                    Cmd.ajax(pUrl, pArg, function (data) {
                        dealData.call(me, data, pKey, pCallBack, pIsLoacl);
                    });
                },
            /*
            * get .js document which isnot UTF-8 encoding,the return data should be place into _core.cache[key]
            */
                jsonPData = function (pKey, pUrl, pArg, pCallBack, pIsLoacl, pCharset) {
                    var me = this,
                        _url = (pArg != null && pArg != "") ? pUrl + "?" + pArg : pUrl;
                    Cmd.Load.addJs(_url, function () {
                        var data = Cmd.JsonPData;
                        dealData.call(me, data, pKey, pCallBack, pIsLoacl);
                    }, true, pCharset);
                },
                sessionData = function (pKey, pUrl, pArg, pCallBack, pFunc, pCharset) {
                    var data = sessionStorage.getItem(pKey);
                    if (hasData(data)) {
                        dealData(data, pKey, pCallBack, false);
                    } else {
                        pFunc(pKey, pUrl, pArg, pCallBack, false, pCharset);
                    }
                },
                localData = function (pKey, pUrl, pArg, pCallBack, pFunc, pCharset) {
                    var data = localStorage.getItem(pKey);
                    if (hasData(data)) {
                        dealData(data, pKey, pCallBack, true);
                    } else {
                        pFunc(pKey, pUrl, pArg, pCallBack, true, pCharset);
                    }
                },
                dealData = function (data, pKey, pCallBack, pIsLoacl) {
                    _canuse && pIsLoacl && localStorage.setItem(pKey, data);
                    _canuse && !pIsLoacl && sessionStorage.setItem(pKey, data);
                    pCallBack(data);
                };
            /*
            *  get session storge,if not exist ,get data from the server
            *  @param  {string}            the hash key name of the data
            *  @param  {string}            the url where to get data from
            *  @param  {string}            the arguments used in the request
            *  @param  {function|null}     the callback function
            *  @param  {boolen|null}       if use jsonp
            */
            this.getSession = function (pKey, pUrl, pArg, pCallBack, pIsJsonP, pCharset) {
                var _funcPoint = pIsJsonP ? jsonPData : ajaxData;
                if (_canuse) {
                    sessionData(pKey, pUrl, pArg, pCallBack, _funcPoint, pCharset);
                } else {
                    _funcPoint(pKey, pUrl, pArg, pCallBack, false, pCharset);
                }
            };
            /*
            *  get local storge,if not exist ,get data from the server
            *  @param  {string}            the hash key name of the data
            *  @param  {string}            the url where to get data from
            *  @param  {string}            the arguments used in the request
            *  @param  {function|null}     the callback function
            *  @param  {boolen|null}       if use jsonp
            */
            this.getLocal = function (pKey, pUrl, pArg, pCallBack, pIsJsonP, pCharset) {
                var _funcPoint = pIsJsonP ? jsonPData : ajaxData;
                if (_canuse) {
                    localData(pKey, pUrl, pArg, pCallBack, _funcPoint, pCharset);
                } else {
                    _funcPoint(pKey, pUrl, pArg, pCallBack, true, pCharset);
                }
            };
        };

        //Set the global object
        window.Core = _core;
    })();
    /*
    * UI Simple
    * @Author:     yulianghuang
    * @CreateDate  2012/11/5
    */
    (function () {
        var _ui = {};
        /*
        * Template Replace MethodCore
        * @Author:     fan_li
        * @CreateDate  2012/10/19
        */
        _ui.TReplace = {
            cache: {},
            box: document.createElement("div"),
            documentFragment: document.createDocumentFragment(),
            error: function (message) {
                throw new Error("TRplace Error:" + message + ";");
            },
            parse: function (template) {
                if (!this.cache[template]) {
                    var __list__ = [];
                    try {
                        this.cache[template] = eval("(function(){return function(GlobalData){var __result__ = [];" + ("$>" + template + "<$").replace(/<\$= ([\s\S]*?) \$>/g, function (a, b) {
                            return "<$ __result__.push(" + b + "); $>";
                        }).replace(/\$>([\s\S]*?)<\$/g, function (a, b) {
                            if (/^\s*$/.test(b))
                                return "";
                            else
                                return "__result__.push(__list__[" + (__list__.push(b) - 1) + "]);";
                        }) + "return __result__.join('');}})()");
                    } catch (e) {
                        this.error("template error");
                    }
                }
                return this.cache[template];
            },
            replace: function (template, data) {
                var t = this.parse(template);
                if (t) {
                    try {
                        return t(data);
                    } catch (e) {
                        this.error("data error");
                        return "";
                    }
                } else {
                    return "";
                }
            },
            getElement: function (template, data) {
                var htmlStr = this.replace(template, data),
                    elements = [];
                if (!this.documentFragment || this.documentFragment.childNodes.length)
                    this.documentFragment = document.createDocumentFragment();
                if (htmlStr) {
                    this.box.innerHTML = htmlStr;
                    var _elements = this.box.childNodes;
                    for (var i = 0, l = _elements.length; i < l; i++) {
                        elements[i] = _elements[0];
                        this.documentFragment.appendChild(_elements[0]);
                    }
                    _elements = null;
                }
                elements.node = this.documentFragment;
                //add return string
                elements.htmlStr = htmlStr;
                return elements;
            }
        };

        /*
        * Scroll Repair
        * @Author:     yulianghuang
        * @CreateDate  2012/10/22
        */
        _ui.Dom = {
            /*
            * Get or set the scrollHeight
            * @param  {number}
            * @return {number}
            */
            scrollHeight: function (pHeight) {
                if (typeof (pHeight) === "number") {
                    document.documentElement.scrollHeight = document.body.scrollHeight = pHeight;
                } else {
                    return document.documentElement.scrollHeight || document.body.scrollHeight || 0;
                }
            },
            scrollWidth: function (pVal) {
                if (typeof (pVal) === "number") {
                    document.documentElement.scrollWidth = document.body.scrollWidth = pVal;
                } else {
                    return document.documentElement.scrollWidth || document.body.scrollWidth || 0;
                }
            },
            /*
            * Get or set the scrollTop
            * @param  {number}
            * @return {number}
            */
            scrollTop: function (pTop) {
                if (typeof (pTop) === "number") {
                    window.pageYOffset = document.body.scrollTop = document.documentElement.scrollTop = pTop;
                }
                else {
                    return Core.max([document.documentElement.scrollTop, document.body.scrollTop, window.pageYOffset, 0]); //because of ie9!
                    //return document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0;
                }
            },
            scrollLeft: function (pVal) {
                if (typeof (pVal) === "number") {
                    window.pageXOffset = document.body.scrollLeft = document.documentElement.scrollLeft = pVal;
                }
                else {
                    return Core.max([document.documentElement.scrollLeft, document.body.scrollLeft, window.pageXOffset, 0]); //because of ie9!
                    //return document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0;
                }
            },
            /*
            * Get or set the clientHeight
            * @param  {number}
            * @return {number}
            */
            clientHeight: function (pHeight) {
                if (typeof (pHeight) === "number") {
                    document.documentElement.clientHeight = document.body.clientHeight = pHeight;
                } else {
                    return document.documentElement.clientHeight || document.body.clientHeight || 0;
                }
            },
            clientWidth: function (pVal) {
                if (typeof (pVal) === "number") {
                    document.documentElement.clientWidth = document.body.clientWidth = pVal;
                } else {
                    return document.documentElement.clientWidth || document.body.clientWidth || 0;
                }
            },
            /*
            * To ensure if the element has the scroll bar    Be Careful with IE
            * @param  {object|undefined} the element need to be tested,empty is the window
            * @return {object}           x,y
            */
            hasScroll: function (el) {
                var elems = el ? [el] : [document.documentElement, document.body],
                    scrollX = false, scrollY = false;
                for (var i = 0; i < elems.length; i++) {
                    var o = elems[i];
                    // test horizontal

                    //Don't use it in the event onscoll.
                    var sl = o.scrollLeft;
                    o.scrollLeft += (sl > 0) ? -1 : 1;
                    o.scrollLeft !== sl && (scrollX = scrollX || true);
                    o.scrollLeft = sl;

                    // test vertical
                    var st = o.scrollTop;
                    o.scrollTop += (st > 0) ? -1 : 1;
                    o.scrollTop !== st && (scrollY = scrollY || true);
                    o.scrollTop = st;

                }
                // ret
                return {
                    scrollX: scrollX || _ui.Dom.clientWidth() < _ui.Dom.scrollWidth(),
                    scrollY: scrollY || _ui.Dom.clientHeight() < _ui.Dom.scrollHeight()
                };
            },
            mousePosition: function (event) {
                if (event.pageX) {
                    return {
                        x: event.pageX,
                        y: event.pageY
                    }
                } else {
                    return {
                        x: event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
                        y: event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
                    }
                }
            },
            /*
            * set the opacity
            */
            setOpacity: function (pDom, pOpacity) {
                if (pDom.filters) {
                    arguments.callee = function (pDom, pOpacity) {
                        pDom.style.filter = "alpha(opacity=" + pOpacity + ")";
                        //pDom.filters.alpha.opacity=pOpacity;
                    }
                } else {
                    arguments.callee = function (pDom, pOpacity) {
                        pDom.style.opacity = pOpacity / 100;
                    }
                }
                arguments.callee(pDom, pOpacity);
            },
            /*
            * get the absolute position
            */
            position: function (pObj) {
                var _left = pObj.offsetLeft || 0,
                    _top = pObj.offsetTop || 0;
                while (pObj = pObj.offsetParent) {
                    _left += eval(pObj.offsetLeft);
                    _top += pObj.offsetTop;
                }
                return { x: _left, y: _top };
            },
            /*
            * select only element (FF!)
            */
            childElement: function (pDom) {
                var _array = [], _temp = pDom.childNodes;
                for (var i = _temp.length - 1; i !== -1; i--) {
                    if (_temp[i].nodeType === 1) {
                        _array.unshift(_temp[i]);
                    }
                }
                delete _temp;
                return _array;
            },
            /*
            * get the window of the iframe
            */
            iframeWindow: function (pDom) {
                return pDom.contentWindow;
            },
            /*
            * get ehe document of the iframe,care the domain
            */
            iframeDocument: function (pDom) {
                try {
                    return pDom.contentDocument || pDom.contentWindow.document || null;
                }
                catch (e) {
                    return null;
                }
            },
            /*
            * imitate form sumbit
            */
            sumbitForm: function (pParam, pAction, pMethod, isNew) {
                var _form = this.createFrom(pParam, pAction, pMethod, isNew);
                _form.submit();
                delete _form;
            },
            sumbitFormByForm: function (pParam, pAction, pMethod) {
                var _iframe = document.getElementById("CoreIFrame"),
                    _form = this.createFrom(pParam, pAction, pMethod);
                if (!_iframe) {
                    _iframe = document.createElement("IFRAME");
                    _iframe.style.display = "none";
                    document.getElementsByTagName("BODY")[0].appendChild(_iframe);
                }
                var _frameDoc = UI.Dom.iframeDocument(_iframe).getElementsByTagName("BODY"),
                    _body = _frameDoc.length > 0 ? _frameDoc[0] : UI.Dom.iframeDocument(_iframe);
                _body.appendChild(_form);
                _form.submit();
            },
            createFrom: function (pParam, pAction, pMethod, isNew) {
                var _form = document.createElement("FORM"),
                    _inner = [],
                    _guid = Core.getGuid();
                isNew && (_form.target = "_blank");
                _form.method = pMethod || "get";
                for (var name in pParam) {
                    _inner.push(['<input type="hidden" name="', name, '" id="', name, '" value="', pParam[name], '" />'].join(""));
                }
                _inner.push(['<input type="submit" name="submitBtn', _guid, '" id="submitBtn', _guid, '" value="" />'].join(""));
                _form.action = pAction;
                _form.innerHTML = _inner.join("");
                document.body.appendChild(_form);
                return _form;
            },
            addClass: function (pDom, pClassName) {
                var _reg = new RegExp('(\\s|\\t|\\n|\\r|^)' + pClassName + '(?=\\s|\\t|\\n|\\r|$)');
                if (!_reg.test(pDom.className)) pDom.className += " " + pClassName;
            },
            removeClass: function (pDom, pClassName) {
                var _reg = new RegExp('(\\s|\\t|\\n|\\r|^)' + pClassName + '(?=\\s|\\t|\\n|\\r|$)');
                pDom.className = pDom.className.replace(_reg, "");
            },
            getParentNode: function (pDom, pDelegate) {
                var _node = pDom;
                if (_node != null) {
                    while (_node.parentNode != null) {
                        _node = _node.parentNode;
                        if (pDelegate(_node)) return _node;
                    }
                }
                return _node;
            },
            hasParent: function (pSon, pDoms) {
                var _node = pSon,
                    _val = false;
                if (_node != null) {
                    while (_node.parentNode != null) {
                        _node = _node.parentNode;
                        for (var i = 0, l = pDoms.length; i < l; i++) {
                            if (pDoms[i] == _node) return true;
                        }
                    }
                }
                return _val;
            }
        };
        window.UI = _ui;
    })();
}

if (window.VacationConfig == null) {
    (function () {
        $.mod.load('address', '1.0');
        $.mod.load('validate', '1.1');
        //<input type="hidden" id="solution" value="PRO|GB"/>
        var _arr = document.getElementById("solution").value.split('|'),
            _host1 = (_arr[1] === "BIG5" || _arr[1] === "HK") ? "http://vacations.big5." : "http://vacations.",
            _host2;
        switch (_arr[0]) {
            case "PRO": _host2 = "ctrip.com"; break;
            case "UAT": _host2 = "UAT.sh.ctriptravel.com"; break;
            case "TEST": _host2 = "test.sh.ctriptravel.com"; break;
        }
        var host = _host1 + _host2;
        window.VacationConfig = {
            VacationSearchUrl: (host + "/booking/IndexSearch.ashx"),
            AddressDataUrl: (host + "/booking/PageTools/HomeStatic/DestSelector2013.ashx"),
            AddressVersion: "1.0",
            ValidateVersion: "1.1",
            StartCity: 2
        }
    })();
}

(function () {
    var VacationSearch = function () {
        var _hiddenVal = document.getElementById("solution").value.split('|')[1],
            _encode = (_hiddenVal === "BIG5" || _hiddenVal === "HK") ? "big5" : "gb2312",
            _startCity = VacationConfig.StartCity || 2,
            _txtTicketDestCity = document.getElementById("txtTicketDestCity"),
            _iptTicketSearchBtn = document.getElementById("iptTicketSearchBtn"),
        //_refVacation,
            _refTicket,
        /*
        * 地址选择器
        */
            SearchAddress = function (pCQueryDom, pName, pDataSource, pAfterSelect,pEnterFunc) {
                var _dom = pCQueryDom,
                    _name = pName,
                    _afterSelect = pAfterSelect || null,
                    _suggestion = '',
                    _dataSource = pDataSource,
                    _ref,
                    init = function () {
                        var me = this;
                        initData.call(me, _dataSource);
                    },
                    initData = function (pData) {
                        _ref = _dom.regMod('address', VacationConfig.AddressVersion, {
                            name: _name,
                            source: {
                                suggestion: _suggestion,
                                alias: ['pinyin', 'cityName', 'cityId'],
                                data: pData
                            },
                            //minLength:2,
                            needReadOnly: false,
                            isFocusNext: !!pEnterFunc,
                            isFilterSelect:!pEnterFunc,
                            isAutoCorrect: (_dom.attr("data-correct") != null)
                            //template:{filter:_templateFilter}
                        });

                        _ref.method('bind','change',function(){
                            _dom[0].setAttribute("data-val",arguments[1].data);
                            _afterSelect && _afterSelect();
                            _dom[0].blur();
                            pEnterFunc  &&  pEnterFunc();
                        });

                        if(!/ipad/.test(navigator.userAgent.toLowerCase()) && !!pEnterFunc){
                            _ref.method('bind','enter',function(){;
                                setTimeout(function(){
                                    _dom[0].blur();
                                    pEnterFunc();
                                },0);
                            });
                        }
                    };
                this.changeSource = function (pSource) {
                    _ref.set("source", { data: pSource });
                };
                init();
            },
            defaultTip = function (pDom) {
                var _defaultTip = pDom.getAttribute("data-default");
                if (pDom.value == _defaultTip) {
                    //pDom.value=_defaultTip;//input_default
                    UI.Dom.addClass(pDom, "inputSel");
                } else {
                    UI.Dom.removeClass(pDom, "inputSel");
                }
                Core.bind(pDom, "focus", function () {
                    UI.Dom.removeClass(pDom, "inputSel");
                    if (pDom.value === _defaultTip) {
                        pDom.value = "";
                    }
                });
                Core.bind(pDom, "blur", function () {
                    if (pDom.value.replace(/\s|\t|\n|\r/g, "") === "") {
                        UI.Dom.addClass(pDom, "inputSel");
                        pDom.value = _defaultTip;
                    }
                });
            },
            vacationSearch = function (pDom, pAppendParam) {
                var _dataVal = pDom.getAttribute("data-val"),
                    _param = {
                        StartCity: _startCity,
                        SearchText: pDom.value,
                        SearchType: "U",
                        SearchValue: pDom.value,
                        SearchID: 0,
                        SearchFrom: 'http://vacations.ctrip.com/tickets'
                    };
                if (_dataVal != null) {
                    var _arr = _dataVal.split("|");
                    if (_arr.length > 2) {
                        var _args = _arr[2].split("$");
                        if (_args.length > 2 && _arr[1] === pDom.value) {
                            _param.SearchID = _args[2];
                            _param.SearchType = _args[1];
                            _param.SearchValue = _args[0];
                        }
                    }
                }
                if (pAppendParam) {
                    for (var name in pAppendParam) {
                        _param[name] = pAppendParam[name];
                    }
                }
                UI.Dom.sumbitForm(_param, window.VacationConfig.VacationSearchUrl, "post");
            },
            initSearch = function () {
                var me = this;
                defaultTip(_txtTicketDestCity);
                Core.Storage.getSession("VacationAddressData" + _startCity, VacationConfig.AddressDataUrl, "startCity=" + _startCity, function (data) {
                    _refTicket= new SearchAddress($(_txtTicketDestCity),"TicketSearch",data,null,function(){
                        var _val = _txtTicketDestCity.value.replace(/\s|\t|\n|\r/g, "");
                        if (_val !== "" && _val !== _txtTicketDestCity.getAttribute("data-default")) {
                            vacationSearch.call(me, _txtTicketDestCity);
                            ins.method("hide");
                        } else {
                            ins.method("show", {
                                $obj: $(_txtTicketDestCity),
                                data: "请输入内容！",
                                removeErrorClass: true,
                                hideEvent: "blur",
                                isFocus: true,
                                isScroll: false
                            });
                        }
                    });
                }, true, _encode);
                var ins = $("#ticketTab").regMod('validate', "1.1");
                Core.bind(_iptTicketSearchBtn, "click", function () {
                    var _val = _txtTicketDestCity.value.replace(/\s|\t|\n|\r/g, "");
                    if (_val !== "" && _val !== _txtTicketDestCity.getAttribute("data-default")) {
                        vacationSearch.call(me, _txtTicketDestCity);
                        ins.method("hide");
                    } else {
                        ins.method("show", {
                            $obj: $(_txtTicketDestCity),
                            data: "请输入内容！",
                            removeErrorClass: true,
                            hideEvent: "blur",
                            isFocus: true,
                            isScroll: false
                        });
                    }
                });

            },
            init = function () {
                var me = this;
                initSearch.call(me);
                if (_encode === "big5") {
                    var _a = $("#ticketTab a");
                    for (var i = 0, l = _a.length; i < l; i++) {
                        _a[i].href = _a[i].href.replace("http://vacations.ctrip.com", "http://vacations.big5.ctrip.com");
                    }
                }
            };
        init();
    };
    $.ready(function () {
        new VacationSearch();
    });
})();/*****env:4,update:2013-9-3 14:06:02*****/