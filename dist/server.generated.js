/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n  env: \"development\" || 0,\n  port: process.env.PORT || 3030,\n  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',\n  mongoUri: // 'mongodb+srv://mongo:mongo@cluster0.iwcxlbe.mongodb.net?retryWrites=true&w=majorityrs' ||\n  process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/ocpp'\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://occp/./config/config.js?");

/***/ }),

/***/ "./server/centralSystem.js":
/*!*********************************!*\
  !*** ./server/centralSystem.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createServer\": () => (/* binding */ createServer)\n/* harmony export */ });\n/* harmony import */ var _ocpp_src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ocpp/src */ \"./server/ocpp/src/index.js\");\n/* harmony import */ var _ocpp_src_commands_Authorize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ocpp/src/commands/Authorize */ \"./server/ocpp/src/commands/Authorize.js\");\n/* harmony import */ var _ocpp_src_commands_StartTransaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ocpp/src/commands/StartTransaction */ \"./server/ocpp/src/commands/StartTransaction.js\");\n/* harmony import */ var _ocpp_src_ocppError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ocpp/src/ocppError */ \"./server/ocpp/src/ocppError.js\");\n/* harmony import */ var _ocpp_src_commands_BootNotification__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ocpp/src/commands/BootNotification */ \"./server/ocpp/src/commands/BootNotification.js\");\n/* harmony import */ var _ocpp_src_commands_StatusNotification__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ocpp/src/commands/StatusNotification */ \"./server/ocpp/src/commands/StatusNotification.js\");\n/* harmony import */ var _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/chargerPoint.model */ \"./server/models/chargerPoint.model.js\");\n/* harmony import */ var _models_transaction_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/transaction.model */ \"./server/models/transaction.model.js\");\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _models_transactionId_model__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/transactionId.model */ \"./server/models/transactionId.model.js\");\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var _models_cost_model__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./models/cost.model */ \"./server/models/cost.model.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst getCPData = payload => {\n  return {\n    charge_point_vendor: payload.chargePointVendor || '',\n    charge_point_model: payload.chargePointModel || '',\n    charge_point_serial_number: payload.chargePointSerialNumber || '',\n    charge_box_serial_number: payload.chargeBoxSerialNumber || '',\n    fw_version: payload.firmwareVersion || '',\n    iccid: payload.iccid || '',\n    imsi: payload.imsi || '',\n    meter_type: payload.meterType || '',\n    meter_serial_number: payload.meterSerialNumber || '',\n    registration_status: 'Accepted'\n  };\n};\n\nconst concatenate = (command, client) => {\n  const ui = Math.round(Date.now() + Math.random());\n  const connectorIdx = client.info.connectors.findIndex(item => {\n    return command.connectorId === item.connectorId;\n  });\n  const uid = '' + ui + client.info.connectors[connectorIdx].connectorId;\n\n  if (connectorIdx === -1) {\n    client.info.connectors.push({});\n  } else {\n    client.info.connectors[connectorIdx] = { ...client.info.connectors[connectorIdx],\n      ...{\n        transactionId: uid\n      }\n    };\n    return uid;\n  }\n};\n\nfunction createServer(server) {\n  const cSystem = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.CentralSystem({\n    validateConnection,\n    wsOptions: {\n      server\n    }\n  });\n\n  const getChargerPointId = async connectionUrl => {\n    const chargerPoint = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n      charger_box_id: connectionUrl.slice(1)\n    }, '_id');\n    return chargerPoint._id;\n  };\n\n  const getUserId = async idTag => {\n    const user = await _models_user_model__WEBPACK_IMPORTED_MODULE_10__[\"default\"].findOne({\n      id_tag: idTag\n    }, 'id_tag');\n    return user && user._id ? user._id : \"6414f16aca152004ab6afc4d\";\n  };\n\n  const getNextSequenceId = async () => {\n    let seq;\n    const count = await _models_transactionId_model__WEBPACK_IMPORTED_MODULE_9__[\"default\"].findOneAndUpdate({\n      id: \"transactionIDCount\"\n    }, {\n      \"$inc\": {\n        \"transactionId\": 1\n      }\n    }, {\n      new: true\n    });\n\n    if (count == null) {\n      const newVal = new _models_transactionId_model__WEBPACK_IMPORTED_MODULE_9__[\"default\"]({\n        id: \"transactionIDCount\",\n        transactionId: 1\n      });\n      newVal.save();\n      seq = 1;\n    } else {\n      seq = count.transactionId;\n    }\n\n    return seq;\n  };\n\n  const createTransaction = async (chargerPointId, userId, command, sequenceId) => {\n    const dataTransaction = new _models_transaction_model__WEBPACK_IMPORTED_MODULE_7__[\"default\"]({\n      chargerPointId,\n      transactionId: sequenceId,\n      user: userId,\n      connectorId: command.connectorId,\n      start_timestamp: command.timestamp,\n      start_value: command.meterStart,\n      stop_timestamp: command.timestamp,\n      stop_value: command.meterStart\n    });\n    return dataTransaction.save();\n  };\n\n  const handleStartTransactionCommand = async (client, command) => {\n    client.payload = {\n      command: \"StartTransaction\",\n      data: { ...command\n      }\n    };\n    await cSystem.onStatusUpdate();\n    const chargerPointId = await getChargerPointId(client.connection.url);\n    const userId = await getUserId(command.idTag);\n    const seq = await getNextSequenceId();\n    console.log(\"🚀 ~ file: centralSystem.js:125 ~ userId:\", userId);\n    const transaction = await createTransaction(chargerPointId, userId, command, seq);\n    console.log(\"🚀 ~ file: centralSystem.js:149 ~ dataTransaction:\", transaction);\n    return {\n      transactionId: seq,\n      idTagInfo: {\n        status: _ocpp_src_commands_StartTransaction__WEBPACK_IMPORTED_MODULE_2__.STATUS_ACCEPTED\n      }\n    };\n  };\n\n  cSystem.listen(null);\n\n  cSystem.onStatusUpdate = async function () {};\n\n  cSystem.onRequest = async function (client, command) {\n    const connection = client.connection; // console.info(`New command from ${connection.url}`);\n\n    switch (true) {\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.BootNotification:\n        client.payload = {\n          command: \"BootNotification\",\n          data: { ...command\n          }\n        };\n        let chargerPoint = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n          charger_box_id: connection.url.substring(1)\n        });\n\n        if (!chargerPoint) {\n          console.info('ChargerPoint does not exist in DB');\n          return {\n            status: _ocpp_src_commands_BootNotification__WEBPACK_IMPORTED_MODULE_4__.STATUS_REJECTED,\n            currentTime: new Date().toISOString(),\n            interval: 30\n          };\n        }\n\n        console.info('ChargerPoint  exists in DB');\n        await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findByIdAndUpdate(chargerPoint._id, getCPData(command));\n        await cSystem.onStatusUpdate();\n        return {\n          status: _ocpp_src_commands_BootNotification__WEBPACK_IMPORTED_MODULE_4__.STATUS_ACCEPTED,\n          currentTime: new Date().toISOString(),\n          interval: 28800 // 8 horas\n\n        };\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.Authorize:\n        return {\n          idTagInfo: {\n            status: _ocpp_src_commands_Authorize__WEBPACK_IMPORTED_MODULE_1__.STATUS_ACCEPTED\n          }\n        };\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.MeterValues:\n        console.log(\"🚀 ~ file: centralSystem.js:105 ~ command:\", command);\n        client.payload = {\n          command: \"MeterValues\",\n          data: { ...command\n          }\n        };\n        await cSystem.onStatusUpdate();\n        return null;\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StartTransaction:\n        // client.payload = {\n        //     command: \"StartTransaction\",\n        //     data: { ...command },\n        // };\n        // await cSystem.onStatusUpdate();\n        // const url = client.connection.url\n        // const CP = await ChargerPoint.find({ charger_box_id: url.slice(1) }, '_id')\n        // const userId = await User.find({ id_tag: command.idTag }, 'id_tag')\n        // console.log(\"🚀 ~ file: centralSystem.js:125 ~ userId:\", userId)\n        // const _userId = []\n        // let seq;\n        // if (userId.length == 0) {\n        //     _userId.push(\"6414f16aca152004ab6afc4d\")\n        // } else {\n        //     _userId.push(userId[0]._id)\n        // }\n        // await TransactionId.findOneAndUpdate(\n        //     { id: \"transactionIDCount\" },\n        //     { \"$inc\": { \"transactionId\": 1 } },\n        //     { new: true }, (err, cd) => {\n        //         let seqId;\n        //         if (cd == null) {\n        //             const newVal = new TransactionId({ id: \"transactionIDCount\", transactionId: 1 })\n        //             newVal.save()\n        //             seqId = 1\n        //         } else {\n        //             seqId = cd.transactionId\n        //         }\n        //         seq = seqId\n        //         const dataTransaction = new Transaction({\n        //             chargerPointId: CP[0]._id,\n        //             transactionId: seq,\n        //             user: _userId[0],\n        //             connectorId: command.connectorId,\n        //             start_timestamp: command.timestamp,\n        //             start_value: command.meterStart,\n        //             stop_timestamp: command.timestamp,\n        //             stop_value: command.meterStart\n        //         })\n        //         console.log(\"🚀 ~ file: centralSystem.js:149 ~ dataTransaction:\", dataTransaction)\n        //         dataTransaction.save()\n        //     }\n        // )\n        // return {\n        //     transactionId: 98,\n        //     idTagInfo: {\n        //         status: StartTransactionConst.STATUS_ACCEPTED,\n        //     },\n        // };\n        const data = handleStartTransactionCommand(client, command);\n        console.log(\"🚀 ~ file: centralSystem.js:244 ~ data:\", data);\n        return data;\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StopTransaction:\n        client.payload = {\n          command: \"StopTransaction\",\n          data: { ...command\n          }\n        };\n        await cSystem.onStatusUpdate();\n        const price = await _models_cost_model__WEBPACK_IMPORTED_MODULE_11__[\"default\"].findOne({\n          name: \"Main\"\n        });\n        const unitPrice = parseInt(price.cost) * (parseInt(command.meterStop) / 1000);\n        const m = await _models_transaction_model__WEBPACK_IMPORTED_MODULE_7__[\"default\"].findOneAndUpdate({\n          transactionId: command.transactionId\n        }, {\n          stop_value: command.meterStop,\n          stop_timestamp: command.timestamp,\n          cost: unitPrice\n        }, {\n          new: true\n        });\n        return {\n          transactionId: command.transactionId,\n          idTagInfo: {\n            status: _ocpp_src_commands_StartTransaction__WEBPACK_IMPORTED_MODULE_2__.STATUS_ACCEPTED\n          }\n        };\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.Heartbeat:\n        return {\n          currentTime: new Date().toISOString()\n        };\n\n      case command instanceof _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StatusNotification:\n        // client.info = client.info || {};\n        // client.info.connectors = client.info.connectors || [];\n        // const connectorIndex = client.info.connectors.findIndex((item) => {\n        //     return command.connectorId === item.connectorId;\n        // });\n        // if (connectorIndex === -1) {\n        //     client.info.connectors.push({\n        //         ...command,\n        //     });\n        // } else {\n        //     client.info.connectors[connectorIndex] = {\n        //         ...command,\n        //     };\n        // }\n        // client.info.payload = command\n        client.payload = {\n          command: \"StatusNotification\",\n          data: { ...command\n          }\n        };\n        await cSystem.onStatusUpdate();\n        return {};\n\n      default:\n        throw new _ocpp_src_ocppError__WEBPACK_IMPORTED_MODULE_3__[\"default\"](_ocpp_src_ocppError__WEBPACK_IMPORTED_MODULE_3__.ERROR_NOTIMPLEMENTED, 'Unknown command');\n    }\n  };\n\n  cSystem.reset = async client => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.Reset({\n      type: \"Soft\"\n    });\n    return await client.connection.send(command);\n  };\n\n  cSystem.getConf = async client => {\n    //console.log(\"🚀 ~ file: centralSystem.js:235 ~ cSystem.getConf= ~ client:\", client)\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.GetConfiguration();\n    return await client.connection.send(command);\n  };\n\n  cSystem.triggerMessage = async (client, requestedMessage) => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.TriggerMessage({\n      requestedMessage: requestedMessage\n    });\n    return await client.connection.send(command);\n  };\n\n  cSystem.setConfig = async (client, data) => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.ChangeConfiguration(data);\n    return await client.connection.send(command);\n  };\n\n  cSystem.unlock = async client => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.UnlockConnector({\n      connectorId: 1\n    });\n    return await client.connection.send(command);\n  };\n\n  cSystem.clearCache = async client => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.ClearCache();\n    return await client.connection.send(command);\n  };\n\n  cSystem.stop = async (client, tId) => {\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.RemoteStopTransaction({\n      transactionId: tId\n    });\n    return await client.connection.send(command);\n  };\n\n  cSystem.toggleChargePoint = async (client, connectorId, idTag) => {\n    // const connector = client.info.connectors.find(\n    //     (item) => connectorId.toString() === item.connectorId.toString(),\n    // );\n    // if (!connector) {\n    //     return null;\n    // }\n    // if (connector.status !== StatusNotificationConst.STATUS_AVAILABLE) {\n    //     let command = new OCPPCommands.RemoteStopTransaction({\n    //         transactionId: connectorId,\n    //     });\n    //     return await client.connection.send(command);\n    // }\n    console.log(\"===>\", connectorId, idTag);\n    let command = new _ocpp_src__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.RemoteStartTransaction({\n      connectorId: connectorId,\n      idTag\n    });\n    return await client.connection.send(command);\n  };\n\n  return cSystem;\n\n  async function validateConnection(url) {\n    let chargerPoint = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n      charger_box_id: url.substring(1)\n    });\n\n    if (chargerPoint) {\n      return true;\n    }\n\n    return false;\n  }\n}\n\nfunction timeout(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\n//# sourceURL=webpack://occp/./server/centralSystem.js?");

/***/ }),

/***/ "./server/controllers/auth.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/auth.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_jwt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../config/config */ \"./config/config.js\");\n\n\n\n\n\nconst signin = async (req, res) => {\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      email: req.body.email\n    });\n    if (!user) return res.status('401').json({\n      error: 'User not found'\n    });\n\n    if (!user.authenticate(req.body.password)) {\n      return res.status('401').send({\n        error: \"Email and password don't match.\"\n      });\n    }\n\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n      _id: user._id\n    }, _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret);\n    res.cookie('t', token, {\n      expire: new Date() + 9999\n    });\n    return res.json({\n      token,\n      user: {\n        _id: user._id,\n        name: user.name,\n        email: user.email\n      }\n    });\n  } catch (err) {\n    return res.status('401').json({\n      error: 'Could not sign in'\n    });\n  }\n};\n\nconst signout = (req, res) => {\n  res.clearCookie('t');\n  return res.status('200').json({\n    message: 'signed out'\n  });\n};\n\nconst requireSignin = express_jwt__WEBPACK_IMPORTED_MODULE_2___default()({\n  secret: _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret,\n  userProperty: 'auth',\n  algorithms: ['sha1', 'RS256', 'HS256']\n});\n\nconst hasAuthorization = (req, res, next) => {\n  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;\n\n  if (!authorized) {\n    return res.status('403').json({\n      error: 'User is not authorized'\n    });\n  }\n\n  next();\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  signin,\n  signout,\n  requireSignin,\n  hasAuthorization\n});\n\n//# sourceURL=webpack://occp/./server/controllers/auth.controller.js?");

/***/ }),

