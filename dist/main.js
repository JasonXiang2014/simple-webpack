(function(modules){
        function require(module){
            function newRequire(relativePath){
                return require(modules[module].dependencies[relativePath])
            }
            var exports = {};
            (function(require,exports,code){
                eval(code)
            })(newRequire, exports, modules[module].code)
            return exports;
        }
        require('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./a.js":"./src/a.js","./b.js":"./src/b.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nvar _b = require(\"./b.js\");\n\n//分析 入口模块的 内容 依赖\n//内容： 借助babel 处理代码 生成代码片段（）\n//依赖： 依赖模块（目的是模块的路径）\n//babel-parser  =>  ast\n//babel-traverse => 对ast进行crud\n//babel-core babel-preset-env => 对ast 进行语法转换 生成thunk\nconsole.log(\"\".concat(_a.str, \" \").concat(_b.str2));"},"./src/a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\nvar str = 'webpack';\nexports.str = str;"},"./src/b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str2 = void 0;\nvar str2 = 'webpack2';\nexports.str2 = str2;"}})