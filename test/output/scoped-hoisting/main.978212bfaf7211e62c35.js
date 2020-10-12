/** ****/ (function (modules) {
  // webpackBootstrap
  /** ****/ // The module cache
  /** ****/ const installedModules = {}; // The require function
  /** ****/
  /** ****/ /** ****/ function __webpack_require__(moduleId) {
    /** ****/
    /** ****/ // Check if module is in cache
    /** ****/ if (installedModules[moduleId]) {
      /** ****/ return installedModules[moduleId].exports;
      /** ****/
    } // Create a new module (and put it into the cache)
    /** ****/ /** ****/ const module = (installedModules[moduleId] = {
      /** ****/ i: moduleId,
      /** ****/ l: false,
      /** ****/ exports: {}
      /** ****/
    }); // Execute the module function
    /** ****/
    /** ****/ /** ****/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /** ****/
    /** ****/ /** ****/ module.l = true; // Return the exports of the module
    /** ****/
    /** ****/ /** ****/ return module.exports;
    /** ****/
  } // expose the modules object (__webpack_modules__)
  /** ****/
  /** ****/
  /** ****/ /** ****/ __webpack_require__.m = modules; // expose the module cache
  /** ****/
  /** ****/ /** ****/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /** ****/
  /** ****/ /** ****/ __webpack_require__.d = function (exports, name, getter) {
    /** ****/ if (!__webpack_require__.o(exports, name)) {
      /** ****/ Object.defineProperty(exports, name, {
        /** ****/ configurable: false,
        /** ****/ enumerable: true,
        /** ****/ get: getter
        /** ****/
      });
      /** ****/
    }
    /** ****/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /** ****/
  /** ****/ /** ****/ __webpack_require__.n = function (module) {
    /** ****/ const getter =
      module && module.__esModule
        ? /** ****/ function getDefault() {
            return module.default;
          }
        : /** ****/ function getModuleExports() {
            return module;
          };
    /** ****/ __webpack_require__.d(getter, 'a', getter);
    /** ****/ return getter;
    /** ****/
  }; // Object.prototype.hasOwnProperty.call
  /** ****/
  /** ****/ /** ****/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /** ****/
  /** ****/ /** ****/ __webpack_require__.p = ''; // Load entry module and return exports
  /** ****/
  /** ****/ /** ****/ return __webpack_require__((__webpack_require__.s = 2));
  /** ****/
})(
  /** **********************************************************************/
  /** ****/ [
    /* 0 */
    /***/ function (module, exports) {
      // shim for using process in browser
      const process = (module.exports = {});

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      let cachedSetTimeout;
      let cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          // normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          // normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      let queue = [];
      let draining = false;
      let currentQueue;
      let queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        const timeout = runTimeout(cleanUpNextTick);
        draining = true;

        let len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        const args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (let i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };

      /***/
    },
    /* 1 */
    /***/ function (module, exports, __webpack_require__) {
      /*
object-assign
(c) Sindre Sorhus
@license MIT
*/

      /* eslint-disable no-unused-vars */
      const { getOwnPropertySymbols } = Object;
      const { hasOwnProperty } = Object.prototype;
      const propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function toObject(val) {
        if (val === null || val === undefined) {
          throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
      }

      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false;
          }

          // Detect buggy property enumeration order in older V8 versions.

          // https://bugs.chromium.org/p/v8/issues/detail?id=4118
          const test1 = new String('abc'); // eslint-disable-line no-new-wrappers
          test1[5] = 'de';
          if (Object.getOwnPropertyNames(test1)[0] === '5') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          const test2 = {};
          for (let i = 0; i < 10; i++) {
            test2[`_${String.fromCharCode(i)}`] = i;
          }
          const order2 = Object.getOwnPropertyNames(test2).map((n) => test2[n]);
          if (order2.join('') !== '0123456789') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          const test3 = {};
          'abcdefghijklmnopqrst'.split('').forEach((letter) => {
            test3[letter] = letter;
          });
          if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
            return false;
          }

          return true;
        } catch (err) {
          // We don't expect any of the above to throw, but better to be safe.
          return false;
        }
      }

      module.exports = shouldUseNative()
        ? Object.assign
        : function (target, source) {
            let from;
            const to = toObject(target);
            let symbols;

            for (let s = 1; s < arguments.length; s++) {
              from = Object(arguments[s]);

              for (const key in from) {
                if (hasOwnProperty.call(from, key)) {
                  to[key] = from[key];
                }
              }

              if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (let i = 0; i < symbols.length; i++) {
                  if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                  }
                }
              }
            }

            return to;
          };

      /***/
    },
    /* 2 */
    /***/ function (module, __webpack_exports__, __webpack_require__) {
      Object.defineProperty(__webpack_exports__, '__esModule', { value: true });

      // EXTERNAL MODULE: ../node_modules/react/index.js
      const react = __webpack_require__(3);
      const react_default = /* #__PURE__*/ __webpack_require__.n(react);

      // CONCATENATED MODULE: ./output/scoped-hoisting/logo.svg

      const logo_SvgComponent = function SvgComponent(props) {
        return /* #__PURE__*/ react_default.a.createElement('svg', props);
      };

      /* harmony default export */ const logo = `${__webpack_require__.p}86fe11ef32e54d0785c367dac9294aa0.svg`;

      // CONCATENATED MODULE: ./output/scoped-hoisting/index.js

      /***/
    },
    /* 3 */
    /***/ function (module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */ (function (process) {
        if (process.env.NODE_ENV === 'production') {
          module.exports = __webpack_require__(4);
        } else {
          module.exports = __webpack_require__(5);
        }

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(0)));

      /***/
    },
    /* 4 */
    /***/ function (module, exports, __webpack_require__) {
      /** @license React v16.13.1
       * react.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      const l = __webpack_require__(1);
      let n = typeof Symbol === 'function' && Symbol.for;
      let p = n ? Symbol.for('react.element') : 60103;
      let q = n ? Symbol.for('react.portal') : 60106;
      let r = n ? Symbol.for('react.fragment') : 60107;
      let t = n ? Symbol.for('react.strict_mode') : 60108;
      let u = n ? Symbol.for('react.profiler') : 60114;
      let v = n ? Symbol.for('react.provider') : 60109;
      let w = n ? Symbol.for('react.context') : 60110;
      let x = n ? Symbol.for('react.forward_ref') : 60112;
      let y = n ? Symbol.for('react.suspense') : 60113;
      let z = n ? Symbol.for('react.memo') : 60115;
      let A = n ? Symbol.for('react.lazy') : 60116;
      let B = typeof Symbol === 'function' && Symbol.iterator;
      function C(a) {
        for (
          var b = `https://reactjs.org/docs/error-decoder.html?invariant=${a}`, c = 1;
          c < arguments.length;
          c++
        )
          b += `&args[]=${encodeURIComponent(arguments[c])}`;
        return `Minified React error #${a}; visit ${b} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`;
      }
      const D = {
        isMounted() {
          return !1;
        },
        enqueueForceUpdate() {},
        enqueueReplaceState() {},
        enqueueSetState() {}
      };
      let E = {};
      function F(a, b, c) {
        this.props = a;
        this.context = b;
        this.refs = E;
        this.updater = c || D;
      }
      F.prototype.isReactComponent = {};
      F.prototype.setState = function (a, b) {
        if (typeof a !== 'object' && typeof a !== 'function' && a != null) throw Error(C(85));
        this.updater.enqueueSetState(this, a, b, 'setState');
      };
      F.prototype.forceUpdate = function (a) {
        this.updater.enqueueForceUpdate(this, a, 'forceUpdate');
      };
      function G() {}
      G.prototype = F.prototype;
      function H(a, b, c) {
        this.props = a;
        this.context = b;
        this.refs = E;
        this.updater = c || D;
      }
      const I = (H.prototype = new G());
      I.constructor = H;
      l(I, F.prototype);
      I.isPureReactComponent = !0;
      const J = { current: null };
      var K = Object.prototype.hasOwnProperty;
      let L = { key: !0, ref: !0, __self: !0, __source: !0 };
      function M(a, b, c) {
        let e;
        let d = {};
        var g = null;
        let k = null;
        if (b != null)
          for (e in (void 0 !== b.ref && (k = b.ref), void 0 !== b.key && (g = `${b.key}`), b))
            K.call(b, e) && !L.hasOwnProperty(e) && (d[e] = b[e]);
        let f = arguments.length - 2;
        if (f === 1) d.children = c;
        else if (f > 1) {
          for (var h = Array(f), m = 0; m < f; m++) h[m] = arguments[m + 2];
          d.children = h;
        }
        if (a && a.defaultProps)
          for (e in ((f = a.defaultProps), f)) void 0 === d[e] && (d[e] = f[e]);
        return { $$typeof: p, type: a, key: g, ref: k, props: d, _owner: J.current };
      }
      function N(a, b) {
        return { $$typeof: p, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
      }
      function O(a) {
        return typeof a === 'object' && a !== null && a.$$typeof === p;
      }
      function escape(a) {
        const b = { '=': '=0', ':': '=2' };
        return `$${(`${  a}`).replace(/[=:]/g, (a) => {
            return b[a];
          })}`
        );
      }
      const P = /\/+/g;
      let Q = [];
      function R(a, b, c, e) {
        if (Q.length) {
          const d = Q.pop();
          d.result = a;
          d.keyPrefix = b;
          d.func = c;
          d.context = e;
          d.count = 0;
          return d;
        }
        return { result: a, keyPrefix: b, func: c, context: e, count: 0 };
      }
      function S(a) {
        a.result = null;
        a.keyPrefix = null;
        a.func = null;
        a.context = null;
        a.count = 0;
        Q.length < 10 && Q.push(a);
      }
      function T(a, b, c, e) {
        let d = typeof a;
        if (d === 'undefined' || d === 'boolean') a = null;
        let g = !1;
        if (a === null) g = !0;
        else
          switch (d) {
            case 'string':
            case 'number':
              g = !0;
              break;
            case 'object':
              switch (a.$$typeof) {
                case p:
                case q:
                  g = !0;
              }
          }
        if (g) return c(e, a, b === '' ? `.${U(a, 0)}` : b), 1;
        g = 0;
        b = b === '' ? '.' : `${b}:`;
        if (Array.isArray(a))
          for (var k = 0; k < a.length; k++) {
            d = a[k];
            var f = b + U(d, k);
            g += T(d, f, c, e);
          }
        else if (
          (a === null || typeof a !== 'object'
            ? (f = null)
            : ((f = (B && a[B]) || a['@@iterator']), (f = typeof f === 'function' ? f : null)),
          typeof f === 'function')
        )
          for (a = f.call(a), k = 0; !(d = a.next()).done; )
            (d = d.value), (f = b + U(d, k++)), (g += T(d, f, c, e));
        else if (d === 'object')
          throw (
            ((c = `${a}`),
            Error(
              C(
                31,
                c === '[object Object]' ? `object with keys {${Object.keys(a).join(', ')}}` : c,
                ''
              )
            ))
          );
        return g;
      }
      function V(a, b, c) {
        return a == null ? 0 : T(a, '', b, c);
      }
      function U(a, b) {
        return typeof a === 'object' && a !== null && a.key != null
          ? escape(a.key)
          : b.toString(36);
      }
      function W(a, b) {
        a.func.call(a.context, b, a.count++);
      }
      function aa(a, b, c) {
        const e = a.result;
        var d = a.keyPrefix;
        a = a.func.call(a.context, b, a.count++);
        Array.isArray(a)
          ? X(a, e, c, (a) => a)
          : a != null &&
            (O(a) &&
              (a = N(
                a,
                d +
                  (!a.key || (b && b.key === a.key) ? '' : `${(`${  a.key}`).replace(P, '$&/')}/`) +
                  c
              )),
            e.push(a));
      }
      function X(a, b, c, e, d) {
        let g = '';
        c != null && (g = `${(`${  c}`).replace(P, '$&/')}/`);
        b = R(b, g, e, d);
        V(a, aa, b);
        S(b);
      }
      const Y = { current: null };
      function Z() {
        const a = Y.current;
        if (a === null) throw Error(C(321));
        return a;
      }
      const ba = {
        ReactCurrentDispatcher: Y,
        ReactCurrentBatchConfig: { suspense: null },
        ReactCurrentOwner: J,
        IsSomeRendererActing: { current: !1 },
        assign: l
      };
      exports.Children = {
        map(a, b, c) {
          if (a == null) return a;
          let e = [];
          X(a, e, null, b, c);
          return e;
        },
        forEach(a, b, c) {
          if (a == null) return a;
          b = R(null, null, b, c);
          V(a, W, b);
          S(b);
        },
        count(a) {
          return V(
            a,
            () => {
              return null;
            },
            null
          );
        },
        toArray(a) {
          let b = [];
          X(a, b, null, (a) => {
            return a;
          });
          return b;
        },
        only(a) {
          if (!O(a)) throw Error(C(143));
          return a;
        }
      };
      exports.Component = F;
      exports.Fragment = r;
      exports.Profiler = u;
      exports.PureComponent = H;
      exports.StrictMode = t;
      exports.Suspense = y;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ba;
      exports.cloneElement = function (a, b, c) {
        if (a === null || void 0 === a) throw Error(C(267, a));
        const e = l({}, a.props);
        var d = a.key;
        let g = a.ref;
        let k = a._owner;
        if (b != null) {
          void 0 !== b.ref && ((g = b.ref), (k = J.current));
          void 0 !== b.key && (d = `${b.key}`);
          if (a.type && a.type.defaultProps) var f = a.type.defaultProps;
          for (h in b)
            K.call(b, h) &&
              !L.hasOwnProperty(h) &&
              (e[h] = void 0 === b[h] && void 0 !== f ? f[h] : b[h]);
        }
        var h = arguments.length - 2;
        if (h === 1) e.children = c;
        else if (h > 1) {
          f = Array(h);
          for (let m = 0; m < h; m++) f[m] = arguments[m + 2];
          e.children = f;
        }
        return { $$typeof: p, type: a.type, key: d, ref: g, props: e, _owner: k };
      };
      exports.createContext = function (a, b) {
        void 0 === b && (b = null);
        a = {
          $$typeof: w,
          _calculateChangedBits: b,
          _currentValue: a,
          _currentValue2: a,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        a.Provider = { $$typeof: v, _context: a };
        return (a.Consumer = a);
      };
      exports.createElement = M;
      exports.createFactory = function (a) {
        const b = M.bind(null, a);
        b.type = a;
        return b;
      };
      exports.createRef = function () {
        return { current: null };
      };
      exports.forwardRef = function (a) {
        return { $$typeof: x, render: a };
      };
      exports.isValidElement = O;
      exports.lazy = function (a) {
        return { $$typeof: A, _ctor: a, _status: -1, _result: null };
      };
      exports.memo = function (a, b) {
        return { $$typeof: z, type: a, compare: void 0 === b ? null : b };
      };
      exports.useCallback = function (a, b) {
        return Z().useCallback(a, b);
      };
      exports.useContext = function (a, b) {
        return Z().useContext(a, b);
      };
      exports.useDebugValue = function () {};
      exports.useEffect = function (a, b) {
        return Z().useEffect(a, b);
      };
      exports.useImperativeHandle = function (a, b, c) {
        return Z().useImperativeHandle(a, b, c);
      };
      exports.useLayoutEffect = function (a, b) {
        return Z().useLayoutEffect(a, b);
      };
      exports.useMemo = function (a, b) {
        return Z().useMemo(a, b);
      };
      exports.useReducer = function (a, b, c) {
        return Z().useReducer(a, b, c);
      };
      exports.useRef = function (a) {
        return Z().useRef(a);
      };
      exports.useState = function (a) {
        return Z().useState(a);
      };
      exports.version = '16.13.1';

      /***/
    },
    /* 5 */
    /***/ function (module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */ (function (process) {
        /** @license React v16.13.1
         * react.development.js
         *
         * Copyright (c) Facebook, Inc. and its affiliates.
         *
         * This source code is licensed under the MIT license found in the
         * LICENSE file in the root directory of this source tree.
         */

        if (process.env.NODE_ENV !== 'production') {
          (function () {
            const _assign = __webpack_require__(1);
            const checkPropTypes = __webpack_require__(6);

            const ReactVersion = '16.13.1';

            // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
            // nor polyfill, then a plain number is used for performance.
            const hasSymbol = typeof Symbol === 'function' && Symbol.for;
            const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
            const REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
            const REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
            const REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
            const REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
            const REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
            const REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
            const REACT_CONCURRENT_MODE_TYPE = hasSymbol
              ? Symbol.for('react.concurrent_mode')
              : 0xeacf;
            const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
            const REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
            const REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
            const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
            const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
            const REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
            const REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
            const REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
            const REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
            const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
            const FAUX_ITERATOR_SYMBOL = '@@iterator';
            function getIteratorFn(maybeIterable) {
              if (maybeIterable === null || typeof maybeIterable !== 'object') {
                return null;
              }

              const maybeIterator =
                (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
                maybeIterable[FAUX_ITERATOR_SYMBOL];

              if (typeof maybeIterator === 'function') {
                return maybeIterator;
              }

              return null;
            }

            /**
             * Keeps track of the current dispatcher.
             */
            const ReactCurrentDispatcher = {
              /**
               * @internal
               * @type {ReactComponent}
               */
              current: null
            };

            /**
             * Keeps track of the current batch's configuration such as how long an update
             * should suspend for if it needs to.
             */
            const ReactCurrentBatchConfig = {
              suspense: null
            };

            /**
             * Keeps track of the current owner.
             *
             * The current owner is the component who should own any components that are
             * currently being constructed.
             */
            const ReactCurrentOwner = {
              /**
               * @internal
               * @type {ReactComponent}
               */
              current: null
            };

            const BEFORE_SLASH_RE = /^(.*)[\\\/]/;
            function describeComponentFrame(name, source, ownerName) {
              let sourceInfo = '';

              if (source) {
                const path = source.fileName;
                let fileName = path.replace(BEFORE_SLASH_RE, '');

                {
                  // In DEV, include code for a common special case:
                  // prefer "folder/index.js" instead of just "index.js".
                  if (/^index\./.test(fileName)) {
                    const match = path.match(BEFORE_SLASH_RE);

                    if (match) {
                      const pathBeforeSlash = match[1];

                      if (pathBeforeSlash) {
                        const folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
                        fileName = `${folderName}/${fileName}`;
                      }
                    }
                  }
                }

                sourceInfo = ` (at ${fileName}:${source.lineNumber})`;
              } else if (ownerName) {
                sourceInfo = ` (created by ${ownerName})`;
              }

              return `\n    in ${name || 'Unknown'}${sourceInfo}`;
            }

            const Resolved = 1;
            function refineResolvedLazyComponent(lazyComponent) {
              return lazyComponent._status === Resolved ? lazyComponent._result : null;
            }

            function getWrappedName(outerType, innerType, wrapperName) {
              const functionName = innerType.displayName || innerType.name || '';
              return (
                outerType.displayName ||
                (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName)
              );
            }

            function getComponentName(type) {
              if (type == null) {
                // Host root, text node or just invalid type.
                return null;
              }

              {
                if (typeof type.tag === 'number') {
                  error(
                    'Received an unexpected object in getComponentName(). ' +
                      'This is likely a bug in React. Please file an issue.'
                  );
                }
              }

              if (typeof type === 'function') {
                return type.displayName || type.name || null;
              }

              if (typeof type === 'string') {
                return type;
              }

              switch (type) {
                case REACT_FRAGMENT_TYPE:
                  return 'Fragment';

                case REACT_PORTAL_TYPE:
                  return 'Portal';

                case REACT_PROFILER_TYPE:
                  return 'Profiler';

                case REACT_STRICT_MODE_TYPE:
                  return 'StrictMode';

                case REACT_SUSPENSE_TYPE:
                  return 'Suspense';

                case REACT_SUSPENSE_LIST_TYPE:
                  return 'SuspenseList';
              }

              if (typeof type === 'object') {
                switch (type.$$typeof) {
                  case REACT_CONTEXT_TYPE:
                    return 'Context.Consumer';

                  case REACT_PROVIDER_TYPE:
                    return 'Context.Provider';

                  case REACT_FORWARD_REF_TYPE:
                    return getWrappedName(type, type.render, 'ForwardRef');

                  case REACT_MEMO_TYPE:
                    return getComponentName(type.type);

                  case REACT_BLOCK_TYPE:
                    return getComponentName(type.render);

                  case REACT_LAZY_TYPE: {
                    const thenable = type;
                    const resolvedThenable = refineResolvedLazyComponent(thenable);

                    if (resolvedThenable) {
                      return getComponentName(resolvedThenable);
                    }

                    break;
                  }
                }
              }

              return null;
            }

            const ReactDebugCurrentFrame = {};
            let currentlyValidatingElement = null;
            function setCurrentlyValidatingElement(element) {
              {
                currentlyValidatingElement = element;
              }
            }

            {
              // Stack implementation injected by the current renderer.
              ReactDebugCurrentFrame.getCurrentStack = null;

              ReactDebugCurrentFrame.getStackAddendum = function () {
                let stack = ''; // Add an extra top frame while an element is being validated

                if (currentlyValidatingElement) {
                  const name = getComponentName(currentlyValidatingElement.type);
                  const owner = currentlyValidatingElement._owner;
                  stack += describeComponentFrame(
                    name,
                    currentlyValidatingElement._source,
                    owner && getComponentName(owner.type)
                  );
                } // Delegate to the injected renderer-specific implementation

                const impl = ReactDebugCurrentFrame.getCurrentStack;

                if (impl) {
                  stack += impl() || '';
                }

                return stack;
              };
            }

            /**
             * Used by act() to track whether you're inside an act() scope.
             */
            const IsSomeRendererActing = {
              current: false
            };

            const ReactSharedInternals = {
              ReactCurrentDispatcher,
              ReactCurrentBatchConfig,
              ReactCurrentOwner,
              IsSomeRendererActing,
              // Used by renderers to avoid bundling object-assign twice in UMD bundles:
              assign: _assign
            };

            {
              _assign(ReactSharedInternals, {
                // These should not be included in production.
                ReactDebugCurrentFrame,
                // Shim for React DOM 16.0.0 which still destructured (but not used) this.
                // TODO: remove in React 17.0.
                ReactComponentTreeHook: {}
              });
            }

            // by calls to these methods by a Babel plugin.
            //
            // In PROD (or in packages without access to React internals),
            // they are left as they are instead.

            function warn(format) {
              {
                for (
                  var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
                  _key < _len;
                  _key++
                ) {
                  args[_key - 1] = arguments[_key];
                }

                printWarning('warn', format, args);
              }
            }
            function error(format) {
              {
                for (
                  var _len2 = arguments.length,
                    args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                    _key2 = 1;
                  _key2 < _len2;
                  _key2++
                ) {
                  args[_key2 - 1] = arguments[_key2];
                }

                printWarning('error', format, args);
              }
            }

            function printWarning(level, format, args) {
              // When changing this logic, you might want to also
              // update consoleWithStackDev.www.js as well.
              {
                const hasExistingStack =
                  args.length > 0 &&
                  typeof args[args.length - 1] === 'string' &&
                  args[args.length - 1].indexOf('\n    in') === 0;

                if (!hasExistingStack) {
                  const { ReactDebugCurrentFrame } = ReactSharedInternals;
                  const stack = ReactDebugCurrentFrame.getStackAddendum();

                  if (stack !== '') {
                    format += '%s';
                    args = args.concat([stack]);
                  }
                }

                const argsWithFormat = args.map((item) => `${  item}`); // Careful: RN currently depends on this prefix

                argsWithFormat.unshift(`Warning: ${format}`); // We intentionally don't use spread (or .apply) directly because it
                // breaks IE9: https://github.com/facebook/react/issues/13610
                // eslint-disable-next-line react-internal/no-production-logging

                Function.prototype.apply.call(console[level], console, argsWithFormat);

                try {
                  // --- Welcome to debugging React ---
                  // This error was thrown as a convenience so that you can use this stack
                  // to find the callsite that caused this warning to fire.
                  let argIndex = 0;
                  const message = `Warning: ${format.replace(/%s/g, () => args[argIndex++])}`;
                  throw new Error(message);
                } catch (x) {}
              }
            }

            const didWarnStateUpdateForUnmountedComponent = {};

            function warnNoop(publicInstance, callerName) {
              {
                const _constructor = publicInstance.constructor;
                const componentName =
                  (_constructor && (_constructor.displayName || _constructor.name)) || 'ReactClass';
                const warningKey = `${componentName}.${callerName}`;

                if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
                  return;
                }

                error(
                  "Can't call %s on a component that is not yet mounted. " +
                    'This is a no-op, but it might indicate a bug in your application. ' +
                    'Instead, assign to `this.state` directly or define a `state = {};` ' +
                    'class property with the desired state in the %s component.',
                  callerName,
                  componentName
                );

                didWarnStateUpdateForUnmountedComponent[warningKey] = true;
              }
            }
            /**
             * This is the abstract API for an update queue.
             */

            const ReactNoopUpdateQueue = {
              /**
               * Checks whether or not this composite component is mounted.
               * @param {ReactClass} publicInstance The instance we want to test.
               * @return {boolean} True if mounted, false otherwise.
               * @protected
               * @final
               */
              isMounted(publicInstance) {
                return false;
              },

              /**
               * Forces an update. This should only be invoked when it is known with
               * certainty that we are **not** in a DOM transaction.
               *
               * You may want to call this when you know that some deeper aspect of the
               * component's state has changed but `setState` was not called.
               *
               * This will not invoke `shouldComponentUpdate`, but it will invoke
               * `componentWillUpdate` and `componentDidUpdate`.
               *
               * @param {ReactClass} publicInstance The instance that should rerender.
               * @param {?function} callback Called after component is updated.
               * @param {?string} callerName name of the calling function in the public API.
               * @internal
               */
              enqueueForceUpdate(publicInstance, callback, callerName) {
                warnNoop(publicInstance, 'forceUpdate');
              },

              /**
               * Replaces all of the state. Always use this or `setState` to mutate state.
               * You should treat `this.state` as immutable.
               *
               * There is no guarantee that `this.state` will be immediately updated, so
               * accessing `this.state` after calling this method may return the old value.
               *
               * @param {ReactClass} publicInstance The instance that should rerender.
               * @param {object} completeState Next state.
               * @param {?function} callback Called after component is updated.
               * @param {?string} callerName name of the calling function in the public API.
               * @internal
               */
              enqueueReplaceState(publicInstance, completeState, callback, callerName) {
                warnNoop(publicInstance, 'replaceState');
              },

              /**
               * Sets a subset of the state. This only exists because _pendingState is
               * internal. This provides a merging strategy that is not available to deep
               * properties which is confusing. TODO: Expose pendingState or don't use it
               * during the merge.
               *
               * @param {ReactClass} publicInstance The instance that should rerender.
               * @param {object} partialState Next partial state to be merged with state.
               * @param {?function} callback Called after component is updated.
               * @param {?string} Name of the calling function in the public API.
               * @internal
               */
              enqueueSetState(publicInstance, partialState, callback, callerName) {
                warnNoop(publicInstance, 'setState');
              }
            };

            const emptyObject = {};

            {
              Object.freeze(emptyObject);
            }
            /**
             * Base class helpers for the updating state of a component.
             */

            function Component(props, context, updater) {
              this.props = props;
              this.context = context; // If a component has string refs, we will assign a different object later.

              this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
              // renderer.

              this.updater = updater || ReactNoopUpdateQueue;
            }

            Component.prototype.isReactComponent = {};
            /**
             * Sets a subset of the state. Always use this to mutate
             * state. You should treat `this.state` as immutable.
             *
             * There is no guarantee that `this.state` will be immediately updated, so
             * accessing `this.state` after calling this method may return the old value.
             *
             * There is no guarantee that calls to `setState` will run synchronously,
             * as they may eventually be batched together.  You can provide an optional
             * callback that will be executed when the call to setState is actually
             * completed.
             *
             * When a function is provided to setState, it will be called at some point in
             * the future (not synchronously). It will be called with the up to date
             * component arguments (state, props, context). These values can be different
             * from this.* because your function may be called after receiveProps but before
             * shouldComponentUpdate, and this new state, props, and context will not yet be
             * assigned to this.
             *
             * @param {object|function} partialState Next partial state or function to
             *        produce next partial state to be merged with current state.
             * @param {?function} callback Called after state is updated.
             * @final
             * @protected
             */

            Component.prototype.setState = function (partialState, callback) {
              if (
                !(
                  typeof partialState === 'object' ||
                  typeof partialState === 'function' ||
                  partialState == null
                )
              ) {
                {
                  throw Error(
                    'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
                  );
                }
              }

              this.updater.enqueueSetState(this, partialState, callback, 'setState');
            };
            /**
             * Forces an update. This should only be invoked when it is known with
             * certainty that we are **not** in a DOM transaction.
             *
             * You may want to call this when you know that some deeper aspect of the
             * component's state has changed but `setState` was not called.
             *
             * This will not invoke `shouldComponentUpdate`, but it will invoke
             * `componentWillUpdate` and `componentDidUpdate`.
             *
             * @param {?function} callback Called after update is complete.
             * @final
             * @protected
             */

            Component.prototype.forceUpdate = function (callback) {
              this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
            };
            /**
             * Deprecated APIs. These APIs used to exist on classic React classes but since
             * we would like to deprecate them, we're not going to move them over to this
             * modern base class. Instead, we define a getter that warns if it's accessed.
             */

            {
              const deprecatedAPIs = {
                isMounted: [
                  'isMounted',
                  'Instead, make sure to clean up subscriptions and pending requests in ' +
                    'componentWillUnmount to prevent memory leaks.'
                ],
                replaceState: [
                  'replaceState',
                  'Refactor your code to use setState instead (see ' +
                    'https://github.com/facebook/react/issues/3236).'
                ]
              };

              const defineDeprecationWarning = function (methodName, info) {
                Object.defineProperty(Component.prototype, methodName, {
                  get() {
                    warn(
                      '%s(...) is deprecated in plain JavaScript React classes. %s',
                      info[0],
                      info[1]
                    );

                    return undefined;
                  }
                });
              };

              for (const fnName in deprecatedAPIs) {
                if (deprecatedAPIs.hasOwnProperty(fnName)) {
                  defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
                }
              }
            }

            function ComponentDummy() {}

            ComponentDummy.prototype = Component.prototype;
            /**
             * Convenience component with default shallow equality check for sCU.
             */

            function PureComponent(props, context, updater) {
              this.props = props;
              this.context = context; // If a component has string refs, we will assign a different object later.

              this.refs = emptyObject;
              this.updater = updater || ReactNoopUpdateQueue;
            }

            const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
            pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

            _assign(pureComponentPrototype, Component.prototype);

            pureComponentPrototype.isPureReactComponent = true;

            // an immutable object with a single mutable value
            function createRef() {
              const refObject = {
                current: null
              };

              {
                Object.seal(refObject);
              }

              return refObject;
            }

            const { hasOwnProperty } = Object.prototype;
            const RESERVED_PROPS = {
              key: true,
              ref: true,
              __self: true,
              __source: true
            };
            let specialPropKeyWarningShown;
            let specialPropRefWarningShown;
            let didWarnAboutStringRefs;

            {
              didWarnAboutStringRefs = {};
            }

            function hasValidRef(config) {
              {
                if (hasOwnProperty.call(config, 'ref')) {
                  const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

                  if (getter && getter.isReactWarning) {
                    return false;
                  }
                }
              }

              return config.ref !== undefined;
            }

            function hasValidKey(config) {
              {
                if (hasOwnProperty.call(config, 'key')) {
                  const getter = Object.getOwnPropertyDescriptor(config, 'key').get;

                  if (getter && getter.isReactWarning) {
                    return false;
                  }
                }
              }

              return config.key !== undefined;
            }

            function defineKeyPropWarningGetter(props, displayName) {
              const warnAboutAccessingKey = function () {
                {
                  if (!specialPropKeyWarningShown) {
                    specialPropKeyWarningShown = true;

                    error(
                      '%s: `key` is not a prop. Trying to access it will result ' +
                        'in `undefined` being returned. If you need to access the same ' +
                        'value within the child component, you should pass it as a different ' +
                        'prop. (https://fb.me/react-special-props)',
                      displayName
                    );
                  }
                }
              };

              warnAboutAccessingKey.isReactWarning = true;
              Object.defineProperty(props, 'key', {
                get: warnAboutAccessingKey,
                configurable: true
              });
            }

            function defineRefPropWarningGetter(props, displayName) {
              const warnAboutAccessingRef = function () {
                {
                  if (!specialPropRefWarningShown) {
                    specialPropRefWarningShown = true;

                    error(
                      '%s: `ref` is not a prop. Trying to access it will result ' +
                        'in `undefined` being returned. If you need to access the same ' +
                        'value within the child component, you should pass it as a different ' +
                        'prop. (https://fb.me/react-special-props)',
                      displayName
                    );
                  }
                }
              };

              warnAboutAccessingRef.isReactWarning = true;
              Object.defineProperty(props, 'ref', {
                get: warnAboutAccessingRef,
                configurable: true
              });
            }

            function warnIfStringRefCannotBeAutoConverted(config) {
              {
                if (
                  typeof config.ref === 'string' &&
                  ReactCurrentOwner.current &&
                  config.__self &&
                  ReactCurrentOwner.current.stateNode !== config.__self
                ) {
                  const componentName = getComponentName(ReactCurrentOwner.current.type);

                  if (!didWarnAboutStringRefs[componentName]) {
                    error(
                      'Component "%s" contains the string ref "%s". ' +
                        'Support for string refs will be removed in a future major release. ' +
                        'This case cannot be automatically converted to an arrow function. ' +
                        'We ask you to manually fix this case by using useRef() or createRef() instead. ' +
                        'Learn more about using refs safely here: ' +
                        'https://fb.me/react-strict-mode-string-ref',
                      getComponentName(ReactCurrentOwner.current.type),
                      config.ref
                    );

                    didWarnAboutStringRefs[componentName] = true;
                  }
                }
              }
            }
            /**
             * Factory method to create a new React element. This no longer adheres to
             * the class pattern, so do not use new to call it. Also, instanceof check
             * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
             * if something is a React Element.
             *
             * @param {*} type
             * @param {*} props
             * @param {*} key
             * @param {string|object} ref
             * @param {*} owner
             * @param {*} self A *temporary* helper to detect places where `this` is
             * different from the `owner` when React.createElement is called, so that we
             * can warn. We want to get rid of owner and replace string `ref`s with arrow
             * functions, and as long as `this` and owner are the same, there will be no
             * change in behavior.
             * @param {*} source An annotation object (added by a transpiler or otherwise)
             * indicating filename, line number, and/or other information.
             * @internal
             */

            const ReactElement = function (type, key, ref, self, source, owner, props) {
              const element = {
                // This tag allows us to uniquely identify this as a React Element
                $$typeof: REACT_ELEMENT_TYPE,
                // Built-in properties that belong on the element
                type,
                key,
                ref,
                props,
                // Record the component responsible for creating this element.
                _owner: owner
              };

              {
                // The validation flag is currently mutative. We put it on
                // an external backing store so that we can freeze the whole object.
                // This can be replaced with a WeakMap once they are implemented in
                // commonly used development environments.
                element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
                // the validation flag non-enumerable (where possible, which should
                // include every environment we run tests in), so the test framework
                // ignores it.

                Object.defineProperty(element._store, 'validated', {
                  configurable: false,
                  enumerable: false,
                  writable: true,
                  value: false
                }); // self and source are DEV only properties.

                Object.defineProperty(element, '_self', {
                  configurable: false,
                  enumerable: false,
                  writable: false,
                  value: self
                }); // Two elements created in two different places should be considered
                // equal for testing purposes and therefore we hide it from enumeration.

                Object.defineProperty(element, '_source', {
                  configurable: false,
                  enumerable: false,
                  writable: false,
                  value: source
                });

                if (Object.freeze) {
                  Object.freeze(element.props);
                  Object.freeze(element);
                }
              }

              return element;
            };
            /**
             * Create and return a new ReactElement of the given type.
             * See https://reactjs.org/docs/react-api.html#createelement
             */

            function createElement(type, config, children) {
              let propName; // Reserved names are extracted

              const props = {};
              let key = null;
              let ref = null;
              let self = null;
              let source = null;

              if (config != null) {
                if (hasValidRef(config)) {
                  ref = config.ref;

                  {
                    warnIfStringRefCannotBeAutoConverted(config);
                  }
                }

                if (hasValidKey(config)) {
                  key = `${config.key}`;
                }

                self = config.__self === undefined ? null : config.__self;
                source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

                for (propName in config) {
                  if (
                    hasOwnProperty.call(config, propName) &&
                    !RESERVED_PROPS.hasOwnProperty(propName)
                  ) {
                    props[propName] = config[propName];
                  }
                }
              } // Children can be more than one argument, and those are transferred onto
              // the newly allocated props object.

              const childrenLength = arguments.length - 2;

              if (childrenLength === 1) {
                props.children = children;
              } else if (childrenLength > 1) {
                const childArray = Array(childrenLength);

                for (let i = 0; i < childrenLength; i++) {
                  childArray[i] = arguments[i + 2];
                }

                {
                  if (Object.freeze) {
                    Object.freeze(childArray);
                  }
                }

                props.children = childArray;
              } // Resolve default props

              if (type && type.defaultProps) {
                const { defaultProps } = type;

                for (propName in defaultProps) {
                  if (props[propName] === undefined) {
                    props[propName] = defaultProps[propName];
                  }
                }
              }

              {
                if (key || ref) {
                  const displayName =
                    typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

                  if (key) {
                    defineKeyPropWarningGetter(props, displayName);
                  }

                  if (ref) {
                    defineRefPropWarningGetter(props, displayName);
                  }
                }
              }

              return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
            }
            function cloneAndReplaceKey(oldElement, newKey) {
              const newElement = ReactElement(
                oldElement.type,
                newKey,
                oldElement.ref,
                oldElement._self,
                oldElement._source,
                oldElement._owner,
                oldElement.props
              );
              return newElement;
            }
            /**
             * Clone and return a new ReactElement using element as the starting point.
             * See https://reactjs.org/docs/react-api.html#cloneelement
             */

            function cloneElement(element, config, children) {
              if (element === null || element === undefined) {
                {
                  throw Error(
                    `React.cloneElement(...): The argument must be a React element, but you passed ${element}.`
                  );
                }
              }

              let propName; // Original props are copied

              const props = _assign({}, element.props); // Reserved names are extracted

              let { key } = element;
              let { ref } = element; // Self is preserved since the owner is preserved.

              const self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
              // transpiler, and the original source is probably a better indicator of the
              // true owner.

              const source = element._source; // Owner will be preserved, unless ref is overridden

              let owner = element._owner;

              if (config != null) {
                if (hasValidRef(config)) {
                  // Silently steal the ref from the parent.
                  ref = config.ref;
                  owner = ReactCurrentOwner.current;
                }

                if (hasValidKey(config)) {
                  key = `${config.key}`;
                } // Remaining properties override existing props

                let defaultProps;

                if (element.type && element.type.defaultProps) {
                  defaultProps = element.type.defaultProps;
                }

                for (propName in config) {
                  if (
                    hasOwnProperty.call(config, propName) &&
                    !RESERVED_PROPS.hasOwnProperty(propName)
                  ) {
                    if (config[propName] === undefined && defaultProps !== undefined) {
                      // Resolve default props
                      props[propName] = defaultProps[propName];
                    } else {
                      props[propName] = config[propName];
                    }
                  }
                }
              } // Children can be more than one argument, and those are transferred onto
              // the newly allocated props object.

              const childrenLength = arguments.length - 2;

              if (childrenLength === 1) {
                props.children = children;
              } else if (childrenLength > 1) {
                const childArray = Array(childrenLength);

                for (let i = 0; i < childrenLength; i++) {
                  childArray[i] = arguments[i + 2];
                }

                props.children = childArray;
              }

              return ReactElement(element.type, key, ref, self, source, owner, props);
            }
            /**
             * Verifies the object is a ReactElement.
             * See https://reactjs.org/docs/react-api.html#isvalidelement
             * @param {?object} object
             * @return {boolean} True if `object` is a ReactElement.
             * @final
             */

            function isValidElement(object) {
              return (
                typeof object === 'object' &&
                object !== null &&
                object.$$typeof === REACT_ELEMENT_TYPE
              );
            }

            const SEPARATOR = '.';
            const SUBSEPARATOR = ':';
            /**
             * Escape and wrap key so it is safe to use as a reactid
             *
             * @param {string} key to be escaped.
             * @return {string} the escaped key.
             */

            function escape(key) {
              const escapeRegex = /[=:]/g;
              const escaperLookup = {
                '=': '=0',
                ':': '=2'
              };
              const escapedString = `${key}`.replace(escapeRegex, (match) => escaperLookup[match]);
              return `$${escapedString}`;
            }
            /**
             * TODO: Test that a single child and an array with one item have the same key
             * pattern.
             */

            let didWarnAboutMaps = false;
            const userProvidedKeyEscapeRegex = /\/+/g;

            function escapeUserProvidedKey(text) {
              return `${text}`.replace(userProvidedKeyEscapeRegex, '$&/');
            }

            const POOL_SIZE = 10;
            const traverseContextPool = [];

            function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
              if (traverseContextPool.length) {
                let traverseContext = traverseContextPool.pop();
                traverseContext.result = mapResult;
                traverseContext.keyPrefix = keyPrefix;
                traverseContext.func = mapFunction;
                traverseContext.context = mapContext;
                traverseContext.count = 0;
                return traverseContext;
              }
              return {
                result: mapResult,
                keyPrefix,
                func: mapFunction,
                context: mapContext,
                count: 0
              };
            }

            function releaseTraverseContext(traverseContext) {
              traverseContext.result = null;
              traverseContext.keyPrefix = null;
              traverseContext.func = null;
              traverseContext.context = null;
              traverseContext.count = 0;

              if (traverseContextPool.length < POOL_SIZE) {
                traverseContextPool.push(traverseContext);
              }
            }
            /**
             * @param {?*} children Children tree container.
             * @param {!string} nameSoFar Name of the key path so far.
             * @param {!function} callback Callback to invoke with each child found.
             * @param {?*} traverseContext Used to pass information throughout the traversal
             * process.
             * @return {!number} The number of children in this subtree.
             */

            function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
              const type = typeof children;

              if (type === 'undefined' || type === 'boolean') {
                // All of the above are perceived as null.
                children = null;
              }

              let invokeCallback = false;

              if (children === null) {
                invokeCallback = true;
              } else {
                switch (type) {
                  case 'string':
                  case 'number':
                    invokeCallback = true;
                    break;

                  case 'object':
                    switch (children.$$typeof) {
                      case REACT_ELEMENT_TYPE:
                      case REACT_PORTAL_TYPE:
                        invokeCallback = true;
                    }
                }
              }

              if (invokeCallback) {
                callback(
                  traverseContext,
                  children, // If it's the only child, treat the name as if it was wrapped in an array
                  // so that it's consistent if the number of children grows.
                  nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
                );
                return 1;
              }

              let child;
              let nextName;
              let subtreeCount = 0; // Count of children found in the current subtree.

              const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

              if (Array.isArray(children)) {
                for (let i = 0; i < children.length; i++) {
                  child = children[i];
                  nextName = nextNamePrefix + getComponentKey(child, i);
                  subtreeCount += traverseAllChildrenImpl(
                    child,
                    nextName,
                    callback,
                    traverseContext
                  );
                }
              } else {
                const iteratorFn = getIteratorFn(children);

                if (typeof iteratorFn === 'function') {
                  {
                    // Warn about using Maps as children
                    if (iteratorFn === children.entries) {
                      if (!didWarnAboutMaps) {
                        warn(
                          'Using Maps as children is deprecated and will be removed in ' +
                            'a future major release. Consider converting children to ' +
                            'an array of keyed ReactElements instead.'
                        );
                      }

                      didWarnAboutMaps = true;
                    }
                  }

                  const iterator = iteratorFn.call(children);
                  let step;
                  let ii = 0;

                  while (!(step = iterator.next()).done) {
                    child = step.value;
                    nextName = nextNamePrefix + getComponentKey(child, ii++);
                    subtreeCount += traverseAllChildrenImpl(
                      child,
                      nextName,
                      callback,
                      traverseContext
                    );
                  }
                } else if (type === 'object') {
                  let addendum = '';

                  {
                    addendum = `${
                      ' If you meant to render a collection of children, use an array ' + 'instead.'
                    }${ReactDebugCurrentFrame.getStackAddendum()}`;
                  }

                  const childrenString = `${children}`;

                  {
                    {
                      throw Error(
                        `Objects are not valid as a React child (found: ${
                          childrenString === '[object Object]'
                            ? `object with keys {${  Object.keys(children).join(', ')  }}`
                            : childrenString
                        }).${addendum}`
                      );
                    }
                  }
                }
              }

              return subtreeCount;
            }
            /**
             * Traverses children that are typically specified as `props.children`, but
             * might also be specified through attributes:
             *
             * - `traverseAllChildren(this.props.children, ...)`
             * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
             *
             * The `traverseContext` is an optional argument that is passed through the
             * entire traversal. It can be used to store accumulations or anything else that
             * the callback might find relevant.
             *
             * @param {?*} children Children tree object.
             * @param {!function} callback To invoke upon traversing each child.
             * @param {?*} traverseContext Context for traversal.
             * @return {!number} The number of children in this subtree.
             */

            function traverseAllChildren(children, callback, traverseContext) {
              if (children == null) {
                return 0;
              }

              return traverseAllChildrenImpl(children, '', callback, traverseContext);
            }
            /**
             * Generate a key string that identifies a component within a set.
             *
             * @param {*} component A component that could contain a manual key.
             * @param {number} index Index that is used if a manual key is not provided.
             * @return {string}
             */

            function getComponentKey(component, index) {
              // Do some typechecking here since we call this blindly. We want to ensure
              // that we don't block potential future ES APIs.
              if (typeof component === 'object' && component !== null && component.key != null) {
                // Explicit key
                return escape(component.key);
              } // Implicit key determined by the index in the set

              return index.toString(36);
            }

            function forEachSingleChild(bookKeeping, child, name) {
              const { func } = bookKeeping;
              var {context} = bookKeeping;
              func.call(context, child, bookKeeping.count++);
            }
            /**
             * Iterates through children that are typically specified as `props.children`.
             *
             * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
             *
             * The provided forEachFunc(child, index) will be called for each
             * leaf child.
             *
             * @param {?*} children Children tree container.
             * @param {function(*, int)} forEachFunc
             * @param {*} forEachContext Context for forEachContext.
             */

            function forEachChildren(children, forEachFunc, forEachContext) {
              if (children == null) {
                return children;
              }

              const traverseContext = getPooledTraverseContext(
                null,
                null,
                forEachFunc,
                forEachContext
              );
              traverseAllChildren(children, forEachSingleChild, traverseContext);
              releaseTraverseContext(traverseContext);
            }

            function mapSingleChildIntoContext(bookKeeping, child, childKey) {
              const { result } = bookKeeping;
              var {keyPrefix} = bookKeeping;
              var {func} = bookKeeping;
              let { context } = bookKeeping;
              let mappedChild = func.call(context, child, bookKeeping.count++);

              if (Array.isArray(mappedChild)) {
                mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, (c) => c);
              } else if (mappedChild != null) {
                if (isValidElement(mappedChild)) {
                  mappedChild = cloneAndReplaceKey(
                    mappedChild, // Keep both the (mapped) and old keys if they differ, just as
                    // traverseAllChildren used to do for objects as children
                    keyPrefix +
                      (mappedChild.key && (!child || child.key !== mappedChild.key)
                        ? `${escapeUserProvidedKey(mappedChild.key)}/`
                        : '') +
                      childKey
                  );
                }

                result.push(mappedChild);
              }
            }

            function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
              let escapedPrefix = '';

              if (prefix != null) {
                escapedPrefix = `${escapeUserProvidedKey(prefix)}/`;
              }

              const traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
              traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
              releaseTraverseContext(traverseContext);
            }
            /**
             * Maps children that are typically specified as `props.children`.
             *
             * See https://reactjs.org/docs/react-api.html#reactchildrenmap
             *
             * The provided mapFunction(child, key, index) will be called for each
             * leaf child.
             *
             * @param {?*} children Children tree container.
             * @param {function(*, int)} func The map function.
             * @param {*} context Context for mapFunction.
             * @return {object} Object containing the ordered map of results.
             */

            function mapChildren(children, func, context) {
              if (children == null) {
                return children;
              }

              const result = [];
              mapIntoWithKeyPrefixInternal(children, result, null, func, context);
              return result;
            }
            /**
             * Count the number of children that are typically specified as
             * `props.children`.
             *
             * See https://reactjs.org/docs/react-api.html#reactchildrencount
             *
             * @param {?*} children Children tree container.
             * @return {number} The number of children.
             */

            function countChildren(children) {
              return traverseAllChildren(children, () => null, null);
            }
            /**
             * Flatten a children object (typically specified as `props.children`) and
             * return an array with appropriately re-keyed children.
             *
             * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
             */

            function toArray(children) {
              const result = [];
              mapIntoWithKeyPrefixInternal(children, result, null, (child) => child);
              return result;
            }
            /**
             * Returns the first child in a collection of children and verifies that there
             * is only one child in the collection.
             *
             * See https://reactjs.org/docs/react-api.html#reactchildrenonly
             *
             * The current implementation of this function assumes that a single child gets
             * passed without a wrapper, but the purpose of this helper function is to
             * abstract away the particular structure of children.
             *
             * @param {?object} children Child collection structure.
             * @return {ReactElement} The first and only `ReactElement` contained in the
             * structure.
             */

            function onlyChild(children) {
              if (!isValidElement(children)) {
                {
                  throw Error(
                    'React.Children.only expected to receive a single React element child.'
                  );
                }
              }

              return children;
            }

            function createContext(defaultValue, calculateChangedBits) {
              if (calculateChangedBits === undefined) {
                calculateChangedBits = null;
              } else {
                {
                  if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
                    error(
                      'createContext: Expected the optional second argument to be a ' +
                        'function. Instead received: %s',
                      calculateChangedBits
                    );
                  }
                }
              }

              const context = {
                $$typeof: REACT_CONTEXT_TYPE,
                _calculateChangedBits: calculateChangedBits,
                // As a workaround to support multiple concurrent renderers, we categorize
                // some renderers as primary and others as secondary. We only expect
                // there to be two concurrent renderers at most: React Native (primary) and
                // Fabric (secondary); React DOM (primary) and React ART (secondary).
                // Secondary renderers store their context values on separate fields.
                _currentValue: defaultValue,
                _currentValue2: defaultValue,
                // Used to track how many concurrent renderers this context currently
                // supports within in a single renderer. Such as parallel server rendering.
                _threadCount: 0,
                // These are circular
                Provider: null,
                Consumer: null
              };
              context.Provider = {
                $$typeof: REACT_PROVIDER_TYPE,
                _context: context
              };
              let hasWarnedAboutUsingNestedContextConsumers = false;
              let hasWarnedAboutUsingConsumerProvider = false;

              {
                // A separate object, but proxies back to the original context object for
                // backwards compatibility. It has a different $$typeof, so we can properly
                // warn for the incorrect usage of Context as a Consumer.
                const Consumer = {
                  $$typeof: REACT_CONTEXT_TYPE,
                  _context: context,
                  _calculateChangedBits: context._calculateChangedBits
                }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

                Object.defineProperties(Consumer, {
                  Provider: {
                    get() {
                      if (!hasWarnedAboutUsingConsumerProvider) {
                        hasWarnedAboutUsingConsumerProvider = true;

                        error(
                          'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' +
                            'a future major release. Did you mean to render <Context.Provider> instead?'
                        );
                      }

                      return context.Provider;
                    },
                    set(_Provider) {
                      context.Provider = _Provider;
                    }
                  },
                  _currentValue: {
                    get() {
                      return context._currentValue;
                    },
                    set(_currentValue) {
                      context._currentValue = _currentValue;
                    }
                  },
                  _currentValue2: {
                    get() {
                      return context._currentValue2;
                    },
                    set(_currentValue2) {
                      context._currentValue2 = _currentValue2;
                    }
                  },
                  _threadCount: {
                    get() {
                      return context._threadCount;
                    },
                    set(_threadCount) {
                      context._threadCount = _threadCount;
                    }
                  },
                  Consumer: {
                    get() {
                      if (!hasWarnedAboutUsingNestedContextConsumers) {
                        hasWarnedAboutUsingNestedContextConsumers = true;

                        error(
                          'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' +
                            'a future major release. Did you mean to render <Context.Consumer> instead?'
                        );
                      }

                      return context.Consumer;
                    }
                  }
                }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

                context.Consumer = Consumer;
              }

              {
                context._currentRenderer = null;
                context._currentRenderer2 = null;
              }

              return context;
            }

            function lazy(ctor) {
              const lazyType = {
                $$typeof: REACT_LAZY_TYPE,
                _ctor: ctor,
                // React uses these fields to store the result.
                _status: -1,
                _result: null
              };

              {
                // In production, this would just set it on the object.
                let defaultProps;
                let propTypes;
                Object.defineProperties(lazyType, {
                  defaultProps: {
                    configurable: true,
                    get() {
                      return defaultProps;
                    },
                    set(newDefaultProps) {
                      error(
                        'React.lazy(...): It is not supported to assign `defaultProps` to ' +
                          'a lazy component import. Either specify them where the component ' +
                          'is defined, or create a wrapping component around it.'
                      );

                      defaultProps = newDefaultProps; // Match production behavior more closely:

                      Object.defineProperty(lazyType, 'defaultProps', {
                        enumerable: true
                      });
                    }
                  },
                  propTypes: {
                    configurable: true,
                    get() {
                      return propTypes;
                    },
                    set(newPropTypes) {
                      error(
                        'React.lazy(...): It is not supported to assign `propTypes` to ' +
                          'a lazy component import. Either specify them where the component ' +
                          'is defined, or create a wrapping component around it.'
                      );

                      propTypes = newPropTypes; // Match production behavior more closely:

                      Object.defineProperty(lazyType, 'propTypes', {
                        enumerable: true
                      });
                    }
                  }
                });
              }

              return lazyType;
            }

            function forwardRef(render) {
              {
                if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
                  error(
                    'forwardRef requires a render function but received a `memo` ' +
                      'component. Instead of forwardRef(memo(...)), use ' +
                      'memo(forwardRef(...)).'
                  );
                } else if (typeof render !== 'function') {
                  error(
                    'forwardRef requires a render function but was given %s.',
                    render === null ? 'null' : typeof render
                  );
                } else if (render.length !== 0 && render.length !== 2) {
                  error(
                    'forwardRef render functions accept exactly two parameters: props and ref. %s',
                    render.length === 1
                      ? 'Did you forget to use the ref parameter?'
                      : 'Any additional parameter will be undefined.'
                  );
                }

                if (render != null) {
                  if (render.defaultProps != null || render.propTypes != null) {
                    error(
                      'forwardRef render functions do not support propTypes or defaultProps. ' +
                        'Did you accidentally pass a React component?'
                    );
                  }
                }
              }

              return {
                $$typeof: REACT_FORWARD_REF_TYPE,
                render
              };
            }

            function isValidElementType(type) {
              return (
                typeof type === 'string' ||
                typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
                type === REACT_FRAGMENT_TYPE ||
                type === REACT_CONCURRENT_MODE_TYPE ||
                type === REACT_PROFILER_TYPE ||
                type === REACT_STRICT_MODE_TYPE ||
                type === REACT_SUSPENSE_TYPE ||
                type === REACT_SUSPENSE_LIST_TYPE ||
                (typeof type === 'object' &&
                  type !== null &&
                  (type.$$typeof === REACT_LAZY_TYPE ||
                    type.$$typeof === REACT_MEMO_TYPE ||
                    type.$$typeof === REACT_PROVIDER_TYPE ||
                    type.$$typeof === REACT_CONTEXT_TYPE ||
                    type.$$typeof === REACT_FORWARD_REF_TYPE ||
                    type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
                    type.$$typeof === REACT_RESPONDER_TYPE ||
                    type.$$typeof === REACT_SCOPE_TYPE ||
                    type.$$typeof === REACT_BLOCK_TYPE))
              );
            }

            function memo(type, compare) {
              {
                if (!isValidElementType(type)) {
                  error(
                    'memo: The first argument must be a component. Instead ' + 'received: %s',
                    type === null ? 'null' : typeof type
                  );
                }
              }

              return {
                $$typeof: REACT_MEMO_TYPE,
                type,
                compare: compare === undefined ? null : compare
              };
            }

            function resolveDispatcher() {
              const dispatcher = ReactCurrentDispatcher.current;

              if (!(dispatcher !== null)) {
                {
                  throw Error(
                    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.'
                  );
                }
              }

              return dispatcher;
            }

            function useContext(Context, unstable_observedBits) {
              const dispatcher = resolveDispatcher();

              {
                if (unstable_observedBits !== undefined) {
                  error(
                    'useContext() second argument is reserved for future ' +
                      'use in React. Passing it is not supported. ' +
                      'You passed: %s.%s',
                    unstable_observedBits,
                    typeof unstable_observedBits === 'number' && Array.isArray(arguments[2])
                      ? '\n\nDid you call array.map(useContext)? ' +
                          'Calling Hooks inside a loop is not supported. ' +
                          'Learn more at https://fb.me/rules-of-hooks'
                      : ''
                  );
                } // TODO: add a more generic warning for invalid values.

                if (Context._context !== undefined) {
                  const realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
                  // and nobody should be using this in existing code.

                  if (realContext.Consumer === Context) {
                    error(
                      'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' +
                        'removed in a future major release. Did you mean to call useContext(Context) instead?'
                    );
                  } else if (realContext.Provider === Context) {
                    error(
                      'Calling useContext(Context.Provider) is not supported. ' +
                        'Did you mean to call useContext(Context) instead?'
                    );
                  }
                }
              }

              return dispatcher.useContext(Context, unstable_observedBits);
            }
            function useState(initialState) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useState(initialState);
            }
            function useReducer(reducer, initialArg, init) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useReducer(reducer, initialArg, init);
            }
            function useRef(initialValue) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useRef(initialValue);
            }
            function useEffect(create, deps) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useEffect(create, deps);
            }
            function useLayoutEffect(create, deps) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useLayoutEffect(create, deps);
            }
            function useCallback(callback, deps) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useCallback(callback, deps);
            }
            function useMemo(create, deps) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useMemo(create, deps);
            }
            function useImperativeHandle(ref, create, deps) {
              const dispatcher = resolveDispatcher();
              return dispatcher.useImperativeHandle(ref, create, deps);
            }
            function useDebugValue(value, formatterFn) {
              {
                const dispatcher = resolveDispatcher();
                return dispatcher.useDebugValue(value, formatterFn);
              }
            }

            let propTypesMisspellWarningShown;

            {
              propTypesMisspellWarningShown = false;
            }

            function getDeclarationErrorAddendum() {
              if (ReactCurrentOwner.current) {
                const name = getComponentName(ReactCurrentOwner.current.type);

                if (name) {
                  return `\n\nCheck the render method of \`${name}\`.`;
                }
              }

              return '';
            }

            function getSourceInfoErrorAddendum(source) {
              if (source !== undefined) {
                const fileName = source.fileName.replace(/^.*[\\\/]/, '');
                const { lineNumber } = source;
                return `\n\nCheck your code at ${fileName}:${lineNumber}.`;
              }

              return '';
            }

            function getSourceInfoErrorAddendumForProps(elementProps) {
              if (elementProps !== null && elementProps !== undefined) {
                return getSourceInfoErrorAddendum(elementProps.__source);
              }

              return '';
            }
            /**
             * Warn if there's no key explicitly set on dynamic arrays of children or
             * object keys are not valid. This allows us to keep track of children between
             * updates.
             */

            const ownerHasKeyUseWarning = {};

            function getCurrentComponentErrorInfo(parentType) {
              let info = getDeclarationErrorAddendum();

              if (!info) {
                const parentName =
                  typeof parentType === 'string'
                    ? parentType
                    : parentType.displayName || parentType.name;

                if (parentName) {
                  info = `\n\nCheck the top-level render call using <${parentName}>.`;
                }
              }

              return info;
            }
            /**
             * Warn if the element doesn't have an explicit key assigned to it.
             * This element is in an array. The array could grow and shrink or be
             * reordered. All children that haven't already been validated are required to
             * have a "key" property assigned to it. Error statuses are cached so a warning
             * will only be shown once.
             *
             * @internal
             * @param {ReactElement} element Element that requires a key.
             * @param {*} parentType element's parent's type.
             */

            function validateExplicitKey(element, parentType) {
              if (!element._store || element._store.validated || element.key != null) {
                return;
              }

              element._store.validated = true;
              const currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

              if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
                return;
              }

              ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
              // property, it may be the creator of the child that's responsible for
              // assigning it a key.

              let childOwner = '';

              if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
                // Give the component that originally created this child.
                childOwner = ` It was passed a child from ${getComponentName(
                  element._owner.type
                )}.`;
              }

              setCurrentlyValidatingElement(element);

              {
                error(
                  'Each child in a list should have a unique "key" prop.' +
                    '%s%s See https://fb.me/react-warning-keys for more information.',
                  currentComponentErrorInfo,
                  childOwner
                );
              }

              setCurrentlyValidatingElement(null);
            }
            /**
             * Ensure that every element either is passed in a static location, in an
             * array with an explicit keys property defined, or in an object literal
             * with valid key property.
             *
             * @internal
             * @param {ReactNode} node Statically passed child of any type.
             * @param {*} parentType node's parent's type.
             */

            function validateChildKeys(node, parentType) {
              if (typeof node !== 'object') {
                return;
              }

              if (Array.isArray(node)) {
                for (let i = 0; i < node.length; i++) {
                  const child = node[i];

                  if (isValidElement(child)) {
                    validateExplicitKey(child, parentType);
                  }
                }
              } else if (isValidElement(node)) {
                // This element was passed in a valid location.
                if (node._store) {
                  node._store.validated = true;
                }
              } else if (node) {
                const iteratorFn = getIteratorFn(node);

                if (typeof iteratorFn === 'function') {
                  // Entry iterators used to provide implicit keys,
                  // but now we print a separate warning for them later.
                  if (iteratorFn !== node.entries) {
                    const iterator = iteratorFn.call(node);
                    let step;

                    while (!(step = iterator.next()).done) {
                      if (isValidElement(step.value)) {
                        validateExplicitKey(step.value, parentType);
                      }
                    }
                  }
                }
              }
            }
            /**
             * Given an element, validate that its props follow the propTypes definition,
             * provided by the type.
             *
             * @param {ReactElement} element
             */

            function validatePropTypes(element) {
              {
                const { type } = element;

                if (type === null || type === undefined || typeof type === 'string') {
                  return;
                }

                const name = getComponentName(type);
                let propTypes;

                if (typeof type === 'function') {
                  propTypes = type.propTypes;
                } else if (
                  typeof type === 'object' &&
                  (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                    // Inner props are checked in the reconciler.
                    type.$$typeof === REACT_MEMO_TYPE)
                ) {
                  propTypes = type.propTypes;
                } else {
                  return;
                }

                if (propTypes) {
                  setCurrentlyValidatingElement(element);
                  checkPropTypes(
                    propTypes,
                    element.props,
                    'prop',
                    name,
                    ReactDebugCurrentFrame.getStackAddendum
                  );
                  setCurrentlyValidatingElement(null);
                } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
                  propTypesMisspellWarningShown = true;

                  error(
                    'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?',
                    name || 'Unknown'
                  );
                }

                if (
                  typeof type.getDefaultProps === 'function' &&
                  !type.getDefaultProps.isReactClassApproved
                ) {
                  error(
                    'getDefaultProps is only used on classic React.createClass ' +
                      'definitions. Use a static property named `defaultProps` instead.'
                  );
                }
              }
            }
            /**
             * Given a fragment, validate that it can only be provided with fragment props
             * @param {ReactElement} fragment
             */

            function validateFragmentProps(fragment) {
              {
                setCurrentlyValidatingElement(fragment);
                const keys = Object.keys(fragment.props);

                for (let i = 0; i < keys.length; i++) {
                  const key = keys[i];

                  if (key !== 'children' && key !== 'key') {
                    error(
                      'Invalid prop `%s` supplied to `React.Fragment`. ' +
                        'React.Fragment can only have `key` and `children` props.',
                      key
                    );

                    break;
                  }
                }

                if (fragment.ref !== null) {
                  error('Invalid attribute `ref` supplied to `React.Fragment`.');
                }

                setCurrentlyValidatingElement(null);
              }
            }
            function createElementWithValidation(type, props, children) {
              const validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
              // succeed and there will likely be errors in render.

              if (!validType) {
                let info = '';

                if (
                  type === undefined ||
                  (typeof type === 'object' && type !== null && Object.keys(type).length === 0)
                ) {
                  info +=
                    ' You likely forgot to export your component from the file ' +
                    "it's defined in, or you might have mixed up default and named imports.";
                }

                const sourceInfo = getSourceInfoErrorAddendumForProps(props);

                if (sourceInfo) {
                  info += sourceInfo;
                } else {
                  info += getDeclarationErrorAddendum();
                }

                let typeString;

                if (type === null) {
                  typeString = 'null';
                } else if (Array.isArray(type)) {
                  typeString = 'array';
                } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
                  typeString = `<${getComponentName(type.type) || 'Unknown'} />`;
                  info = ' Did you accidentally export a JSX literal instead of a component?';
                } else {
                  typeString = typeof type;
                }

                {
                  error(
                    'React.createElement: type is invalid -- expected a string (for ' +
                      'built-in components) or a class/function (for composite ' +
                      'components) but got: %s.%s',
                    typeString,
                    info
                  );
                }
              }

              const element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
              // TODO: Drop this when these are no longer allowed as the type argument.

              if (element == null) {
                return element;
              } // Skip key warning if the type isn't valid since our key validation logic
              // doesn't expect a non-string/function type and can throw confusing errors.
              // We don't want exception behavior to differ between dev and prod.
              // (Rendering will throw with a helpful message and as soon as the type is
              // fixed, the key warnings will appear.)

              if (validType) {
                for (let i = 2; i < arguments.length; i++) {
                  validateChildKeys(arguments[i], type);
                }
              }

              if (type === REACT_FRAGMENT_TYPE) {
                validateFragmentProps(element);
              } else {
                validatePropTypes(element);
              }

              return element;
            }
            let didWarnAboutDeprecatedCreateFactory = false;
            function createFactoryWithValidation(type) {
              const validatedFactory = createElementWithValidation.bind(null, type);
              validatedFactory.type = type;

              {
                if (!didWarnAboutDeprecatedCreateFactory) {
                  didWarnAboutDeprecatedCreateFactory = true;

                  warn(
                    'React.createFactory() is deprecated and will be removed in ' +
                      'a future major release. Consider using JSX ' +
                      'or use React.createElement() directly instead.'
                  );
                } // Legacy hook: remove it

                Object.defineProperty(validatedFactory, 'type', {
                  enumerable: false,
                  get() {
                    warn(
                      'Factory.type is deprecated. Access the class directly ' +
                        'before passing it to createFactory.'
                    );

                    Object.defineProperty(this, 'type', {
                      value: type
                    });
                    return type;
                  }
                });
              }

              return validatedFactory;
            }
            function cloneElementWithValidation(element, props, children) {
              const newElement = cloneElement.apply(this, arguments);

              for (let i = 2; i < arguments.length; i++) {
                validateChildKeys(arguments[i], newElement.type);
              }

              validatePropTypes(newElement);
              return newElement;
            }

            {
              try {
                const frozenObject = Object.freeze({});
                const testMap = new Map([[frozenObject, null]]);
                const testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
                // https://github.com/rollup/rollup/issues/1771
                // TODO: we can remove these if Rollup fixes the bug.

                testMap.set(0, 0);
                testSet.add(0);
              } catch (e) {}
            }

            const createElement$1 = createElementWithValidation;
            const cloneElement$1 = cloneElementWithValidation;
            const createFactory = createFactoryWithValidation;
            const Children = {
              map: mapChildren,
              forEach: forEachChildren,
              count: countChildren,
              toArray,
              only: onlyChild
            };

            exports.Children = Children;
            exports.Component = Component;
            exports.Fragment = REACT_FRAGMENT_TYPE;
            exports.Profiler = REACT_PROFILER_TYPE;
            exports.PureComponent = PureComponent;
            exports.StrictMode = REACT_STRICT_MODE_TYPE;
            exports.Suspense = REACT_SUSPENSE_TYPE;
            exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
            exports.cloneElement = cloneElement$1;
            exports.createContext = createContext;
            exports.createElement = createElement$1;
            exports.createFactory = createFactory;
            exports.createRef = createRef;
            exports.forwardRef = forwardRef;
            exports.isValidElement = isValidElement;
            exports.lazy = lazy;
            exports.memo = memo;
            exports.useCallback = useCallback;
            exports.useContext = useContext;
            exports.useDebugValue = useDebugValue;
            exports.useEffect = useEffect;
            exports.useImperativeHandle = useImperativeHandle;
            exports.useLayoutEffect = useLayoutEffect;
            exports.useMemo = useMemo;
            exports.useReducer = useReducer;
            exports.useRef = useRef;
            exports.useState = useState;
            exports.version = ReactVersion;
          })();
        }

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(0)));

      /***/
    },
    /* 6 */
    /***/ function (module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */ (function (process) {
        /**
         * Copyright (c) 2013-present, Facebook, Inc.
         *
         * This source code is licensed under the MIT license found in the
         * LICENSE file in the root directory of this source tree.
         */

        let printWarning = function () {};

        if (process.env.NODE_ENV !== 'production') {
          var ReactPropTypesSecret = __webpack_require__(7);
          var loggedTypeFailures = {};
          var has = Function.call.bind(Object.prototype.hasOwnProperty);

          printWarning = function (text) {
            const message = `Warning: ${text}`;
            if (typeof console !== 'undefined') {
              console.error(message);
            }
            try {
              // --- Welcome to debugging React ---
              // This error was thrown as a convenience so that you can use this stack
              // to find the callsite that caused this warning to fire.
              throw new Error(message);
            } catch (x) {}
          };
        }

        /**
         * Assert that the values match with the type specs.
         * Error messages are memorized and will only be shown once.
         *
         * @param {object} typeSpecs Map of name to a ReactPropType
         * @param {object} values Runtime values that need to be type-checked
         * @param {string} location e.g. "prop", "context", "child context"
         * @param {string} componentName Name of the component for error messages.
         * @param {?Function} getStack Returns the component stack.
         * @private
         */
        function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
          if (process.env.NODE_ENV !== 'production') {
            for (const typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error;
                // Prop type validation may throw. In case they do, we don't want to
                // fail the render phase where it didn't fail before. So we log it.
                // After these have been cleaned up, we'll let them throw.
                try {
                  // This is intentionally an invariant that gets caught. It's the same
                  // behavior as without this statement except with a better message.
                  if (typeof typeSpecs[typeSpecName] !== 'function') {
                    const err = Error(
                      `${
                        componentName || 'React class'
                      }: ${location} type \`${typeSpecName}\` is invalid; ` +
                        `it must be a function, usually from the \`prop-types\` package, but received \`${typeof typeSpecs[
                          typeSpecName
                        ]}\`.`
                    );
                    err.name = 'Invariant Violation';
                    throw err;
                  }
                  error = typeSpecs[typeSpecName](
                    values,
                    typeSpecName,
                    componentName,
                    location,
                    null,
                    ReactPropTypesSecret
                  );
                } catch (ex) {
                  error = ex;
                }
                if (error && !(error instanceof Error)) {
                  printWarning(
                    `${
                      componentName || 'React class'
                    }: type specification of ${location} \`${typeSpecName}\` is invalid; the type checker ` +
                      `function must return \`null\` or an \`Error\` but returned a ${typeof error}. ` +
                      `You may have forgotten to pass an argument to the type checker ` +
                      `creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ` +
                      `shape all require an argument).`
                  );
                }
                if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                  // Only monitor this failure once because there tends to be a lot of the
                  // same error.
                  loggedTypeFailures[error.message] = true;

                  const stack = getStack ? getStack() : '';

                  printWarning(
                    `Failed ${location} type: ${error.message}${stack != null ? stack : ''}`
                  );
                }
              }
            }
          }
        }

        /**
         * Resets warning cache when testing.
         *
         * @private
         */
        checkPropTypes.resetWarningCache = function () {
          if (process.env.NODE_ENV !== 'production') {
            loggedTypeFailures = {};
          }
        };

        module.exports = checkPropTypes;

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(0)));

      /***/
    },
    /* 7 */
    /***/ function (module, exports, __webpack_require__) {
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      const ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

      module.exports = ReactPropTypesSecret;

      /***/
    }
    /** ****/
  ]
);