/***/ "./server/controllers/chargerPoint.controller.js":
/*!*******************************************************!*\
  !*** ./server/controllers/chargerPoint.controller.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/chargerPoint.model */ \"./server/models/chargerPoint.model.js\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend */ \"lodash/extend\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../server */ \"./server/server.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _models_transactionId_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/transactionId.model */ \"./server/models/transactionId.model.js\");\n/* harmony import */ var _models_transaction_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../models/transaction.model */ \"./server/models/transaction.model.js\");\n\n\n\n\n\n\n\n\nconst create = async (req, res) => {\n  const chargerPoint = new _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n\n  try {\n    await chargerPoint.save();\n    return res.status(200).json({\n      message: 'Charger Point Successfully created!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst list = async (req, res) => {\n  try {\n    let chargerPoints = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find();\n    res.json(chargerPoints);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst chargerPointByID = async (req, res, next, id) => {\n  try {\n    let chargerPoint = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({\n      _id: id\n    });\n    if (!chargerPoint) return res.status('400').json({\n      error: 'ChargerPoint not found'\n    });\n    req.cp = chargerPoint;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve chargerPoint'\n    });\n  }\n};\n\nconst read = async (req, res) => {\n  // console.log(req)\n  console.log('%cchargerPoint.controller.js line:51 req.params.station', 'color: #007acc;', req.params.station);\n\n  try {\n    let chargerPoint = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      charger_box_id: req.params.station\n    });\n    if (!chargerPoint) return res.status('400').json({\n      error: 'ChargerPoint not found'\n    });\n    res.json(chargerPoint);\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve chargerPoint'\n    });\n  }\n};\n\nconst update = async (req, res) => {\n  try {\n    let chargerPoint = req.cp;\n    chargerPoint = lodash_extend__WEBPACK_IMPORTED_MODULE_1___default()(chargerPoint, req.body);\n    chargerPoint.updated = Date.now();\n    await chargerPoint.save();\n    res.json(chargerPoint);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst reset = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (idf !== -1) {\n    const result = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.reset(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf]);\n    console.log(result);\n    res.write(JSON.stringify(result));\n  }\n\n  res.end();\n  return;\n};\n\nconst getConf = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  console.log(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients); // Cambiar\n\n  if (idf !== -1) {\n    //f (true) {\n    const result = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.getConf( // Cambiar\n    // centralSystem.clients[idf]\n    _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[0]);\n    res.write(JSON.stringify(result));\n  }\n\n  res.end();\n  return;\n};\n\nconst triggerMessage = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (true) {\n    const result = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.triggerMessage(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[0], \"MeterValues\");\n    res.write(JSON.stringify(result));\n  }\n\n  res.end();\n  return;\n};\n\nconst unlock = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (idf !== -1) {\n    const result = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.unlock(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf]);\n    res.write(JSON.stringify(result));\n  }\n\n  res.end();\n  return;\n};\n\nconst clearCache = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (idf !== -1) {\n    const result = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clearCache(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf]);\n    res.write(JSON.stringify(result));\n  }\n\n  res.end();\n  return;\n};\n\nconst remoteStart = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    console.log(\"🚀 ~ file: chargerPoint.controller.js:161 ~ idf ~ idf\", o.connection.req.url);\n    console.log(\"🚀 ~ file: chargerPoint.controller.js:162 ~ idf ~ idf\", req.body.id);\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (idf !== -1) {\n    const ms = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.toggleChargePoint(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf], parseInt(req.body.connector), \"83FA81A40292\" //req.body.transactionId\n    );\n    res.write(JSON.stringify(ms));\n  } else {\n    res.write(\"No se encontro conexcion con el CP\");\n  }\n\n  res.end();\n  return;\n};\n\nconst stop = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  if (idf !== -1) {\n    const client = _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf].connection.req.url.slice(1);\n    console.log(\"🚀 ~ file: chargerPoint.controller.js:187 ~ stop ~ client\", client);\n    const CP = await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      charger_box_id: client\n    });\n    console.log(\"🚀 ~ file: chargerPoint.controller.js:216 ~ stop ~ CP:\", CP);\n    const transactionId = await _models_transaction_model__WEBPACK_IMPORTED_MODULE_6__[\"default\"].find({\n      chargerPointId: CP._id\n    }).sort({\n      createdAt: -1\n    }).limit(1);\n    console.log(\"🚀 ~ file: chargerPoint.controller.js:188 ~ stop ~ transactionId\", transactionId);\n    const ms = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.stop(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf], transactionId[0].transactionId);\n    res.write(JSON.stringify(ms));\n  }\n\n  res.end();\n  return;\n};\n\nconst setConfig = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n\n  const {\n    data\n  } = req.body; // Cambiar\n\n  if (idf !== -1) {\n    //if (true) {\n    const ms = await _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.setConfig( // Cambiar\n    // centralSystem.clients[idf],\n    _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[0], data);\n    res.write(JSON.stringify(ms));\n  }\n\n  res.end();\n  return;\n};\n\nconst remove = async (req, res) => {\n  try {\n    let chargerPoint = req.cp;\n    await _models_chargerPoint_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].deleteOne({\n      charger_box_id: chargerPoint.charger_box_id\n    }).then(function (data) {\n      res.json(data);\n      console.log(data); // Success\n    }).catch(function (error) {\n      console.log(error); // Failure\n    });\n  } catch (err) {\n    console.log(err);\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst clients = async (req, res) => {\n  try {\n    const getClients = _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients.map(client => client.connection.req.url);\n    res.json(getClients);\n  } catch (error) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst status = async (req, res) => {\n  res.setHeader('Content-Type', 'text/event-stream');\n  res.setHeader('Access-Control-Allow-Origin', '*');\n  onDigits2(req, res);\n\n  _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.onStatusUpdate = () => onDigits2(req, res);\n};\n\nfunction onDigits2(req, res) {\n  const data = _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients.map(client => {\n    return {\n      ocpp: {\n        id: client.connection.req.url\n      },\n      payload: client.payload\n    };\n  });\n  res.write(`data: ${JSON.stringify(data)}\\n\\n`);\n  res.on('close', () => {\n    res.end();\n  });\n}\n\nfunction onDigits(req, res) {\n  const intervalId = setInterval(() => {\n    const data = _server__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients.map(client => {\n      return {\n        id: client.connection.req.url,\n        ...client.info\n      };\n    });\n    res.write(`data: ${JSON.stringify(data)}\\n\\n`);\n  }, 5000);\n  res.on('close', () => {\n    clearInterval(intervalId);\n    res.end();\n  });\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  chargerPointByID,\n  read,\n  list,\n  remove,\n  update,\n  status,\n  clients,\n  remoteStart,\n  reset,\n  getConf,\n  triggerMessage,\n  clearCache,\n  unlock,\n  stop,\n  setConfig\n});\n\n//# sourceURL=webpack://occp/./server/controllers/chargerPoint.controller.js?");

/***/ }),

/***/ "./server/controllers/cost.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/cost.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_cost_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/cost.model */ \"./server/models/cost.model.js\");\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n\n\n\nconst create = async (req, res) => {\n  const cost = new _models_cost_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n\n  try {\n    await cost.save();\n    return res.status(200).json({\n      message: 'Cost Successfully created!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst list = async (req, res) => {\n  try {\n    let costs = await _models_cost_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find();\n    res.json(costs);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  list\n});\n\n//# sourceURL=webpack://occp/./server/controllers/cost.controller.js?");

/***/ }),

/***/ "./server/controllers/transaction.controller.js":
/*!******************************************************!*\
  !*** ./server/controllers/transaction.controller.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_transaction_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/transaction.model */ \"./server/models/transaction.model.js\");\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n\n\n\nconst create = async (req, res) => {\n  const transaction = new _models_transaction_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n\n  try {\n    await transaction.save();\n    return res.status(200).json({\n      message: 'Transaction Successfully created!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst list = async (req, res) => {\n  try {\n    let transactions = await _models_transaction_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find();\n    res.json(transactions);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  list\n});\n\n//# sourceURL=webpack://occp/./server/controllers/transaction.controller.js?");

/***/ }),

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend */ \"lodash/extend\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n\nconst create = async (req, res) => {\n  const idTag = (0,uuid__WEBPACK_IMPORTED_MODULE_3__.v4)().slice(-12).toLocaleUpperCase();\n  const user = new _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({ ...req.body,\n    id_tag: idTag\n  });\n\n  try {\n    await user.save();\n    return res.status(200).json({\n      message: 'Successfully signed up!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst list = async (req, res) => {\n  try {\n    let users = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find().select('name email updated created');\n    res.json(users);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst userByID = async (req, res, next, id) => {\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id);\n    if (!user) return res.status('400').json({\n      error: 'User not found'\n    });\n    req.profile = user;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve user'\n    });\n  }\n};\n\nconst read = (req, res) => {\n  req.profile.hashed_password = undefined;\n  req.profile.salt = undefined;\n  return res.json(req.profile);\n};\n\nconst update = async (req, res) => {\n  try {\n    let user = req.profile;\n    user = lodash_extend__WEBPACK_IMPORTED_MODULE_1___default()(user, req.body);\n    user.updated = Date.now();\n    await user.save();\n    user.hashed_password = undefined;\n    user.salt = undefined;\n    res.json(user);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst remove = async (req, res) => {\n  try {\n    let user = req.profile;\n    let deletedUser = await user.remove();\n    deletedUser.hashed_password = undefined;\n    deletedUser.salt = undefined;\n    res.json(deletedUser);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  userByID,\n  read,\n  list,\n  remove,\n  update\n});\n\n//# sourceURL=webpack://occp/./server/controllers/user.controller.js?");

/***/ }),

/***/ "./server/express.js":
/*!***************************!*\
  !*** ./server/express.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! helmet */ \"helmet\");\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _routes_user_routes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routes/user.routes */ \"./server/routes/user.routes.js\");\n/* harmony import */ var _routes_auth_routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes/auth.routes */ \"./server/routes/auth.routes.js\");\n/* harmony import */ var _routes_chargerPoint_routes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./routes/chargerPoint.routes */ \"./server/routes/chargerPoint.routes.js\");\n/* harmony import */ var _routes_cost_routes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./routes/cost.routes */ \"./server/routes/cost.routes.js\");\n/* harmony import */ var _routes_transaction_routes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./routes/transaction.routes */ \"./server/routes/transaction.routes.js\");\n/* harmony import */ var _sse__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sse */ \"./server/sse.js\");\n/* harmony import */ var _sse__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_sse__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\n\n\n\n\n\n\n\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()();\n/*... configure express ... */\n\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default().json());\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default().urlencoded({\n  extended: true\n}));\napp.use(cookie_parser__WEBPACK_IMPORTED_MODULE_1___default()()); //app.use(compress());\n\napp.use(helmet__WEBPACK_IMPORTED_MODULE_3___default()());\napp.use(cors__WEBPACK_IMPORTED_MODULE_2___default()());\napp.use((_sse__WEBPACK_IMPORTED_MODULE_9___default()));\napp.use('/', _routes_user_routes__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\napp.use('/', _routes_auth_routes__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\napp.use('/', _routes_chargerPoint_routes__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\napp.use('/', _routes_cost_routes__WEBPACK_IMPORTED_MODULE_7__[\"default\"]);\napp.use('/', _routes_transaction_routes__WEBPACK_IMPORTED_MODULE_8__[\"default\"]);\napp.use((err, req, res, next) => {\n  if (err.name === 'UnauthorizedError') {\n    res.status(401).json({\n      error: err.name + ': ' + err.message\n    });\n  } else if (err) {\n    res.status(400).json({\n      error: err.name + ': ' + err.message\n    });\n    console.log(err);\n  }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n//# sourceURL=webpack://occp/./server/express.js?");

/***/ }),

/***/ "./server/helpers/dbErrorHandler.js":
/*!******************************************!*\
  !*** ./server/helpers/dbErrorHandler.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/**\n * Get unique error field name\n */\n\nconst getUniqueErrorMessage = err => {\n  let output;\n\n  try {\n    let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));\n    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';\n  } catch (ex) {\n    output = 'Unique field already exists';\n  }\n\n  return output;\n};\n/**\n * Get the error message from error object\n */\n\n\nconst getErrorMessage = err => {\n  let message = '';\n\n  if (err.code) {\n    switch (err.code) {\n      case 11000:\n      case 11001:\n        message = getUniqueErrorMessage(err);\n        break;\n\n      default:\n        message = 'Something went wrong';\n    }\n  } else {\n    for (let errName in err.errors) {\n      if (err.errors[errName].message) message = err.errors[errName].message;\n    }\n  }\n\n  return message;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  getErrorMessage\n});\n\n//# sourceURL=webpack://occp/./server/helpers/dbErrorHandler.js?");

/***/ }),

/***/ "./server/models/chargerPoint.model.js":
/*!*********************************************!*\
  !*** ./server/models/chargerPoint.model.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst ChargerPointSchema = new Schema({\n  charger_box_id: {\n    type: String,\n    required: true\n  },\n  connectors: {\n    type: String,\n    required: true\n  },\n  ocpp_protocol: {\n    type: String,\n    required: false\n  },\n  registration_status: {\n    type: String,\n    required: false\n  },\n  charge_point_vendor: {\n    type: String,\n    required: false\n  },\n  charger_point_model: {\n    type: String,\n    required: false\n  },\n  charger_point_serial_number: {\n    type: String,\n    required: false\n  },\n  charger_box_serial_number: {\n    type: String,\n    required: false\n  },\n  fw_version: {\n    type: String,\n    required: false\n  },\n  fw_update_status: {\n    type: String,\n    required: false\n  },\n  fw_update_timestamp: {\n    type: Date,\n    required: false\n  },\n  meter_type: {\n    type: String,\n    required: false\n  },\n  meter_serial_number: {\n    type: String,\n    required: false\n  },\n  diagnostics_status: {\n    type: String,\n    required: false\n  },\n  diagnostics_timestamp: {\n    type: Date,\n    required: false\n  },\n  last_heartbeat_timestamp: {\n    type: Date,\n    required: false\n  },\n  iccid: {\n    type: String,\n    required: false\n  },\n  imsi: {\n    type: String,\n    required: false\n  },\n  description: {\n    type: String,\n    required: false\n  },\n  note: {\n    type: String,\n    required: false\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('ChargerPoint', ChargerPointSchema));\n\n//# sourceURL=webpack://occp/./server/models/chargerPoint.model.js?");

/***/ }),

/***/ "./server/models/cost.model.js":
/*!*************************************!*\
  !*** ./server/models/cost.model.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst CostSchema = new Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  cost: {\n    type: String,\n    required: true\n  }\n}, {\n  timestamps: true\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('Cost', CostSchema));\n\n//# sourceURL=webpack://occp/./server/models/cost.model.js?");

/***/ }),

/***/ "./server/models/transaction.model.js":
/*!********************************************!*\
  !*** ./server/models/transaction.model.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst TransactionSchema = new Schema({\n  chargerPointId: {\n    type: String,\n    required: true\n  },\n  transactionId: {\n    type: Number,\n    required: true\n  },\n  user: {\n    type: String,\n    required: true\n  },\n  connectorId: {\n    type: Number,\n    required: true\n  },\n  start_timestamp: {\n    type: Date,\n    required: true\n  },\n  start_value: {\n    type: Number,\n    required: true\n  },\n  stop_timestamp: {\n    type: Date,\n    required: true\n  },\n  stop_value: {\n    type: Number,\n    required: true\n  },\n  cost: {\n    type: String\n  }\n}, {\n  timestamps: true\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('Transaction', TransactionSchema));\n\n//# sourceURL=webpack://occp/./server/models/transaction.model.js?");

/***/ }),

/***/ "./server/models/transactionId.model.js":
/*!**********************************************!*\
  !*** ./server/models/transactionId.model.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst TransactionIdSchema = new Schema({\n  id: {\n    type: String,\n    required: true\n  },\n  transactionId: {\n    type: Number,\n    required: true\n  }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('TransactionId', TransactionIdSchema));\n\n//# sourceURL=webpack://occp/./server/models/transactionId.model.js?");

/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst UserSchema = new Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: 'Name is required'\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: 'Email already exists',\n    match: [/.+\\@.+\\..+/, 'Please fill a valid email address'],\n    required: 'Email is required'\n  },\n  hashed_password: {\n    type: String,\n    required: 'Password is required'\n  },\n  about: {\n    type: String,\n    trim: true\n  },\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  id_tag: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  salt: String,\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date\n});\nUserSchema.virtual('password').set(function (password) {\n  this._password = password;\n  this.salt = this.makeSalt();\n  this.hashed_password = this.encryptPassword(password);\n}).get(function () {\n  return this._password;\n});\nUserSchema.methods = {\n  authenticate: function (plainText) {\n    return this.encryptPassword(plainText) === this.hashed_password;\n  },\n  encryptPassword: function (password) {\n    if (!password) return '';\n\n    try {\n      return crypto__WEBPACK_IMPORTED_MODULE_1___default().createHmac('sha1', this.salt).update(password).digest('hex');\n    } catch (err) {\n      return '';\n    }\n  },\n  makeSalt: function () {\n    return Math.round(new Date().valueOf() * Math.random()) + '';\n  }\n};\nUserSchema.path('hashed_password').validate(function (v) {\n  if (this._password && this._password.length < 6) {\n    this.invalidate('password', 'Password must be at least 6 characters.');\n  }\n\n  if (this.isNew && !this._password) {\n    this.invalidate('password', 'Password is required');\n  }\n}, null);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('User', UserSchema));\n\n//# sourceURL=webpack://occp/./server/models/user.model.js?");

/***/ }),

/***/ "./server/ocpp/src/centralSystem.js":
/*!******************************************!*\
  !*** ./server/ocpp/src/centralSystem.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CentralSystem)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ \"./server/ocpp/src/logger.js\");\n/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connection */ \"./server/ocpp/src/connection.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ \"./server/ocpp/src/constants.js\");\n/* harmony import */ var _centralSystemClient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./centralSystemClient */ \"./server/ocpp/src/centralSystemClient.js\");\n\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass CentralSystem {\n  constructor(options) {\n    this.options = options || {};\n    this.clients = [];\n    this.logger = new _logger__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\n  }\n\n  listen(port = 9220, host = null) {\n    this.port = port;\n\n    const validateConnection = this.options.validateConnection || (() => true);\n\n    const wsOptions = {\n      port,\n      host,\n      handleProtocols: (protocols, req) => {\n        let newProtocols;\n\n        if (typeof protocols === 'object') {\n          newProtocols = Array.from(protocols);\n        } else {\n          newProtocols = protocols;\n        }\n\n        if (newProtocols.indexOf(_constants__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6) === -1) {\n          return '';\n        }\n\n        return _constants__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6;\n      },\n      verifyClient: async (info, cb) => {\n        if (info.req.url === _logger__WEBPACK_IMPORTED_MODULE_2__.LOGGER_URL) {\n          debug('Logger connected');\n          return cb(true);\n        }\n\n        const isAccept = await validateConnection(info.req.url);\n        this.logger.debug(`Request for connect \"${info.req.url}\" (${info.req.headers['sec-websocket-protocol']}) - ${isAccept ? 'Valid identifier' : 'Invalid identifier'}`);\n        cb(isAccept, 404, 'Central System does not recognize the charge point identifier in the URL path');\n      },\n      ...(this.options.wsOptions || {})\n    };\n    this.server = new (ws__WEBPACK_IMPORTED_MODULE_0___default().Server)(wsOptions);\n    this.server.on('error', (ws, req) => {\n      console.info(ws, req);\n    });\n    this.server.on('message', data => {\n      console.info(data);\n    });\n    this.server.on('upgrade', (ws, req) => {\n      console.info(req);\n    });\n    this.server.on('connection', (ws, req) => this.onNewConnection(ws, req));\n    debug(`Listen on ${host || 'default host'}:${port}`);\n  }\n\n  onNewConnection(socket, req) {\n    socket.on('error', err => {\n      console.info(err, socket.readyState);\n    });\n\n    if (req.url === _logger__WEBPACK_IMPORTED_MODULE_2__.LOGGER_URL) {\n      this.logger.addSocket(socket);\n      return;\n    }\n\n    if (!socket.protocol) {\n      // From Spec: If the Central System does not agree to using one of the subprotocols offered by the client,\n      // it MUST complete the WebSocket handshake with a response without a Sec-WebSocket-Protocol header and then\n      // immediately close the WebSocket connection.\n      this.logger.debug(`Close connection due to unsupported protocol`);\n      return socket.close();\n    }\n\n    const connection = new _connection__WEBPACK_IMPORTED_MODULE_3__.Connection(socket, req, this.logger);\n    const client = new _centralSystemClient__WEBPACK_IMPORTED_MODULE_5__[\"default\"](connection);\n\n    connection.onRequest = command => this.onRequest(client, command);\n\n    socket.on('close', err => {\n      const index = this.clients.indexOf(client);\n      this.clients.splice(index, 1);\n    });\n    this.clients.push(client);\n  }\n\n  async onRequest(client, command) {// implementation\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/centralSystem.js?");

