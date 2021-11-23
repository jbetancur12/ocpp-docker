"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "client_components_QR2_js";
exports.ids = ["client_components_QR2_js"];
exports.modules = {

/***/ "./client/components/QR2.js":
/*!**********************************!*\
  !*** ./client/components/QR2.js ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ QR)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_qr_reader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-qr-reader */ \"react-qr-reader\");\n/* harmony import */ var react_qr_reader__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_qr_reader__WEBPACK_IMPORTED_MODULE_1__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\nfunction QR() {\n  const [result, SetResult] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(\"No result\");\n\n  const handleScan = data => {\n    if (data) {\n      SetResult(data);\n    }\n  };\n\n  const handleError = err => {\n    console.error(err);\n  };\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react_qr_reader__WEBPACK_IMPORTED_MODULE_1___default()), {\n    delay: 300,\n    onError: handleError,\n    onScan: handleScan,\n    style: {\n      width: \"100%\"\n    }\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"p\", null, result));\n}\n\n__signature__(QR, \"useState{[result, SetResult](\\\"No result\\\")}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(QR, \"QR\", \"/home/jorge/tutorials/mern/skeleton/client/components/QR2.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://occp/./client/components/QR2.js?");

/***/ })

};
;