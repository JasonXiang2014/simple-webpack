const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");
module.exports = class Webpack {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
    this.modules = [];
  }

  run() {
    const info = this.parse(this.entry);
    //递归处理所有依赖
    this.modules.push(info);
    for (let i = 0; i < this.modules.length; i++) {
      let item = this.modules[i];
      const { dependencies } = item;
      if (dependencies) {
        for (let j in dependencies) {
          this.modules.push(this.parse(dependencies[j]));
        }
      }
    }
    //修改数组结构 数组转对象
    const obj = {};
    this.modules.forEach(item => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code
      };
    });
    //代码生成，文件生成
    // console.log(obj);
    this.file(obj);
  }

  parse(entryFile) {
    const content = fs.readFileSync(entryFile, "utf-8");
    const ast = parser.parse(content, {
      // parse in strict mode and allow module declarations
      sourceType: "module",
      plugins: [
        // enable jsx and flow syntax
        "jsx",
        "flow"
      ]
    });
    const dependencies = {};
    traverse(ast, {
      ImportDeclaration: function({ node }) {
        const newPathName =
          "./" + path.join(path.dirname(entryFile), node.source.value);
        dependencies[node.source.value] = newPathName;
      }
    });

    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });
    return {
      entryFile,
      dependencies,
      code
    };
  }

  file(code) {
    const { path: filePath, filename } = this.output;
    const fieePath = path.join(filePath, filename);
    const newCode = JSON.stringify(code);
    const bundle = `(function(modules){
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
        require('${this.entry}')
    })(${newCode})`;
    fs.writeFileSync(fieePath, bundle, "utf-8");
  }
};