/***/ }),

/***/ "./server/ocpp/src/centralSystemClient.js":
/*!************************************************!*\
  !*** ./server/ocpp/src/centralSystemClient.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CentralSystemClient)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connection */ \"./server/ocpp/src/connection.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ \"./server/ocpp/src/constants.js\");\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants__WEBPACK_IMPORTED_MODULE_3__.DEBUG_LIBNAME);\nclass CentralSystemClient {\n  constructor(connection) {\n    this.connection = connection;\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/centralSystemClient.js?");

/***/ }),

/***/ "./server/ocpp/src/chargePoint.js":
/*!****************************************!*\
  !*** ./server/ocpp/src/chargePoint.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ChargePoint)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commands */ \"./server/ocpp/src/commands/index.js\");\n/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connection */ \"./server/ocpp/src/connection.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ \"./server/ocpp/src/constants.js\");\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass ChargePoint {\n  /**\n   * Create OCPP client\n   *\n   * @param {Object} options Configuration options\n   * @param {String} options.centralSystemUrl The url where to connect\n   * @param {String} options.reconnectInterval The number of milliseconds to delay before attempting to reconnect (default: 5 minutes)\n   * @param {String} options.connectors Array of virtual connectors\n   */\n  constructor(options) {\n    options.connectors = options.connectors || [];\n    this.options = options;\n  }\n\n  connect() {\n    debug(`Try connect to ${this.options.centralSystemUrl}`);\n    let reconnectTimer;\n    const reconnectInterval = this.options.reconnectInterval || 5 * 60 * 1000; // 5 minutes\n\n    const self = this;\n    return new Promise((resolve, reject) => {\n      const ws = new (ws__WEBPACK_IMPORTED_MODULE_0___default())(this.options.centralSystemUrl, [_constants__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6], {\n        perMessageDeflate: false,\n        protocolVersion: 13\n      });\n      ws.on('upgrade', res => {\n        if (!res.headers['sec-websocket-protocol']) {\n          return reject(new Error(`Server doesn't support protocol ${_constants__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6}`));\n        }\n      });\n      ws.on('close', () => {\n        debug(`Connection is closed`);\n        this.connection = null;\n        nextReconnectAttempt();\n      });\n      ws.on('open', () => {\n        ws.removeAllListeners('error');\n        this.connection = new _connection__WEBPACK_IMPORTED_MODULE_3__.Connection(ws);\n\n        this.connection.onRequest = command => this.onRequest(command);\n\n        resolve(this.connection);\n      });\n      ws.on('error', reject);\n    });\n\n    function nextReconnectAttempt() {\n      if (reconnectTimer) {\n        clearInterval(reconnectTimer);\n        reconnectTimer = null;\n      }\n\n      reconnectTimer = setTimeout(async () => {\n        try {\n          await self.connect();\n        } catch (err) {}\n      }, reconnectInterval);\n    }\n  }\n\n  send(command) {\n    if (!this.connection) {\n      return false;\n    }\n\n    return this.connection.send(command);\n  }\n\n  onRequest(command) {}\n\n  getConnectors() {\n    return this.options.connectors;\n  }\n\n  async sendCurrentStatus() {\n    const promises = this.getConnectors().map(async connector => {\n      const status = {\n        timestamp: new Date().toISOString(),\n        ...connector\n      };\n      const statusCommand = new _commands__WEBPACK_IMPORTED_MODULE_2__[\"default\"].StatusNotification(status);\n      await this.send(statusCommand);\n    });\n    return await Promise.all(promises);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/chargePoint.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/Authorize.js":
/*!***********************************************!*\
  !*** ./server/ocpp/src/commands/Authorize.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"Authorize\": () => (/* binding */ Authorize)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Authorize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Authorize */ \"./server/ocpp/ocpp-1.6-schemas/Authorize.json\");\n/* harmony import */ var _ocpp_1_6_schemas_AuthorizeResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/AuthorizeResponse */ \"./server/ocpp/ocpp-1.6-schemas/AuthorizeResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass Authorize extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Authorize__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_AuthorizeResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/Authorize.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/BaseCommand.js":
/*!*************************************************!*\
  !*** ./server/ocpp/src/commands/BaseCommand.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BaseCommand)\n/* harmony export */ });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./server/ocpp/src/helpers.js\");\n\nconst RESPONSE_SCHEMA_SYMBOL = Symbol('responseSchema');\nclass BaseCommand {\n  constructor(requestSchema, responseSchema, values) {\n    this[RESPONSE_SCHEMA_SYMBOL] = responseSchema;\n    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.applyPropertiesValidators)(this, requestSchema, values);\n  }\n\n  getCommandName() {\n    return this.constructor.name;\n  }\n\n  createResponse(payload) {\n    const response = new function () {}();\n    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.applyPropertiesValidators)(response, this[RESPONSE_SCHEMA_SYMBOL], payload);\n    return response;\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/BaseCommand.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/BootNotification.js":
/*!******************************************************!*\
  !*** ./server/ocpp/src/commands/BootNotification.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_PENDING\": () => (/* binding */ STATUS_PENDING),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"BootNotification\": () => (/* binding */ BootNotification)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_BootNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/BootNotification */ \"./server/ocpp/ocpp-1.6-schemas/BootNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_BootNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/BootNotificationResponse */ \"./server/ocpp/ocpp-1.6-schemas/BootNotificationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_PENDING = 'Pending';\nconst STATUS_REJECTED = 'Rejected';\nclass BootNotification extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_BootNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_BootNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/BootNotification.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/CancelReservation.js":
/*!*******************************************************!*\
  !*** ./server/ocpp/src/commands/CancelReservation.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"CancelReservation\": () => (/* binding */ CancelReservation)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_CancelReservation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/CancelReservation */ \"./server/ocpp/ocpp-1.6-schemas/CancelReservation.json\");\n/* harmony import */ var _ocpp_1_6_schemas_CancelReservationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/CancelReservationResponse */ \"./server/ocpp/ocpp-1.6-schemas/CancelReservationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass CancelReservation extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_CancelReservation__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_CancelReservationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/CancelReservation.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/ChangeAvailability.js":
/*!********************************************************!*\
  !*** ./server/ocpp/src/commands/ChangeAvailability.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"TYPE_INOPERATIVE\": () => (/* binding */ TYPE_INOPERATIVE),\n/* harmony export */   \"TYPE_OPERATIVE\": () => (/* binding */ TYPE_OPERATIVE),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_SCHEDULED\": () => (/* binding */ STATUS_SCHEDULED),\n/* harmony export */   \"ChangeAvailability\": () => (/* binding */ ChangeAvailability)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeAvailability__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeAvailability */ \"./server/ocpp/ocpp-1.6-schemas/ChangeAvailability.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeAvailabilityResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeAvailabilityResponse */ \"./server/ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json\");\n\n\n\nconst TYPE_INOPERATIVE = 'Inoperative';\nconst TYPE_OPERATIVE = 'Operative';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_SCHEDULED = 'Scheduled';\nclass ChangeAvailability extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ChangeAvailability__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ChangeAvailabilityResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/ChangeAvailability.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/ChangeConfiguration.js":
/*!*********************************************************!*\
  !*** ./server/ocpp/src/commands/ChangeConfiguration.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_REBOOTREQUIRED\": () => (/* binding */ STATUS_REBOOTREQUIRED),\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"ChangeConfiguration\": () => (/* binding */ ChangeConfiguration)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeConfiguration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeConfiguration */ \"./server/ocpp/ocpp-1.6-schemas/ChangeConfiguration.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeConfigurationResponse */ \"./server/ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_REBOOTREQUIRED = 'RebootRequired';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nclass ChangeConfiguration extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ChangeConfiguration__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ChangeConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/ChangeConfiguration.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/ClearCache.js":
/*!************************************************!*\
  !*** ./server/ocpp/src/commands/ClearCache.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"ClearCache\": () => (/* binding */ ClearCache)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearCache */ \"./server/ocpp/ocpp-1.6-schemas/ClearCache.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearCacheResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearCacheResponse */ \"./server/ocpp/ocpp-1.6-schemas/ClearCacheResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass ClearCache extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ClearCache__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ClearCacheResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/ClearCache.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/ClearChargingProfile.js":
/*!**********************************************************!*\
  !*** ./server/ocpp/src/commands/ClearChargingProfile.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_UNKNOWN\": () => (/* binding */ STATUS_UNKNOWN),\n/* harmony export */   \"ClearChargingProfile\": () => (/* binding */ ClearChargingProfile)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearChargingProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearChargingProfile */ \"./server/ocpp/ocpp-1.6-schemas/ClearChargingProfile.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearChargingProfileResponse */ \"./server/ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_UNKNOWN = 'Unknown';\nclass ClearChargingProfile extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ClearChargingProfile__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ClearChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/ClearChargingProfile.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/DataTransfer.js":
/*!**************************************************!*\
  !*** ./server/ocpp/src/commands/DataTransfer.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_UNKNOWNMESSAGEID\": () => (/* binding */ STATUS_UNKNOWNMESSAGEID),\n/* harmony export */   \"STATUS_UNKNOWNVENDORID\": () => (/* binding */ STATUS_UNKNOWNVENDORID),\n/* harmony export */   \"DataTransfer\": () => (/* binding */ DataTransfer)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_DataTransfer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DataTransfer */ \"./server/ocpp/ocpp-1.6-schemas/DataTransfer.json\");\n/* harmony import */ var _ocpp_1_6_schemas_DataTransferResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DataTransferResponse */ \"./server/ocpp/ocpp-1.6-schemas/DataTransferResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_UNKNOWNMESSAGEID = 'UnknownMessageId';\nconst STATUS_UNKNOWNVENDORID = 'UnknownVendorId';\nclass DataTransfer extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_DataTransfer__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_DataTransferResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/DataTransfer.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/DiagnosticsStatusNotification.js":
/*!*******************************************************************!*\
  !*** ./server/ocpp/src/commands/DiagnosticsStatusNotification.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_IDLE\": () => (/* binding */ STATUS_IDLE),\n/* harmony export */   \"STATUS_UPLOADED\": () => (/* binding */ STATUS_UPLOADED),\n/* harmony export */   \"STATUS_UPLOADFAILED\": () => (/* binding */ STATUS_UPLOADFAILED),\n/* harmony export */   \"STATUS_UPLOADING\": () => (/* binding */ STATUS_UPLOADING),\n/* harmony export */   \"DiagnosticsStatusNotification\": () => (/* binding */ DiagnosticsStatusNotification)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DiagnosticsStatusNotification */ \"./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_DiagnosticsStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse */ \"./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json\");\n\n\n\nconst STATUS_IDLE = 'Idle';\nconst STATUS_UPLOADED = 'Uploaded';\nconst STATUS_UPLOADFAILED = 'UploadFailed';\nconst STATUS_UPLOADING = 'Uploading';\nclass DiagnosticsStatusNotification extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_DiagnosticsStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/DiagnosticsStatusNotification.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/FirmwareStatusNotification.js":
/*!****************************************************************!*\
  !*** ./server/ocpp/src/commands/FirmwareStatusNotification.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_DOWNLOADED\": () => (/* binding */ STATUS_DOWNLOADED),\n/* harmony export */   \"STATUS_DOWNLOADFAILED\": () => (/* binding */ STATUS_DOWNLOADFAILED),\n/* harmony export */   \"STATUS_DOWNLOADING\": () => (/* binding */ STATUS_DOWNLOADING),\n/* harmony export */   \"STATUS_IDLE\": () => (/* binding */ STATUS_IDLE),\n/* harmony export */   \"STATUS_INSTALLATIONFAILED\": () => (/* binding */ STATUS_INSTALLATIONFAILED),\n/* harmony export */   \"STATUS_INSTALLING\": () => (/* binding */ STATUS_INSTALLING),\n/* harmony export */   \"STATUS_INSTALLED\": () => (/* binding */ STATUS_INSTALLED),\n/* harmony export */   \"FirmwareStatusNotification\": () => (/* binding */ FirmwareStatusNotification)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/FirmwareStatusNotification */ \"./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_FirmwareStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/FirmwareStatusNotificationResponse */ \"./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json\");\n\n\n\nconst STATUS_DOWNLOADED = 'Downloaded';\nconst STATUS_DOWNLOADFAILED = 'DownloadFailed';\nconst STATUS_DOWNLOADING = 'Downloading';\nconst STATUS_IDLE = 'Idle';\nconst STATUS_INSTALLATIONFAILED = 'InstallationFailed';\nconst STATUS_INSTALLING = 'Installing';\nconst STATUS_INSTALLED = 'Installed';\nclass FirmwareStatusNotification extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_FirmwareStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/FirmwareStatusNotification.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/GetCompositeSchedule.js":
/*!**********************************************************!*\
  !*** ./server/ocpp/src/commands/GetCompositeSchedule.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"GetCompositeSchedule\": () => (/* binding */ GetCompositeSchedule)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetCompositeSchedule */ \"./server/ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetCompositeScheduleResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetCompositeScheduleResponse */ \"./server/ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nclass GetCompositeSchedule extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetCompositeScheduleResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/GetCompositeSchedule.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/GetConfiguration.js":
/*!******************************************************!*\
  !*** ./server/ocpp/src/commands/GetConfiguration.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetConfiguration\": () => (/* binding */ GetConfiguration)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetConfiguration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetConfiguration */ \"./server/ocpp/ocpp-1.6-schemas/GetConfiguration.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetConfigurationResponse */ \"./server/ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json\");\n\n\n\nclass GetConfiguration extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetConfiguration__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/GetConfiguration.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/GetDiagnostics.js":
/*!****************************************************!*\
  !*** ./server/ocpp/src/commands/GetDiagnostics.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetDiagnostics\": () => (/* binding */ GetDiagnostics)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetDiagnostics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetDiagnostics */ \"./server/ocpp/ocpp-1.6-schemas/GetDiagnostics.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetDiagnosticsResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetDiagnosticsResponse */ \"./server/ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json\");\n\n\n\nclass GetDiagnostics extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetDiagnostics__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetDiagnosticsResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/GetDiagnostics.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/GetLocalListVersion.js":
/*!*********************************************************!*\
  !*** ./server/ocpp/src/commands/GetLocalListVersion.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetLocalListVersion\": () => (/* binding */ GetLocalListVersion)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetLocalListVersion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetLocalListVersion */ \"./server/ocpp/ocpp-1.6-schemas/GetLocalListVersion.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetLocalListVersionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetLocalListVersionResponse */ \"./server/ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json\");\n\n\n\nclass GetLocalListVersion extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetLocalListVersion__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetLocalListVersionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/GetLocalListVersion.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/Heartbeat.js":
/*!***********************************************!*\
  !*** ./server/ocpp/src/commands/Heartbeat.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Heartbeat\": () => (/* binding */ Heartbeat)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Heartbeat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Heartbeat */ \"./server/ocpp/ocpp-1.6-schemas/Heartbeat.json\");\n/* harmony import */ var _ocpp_1_6_schemas_HeartbeatResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/HeartbeatResponse */ \"./server/ocpp/ocpp-1.6-schemas/HeartbeatResponse.json\");\n\n\n\nclass Heartbeat extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Heartbeat__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_HeartbeatResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/Heartbeat.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/MeterValues.js":
