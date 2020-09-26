// @babel/preset-env 处理后的代码
"use strict";

var _a = require("./a.js");

var _b = require("./b.js");

//分析 入口模块的 内容 依赖
//内容： 借助babel 处理代码 生成代码片段（）
//依赖： 依赖模块（目的是模块的路径）
//babel-parser  =>  ast
//babel-traverse => 对ast进行crud
//babel-core babel-preset-env => 对ast 进行语法转换 生成thunk
console.log("".concat(_a.str, " ").concat(_b.str2));

//bundle 文件的格式
var f = function(){

}({})