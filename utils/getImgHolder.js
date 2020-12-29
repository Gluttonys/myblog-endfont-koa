"use strict";
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImgInfo = exports.getImgHolderList = exports.getImgHolder = void 0;
var isNumber = function (arg) { return typeof arg === 'number'; };
function getImgHolder() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var baseUrl = "https://picsum.photos";
  function dealWithOption(option) {
    var query = "";
    if (option.id)
      baseUrl += "/id/" + option.id;
    if (option.seed)
      baseUrl += '/seed/picsum';
    baseUrl += (option.width === option.height) ? "/" + option.width : "/" + option.width + "/" + option.height;
    if (option.grayscale)
      query += isNumber(option.grayscale) ? "grayscale=" + option.grayscale + "&" : 'grayscale&';
    if (option.blur)
      query += isNumber(option.blur) ? "blur=" + option.blur + "&" : 'blur&';
    if (option.random)
      query += "random=" + Math.random() + "&";
    baseUrl += query && "?" + query.slice(0, query.length - 1);
    if (option.jpg && option.webp) {
      console.error(" 不能同时选择 .jpg 和 .webp 两种格式， 请检查参数 ");
      throw new Error(" 不能同时选择 .jpg 和 .webp 两种格式， 请检查参数 ");
    }
    if (option.jpg)
      baseUrl += '.jpg';
    if (option.webp)
      baseUrl += '.webp';
    return baseUrl;
  }
  if (args.length === 0) {
    return dealWithOption({ width: 200, height: 200 });
  }
  else if (args.length === 1) {
    var arg = args[0];
    if (isNumber(arg)) {
      return dealWithOption({ width: arg, height: arg });
    }
    else {
      return dealWithOption(arg);
    }
  }
  else if (args.length === 2) {
    var arg_1 = args[0], arg_2 = args[1];
    if (isNumber(arg_2)) {
      return dealWithOption({ width: arg_1, height: arg_2 });
    }
    else {
      return dealWithOption(__assign(__assign({}, arg_2), { width: arg_1, height: arg_1 }));
    }
  }
  else if (args.length === 3) {
    var width = args[0], height = args[1], option = args[2];
    return dealWithOption(__assign(__assign({}, option), { width: width, height: height }));
  }
  return new Error("🚀🚀🚀 参数传递错误 🚀🚀🚀");
}
// exports.getImgHolder = getImgHolder;
function getImgHolderList() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var url = "https://picsum.photos/v2/list";
  if (args.length)
    url += "/?page=" + args[0] + "&limit=" + args[1];
  return fetch(url).then(function (res) { return res.json(); });
}
// exports.getImgHolderList = getImgHolderList;
function getImgInfo(id) {
  return fetch("https://picsum.photos/id/" + id + "/info").then(function (res) { return res.json(); });
}
// exports.getImgInfo = getImgInfo;

export {
  getImgHolder,
  getImgHolderList,
  getImgInfo
}