/*!*************************************************!*\
  !*** ./server/ocpp/src/commands/MeterValues.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CONTEXT_DEAUTHORIZED\": () => (/* binding */ CONTEXT_DEAUTHORIZED),\n/* harmony export */   \"CONTEXT_INTERRUPTION_BEGIN\": () => (/* binding */ CONTEXT_INTERRUPTION_BEGIN),\n/* harmony export */   \"CONTEXT_INTERRUPTION_END\": () => (/* binding */ CONTEXT_INTERRUPTION_END),\n/* harmony export */   \"CONTEXT_SAMPLE_CLOCK\": () => (/* binding */ CONTEXT_SAMPLE_CLOCK),\n/* harmony export */   \"CONTEXT_SAMPLE_PERIODIC\": () => (/* binding */ CONTEXT_SAMPLE_PERIODIC),\n/* harmony export */   \"CONTEXT_TRANSACTION_BEGIN\": () => (/* binding */ CONTEXT_TRANSACTION_BEGIN),\n/* harmony export */   \"CONTEXT_TRANSACTION_END\": () => (/* binding */ CONTEXT_TRANSACTION_END),\n/* harmony export */   \"CONTEXT_TRIGGER\": () => (/* binding */ CONTEXT_TRIGGER),\n/* harmony export */   \"CONTEXT_OTHER\": () => (/* binding */ CONTEXT_OTHER),\n/* harmony export */   \"FORMAT_RAW\": () => (/* binding */ FORMAT_RAW),\n/* harmony export */   \"FORMAT_SIGNEDDATA\": () => (/* binding */ FORMAT_SIGNEDDATA),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_OFFERED\": () => (/* binding */ MEASURAND_POWER_OFFERED),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_FACTOR\": () => (/* binding */ MEASURAND_POWER_FACTOR),\n/* harmony export */   \"MEASURAND_CURRENT_IMPORT\": () => (/* binding */ MEASURAND_CURRENT_IMPORT),\n/* harmony export */   \"MEASURAND_CURRENT_EXPORT\": () => (/* binding */ MEASURAND_CURRENT_EXPORT),\n/* harmony export */   \"MEASURAND_CURRENT_OFFERED\": () => (/* binding */ MEASURAND_CURRENT_OFFERED),\n/* harmony export */   \"MEASURAND_VOLTAGE\": () => (/* binding */ MEASURAND_VOLTAGE),\n/* harmony export */   \"MEASURAND_FREQUENCY\": () => (/* binding */ MEASURAND_FREQUENCY),\n/* harmony export */   \"MEASURAND_TEMPERATURE\": () => (/* binding */ MEASURAND_TEMPERATURE),\n/* harmony export */   \"MEASURAND_SOC\": () => (/* binding */ MEASURAND_SOC),\n/* harmony export */   \"MEASURAND_RPM\": () => (/* binding */ MEASURAND_RPM),\n/* harmony export */   \"PHASE_L1\": () => (/* binding */ PHASE_L1),\n/* harmony export */   \"PHASE_L2\": () => (/* binding */ PHASE_L2),\n/* harmony export */   \"PHASE_L3\": () => (/* binding */ PHASE_L3),\n/* harmony export */   \"PHASE_N\": () => (/* binding */ PHASE_N),\n/* harmony export */   \"PHASE_L1_N\": () => (/* binding */ PHASE_L1_N),\n/* harmony export */   \"PHASE_L2_N\": () => (/* binding */ PHASE_L2_N),\n/* harmony export */   \"PHASE_L3_N\": () => (/* binding */ PHASE_L3_N),\n/* harmony export */   \"PHASE_L1_L2\": () => (/* binding */ PHASE_L1_L2),\n/* harmony export */   \"PHASE_L2_L3\": () => (/* binding */ PHASE_L2_L3),\n/* harmony export */   \"PHASE_L3_L1\": () => (/* binding */ PHASE_L3_L1),\n/* harmony export */   \"LOCATION_CABLE\": () => (/* binding */ LOCATION_CABLE),\n/* harmony export */   \"LOCATION_EV\": () => (/* binding */ LOCATION_EV),\n/* harmony export */   \"LOCATION_INLET\": () => (/* binding */ LOCATION_INLET),\n/* harmony export */   \"LOCATION_OUTLET\": () => (/* binding */ LOCATION_OUTLET),\n/* harmony export */   \"LOCATION_BODY\": () => (/* binding */ LOCATION_BODY),\n/* harmony export */   \"UNIT_WH\": () => (/* binding */ UNIT_WH),\n/* harmony export */   \"UNIT_KWH\": () => (/* binding */ UNIT_KWH),\n/* harmony export */   \"UNIT_VARH\": () => (/* binding */ UNIT_VARH),\n/* harmony export */   \"UNIT_KVARH\": () => (/* binding */ UNIT_KVARH),\n/* harmony export */   \"UNIT_W\": () => (/* binding */ UNIT_W),\n/* harmony export */   \"UNIT_KW\": () => (/* binding */ UNIT_KW),\n/* harmony export */   \"UNIT_VA\": () => (/* binding */ UNIT_VA),\n/* harmony export */   \"UNIT_KVA\": () => (/* binding */ UNIT_KVA),\n/* harmony export */   \"UNIT_VAR\": () => (/* binding */ UNIT_VAR),\n/* harmony export */   \"UNIT_KVAR\": () => (/* binding */ UNIT_KVAR),\n/* harmony export */   \"UNIT_A\": () => (/* binding */ UNIT_A),\n/* harmony export */   \"UNIT_V\": () => (/* binding */ UNIT_V),\n/* harmony export */   \"UNIT_K\": () => (/* binding */ UNIT_K),\n/* harmony export */   \"UNIT_CELCIUS\": () => (/* binding */ UNIT_CELCIUS),\n/* harmony export */   \"UNIT_FAHRENHEIT\": () => (/* binding */ UNIT_FAHRENHEIT),\n/* harmony export */   \"UNIT_PERCENT\": () => (/* binding */ UNIT_PERCENT),\n/* harmony export */   \"MeterValues\": () => (/* binding */ MeterValues)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_MeterValues__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/MeterValues */ \"./server/ocpp/ocpp-1.6-schemas/MeterValues.json\");\n/* harmony import */ var _ocpp_1_6_schemas_MeterValuesResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/MeterValuesResponse */ \"./server/ocpp/ocpp-1.6-schemas/MeterValuesResponse.json\");\n\n\n\nconst CONTEXT_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_INTERRUPTION_BEGIN = 'Interruption.Begin';\nconst CONTEXT_INTERRUPTION_END = 'Interruption.End';\nconst CONTEXT_SAMPLE_CLOCK = 'Sample.Clock';\nconst CONTEXT_SAMPLE_PERIODIC = 'Sample.Periodic';\nconst CONTEXT_TRANSACTION_BEGIN = 'Transaction.Begin';\nconst CONTEXT_TRANSACTION_END = 'Transaction.End';\nconst CONTEXT_TRIGGER = 'Trigger';\nconst CONTEXT_OTHER = 'Other';\nconst FORMAT_RAW = 'Raw';\nconst FORMAT_SIGNEDDATA = 'SignedData';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER = 'Energy.Active.Export.Register';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER = 'Energy.Active.Import.Register';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER = 'Energy.Reactive.Export.Register';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER = 'Energy.Reactive.Import.Register';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL = 'Energy.Active.Export.Interval';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL = 'Energy.Active.Import.Interval';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL = 'Energy.Reactive.Export.Interval';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL = 'Energy.Reactive.Import.Interval';\nconst MEASURAND_POWER_ACTIVE_EXPORT = 'Power.Active.Export';\nconst MEASURAND_POWER_ACTIVE_IMPORT = 'Power.Active.Import';\nconst MEASURAND_POWER_OFFERED = 'Power.Offered';\nconst MEASURAND_POWER_REACTIVE_EXPORT = 'Power.Reactive.Export';\nconst MEASURAND_POWER_REACTIVE_IMPORT = 'Power.Reactive.Import';\nconst MEASURAND_POWER_FACTOR = 'Power.Factor';\nconst MEASURAND_CURRENT_IMPORT = 'Current.Import';\nconst MEASURAND_CURRENT_EXPORT = 'Current.Export';\nconst MEASURAND_CURRENT_OFFERED = 'Current.Offered';\nconst MEASURAND_VOLTAGE = 'Voltage';\nconst MEASURAND_FREQUENCY = 'Frequency';\nconst MEASURAND_TEMPERATURE = 'Temperature';\nconst MEASURAND_SOC = 'SoC';\nconst MEASURAND_RPM = 'RPM';\nconst PHASE_L1 = 'L1';\nconst PHASE_L2 = 'L2';\nconst PHASE_L3 = 'L3';\nconst PHASE_N = 'N';\nconst PHASE_L1_N = 'L1-N';\nconst PHASE_L2_N = 'L2-N';\nconst PHASE_L3_N = 'L3-N';\nconst PHASE_L1_L2 = 'L1-L2';\nconst PHASE_L2_L3 = 'L2-L3';\nconst PHASE_L3_L1 = 'L3-L1';\nconst LOCATION_CABLE = 'Cable';\nconst LOCATION_EV = 'EV';\nconst LOCATION_INLET = 'Inlet';\nconst LOCATION_OUTLET = 'Outlet';\nconst LOCATION_BODY = 'Body';\nconst UNIT_WH = 'Wh';\nconst UNIT_KWH = 'kWh';\nconst UNIT_VARH = 'varh';\nconst UNIT_KVARH = 'kvarh';\nconst UNIT_W = 'W';\nconst UNIT_KW = 'kW';\nconst UNIT_VA = 'VA';\nconst UNIT_KVA = 'kVA';\nconst UNIT_VAR = 'var';\nconst UNIT_KVAR = 'kvar';\nconst UNIT_A = 'A';\nconst UNIT_V = 'V';\nconst UNIT_K = 'K';\nconst UNIT_CELCIUS = 'Celcius';\nconst UNIT_FAHRENHEIT = 'Fahrenheit';\nconst UNIT_PERCENT = 'Percent';\nclass MeterValues extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_MeterValues__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_MeterValuesResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/MeterValues.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/RemoteStartTransaction.js":
/*!************************************************************!*\
  !*** ./server/ocpp/src/commands/RemoteStartTransaction.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_ABSOLUTE\": () => (/* binding */ CHARGING_PROFILE_KIND_ABSOLUTE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RECURRING\": () => (/* binding */ CHARGING_PROFILE_KIND_RECURRING),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RELATIVE\": () => (/* binding */ CHARGING_PROFILE_KIND_RELATIVE),\n/* harmony export */   \"RECURRENCY_KIND_DAILY\": () => (/* binding */ RECURRENCY_KIND_DAILY),\n/* harmony export */   \"RECURRENCY_KIND_WEEKLY\": () => (/* binding */ RECURRENCY_KIND_WEEKLY),\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"RemoteStartTransaction\": () => (/* binding */ RemoteStartTransaction)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStartTransaction */ \"./server/ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStartTransactionResponse */ \"./server/ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst CHARGING_PROFILE_KIND_ABSOLUTE = 'Absolute';\nconst CHARGING_PROFILE_KIND_RECURRING = 'Recurring';\nconst CHARGING_PROFILE_KIND_RELATIVE = 'Relative';\nconst RECURRENCY_KIND_DAILY = 'Daily';\nconst RECURRENCY_KIND_WEEKLY = 'Weekly';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass RemoteStartTransaction extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_RemoteStartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/RemoteStartTransaction.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/RemoteStopTransaction.js":
/*!***********************************************************!*\
  !*** ./server/ocpp/src/commands/RemoteStopTransaction.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"RemoteStopTransaction\": () => (/* binding */ RemoteStopTransaction)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStopTransaction */ \"./server/ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStopTransactionResponse */ \"./server/ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass RemoteStopTransaction extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_RemoteStopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/RemoteStopTransaction.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/ReserveNow.js":
/*!************************************************!*\
  !*** ./server/ocpp/src/commands/ReserveNow.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_FAULTED\": () => (/* binding */ STATUS_FAULTED),\n/* harmony export */   \"STATUS_OCCUPIED\": () => (/* binding */ STATUS_OCCUPIED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_UNAVAILABLE\": () => (/* binding */ STATUS_UNAVAILABLE),\n/* harmony export */   \"ReserveNow\": () => (/* binding */ ReserveNow)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ReserveNow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ReserveNow */ \"./server/ocpp/ocpp-1.6-schemas/ReserveNow.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ReserveNowResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ReserveNowResponse */ \"./server/ocpp/ocpp-1.6-schemas/ReserveNowResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_FAULTED = 'Faulted';\nconst STATUS_OCCUPIED = 'Occupied';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_UNAVAILABLE = 'Unavailable';\nclass ReserveNow extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ReserveNow__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ReserveNowResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/ReserveNow.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/Reset.js":
/*!*******************************************!*\
  !*** ./server/ocpp/src/commands/Reset.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"TYPE_HARD\": () => (/* binding */ TYPE_HARD),\n/* harmony export */   \"TYPE_SOFT\": () => (/* binding */ TYPE_SOFT),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"Reset\": () => (/* binding */ Reset)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Reset */ \"./server/ocpp/ocpp-1.6-schemas/Reset.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ResetResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ResetResponse */ \"./server/ocpp/ocpp-1.6-schemas/ResetResponse.json\");\n\n\n\nconst TYPE_HARD = 'Hard';\nconst TYPE_SOFT = 'Soft';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass Reset extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Reset__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ResetResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/Reset.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/SendLocalList.js":
/*!***************************************************!*\
  !*** ./server/ocpp/src/commands/SendLocalList.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"IDTAGINFO_STATUS_ACCEPTED\": () => (/* binding */ IDTAGINFO_STATUS_ACCEPTED),\n/* harmony export */   \"IDTAGINFO_STATUS_BLOCKED\": () => (/* binding */ IDTAGINFO_STATUS_BLOCKED),\n/* harmony export */   \"IDTAGINFO_STATUS_EXPIRED\": () => (/* binding */ IDTAGINFO_STATUS_EXPIRED),\n/* harmony export */   \"IDTAGINFO_STATUS_INVALID\": () => (/* binding */ IDTAGINFO_STATUS_INVALID),\n/* harmony export */   \"IDTAGINFO_STATUS_CONCURRENTTX\": () => (/* binding */ IDTAGINFO_STATUS_CONCURRENTTX),\n/* harmony export */   \"UPDATE_TYPE_DIFFERENTIAL\": () => (/* binding */ UPDATE_TYPE_DIFFERENTIAL),\n/* harmony export */   \"UPDATE_TYPE_FULL\": () => (/* binding */ UPDATE_TYPE_FULL),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_FAILED\": () => (/* binding */ STATUS_FAILED),\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"STATUS_VERSIONMISMATCH\": () => (/* binding */ STATUS_VERSIONMISMATCH),\n/* harmony export */   \"SendLocalList\": () => (/* binding */ SendLocalList)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_SendLocalList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SendLocalList */ \"./server/ocpp/ocpp-1.6-schemas/SendLocalList.json\");\n/* harmony import */ var _ocpp_1_6_schemas_SendLocalListResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SendLocalListResponse */ \"./server/ocpp/ocpp-1.6-schemas/SendLocalListResponse.json\");\n\n\n\nconst IDTAGINFO_STATUS_ACCEPTED = 'Accepted';\nconst IDTAGINFO_STATUS_BLOCKED = 'Blocked';\nconst IDTAGINFO_STATUS_EXPIRED = 'Expired';\nconst IDTAGINFO_STATUS_INVALID = 'Invalid';\nconst IDTAGINFO_STATUS_CONCURRENTTX = 'ConcurrentTx';\nconst UPDATE_TYPE_DIFFERENTIAL = 'Differential';\nconst UPDATE_TYPE_FULL = 'Full';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_FAILED = 'Failed';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nconst STATUS_VERSIONMISMATCH = 'VersionMismatch';\nclass SendLocalList extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_SendLocalList__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_SendLocalListResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/SendLocalList.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/SetChargingProfile.js":
/*!********************************************************!*\
  !*** ./server/ocpp/src/commands/SetChargingProfile.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_ABSOLUTE\": () => (/* binding */ CHARGING_PROFILE_KIND_ABSOLUTE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RECURRING\": () => (/* binding */ CHARGING_PROFILE_KIND_RECURRING),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RELATIVE\": () => (/* binding */ CHARGING_PROFILE_KIND_RELATIVE),\n/* harmony export */   \"RECURRENCY_KIND_DAILY\": () => (/* binding */ RECURRENCY_KIND_DAILY),\n/* harmony export */   \"RECURRENCY_KIND_WEEKLY\": () => (/* binding */ RECURRENCY_KIND_WEEKLY),\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"SetChargingProfile\": () => (/* binding */ SetChargingProfile)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_SetChargingProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SetChargingProfile */ \"./server/ocpp/ocpp-1.6-schemas/SetChargingProfile.json\");\n/* harmony import */ var _ocpp_1_6_schemas_SetChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SetChargingProfileResponse */ \"./server/ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst CHARGING_PROFILE_KIND_ABSOLUTE = 'Absolute';\nconst CHARGING_PROFILE_KIND_RECURRING = 'Recurring';\nconst CHARGING_PROFILE_KIND_RELATIVE = 'Relative';\nconst RECURRENCY_KIND_DAILY = 'Daily';\nconst RECURRENCY_KIND_WEEKLY = 'Weekly';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass SetChargingProfile extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_SetChargingProfile__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_SetChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/SetChargingProfile.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/StartTransaction.js":
/*!******************************************************!*\
  !*** ./server/ocpp/src/commands/StartTransaction.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"StartTransaction\": () => (/* binding */ StartTransaction)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StartTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StartTransaction */ \"./server/ocpp/ocpp-1.6-schemas/StartTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StartTransactionResponse */ \"./server/ocpp/ocpp-1.6-schemas/StartTransactionResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass StartTransaction extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StartTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/StartTransaction.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/StatusNotification.js":
/*!********************************************************!*\
  !*** ./server/ocpp/src/commands/StatusNotification.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ERRORCODE_CONNECTORLOCKFAILURE\": () => (/* binding */ ERRORCODE_CONNECTORLOCKFAILURE),\n/* harmony export */   \"ERRORCODE_EVCOMMUNICATIONERROR\": () => (/* binding */ ERRORCODE_EVCOMMUNICATIONERROR),\n/* harmony export */   \"ERRORCODE_GROUNDFAILURE\": () => (/* binding */ ERRORCODE_GROUNDFAILURE),\n/* harmony export */   \"ERRORCODE_HIGHTEMPERATURE\": () => (/* binding */ ERRORCODE_HIGHTEMPERATURE),\n/* harmony export */   \"ERRORCODE_INTERNALERROR\": () => (/* binding */ ERRORCODE_INTERNALERROR),\n/* harmony export */   \"ERRORCODE_LOCALLISTCONFLICT\": () => (/* binding */ ERRORCODE_LOCALLISTCONFLICT),\n/* harmony export */   \"ERRORCODE_NOERROR\": () => (/* binding */ ERRORCODE_NOERROR),\n/* harmony export */   \"ERRORCODE_OTHERERROR\": () => (/* binding */ ERRORCODE_OTHERERROR),\n/* harmony export */   \"ERRORCODE_OVERCURRENTFAILURE\": () => (/* binding */ ERRORCODE_OVERCURRENTFAILURE),\n/* harmony export */   \"ERRORCODE_POWERMETERFAILURE\": () => (/* binding */ ERRORCODE_POWERMETERFAILURE),\n/* harmony export */   \"ERRORCODE_POWERSWITCHFAILURE\": () => (/* binding */ ERRORCODE_POWERSWITCHFAILURE),\n/* harmony export */   \"ERRORCODE_READERFAILURE\": () => (/* binding */ ERRORCODE_READERFAILURE),\n/* harmony export */   \"ERRORCODE_RESETFAILURE\": () => (/* binding */ ERRORCODE_RESETFAILURE),\n/* harmony export */   \"ERRORCODE_UNDERVOLTAGE\": () => (/* binding */ ERRORCODE_UNDERVOLTAGE),\n/* harmony export */   \"ERRORCODE_OVERVOLTAGE\": () => (/* binding */ ERRORCODE_OVERVOLTAGE),\n/* harmony export */   \"ERRORCODE_WEAKSIGNAL\": () => (/* binding */ ERRORCODE_WEAKSIGNAL),\n/* harmony export */   \"STATUS_AVAILABLE\": () => (/* binding */ STATUS_AVAILABLE),\n/* harmony export */   \"STATUS_PREPARING\": () => (/* binding */ STATUS_PREPARING),\n/* harmony export */   \"STATUS_CHARGING\": () => (/* binding */ STATUS_CHARGING),\n/* harmony export */   \"STATUS_SUSPENDEDEVSE\": () => (/* binding */ STATUS_SUSPENDEDEVSE),\n/* harmony export */   \"STATUS_SUSPENDEDEV\": () => (/* binding */ STATUS_SUSPENDEDEV),\n/* harmony export */   \"STATUS_FINISHING\": () => (/* binding */ STATUS_FINISHING),\n/* harmony export */   \"STATUS_RESERVED\": () => (/* binding */ STATUS_RESERVED),\n/* harmony export */   \"STATUS_UNAVAILABLE\": () => (/* binding */ STATUS_UNAVAILABLE),\n/* harmony export */   \"STATUS_FAULTED\": () => (/* binding */ STATUS_FAULTED),\n/* harmony export */   \"StatusNotification\": () => (/* binding */ StatusNotification)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StatusNotification */ \"./server/ocpp/ocpp-1.6-schemas/StatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StatusNotificationResponse */ \"./server/ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json\");\n\n\n\nconst ERRORCODE_CONNECTORLOCKFAILURE = 'ConnectorLockFailure';\nconst ERRORCODE_EVCOMMUNICATIONERROR = 'EVCommunicationError';\nconst ERRORCODE_GROUNDFAILURE = 'GroundFailure';\nconst ERRORCODE_HIGHTEMPERATURE = 'HighTemperature';\nconst ERRORCODE_INTERNALERROR = 'InternalError';\nconst ERRORCODE_LOCALLISTCONFLICT = 'LocalListConflict';\nconst ERRORCODE_NOERROR = 'NoError';\nconst ERRORCODE_OTHERERROR = 'OtherError';\nconst ERRORCODE_OVERCURRENTFAILURE = 'OverCurrentFailure';\nconst ERRORCODE_POWERMETERFAILURE = 'PowerMeterFailure';\nconst ERRORCODE_POWERSWITCHFAILURE = 'PowerSwitchFailure';\nconst ERRORCODE_READERFAILURE = 'ReaderFailure';\nconst ERRORCODE_RESETFAILURE = 'ResetFailure';\nconst ERRORCODE_UNDERVOLTAGE = 'UnderVoltage';\nconst ERRORCODE_OVERVOLTAGE = 'OverVoltage';\nconst ERRORCODE_WEAKSIGNAL = 'WeakSignal';\nconst STATUS_AVAILABLE = 'Available';\nconst STATUS_PREPARING = 'Preparing';\nconst STATUS_CHARGING = 'Charging';\nconst STATUS_SUSPENDEDEVSE = 'SuspendedEVSE';\nconst STATUS_SUSPENDEDEV = 'SuspendedEV';\nconst STATUS_FINISHING = 'Finishing';\nconst STATUS_RESERVED = 'Reserved';\nconst STATUS_UNAVAILABLE = 'Unavailable';\nconst STATUS_FAULTED = 'Faulted';\nclass StatusNotification extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/StatusNotification.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/StopTransaction.js":
/*!*****************************************************!*\
  !*** ./server/ocpp/src/commands/StopTransaction.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"REASON_ACCEPTED\": () => (/* binding */ REASON_ACCEPTED),\n/* harmony export */   \"REASON_EMERGENCYSTOP\": () => (/* binding */ REASON_EMERGENCYSTOP),\n/* harmony export */   \"REASON_EVDISCONNECTED\": () => (/* binding */ REASON_EVDISCONNECTED),\n/* harmony export */   \"REASON_HARDRESET\": () => (/* binding */ REASON_HARDRESET),\n/* harmony export */   \"REASON_LOCAL\": () => (/* binding */ REASON_LOCAL),\n/* harmony export */   \"REASON_OTHER\": () => (/* binding */ REASON_OTHER),\n/* harmony export */   \"REASON_POWERLOSS\": () => (/* binding */ REASON_POWERLOSS),\n/* harmony export */   \"REASON_REBOOT\": () => (/* binding */ REASON_REBOOT),\n/* harmony export */   \"REASON_REMOTE\": () => (/* binding */ REASON_REMOTE),\n/* harmony export */   \"REASON_SOFTRESET\": () => (/* binding */ REASON_SOFTRESET),\n/* harmony export */   \"REASON_UNLOCKCOMMAND\": () => (/* binding */ REASON_UNLOCKCOMMAND),\n/* harmony export */   \"REASON_DEAUTHORIZED\": () => (/* binding */ REASON_DEAUTHORIZED),\n/* harmony export */   \"CONTEXT_DEAUTHORIZED\": () => (/* binding */ CONTEXT_DEAUTHORIZED),\n/* harmony export */   \"CONTEXT_INTERRUPTION_BEGIN\": () => (/* binding */ CONTEXT_INTERRUPTION_BEGIN),\n/* harmony export */   \"CONTEXT_INTERRUPTION_END\": () => (/* binding */ CONTEXT_INTERRUPTION_END),\n/* harmony export */   \"CONTEXT_SAMPLE_CLOCK\": () => (/* binding */ CONTEXT_SAMPLE_CLOCK),\n/* harmony export */   \"CONTEXT_SAMPLE_PERIODIC\": () => (/* binding */ CONTEXT_SAMPLE_PERIODIC),\n/* harmony export */   \"CONTEXT_TRANSACTION_BEGIN\": () => (/* binding */ CONTEXT_TRANSACTION_BEGIN),\n/* harmony export */   \"CONTEXT_TRANSACTION_END\": () => (/* binding */ CONTEXT_TRANSACTION_END),\n/* harmony export */   \"CONTEXT_TRIGGER\": () => (/* binding */ CONTEXT_TRIGGER),\n/* harmony export */   \"CONTEXT_OTHER\": () => (/* binding */ CONTEXT_OTHER),\n/* harmony export */   \"FORMAT_RAW\": () => (/* binding */ FORMAT_RAW),\n/* harmony export */   \"FORMAT_SIGNEDDATA\": () => (/* binding */ FORMAT_SIGNEDDATA),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_OFFERED\": () => (/* binding */ MEASURAND_POWER_OFFERED),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_FACTOR\": () => (/* binding */ MEASURAND_POWER_FACTOR),\n/* harmony export */   \"MEASURAND_CURRENT_IMPORT\": () => (/* binding */ MEASURAND_CURRENT_IMPORT),\n/* harmony export */   \"MEASURAND_CURRENT_EXPORT\": () => (/* binding */ MEASURAND_CURRENT_EXPORT),\n/* harmony export */   \"MEASURAND_CURRENT_OFFERED\": () => (/* binding */ MEASURAND_CURRENT_OFFERED),\n/* harmony export */   \"MEASURAND_VOLTAGE\": () => (/* binding */ MEASURAND_VOLTAGE),\n/* harmony export */   \"MEASURAND_FREQUENCY\": () => (/* binding */ MEASURAND_FREQUENCY),\n/* harmony export */   \"MEASURAND_TEMPERATURE\": () => (/* binding */ MEASURAND_TEMPERATURE),\n/* harmony export */   \"MEASURAND_SOC\": () => (/* binding */ MEASURAND_SOC),\n/* harmony export */   \"MEASURAND_RPM\": () => (/* binding */ MEASURAND_RPM),\n/* harmony export */   \"PHASE_L1\": () => (/* binding */ PHASE_L1),\n/* harmony export */   \"PHASE_L2\": () => (/* binding */ PHASE_L2),\n/* harmony export */   \"PHASE_L3\": () => (/* binding */ PHASE_L3),\n/* harmony export */   \"PHASE_N\": () => (/* binding */ PHASE_N),\n/* harmony export */   \"PHASE_L1_N\": () => (/* binding */ PHASE_L1_N),\n/* harmony export */   \"PHASE_L2_N\": () => (/* binding */ PHASE_L2_N),\n/* harmony export */   \"PHASE_L3_N\": () => (/* binding */ PHASE_L3_N),\n/* harmony export */   \"PHASE_L1_L2\": () => (/* binding */ PHASE_L1_L2),\n/* harmony export */   \"PHASE_L2_L3\": () => (/* binding */ PHASE_L2_L3),\n/* harmony export */   \"PHASE_L3_L1\": () => (/* binding */ PHASE_L3_L1),\n/* harmony export */   \"LOCATION_CABLE\": () => (/* binding */ LOCATION_CABLE),\n/* harmony export */   \"LOCATION_EV\": () => (/* binding */ LOCATION_EV),\n/* harmony export */   \"LOCATION_INLET\": () => (/* binding */ LOCATION_INLET),\n/* harmony export */   \"LOCATION_OUTLET\": () => (/* binding */ LOCATION_OUTLET),\n/* harmony export */   \"LOCATION_BODY\": () => (/* binding */ LOCATION_BODY),\n/* harmony export */   \"UNIT_WH\": () => (/* binding */ UNIT_WH),\n/* harmony export */   \"UNIT_KWH\": () => (/* binding */ UNIT_KWH),\n/* harmony export */   \"UNIT_VARH\": () => (/* binding */ UNIT_VARH),\n/* harmony export */   \"UNIT_KVARH\": () => (/* binding */ UNIT_KVARH),\n/* harmony export */   \"UNIT_W\": () => (/* binding */ UNIT_W),\n/* harmony export */   \"UNIT_KW\": () => (/* binding */ UNIT_KW),\n/* harmony export */   \"UNIT_VA\": () => (/* binding */ UNIT_VA),\n/* harmony export */   \"UNIT_KVA\": () => (/* binding */ UNIT_KVA),\n/* harmony export */   \"UNIT_VAR\": () => (/* binding */ UNIT_VAR),\n/* harmony export */   \"UNIT_KVAR\": () => (/* binding */ UNIT_KVAR),\n/* harmony export */   \"UNIT_A\": () => (/* binding */ UNIT_A),\n/* harmony export */   \"UNIT_V\": () => (/* binding */ UNIT_V),\n/* harmony export */   \"UNIT_K\": () => (/* binding */ UNIT_K),\n/* harmony export */   \"UNIT_CELCIUS\": () => (/* binding */ UNIT_CELCIUS),\n/* harmony export */   \"UNIT_FAHRENHEIT\": () => (/* binding */ UNIT_FAHRENHEIT),\n/* harmony export */   \"UNIT_PERCENT\": () => (/* binding */ UNIT_PERCENT),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"StopTransaction\": () => (/* binding */ StopTransaction)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StopTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StopTransaction */ \"./server/ocpp/ocpp-1.6-schemas/StopTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StopTransactionResponse */ \"./server/ocpp/ocpp-1.6-schemas/StopTransactionResponse.json\");\n\n\n\nconst REASON_ACCEPTED = 'Accepted';\nconst REASON_EMERGENCYSTOP = 'EmergencyStop';\nconst REASON_EVDISCONNECTED = 'EVDisconnected';\nconst REASON_HARDRESET = 'HardReset';\nconst REASON_LOCAL = 'Local';\nconst REASON_OTHER = 'Other';\nconst REASON_POWERLOSS = 'PowerLoss';\nconst REASON_REBOOT = 'Reboot';\nconst REASON_REMOTE = 'Remote';\nconst REASON_SOFTRESET = 'SoftReset';\nconst REASON_UNLOCKCOMMAND = 'UnlockCommand';\nconst REASON_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_INTERRUPTION_BEGIN = 'Interruption.Begin';\nconst CONTEXT_INTERRUPTION_END = 'Interruption.End';\nconst CONTEXT_SAMPLE_CLOCK = 'Sample.Clock';\nconst CONTEXT_SAMPLE_PERIODIC = 'Sample.Periodic';\nconst CONTEXT_TRANSACTION_BEGIN = 'Transaction.Begin';\nconst CONTEXT_TRANSACTION_END = 'Transaction.End';\nconst CONTEXT_TRIGGER = 'Trigger';\nconst CONTEXT_OTHER = 'Other';\nconst FORMAT_RAW = 'Raw';\nconst FORMAT_SIGNEDDATA = 'SignedData';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER = 'Energy.Active.Export.Register';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER = 'Energy.Active.Import.Register';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER = 'Energy.Reactive.Export.Register';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER = 'Energy.Reactive.Import.Register';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL = 'Energy.Active.Export.Interval';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL = 'Energy.Active.Import.Interval';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL = 'Energy.Reactive.Export.Interval';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL = 'Energy.Reactive.Import.Interval';\nconst MEASURAND_POWER_ACTIVE_EXPORT = 'Power.Active.Export';\nconst MEASURAND_POWER_ACTIVE_IMPORT = 'Power.Active.Import';\nconst MEASURAND_POWER_OFFERED = 'Power.Offered';\nconst MEASURAND_POWER_REACTIVE_EXPORT = 'Power.Reactive.Export';\nconst MEASURAND_POWER_REACTIVE_IMPORT = 'Power.Reactive.Import';\nconst MEASURAND_POWER_FACTOR = 'Power.Factor';\nconst MEASURAND_CURRENT_IMPORT = 'Current.Import';\nconst MEASURAND_CURRENT_EXPORT = 'Current.Export';\nconst MEASURAND_CURRENT_OFFERED = 'Current.Offered';\nconst MEASURAND_VOLTAGE = 'Voltage';\nconst MEASURAND_FREQUENCY = 'Frequency';\nconst MEASURAND_TEMPERATURE = 'Temperature';\nconst MEASURAND_SOC = 'SoC';\nconst MEASURAND_RPM = 'RPM';\nconst PHASE_L1 = 'L1';\nconst PHASE_L2 = 'L2';\nconst PHASE_L3 = 'L3';\nconst PHASE_N = 'N';\nconst PHASE_L1_N = 'L1-N';\nconst PHASE_L2_N = 'L2-N';\nconst PHASE_L3_N = 'L3-N';\nconst PHASE_L1_L2 = 'L1-L2';\nconst PHASE_L2_L3 = 'L2-L3';\nconst PHASE_L3_L1 = 'L3-L1';\nconst LOCATION_CABLE = 'Cable';\nconst LOCATION_EV = 'EV';\nconst LOCATION_INLET = 'Inlet';\nconst LOCATION_OUTLET = 'Outlet';\nconst LOCATION_BODY = 'Body';\nconst UNIT_WH = 'Wh';\nconst UNIT_KWH = 'kWh';\nconst UNIT_VARH = 'varh';\nconst UNIT_KVARH = 'kvarh';\nconst UNIT_W = 'W';\nconst UNIT_KW = 'kW';\nconst UNIT_VA = 'VA';\nconst UNIT_KVA = 'kVA';\nconst UNIT_VAR = 'var';\nconst UNIT_KVAR = 'kvar';\nconst UNIT_A = 'A';\nconst UNIT_V = 'V';\nconst UNIT_K = 'K';\nconst UNIT_CELCIUS = 'Celcius';\nconst UNIT_FAHRENHEIT = 'Fahrenheit';\nconst UNIT_PERCENT = 'Percent';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass StopTransaction extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StopTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/StopTransaction.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/TriggerMessage.js":
/*!****************************************************!*\
  !*** ./server/ocpp/src/commands/TriggerMessage.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"REQUESTED_MESSAGE_BOOTNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_BOOTNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_HEARTBEAT\": () => (/* binding */ REQUESTED_MESSAGE_HEARTBEAT),\n/* harmony export */   \"REQUESTED_MESSAGE_METERVALUES\": () => (/* binding */ REQUESTED_MESSAGE_METERVALUES),\n/* harmony export */   \"REQUESTED_MESSAGE_STATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_STATUSNOTIFICATION),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_NOTIMPLEMENTED\": () => (/* binding */ STATUS_NOTIMPLEMENTED),\n/* harmony export */   \"TriggerMessage\": () => (/* binding */ TriggerMessage)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_TriggerMessage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/TriggerMessage */ \"./server/ocpp/ocpp-1.6-schemas/TriggerMessage.json\");\n/* harmony import */ var _ocpp_1_6_schemas_TriggerMessageResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/TriggerMessageResponse */ \"./server/ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json\");\n\n\n\nconst REQUESTED_MESSAGE_BOOTNOTIFICATION = 'BootNotification';\nconst REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION = 'DiagnosticsStatusNotification';\nconst REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION = 'FirmwareStatusNotification';\nconst REQUESTED_MESSAGE_HEARTBEAT = 'Heartbeat';\nconst REQUESTED_MESSAGE_METERVALUES = 'MeterValues';\nconst REQUESTED_MESSAGE_STATUSNOTIFICATION = 'StatusNotification';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_NOTIMPLEMENTED = 'NotImplemented';\nclass TriggerMessage extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_TriggerMessage__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_TriggerMessageResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/TriggerMessage.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/UnlockConnector.js":
/*!*****************************************************!*\
  !*** ./server/ocpp/src/commands/UnlockConnector.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_UNLOCKED\": () => (/* binding */ STATUS_UNLOCKED),\n/* harmony export */   \"STATUS_UNLOCKFAILED\": () => (/* binding */ STATUS_UNLOCKFAILED),\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"UnlockConnector\": () => (/* binding */ UnlockConnector)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_UnlockConnector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UnlockConnector */ \"./server/ocpp/ocpp-1.6-schemas/UnlockConnector.json\");\n/* harmony import */ var _ocpp_1_6_schemas_UnlockConnectorResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UnlockConnectorResponse */ \"./server/ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json\");\n\n\n\nconst STATUS_UNLOCKED = 'Unlocked';\nconst STATUS_UNLOCKFAILED = 'UnlockFailed';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nclass UnlockConnector extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_UnlockConnector__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_UnlockConnectorResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/UnlockConnector.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/UpdateFirmware.js":
/*!****************************************************!*\
  !*** ./server/ocpp/src/commands/UpdateFirmware.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UpdateFirmware\": () => (/* binding */ UpdateFirmware)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand */ \"./server/ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_UpdateFirmware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UpdateFirmware */ \"./server/ocpp/ocpp-1.6-schemas/UpdateFirmware.json\");\n/* harmony import */ var _ocpp_1_6_schemas_UpdateFirmwareResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UpdateFirmwareResponse */ \"./server/ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json\");\n\n\n\nclass UpdateFirmware extends _BaseCommand__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_UpdateFirmware__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_UpdateFirmwareResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/UpdateFirmware.js?");

/***/ }),

/***/ "./server/ocpp/src/commands/index.js":
/*!*******************************************!*\
  !*** ./server/ocpp/src/commands/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"CHARGE_POINT_COMMANDS\": () => (/* binding */ CHARGE_POINT_COMMANDS),\n/* harmony export */   \"CENTRAL_SYSTEM_COMMANDS\": () => (/* binding */ CENTRAL_SYSTEM_COMMANDS)\n/* harmony export */ });\n/* harmony import */ var _Authorize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Authorize */ \"./server/ocpp/src/commands/Authorize.js\");\n/* harmony import */ var _BootNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BootNotification */ \"./server/ocpp/src/commands/BootNotification.js\");\n/* harmony import */ var _CancelReservation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CancelReservation */ \"./server/ocpp/src/commands/CancelReservation.js\");\n/* harmony import */ var _ChangeAvailability__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChangeAvailability */ \"./server/ocpp/src/commands/ChangeAvailability.js\");\n/* harmony import */ var _ChangeConfiguration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChangeConfiguration */ \"./server/ocpp/src/commands/ChangeConfiguration.js\");\n/* harmony import */ var _ClearCache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ClearCache */ \"./server/ocpp/src/commands/ClearCache.js\");\n/* harmony import */ var _ClearChargingProfile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ClearChargingProfile */ \"./server/ocpp/src/commands/ClearChargingProfile.js\");\n/* harmony import */ var _DataTransfer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DataTransfer */ \"./server/ocpp/src/commands/DataTransfer.js\");\n/* harmony import */ var _DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DiagnosticsStatusNotification */ \"./server/ocpp/src/commands/DiagnosticsStatusNotification.js\");\n/* harmony import */ var _FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./FirmwareStatusNotification */ \"./server/ocpp/src/commands/FirmwareStatusNotification.js\");\n/* harmony import */ var _GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./GetCompositeSchedule */ \"./server/ocpp/src/commands/GetCompositeSchedule.js\");\n/* harmony import */ var _GetConfiguration__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./GetConfiguration */ \"./server/ocpp/src/commands/GetConfiguration.js\");\n/* harmony import */ var _GetDiagnostics__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./GetDiagnostics */ \"./server/ocpp/src/commands/GetDiagnostics.js\");\n/* harmony import */ var _GetLocalListVersion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./GetLocalListVersion */ \"./server/ocpp/src/commands/GetLocalListVersion.js\");\n/* harmony import */ var _Heartbeat__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Heartbeat */ \"./server/ocpp/src/commands/Heartbeat.js\");\n/* harmony import */ var _MeterValues__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./MeterValues */ \"./server/ocpp/src/commands/MeterValues.js\");\n/* harmony import */ var _RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./RemoteStartTransaction */ \"./server/ocpp/src/commands/RemoteStartTransaction.js\");\n/* harmony import */ var _RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./RemoteStopTransaction */ \"./server/ocpp/src/commands/RemoteStopTransaction.js\");\n/* harmony import */ var _ReserveNow__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ReserveNow */ \"./server/ocpp/src/commands/ReserveNow.js\");\n/* harmony import */ var _Reset__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./Reset */ \"./server/ocpp/src/commands/Reset.js\");\n/* harmony import */ var _SendLocalList__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./SendLocalList */ \"./server/ocpp/src/commands/SendLocalList.js\");\n/* harmony import */ var _SetChargingProfile__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./SetChargingProfile */ \"./server/ocpp/src/commands/SetChargingProfile.js\");\n/* harmony import */ var _StartTransaction__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./StartTransaction */ \"./server/ocpp/src/commands/StartTransaction.js\");\n/* harmony import */ var _StatusNotification__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./StatusNotification */ \"./server/ocpp/src/commands/StatusNotification.js\");\n/* harmony import */ var _StopTransaction__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./StopTransaction */ \"./server/ocpp/src/commands/StopTransaction.js\");\n/* harmony import */ var _TriggerMessage__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./TriggerMessage */ \"./server/ocpp/src/commands/TriggerMessage.js\");\n/* harmony import */ var _UnlockConnector__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./UnlockConnector */ \"./server/ocpp/src/commands/UnlockConnector.js\");\n/* harmony import */ var _UpdateFirmware__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./UpdateFirmware */ \"./server/ocpp/src/commands/UpdateFirmware.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  Authorize: _Authorize__WEBPACK_IMPORTED_MODULE_0__.Authorize,\n  BootNotification: _BootNotification__WEBPACK_IMPORTED_MODULE_1__.BootNotification,\n  CancelReservation: _CancelReservation__WEBPACK_IMPORTED_MODULE_2__.CancelReservation,\n  ChangeAvailability: _ChangeAvailability__WEBPACK_IMPORTED_MODULE_3__.ChangeAvailability,\n  ChangeConfiguration: _ChangeConfiguration__WEBPACK_IMPORTED_MODULE_4__.ChangeConfiguration,\n  ClearCache: _ClearCache__WEBPACK_IMPORTED_MODULE_5__.ClearCache,\n  ClearChargingProfile: _ClearChargingProfile__WEBPACK_IMPORTED_MODULE_6__.ClearChargingProfile,\n  DataTransfer: _DataTransfer__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  DiagnosticsStatusNotification: _DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_8__.DiagnosticsStatusNotification,\n  FirmwareStatusNotification: _FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_9__.FirmwareStatusNotification,\n  GetCompositeSchedule: _GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_10__.GetCompositeSchedule,\n  GetConfiguration: _GetConfiguration__WEBPACK_IMPORTED_MODULE_11__.GetConfiguration,\n  GetDiagnostics: _GetDiagnostics__WEBPACK_IMPORTED_MODULE_12__.GetDiagnostics,\n  GetLocalListVersion: _GetLocalListVersion__WEBPACK_IMPORTED_MODULE_13__.GetLocalListVersion,\n  Heartbeat: _Heartbeat__WEBPACK_IMPORTED_MODULE_14__.Heartbeat,\n  MeterValues: _MeterValues__WEBPACK_IMPORTED_MODULE_15__.MeterValues,\n  RemoteStartTransaction: _RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_16__.RemoteStartTransaction,\n  RemoteStopTransaction: _RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_17__.RemoteStopTransaction,\n  ReserveNow: _ReserveNow__WEBPACK_IMPORTED_MODULE_18__.ReserveNow,\n  Reset: _Reset__WEBPACK_IMPORTED_MODULE_19__.Reset,\n  SendLocalList: _SendLocalList__WEBPACK_IMPORTED_MODULE_20__.SendLocalList,\n  SetChargingProfile: _SetChargingProfile__WEBPACK_IMPORTED_MODULE_21__.SetChargingProfile,\n  StartTransaction: _StartTransaction__WEBPACK_IMPORTED_MODULE_22__.StartTransaction,\n  StatusNotification: _StatusNotification__WEBPACK_IMPORTED_MODULE_23__.StatusNotification,\n  StopTransaction: _StopTransaction__WEBPACK_IMPORTED_MODULE_24__.StopTransaction,\n  TriggerMessage: _TriggerMessage__WEBPACK_IMPORTED_MODULE_25__.TriggerMessage,\n  UnlockConnector: _UnlockConnector__WEBPACK_IMPORTED_MODULE_26__.UnlockConnector,\n  UpdateFirmware: _UpdateFirmware__WEBPACK_IMPORTED_MODULE_27__.UpdateFirmware\n});\nconst CHARGE_POINT_COMMANDS = {\n  Authorize: _Authorize__WEBPACK_IMPORTED_MODULE_0__.Authorize,\n  BootNotification: _BootNotification__WEBPACK_IMPORTED_MODULE_1__.BootNotification,\n  DataTransfer: _DataTransfer__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  DiagnosticsStatusNotification: _DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_8__.DiagnosticsStatusNotification,\n  FirmwareStatusNotification: _FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_9__.FirmwareStatusNotification,\n  Heartbeat: _Heartbeat__WEBPACK_IMPORTED_MODULE_14__.Heartbeat,\n  MeterValues: _MeterValues__WEBPACK_IMPORTED_MODULE_15__.MeterValues,\n  StartTransaction: _StartTransaction__WEBPACK_IMPORTED_MODULE_22__.StartTransaction,\n  StatusNotification: _StatusNotification__WEBPACK_IMPORTED_MODULE_23__.StatusNotification,\n  StopTransaction: _StopTransaction__WEBPACK_IMPORTED_MODULE_24__.StopTransaction\n};\nconst CENTRAL_SYSTEM_COMMANDS = {\n  CancelReservation: _CancelReservation__WEBPACK_IMPORTED_MODULE_2__.CancelReservation,\n  ChangeAvailability: _ChangeAvailability__WEBPACK_IMPORTED_MODULE_3__.ChangeAvailability,\n  ChangeConfiguration: _ChangeConfiguration__WEBPACK_IMPORTED_MODULE_4__.ChangeConfiguration,\n  ClearCache: _ClearCache__WEBPACK_IMPORTED_MODULE_5__.ClearCache,\n  ClearChargingProfile: _ClearChargingProfile__WEBPACK_IMPORTED_MODULE_6__.ClearChargingProfile,\n  DataTransfer: _DataTransfer__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  GetCompositeSchedule: _GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_10__.GetCompositeSchedule,\n  GetConfiguration: _GetConfiguration__WEBPACK_IMPORTED_MODULE_11__.GetConfiguration,\n  GetDiagnostics: _GetDiagnostics__WEBPACK_IMPORTED_MODULE_12__.GetDiagnostics,\n  GetLocalListVersion: _GetLocalListVersion__WEBPACK_IMPORTED_MODULE_13__.GetLocalListVersion,\n  RemoteStartTransaction: _RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_16__.RemoteStartTransaction,\n  RemoteStopTransaction: _RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_17__.RemoteStopTransaction,\n  ReserveNow: _ReserveNow__WEBPACK_IMPORTED_MODULE_18__.ReserveNow,\n  Reset: _Reset__WEBPACK_IMPORTED_MODULE_19__.Reset,\n  SendLocalList: _SendLocalList__WEBPACK_IMPORTED_MODULE_20__.SendLocalList,\n  SetChargingProfile: _SetChargingProfile__WEBPACK_IMPORTED_MODULE_21__.SetChargingProfile,\n  TriggerMessage: _TriggerMessage__WEBPACK_IMPORTED_MODULE_25__.TriggerMessage,\n  UnlockConnector: _UnlockConnector__WEBPACK_IMPORTED_MODULE_26__.UnlockConnector,\n  UpdateFirmware: _UpdateFirmware__WEBPACK_IMPORTED_MODULE_27__.UpdateFirmware\n};\n\n//# sourceURL=webpack://occp/./server/ocpp/src/commands/index.js?");

/***/ }),

/***/ "./server/ocpp/src/connection.js":
/*!***************************************!*\
  !*** ./server/ocpp/src/connection.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Connection\": () => (/* binding */ Connection)\n/* harmony export */ });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands */ \"./server/ocpp/src/commands/index.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ \"./server/ocpp/src/constants.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers */ \"./server/ocpp/src/helpers.js\");\n/* harmony import */ var _ocppError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ocppError */ \"./server/ocpp/src/ocppError.js\");\n\n\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_2___default()(_constants__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass Connection {\n  constructor(socket, req = null, logger = null) {\n    this.socket = socket;\n    this.req = req;\n    this.requests = {};\n    this.logger = logger;\n\n    if (req) {\n      this.url = req && req.url;\n      const ip = req && (req.connection && req.connection.remoteAddress || req.headers['x-forwarded-for']);\n\n      if (this.logger) {\n        this.logger.debug({\n          id: this.url,\n          message: `New connection from \"${ip}\", protocol \"${socket.protocol}\", url \"${this.url}\"`\n        });\n      } else {\n        debug(`New connection from \"${ip}\", protocol \"${socket.protocol}\", url \"${this.url}\"`);\n      }\n    } else {\n      this.url = 'SERVER';\n      debug(`New connection to server`);\n    }\n\n    socket.on('message', msg => this.onMessage(msg));\n    socket.on('error', err => {\n      console.info(err);\n    });\n  }\n\n  async onMessage(message) {\n    let messageType, messageId, commandNameOrPayload, commandPayload, errorDetails;\n\n    try {\n      [messageType, messageId, commandNameOrPayload, commandPayload, errorDetails] = JSON.parse(message);\n    } catch (err) {\n      throw new Error(`Failed to parse message: \"${message}\", ${err.message}`);\n    }\n\n    console.log(messageType);\n\n    switch (messageType) {\n      case _constants__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE:\n        // request\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n\n        const CommandModel = _commands__WEBPACK_IMPORTED_MODULE_3__[\"default\"][commandNameOrPayload];\n\n        if (!CommandModel) {\n          throw new Error(`Unknown command ${commandNameOrPayload}`);\n        }\n\n        let commandRequest, responseData, responseObj;\n\n        try {\n          commandRequest = new CommandModel(commandPayload);\n        } catch (err) {\n          // send error if payload didn't pass the validation\n          return await this.sendError(messageId, new _ocppError__WEBPACK_IMPORTED_MODULE_6__[\"default\"](_ocppError__WEBPACK_IMPORTED_MODULE_6__.ERROR_FORMATIONVIOLATION, err.message));\n        }\n\n        try {\n          responseData = await this.onRequest(commandRequest);\n          responseObj = commandRequest.createResponse(responseData);\n        } catch (err) {\n          return await this.sendError(messageId, err);\n        }\n\n        try {\n          await this.sendMessage(messageId, responseObj, _constants__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE);\n        } catch (err) {\n          await this.sendError(messageId, err);\n        }\n\n        break;\n\n      case _constants__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE:\n        // response\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n\n        const [responseCallback] = this.requests[messageId];\n\n        if (!responseCallback) {\n          throw new Error(`Response for unknown message ${messageId}`);\n        }\n\n        delete this.requests[messageId];\n        responseCallback(commandNameOrPayload);\n        break;\n\n      case _constants__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE:\n        // error response\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n\n        if (!this.requests[messageId]) {\n          throw new Error(`Response for unknown message ${messageId}`);\n        }\n\n        const [, rejectCallback] = this.requests[messageId];\n        delete this.requests[messageId];\n        rejectCallback(new _ocppError__WEBPACK_IMPORTED_MODULE_6__[\"default\"](commandNameOrPayload, commandPayload, errorDetails));\n        break;\n\n      default:\n        throw new Error(`Wrong message type ${messageType}`);\n    }\n  }\n\n  send(command, messageType = _constants__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE) {\n    return this.sendMessage((0,uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(), command, messageType);\n  }\n\n  sendError(messageId, err) {\n    if (this.logger) {\n      this.logger.debug(`Error: ${err.message}`);\n    } else {\n      debug(`Error: ${err.message}`);\n    }\n\n    const error = err instanceof _ocppError__WEBPACK_IMPORTED_MODULE_6__[\"default\"] ? err : new _ocppError__WEBPACK_IMPORTED_MODULE_6__[\"default\"](_ocppError__WEBPACK_IMPORTED_MODULE_6__.ERROR_INTERNALERROR, err.message);\n    return this.sendMessage(messageId, error, _constants__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE);\n  }\n\n  sendMessage(messageId, command, messageType = _constants__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE) {\n    const socket = this.socket;\n    const self = this;\n    const commandValues = (0,_helpers__WEBPACK_IMPORTED_MODULE_5__.getObjectValues)(command);\n    return new Promise((resolve, reject) => {\n      let messageToSend;\n\n      switch (messageType) {\n        case _constants__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE:\n          this.requests[messageId] = [onResponse, onRejectResponse];\n          const commandName = command.getCommandName();\n          messageToSend = JSON.stringify([messageType, messageId, commandName, commandValues]);\n          break;\n\n        case _constants__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE:\n          messageToSend = JSON.stringify([messageType, messageId, commandValues]);\n          break;\n\n        case _constants__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE:\n          const {\n            code,\n            message,\n            details\n          } = command;\n          messageToSend = JSON.stringify([messageType, messageId, code, message, details]);\n          break;\n      }\n\n      if (this.logger) {\n        this.logger.debug(`<< ${messageToSend}`);\n      } else {\n        debug(`<< ${messageToSend}`);\n      }\n\n      if (socket.readyState === (ws__WEBPACK_IMPORTED_MODULE_1___default().OPEN)) {\n        socket.send(messageToSend);\n      } else {\n        return onRejectResponse(`Socket closed ${messageId}`);\n      }\n\n      if (messageType !== _constants__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE) {\n        resolve();\n      } else {\n        setTimeout(() => onRejectResponse(`Timeout for message ${messageId}`), _constants__WEBPACK_IMPORTED_MODULE_4__.SOCKET_TIMEOUT);\n      }\n\n      function onResponse(payload) {\n        const response = command.createResponse(payload);\n        return resolve(response);\n      }\n\n      function onRejectResponse(reason) {\n        self.requests[messageId] = () => {};\n\n        const error = reason instanceof _ocppError__WEBPACK_IMPORTED_MODULE_6__[\"default\"] ? reason : new Error(reason);\n        reject(error);\n      }\n    });\n  }\n\n  onRequest(request) {}\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/connection.js?");

/***/ }),

/***/ "./server/ocpp/src/connector.js":
/*!**************************************!*\
  !*** ./server/ocpp/src/connector.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Connector)\n/* harmony export */ });\n/* harmony import */ var _commands_StatusNotification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commands/StatusNotification */ \"./server/ocpp/src/commands/StatusNotification.js\");\n\nclass Connector {\n  constructor(connectorId) {\n    this.connectorId = connectorId;\n    this.status = _commands_StatusNotification__WEBPACK_IMPORTED_MODULE_0__.STATUS_AVAILABLE;\n    this.errorCode = _commands_StatusNotification__WEBPACK_IMPORTED_MODULE_0__.ERRORCODE_NOERROR;\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/connector.js?");

/***/ }),

/***/ "./server/ocpp/src/constants.js":
/*!**************************************!*\
  !*** ./server/ocpp/src/constants.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DEBUG_LIBNAME\": () => (/* binding */ DEBUG_LIBNAME),\n/* harmony export */   \"OCPP_PROTOCOL_1_6\": () => (/* binding */ OCPP_PROTOCOL_1_6),\n/* harmony export */   \"SOCKET_TIMEOUT\": () => (/* binding */ SOCKET_TIMEOUT),\n/* harmony export */   \"CALL_MESSAGE\": () => (/* binding */ CALL_MESSAGE),\n/* harmony export */   \"CALLRESULT_MESSAGE\": () => (/* binding */ CALLRESULT_MESSAGE),\n/* harmony export */   \"CALLERROR_MESSAGE\": () => (/* binding */ CALLERROR_MESSAGE)\n/* harmony export */ });\nconst DEBUG_LIBNAME = 'ocpp-eliftech';\nconst OCPP_PROTOCOL_1_6 = 'ocpp1.6';\nconst SOCKET_TIMEOUT = 30 * 1000; // 30 sec\n// ## MessageType constants\n//\n// To identify the type of message one of the following Message Type Numbers MUST be used.\n//\n// When a server receives a message with a Message Type Number not in this list, it SHALL ignore the\n// message payload. Each message type may have additional required fields.\n\nconst CALL_MESSAGE = 2; // Client-to-Server\n\nconst CALLRESULT_MESSAGE = 3; // Server-to-Client\n\nconst CALLERROR_MESSAGE = 4; // Server-to-Client\n\n//# sourceURL=webpack://occp/./server/ocpp/src/constants.js?");

/***/ }),

/***/ "./server/ocpp/src/helpers.js":
/*!************************************!*\
  !*** ./server/ocpp/src/helpers.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"applyPropertiesValidators\": () => (/* binding */ applyPropertiesValidators),\n/* harmony export */   \"getObjectValues\": () => (/* binding */ getObjectValues)\n/* harmony export */ });\n/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! joi */ \"joi\");\n/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var enjoi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! enjoi */ \"enjoi\");\n/* harmony import */ var enjoi__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(enjoi__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst MODEL_VALUES_SYMBOL = Symbol('modelValues');\nfunction applyPropertiesValidators(object, schema, values = {}) {\n  const joiSchema = new (enjoi__WEBPACK_IMPORTED_MODULE_1___default())(schema);\n  object[MODEL_VALUES_SYMBOL] = {};\n  const properties = {};\n\n  for (let key in schema.properties) {\n    if (!schema.properties.hasOwnProperty(key)) {\n      return;\n    }\n\n    const validator = joi__WEBPACK_IMPORTED_MODULE_0___default().reach(joiSchema, key);\n    validate(key, values[key], validator);\n    object[MODEL_VALUES_SYMBOL][key] = values[key];\n    properties[key] = {\n      get: () => object[MODEL_VALUES_SYMBOL][key],\n      set: val => {\n        validate(key, val, validator);\n        val === undefined ? delete object[MODEL_VALUES_SYMBOL][key] : object[MODEL_VALUES_SYMBOL][key] = val;\n      },\n      enumerable: true,\n      configurable: false\n    };\n  }\n\n  Object.defineProperties(object, properties);\n\n  function validate(fieldName, value, schema) {\n    const {\n      error\n    } = joi__WEBPACK_IMPORTED_MODULE_0___default().validate(value, schema);\n\n    if (error !== null) {\n      throw new Error(`Invalid value \"${value}\" for field ${fieldName}`);\n    }\n  }\n}\nfunction getObjectValues(object) {\n  const values = { ...(object[MODEL_VALUES_SYMBOL] || {})\n  };\n\n  for (let key in values) {\n    if (!values.hasOwnProperty(key)) {\n      return;\n    }\n\n    if (values[key] === undefined) {\n      delete values[key];\n    }\n  }\n\n  return object[MODEL_VALUES_SYMBOL];\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/helpers.js?");

/***/ }),

/***/ "./server/ocpp/src/index.js":
/*!**********************************!*\
  !*** ./server/ocpp/src/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ChargePoint\": () => (/* reexport safe */ _chargePoint__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"CentralSystem\": () => (/* reexport safe */ _centralSystem__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"Connector\": () => (/* reexport safe */ _connector__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   \"OCPPCommands\": () => (/* reexport safe */ _commands__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _chargePoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chargePoint */ \"./server/ocpp/src/chargePoint.js\");\n/* harmony import */ var _centralSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./centralSystem */ \"./server/ocpp/src/centralSystem.js\");\n/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connector */ \"./server/ocpp/src/connector.js\");\n/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands */ \"./server/ocpp/src/commands/index.js\");\n\n\n\n\n\n\n//# sourceURL=webpack://occp/./server/ocpp/src/index.js?");

/***/ }),

/***/ "./server/ocpp/src/logger.js":
/*!***********************************!*\
  !*** ./server/ocpp/src/logger.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"LOGGER_URL\": () => (/* binding */ LOGGER_URL),\n/* harmony export */   \"default\": () => (/* binding */ Logger)\n/* harmony export */ });\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ \"./server/ocpp/src/constants.js\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(_constants__WEBPACK_IMPORTED_MODULE_1__.DEBUG_LIBNAME);\nconst LOGGER_URL = '/logger';\nconst COUNT_MESSAGE_TO_STORE = 10;\nclass Logger {\n  constructor() {\n    this.sockets = [];\n    this.messages = [];\n  }\n\n  addSocket(socket) {\n    this.sockets.push(socket);\n    console.info('add');\n    socket.send(JSON.stringify({\n      command: 'history',\n      messages: this.messages\n    }));\n  }\n\n  debug(message) {\n    if (typeof message !== 'string') {\n      message = JSON.stringify(message);\n    }\n\n    this.messages.push(message);\n\n    if (this.messages.length > COUNT_MESSAGE_TO_STORE) {\n      this.messages = this.messages.slice(this.messages.length - COUNT_MESSAGE_TO_STORE, this.messages.length);\n    }\n\n    debug(message);\n    this.sendMessage({\n      command: 'message',\n      message\n    });\n  }\n\n  sendMessage(messageToSend) {\n    if (typeof messageToSend !== 'string') {\n      messageToSend = JSON.stringify(messageToSend);\n    }\n\n    for (let socket of this.sockets) {\n      if (socket.readyState === (ws__WEBPACK_IMPORTED_MODULE_2___default().OPEN)) {\n        socket.send(messageToSend);\n      }\n    }\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/logger.js?");

/***/ }),

/***/ "./server/ocpp/src/ocppError.js":
/*!**************************************!*\
  !*** ./server/ocpp/src/ocppError.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ERROR_NOTIMPLEMENTED\": () => (/* binding */ ERROR_NOTIMPLEMENTED),\n/* harmony export */   \"ERROR_NOTSUPPORTED\": () => (/* binding */ ERROR_NOTSUPPORTED),\n/* harmony export */   \"ERROR_INTERNALERROR\": () => (/* binding */ ERROR_INTERNALERROR),\n/* harmony export */   \"ERROR_PROTOCOLERROR\": () => (/* binding */ ERROR_PROTOCOLERROR),\n/* harmony export */   \"ERROR_SECURITYERROR\": () => (/* binding */ ERROR_SECURITYERROR),\n/* harmony export */   \"ERROR_FORMATIONVIOLATION\": () => (/* binding */ ERROR_FORMATIONVIOLATION),\n/* harmony export */   \"ERROR_PROPERTYCONSTRAINTVIOLATION\": () => (/* binding */ ERROR_PROPERTYCONSTRAINTVIOLATION),\n/* harmony export */   \"ERROR_OCCURENCECONSTRAINTVIOLATION\": () => (/* binding */ ERROR_OCCURENCECONSTRAINTVIOLATION),\n/* harmony export */   \"ERROR_TYPECONSTRAINTVIOLATION\": () => (/* binding */ ERROR_TYPECONSTRAINTVIOLATION),\n/* harmony export */   \"ERROR_GENERICERROR\": () => (/* binding */ ERROR_GENERICERROR),\n/* harmony export */   \"default\": () => (/* binding */ OCPPError)\n/* harmony export */ });\n// Requested Action is not known by receiver\nconst ERROR_NOTIMPLEMENTED = 'NotImplemented'; // Requested Action is recognized but not supported by the receiver\n\nconst ERROR_NOTSUPPORTED = 'NotSupported'; // An internal error occurred and the receiver was not able to process the requested Action successfully\n\nconst ERROR_INTERNALERROR = 'InternalError'; // Payload for Action is incomplete\n\nconst ERROR_PROTOCOLERROR = 'ProtocolError'; // During the processing of Action a security issue occurred preventing receiver from completing the Action successfully\n\nconst ERROR_SECURITYERROR = 'SecurityError'; // Payload for Action is syntactically incorrect or not conform the PDU structure for Action\n\nconst ERROR_FORMATIONVIOLATION = 'FormationViolation'; // Payload is syntactically correct but at least one field contains an invalid value\n\nconst ERROR_PROPERTYCONSTRAINTVIOLATION = 'PropertyConstraintViolation'; // Payload for Action is syntactically correct but at least one of the fields violates occurence constraints\n\nconst ERROR_OCCURENCECONSTRAINTVIOLATION = 'OccurenceConstraintViolation'; // Payload for Action is syntactically correct but at least one of the fields violates data type constraints (e.g. “somestring”: 12)\n\nconst ERROR_TYPECONSTRAINTVIOLATION = 'TypeConstraintViolation'; // Any other error not covered by the previous ones\n\nconst ERROR_GENERICERROR = 'GenericError';\nclass OCPPError extends Error {\n  constructor(code, message, details) {\n    super(message);\n    this.code = code;\n    this.message = message;\n    this.details = details;\n    Object.setPrototypeOf(this, OCPPError.prototype); // for instanceof\n\n    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack;\n  }\n\n}\n\n//# sourceURL=webpack://occp/./server/ocpp/src/ocppError.js?");

/***/ }),

/***/ "./server/routes/auth.routes.js":
/*!**************************************!*\
  !*** ./server/routes/auth.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/auth/signin').post(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signin);\nrouter.route('/auth/signout').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signout);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://occp/./server/routes/auth.routes.js?");

/***/ }),

/***/ "./server/routes/chargerPoint.routes.js":
/*!**********************************************!*\
  !*** ./server/routes/chargerPoint.routes.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/chargerPoint.controller */ \"./server/controllers/chargerPoint.controller.js\");\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/ocpp/chargerPoints/status').get(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].status);\nrouter.route('/ocpp/chargerPoints/clients').get(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].clients);\nrouter.route('/ocpp/chargerPoints/:station').get(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].read).put(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].update).delete(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].remove);\nrouter.route('/ocpp/chargerPoints/start/:userId').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].remoteStart);\nrouter.route('/ocpp/chargerPoints/unlock/').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].unlock);\nrouter.route('/ocpp/chargerPoints/stop/').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].stop);\nrouter.route('/ocpp/chargerPoints/reset').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].reset);\nrouter.route('/ocpp/chargerPoints/get_conf').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getConf);\nrouter.route('/ocpp/chargerPoints/set_conf').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].setConfig);\nrouter.route('/ocpp/chargerPoints/clear_cache').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].clearCache);\nrouter.route('/ocpp/chargerPoints/trigger-message').post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].triggerMessage);\nrouter.route('/ocpp/chargerPoints').get(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].list).post(_controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].create);\nrouter.param('station', _controllers_chargerPoint_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].chargerPointByID);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://occp/./server/routes/chargerPoint.routes.js?");

/***/ }),

/***/ "./server/routes/cost.routes.js":
/*!**************************************!*\
  !*** ./server/routes/cost.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_cost_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/cost.controller */ \"./server/controllers/cost.controller.js\");\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/ocpp/cost').get(_controllers_cost_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_cost_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://occp/./server/routes/cost.routes.js?");

/***/ }),

/***/ "./server/routes/transaction.routes.js":
/*!*********************************************!*\
  !*** ./server/routes/transaction.routes.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n/* harmony import */ var _controllers_transaction_controller__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/transaction.controller */ \"./server/controllers/transaction.controller.js\");\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/ocpp/transactions/').get(_controllers_transaction_controller__WEBPACK_IMPORTED_MODULE_3__[\"default\"].list);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://occp/./server/routes/transaction.routes.js?");

/***/ }),

/***/ "./server/routes/user.routes.js":
/*!**************************************!*\
  !*** ./server/routes/user.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/api/users').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\nrouter.route('/api/users/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read).put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].update).delete(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://occp/./server/routes/user.routes.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"centralSystem\": () => (/* binding */ centralSystem)\n/* harmony export */ });\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../config/config */ \"./config/config.js\");\n/* harmony import */ var _express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./express */ \"./server/express.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _centralSystem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./centralSystem */ \"./server/centralSystem.js\");\n\n\n //import WebSocket from \"ws\";\n\n\nprocess.on('uncaughtException', function (err) {\n  console.log('Caught exception: ' + err);\n});\nprocess.on('unhandledRejection', function (reason, p) {\n  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);\n});\n\nconst server = (__webpack_require__(/*! http */ \"http\").createServer)(_express__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\nconst centralSystem = (0,_centralSystem__WEBPACK_IMPORTED_MODULE_3__.createServer)(server); // const wss = new WebSocket.Server({ server: server });\n// export { wss };\n// require(\"./ws\");\n\nserver.listen(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port, err => {\n  if (err) {\n    console.log(err);\n  }\n\n  console.info('Server started on port %s.', _config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port);\n});\n(mongoose__WEBPACK_IMPORTED_MODULE_2___default().Promise) = global.Promise;\nmongoose__WEBPACK_IMPORTED_MODULE_2___default().connect(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri, {\n  useNewUrlParser: true,\n  useCreateIndex: true,\n  useUnifiedTopology: true\n});\nmongoose__WEBPACK_IMPORTED_MODULE_2___default().connection.on('error', () => {\n  throw new Error(`unable to connect to database: ${_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri}`);\n});\n\n\n//# sourceURL=webpack://occp/./server/server.js?");

/***/ }),

/***/ "./server/sse.js":
/*!***********************!*\
  !*** ./server/sse.js ***!
  \***********************/
/***/ ((module) => {

eval("module.exports = function (req, res, next) {\n  res.sseSetup = function () {\n    res.writeHead(200, {\n      'Content-Type': 'text/event-stream',\n      'Cache-Control': 'no-cache',\n      Connection: 'keep-alive'\n    });\n  };\n\n  res.sseSend = function (data) {\n    res.write('data: ' + JSON.stringify(data) + '\\n\\n');\n  };\n\n  next();\n};\n\n//# sourceURL=webpack://occp/./server/sse.js?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("debug");

/***/ }),

/***/ "enjoi":
/*!************************!*\
  !*** external "enjoi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("enjoi");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-jwt");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("helmet");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("joi");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("lodash");

/***/ }),

/***/ "lodash/extend":
/*!********************************!*\
  !*** external "lodash/extend" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("lodash/extend");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("ws");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/Authorize.json":
/*!*****************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/Authorize.json ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"AuthorizeRequest\",\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20}},\"additionalProperties\":false,\"required\":[\"idTag\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/Authorize.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/AuthorizeResponse.json":
/*!*************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/AuthorizeResponse.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"AuthorizeResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]},\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20}},\"required\":[\"status\"]}},\"additionalProperties\":false,\"required\":[\"idTagInfo\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/AuthorizeResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/BootNotification.json":
/*!************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/BootNotification.json ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"BootNotificationRequest\",\"type\":\"object\",\"properties\":{\"chargePointVendor\":{\"type\":\"string\",\"maxLength\":20},\"chargePointModel\":{\"type\":\"string\",\"maxLength\":20},\"chargePointSerialNumber\":{\"type\":\"string\",\"maxLength\":25},\"chargeBoxSerialNumber\":{\"type\":\"string\",\"maxLength\":25},\"firmwareVersion\":{\"type\":\"string\",\"maxLength\":50},\"iccid\":{\"type\":\"string\",\"maxLength\":20},\"imsi\":{\"type\":\"string\",\"maxLength\":20},\"meterType\":{\"type\":\"string\",\"maxLength\":25},\"meterSerialNumber\":{\"type\":\"string\",\"maxLength\":25}},\"additionalProperties\":false,\"required\":[\"chargePointVendor\",\"chargePointModel\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/BootNotification.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/BootNotificationResponse.json":
/*!********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/BootNotificationResponse.json ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"BootNotificationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Pending\",\"Rejected\"]},\"currentTime\":{\"type\":\"string\",\"format\":\"date-time\"},\"interval\":{\"type\":\"number\"}},\"additionalProperties\":false,\"required\":[\"status\",\"currentTime\",\"interval\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/BootNotificationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/CancelReservation.json":
/*!*************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/CancelReservation.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"CancelReservationRequest\",\"type\":\"object\",\"properties\":{\"reservationId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"reservationId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/CancelReservation.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/CancelReservationResponse.json":
/*!*********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/CancelReservationResponse.json ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"CancelReservationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/CancelReservationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ChangeAvailability.json":
/*!**************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ChangeAvailability.json ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeAvailabilityRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"type\":{\"type\":\"string\",\"enum\":[\"Inoperative\",\"Operative\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"type\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ChangeAvailability.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json":
/*!**********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeAvailabilityResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"Scheduled\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ChangeConfiguration.json":
/*!***************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ChangeConfiguration.json ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeConfigurationRequest\",\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"string\",\"maxLength\":50},\"value\":{\"type\":\"string\",\"maxLength\":500}},\"additionalProperties\":false,\"required\":[\"key\",\"value\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ChangeConfiguration.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json":
/*!***********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeConfigurationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"RebootRequired\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ClearCache.json":
/*!******************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ClearCache.json ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearCacheRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ClearCache.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ClearCacheResponse.json":
/*!**************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ClearCacheResponse.json ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearCacheResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ClearCacheResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ClearChargingProfile.json":
/*!****************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ClearChargingProfile.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearChargingProfileRequest\",\"type\":\"object\",\"properties\":{\"id\":{\"type\":\"integer\"},\"connectorId\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"stackLevel\":{\"type\":\"integer\"}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ClearChargingProfile.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json":
/*!************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearChargingProfileResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Unknown\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/DataTransfer.json":
/*!********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/DataTransfer.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DataTransferRequest\",\"type\":\"object\",\"properties\":{\"vendorId\":{\"type\":\"string\",\"maxLength\":255},\"messageId\":{\"type\":\"string\",\"maxLength\":50},\"data\":{\"type\":\"string\"}},\"additionalProperties\":false,\"required\":[\"vendorId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/DataTransfer.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/DataTransferResponse.json":
/*!****************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/DataTransferResponse.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DataTransferResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"UnknownMessageId\",\"UnknownVendorId\"]},\"data\":{\"type\":\"string\"}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/DataTransferResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json":
/*!*************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DiagnosticsStatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Idle\",\"Uploaded\",\"UploadFailed\",\"Uploading\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json":
/*!*********************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json ***!
  \*********************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DiagnosticsStatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json":
/*!**********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"FirmwareStatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Downloaded\",\"DownloadFailed\",\"Downloading\",\"Idle\",\"InstallationFailed\",\"Installing\",\"Installed\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json":
/*!******************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json ***!
  \******************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"FirmwareStatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json":
/*!****************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetCompositeScheduleRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"duration\":{\"type\":\"integer\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"duration\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json":
/*!************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetCompositeScheduleResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]},\"connectorId\":{\"type\":\"integer\"},\"scheduleStart\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetConfiguration.json":
/*!************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetConfiguration.json ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetConfigurationRequest\",\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"maxLength\":50}}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetConfiguration.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json":
/*!********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetConfigurationResponse\",\"type\":\"object\",\"properties\":{\"configurationKey\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"string\",\"maxLength\":50},\"readonly\":{\"type\":\"boolean\"},\"value\":{\"type\":\"string\",\"maxLength\":500}},\"required\":[\"key\",\"readonly\"]}},\"unknownKey\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"maxLength\":50}}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetDiagnostics.json":
/*!**********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetDiagnostics.json ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetDiagnosticsRequest\",\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"format\":\"uri\"},\"retries\":{\"type\":\"integer\"},\"retryInterval\":{\"type\":\"integer\"},\"startTime\":{\"type\":\"string\",\"format\":\"date-time\"},\"stopTime\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"location\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetDiagnostics.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json":
/*!******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetDiagnosticsResponse\",\"type\":\"object\",\"properties\":{\"fileName\":{\"type\":\"string\",\"maxLength\":255}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetLocalListVersion.json":
/*!***************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetLocalListVersion.json ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetLocalListVersionRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetLocalListVersion.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json":
/*!***********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetLocalListVersionResponse\",\"type\":\"object\",\"properties\":{\"listVersion\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"listVersion\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/Heartbeat.json":
/*!*****************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/Heartbeat.json ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"HeartbeatRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/Heartbeat.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/HeartbeatResponse.json":
/*!*************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/HeartbeatResponse.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"HeartbeatResponse\",\"type\":\"object\",\"properties\":{\"currentTime\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"currentTime\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/HeartbeatResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/MeterValues.json":
/*!*******************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/MeterValues.json ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"MeterValuesRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"meterValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"sampledValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"value\":{\"type\":\"string\"},\"context\":{\"type\":\"string\",\"enum\":[\"Interruption.Begin\",\"Interruption.End\",\"Sample.Clock\",\"Sample.Periodic\",\"Transaction.Begin\",\"Transaction.End\",\"Trigger\",\"Other\"]},\"format\":{\"type\":\"string\",\"enum\":[\"Raw\",\"SignedData\"]},\"measurand\":{\"type\":\"string\",\"enum\":[\"Energy.Active.Export.Register\",\"Energy.Active.Import.Register\",\"Energy.Reactive.Export.Register\",\"Energy.Reactive.Import.Register\",\"Energy.Active.Export.Interval\",\"Energy.Active.Import.Interval\",\"Energy.Reactive.Export.Interval\",\"Energy.Reactive.Import.Interval\",\"Power.Active.Export\",\"Power.Active.Import\",\"Power.Offered\",\"Power.Reactive.Export\",\"Power.Reactive.Import\",\"Power.Factor\",\"Current.Import\",\"Current.Export\",\"Current.Offered\",\"Voltage\",\"Frequency\",\"Temperature\",\"SoC\",\"RPM\"]},\"phase\":{\"type\":\"string\",\"enum\":[\"L1\",\"L2\",\"L3\",\"N\",\"L1-N\",\"L2-N\",\"L3-N\",\"L1-L2\",\"L2-L3\",\"L3-L1\"]},\"location\":{\"type\":\"string\",\"enum\":[\"Cable\",\"EV\",\"Inlet\",\"Outlet\",\"Body\"]},\"unit\":{\"type\":\"string\",\"enum\":[\"Wh\",\"kWh\",\"varh\",\"kvarh\",\"W\",\"kW\",\"VA\",\"kVA\",\"var\",\"kvar\",\"A\",\"V\",\"K\",\"Celcius\",\"Fahrenheit\",\"Percent\"]}},\"required\":[\"value\"]}}},\"required\":[\"timestamp\",\"sampledValue\"]}}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"meterValue\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/MeterValues.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/MeterValuesResponse.json":
/*!***************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/MeterValuesResponse.json ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"MeterValuesResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/MeterValuesResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json":
/*!******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStartTransactionRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"chargingProfile\":{\"type\":\"object\",\"properties\":{\"chargingProfileId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"stackLevel\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"chargingProfileKind\":{\"type\":\"string\",\"enum\":[\"Absolute\",\"Recurring\",\"Relative\"]},\"recurrencyKind\":{\"type\":\"string\",\"enum\":[\"Daily\",\"Weekly\"]},\"validFrom\":{\"type\":\"string\",\"format\":\"date-time\"},\"validTo\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"required\":[\"chargingProfileId\",\"stackLevel\",\"chargingProfilePurpose\",\"chargingProfileKind\",\"chargingSchedule\"]}},\"additionalProperties\":false,\"required\":[\"idTag\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json":
/*!**************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStartTransactionResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json":
/*!*****************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStopTransactionRequest\",\"type\":\"object\",\"properties\":{\"transactionId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"transactionId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json":
/*!*************************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStopTransactionResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ReserveNow.json":
/*!******************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ReserveNow.json ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ReserveNowRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"reservationId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"expiryDate\",\"idTag\",\"reservationId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ReserveNow.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ReserveNowResponse.json":
/*!**************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ReserveNowResponse.json ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ReserveNowResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Faulted\",\"Occupied\",\"Rejected\",\"Unavailable\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ReserveNowResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/Reset.json":
/*!*************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/Reset.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ResetRequest\",\"type\":\"object\",\"properties\":{\"type\":{\"type\":\"string\",\"enum\":[\"Hard\",\"Soft\"]}},\"additionalProperties\":false,\"required\":[\"type\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/Reset.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/ResetResponse.json":
/*!*********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/ResetResponse.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ResetResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/ResetResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/SendLocalList.json":
/*!*********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/SendLocalList.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SendLocalListRequest\",\"type\":\"object\",\"properties\":{\"listVersion\":{\"type\":\"integer\"},\"localAuthorizationList\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]}},\"required\":[\"idTag\"]}},\"updateType\":{\"type\":\"string\",\"enum\":[\"Differential\",\"Full\"]}},\"additionalProperties\":false,\"required\":[\"listVersion\",\"updateType\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/SendLocalList.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/SendLocalListResponse.json":
/*!*****************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/SendLocalListResponse.json ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SendLocalListResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Failed\",\"NotSupported\",\"VersionMismatch\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/SendLocalListResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/SetChargingProfile.json":
/*!**************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/SetChargingProfile.json ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SetChargingProfileRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"csChargingProfiles\":{\"type\":\"object\",\"properties\":{\"chargingProfileId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"stackLevel\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"chargingProfileKind\":{\"type\":\"string\",\"enum\":[\"Absolute\",\"Recurring\",\"Relative\"]},\"recurrencyKind\":{\"type\":\"string\",\"enum\":[\"Daily\",\"Weekly\"]},\"validFrom\":{\"type\":\"string\",\"format\":\"date-time\"},\"validTo\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"required\":[\"chargingProfileId\",\"stackLevel\",\"chargingProfilePurpose\",\"chargingProfileKind\",\"chargingSchedule\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"csChargingProfiles\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/SetChargingProfile.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json":
/*!**********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SetChargingProfileResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StartTransaction.json":
/*!************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StartTransaction.json ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StartTransactionRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"meterStart\":{\"type\":\"integer\"},\"reservationId\":{\"type\":\"integer\"},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"idTag\",\"meterStart\",\"timestamp\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StartTransaction.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StartTransactionResponse.json":
/*!********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StartTransactionResponse.json ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StartTransactionResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]},\"transactionId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"idTagInfo\",\"transactionId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StartTransactionResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StatusNotification.json":
/*!**************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StatusNotification.json ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"errorCode\":{\"type\":\"string\",\"enum\":[\"ConnectorLockFailure\",\"EVCommunicationError\",\"GroundFailure\",\"HighTemperature\",\"InternalError\",\"LocalListConflict\",\"NoError\",\"OtherError\",\"OverCurrentFailure\",\"PowerMeterFailure\",\"PowerSwitchFailure\",\"ReaderFailure\",\"ResetFailure\",\"UnderVoltage\",\"OverVoltage\",\"WeakSignal\"]},\"info\":{\"type\":\"string\",\"maxLength\":50},\"status\":{\"type\":\"string\",\"enum\":[\"Available\",\"Preparing\",\"Charging\",\"SuspendedEVSE\",\"SuspendedEV\",\"Finishing\",\"Reserved\",\"Unavailable\",\"Faulted\"]},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"vendorId\":{\"type\":\"string\",\"maxLength\":255},\"vendorErrorCode\":{\"type\":\"string\",\"maxLength\":50}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"errorCode\",\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StatusNotification.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json":
/*!**********************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StopTransaction.json":
/*!***********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StopTransaction.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StopTransactionRequest\",\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"meterStop\":{\"type\":\"integer\"},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"transactionId\":{\"type\":\"integer\"},\"reason\":{\"type\":\"string\",\"enum\":[\"EmergencyStop\",\"EVDisconnected\",\"HardReset\",\"Local\",\"Other\",\"PowerLoss\",\"Reboot\",\"Remote\",\"SoftReset\",\"UnlockCommand\",\"DeAuthorized\"]},\"transactionData\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"sampledValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"value\":{\"type\":\"string\"},\"context\":{\"type\":\"string\",\"enum\":[\"Interruption.Begin\",\"Interruption.End\",\"Sample.Clock\",\"Sample.Periodic\",\"Transaction.Begin\",\"Transaction.End\",\"Trigger\",\"Other\"]},\"format\":{\"type\":\"string\",\"enum\":[\"Raw\",\"SignedData\"]},\"measurand\":{\"type\":\"string\",\"enum\":[\"Energy.Active.Export.Register\",\"Energy.Active.Import.Register\",\"Energy.Reactive.Export.Register\",\"Energy.Reactive.Import.Register\",\"Energy.Active.Export.Interval\",\"Energy.Active.Import.Interval\",\"Energy.Reactive.Export.Interval\",\"Energy.Reactive.Import.Interval\",\"Power.Active.Export\",\"Power.Active.Import\",\"Power.Offered\",\"Power.Reactive.Export\",\"Power.Reactive.Import\",\"Power.Factor\",\"Current.Import\",\"Current.Export\",\"Current.Offered\",\"Voltage\",\"Frequency\",\"Temperature\",\"SoC\",\"RPM\"]},\"phase\":{\"type\":\"string\",\"enum\":[\"L1\",\"L2\",\"L3\",\"N\",\"L1-N\",\"L2-N\",\"L3-N\",\"L1-L2\",\"L2-L3\",\"L3-L1\"]},\"location\":{\"type\":\"string\",\"enum\":[\"Cable\",\"EV\",\"Inlet\",\"Outlet\",\"Body\"]},\"unit\":{\"type\":\"string\",\"enum\":[\"Wh\",\"kWh\",\"varh\",\"kvarh\",\"W\",\"kW\",\"VA\",\"kVA\",\"var\",\"kvar\",\"A\",\"V\",\"K\",\"Celcius\",\"Fahrenheit\",\"Percent\"]}},\"required\":[\"value\"]}}},\"required\":[\"timestamp\",\"sampledValue\"]}}},\"additionalProperties\":false,\"required\":[\"transactionId\",\"timestamp\",\"meterStop\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StopTransaction.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/StopTransactionResponse.json":
/*!*******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/StopTransactionResponse.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StopTransactionResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/StopTransactionResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/TriggerMessage.json":
/*!**********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/TriggerMessage.json ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"TriggerMessageRequest\",\"type\":\"object\",\"properties\":{\"requestedMessage\":{\"type\":\"string\",\"enum\":[\"BootNotification\",\"DiagnosticsStatusNotification\",\"FirmwareStatusNotification\",\"Heartbeat\",\"MeterValues\",\"StatusNotification\"]},\"connectorId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"requestedMessage\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/TriggerMessage.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json":
/*!******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"TriggerMessageResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"NotImplemented\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/UnlockConnector.json":
/*!***********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/UnlockConnector.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UnlockConnectorRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"connectorId\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/UnlockConnector.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json":
/*!*******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UnlockConnectorResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Unlocked\",\"UnlockFailed\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/UpdateFirmware.json":
/*!**********************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/UpdateFirmware.json ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UpdateFirmwareRequest\",\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"format\":\"uri\"},\"retries\":{\"type\":\"number\"},\"retrieveDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"retryInterval\":{\"type\":\"number\"}},\"additionalProperties\":false,\"required\":[\"location\",\"retrieveDate\"]}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/UpdateFirmware.json?");

/***/ }),

/***/ "./server/ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json":
/*!******************************************************************!*\
  !*** ./server/ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UpdateFirmwareResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://occp/./server/ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;