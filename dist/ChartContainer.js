"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _service = require("./service");

var _jsonDigger = _interopRequireDefault(require("json-digger"));

var _domToImage = _interopRequireDefault(require("dom-to-image"));

var _ChartNode = _interopRequireDefault(require("./ChartNode"));

require("./ChartContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var propTypes = {
  datasource: _propTypes.default.object.isRequired,
  pan: _propTypes.default.bool,
  zoom: _propTypes.default.bool,
  zoomoutLimit: _propTypes.default.number,
  zoominLimit: _propTypes.default.number,
  containerClass: _propTypes.default.string,
  chartClass: _propTypes.default.string,
  NodeTemplate: _propTypes.default.elementType,
  draggable: _propTypes.default.bool,
  collapsible: _propTypes.default.bool,
  multipleSelect: _propTypes.default.bool,
  onClickNode: _propTypes.default.func,
  onClickChart: _propTypes.default.func
};
var defaultProps = {
  pan: false,
  zoom: false,
  zoomoutLimit: 0.5,
  zoominLimit: 7,
  containerClass: '',
  chartClass: '',
  draggable: false,
  collapsible: true,
  multipleSelect: false
};
var ChartContainer = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var datasource = _ref.datasource,
      pan = _ref.pan,
      zoom = _ref.zoom,
      zoomoutLimit = _ref.zoomoutLimit,
      zoominLimit = _ref.zoominLimit,
      containerClass = _ref.containerClass,
      chartClass = _ref.chartClass,
      NodeTemplate = _ref.NodeTemplate,
      draggable = _ref.draggable,
      collapsible = _ref.collapsible,
      multipleSelect = _ref.multipleSelect,
      onClickNode = _ref.onClickNode,
      onClickChart = _ref.onClickChart;
  var container = (0, _react.useRef)();
  var chart = (0, _react.useRef)();
  var downloadButton = (0, _react.useRef)();

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      startX = _useState2[0],
      setStartX = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      startY = _useState4[0],
      setStartY = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      transform = _useState6[0],
      setTransform = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      panning = _useState8[0],
      setPanning = _useState8[1];

  var _useState9 = (0, _react.useState)('default'),
      _useState10 = _slicedToArray(_useState9, 2),
      cursor = _useState10[0],
      setCursor = _useState10[1];

  var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      exporting = _useState12[0],
      setExporting = _useState12[1];

  var _useState13 = (0, _react.useState)(''),
      _useState14 = _slicedToArray(_useState13, 2),
      dataURL = _useState14[0],
      setDataURL = _useState14[1];

  var _useState15 = (0, _react.useState)(''),
      _useState16 = _slicedToArray(_useState15, 2),
      download = _useState16[0],
      setDownload = _useState16[1];

  var attachRel = function attachRel(data, flags) {
    data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);

    if (data.children) {
      data.children.forEach(function (item) {
        attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
      });
    }

    return data;
  };

  var _useState17 = (0, _react.useState)(datasource),
      _useState18 = _slicedToArray(_useState17, 2),
      ds = _useState18[0],
      setDS = _useState18[1];

  (0, _react.useEffect)(function () {
    setDS(datasource);
  }, [datasource]);
  var dsDigger = new _jsonDigger.default(datasource, 'id', 'children');

  var clickChartHandler = function clickChartHandler(event) {
    if (!event.target.closest('.oc-node')) {
      if (onClickChart) {
        onClickChart();
      }

      _service.selectNodeService.clearSelectedNodeInfo();
    }
  };

  var panEndHandler = function panEndHandler() {
    setPanning(false);
    setCursor('default');
  };

  var panHandler = function panHandler(e) {
    var newX = 0;
    var newY = 0;

    if (!e.targetTouches) {
      // pand on desktop
      newX = e.pageX - startX;
      newY = e.pageY - startY;
    } else if (e.targetTouches.length === 1) {
      // pan on mobile device
      newX = e.targetTouches[0].pageX - startX;
      newY = e.targetTouches[0].pageY - startY;
    } else if (e.targetTouches.length > 1) {
      return;
    }

    if (transform === '') {
      if (transform.indexOf('3d') === -1) {
        setTransform('matrix(1,0,0,1,' + newX + ',' + newY + ')');
      } else {
        setTransform('matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + newX + ', ' + newY + ',0,1)');
      }
    } else {
      var matrix = transform.split(',');

      if (transform.indexOf('3d') === -1) {
        matrix[4] = newX;
        matrix[5] = newY + ')';
      } else {
        matrix[12] = newX;
        matrix[13] = newY;
      }

      setTransform(matrix.join(','));
    }
  };

  var panStartHandler = function panStartHandler(e) {
    if (e.target.closest('.oc-node')) {
      setPanning(false);
      return;
    } else {
      setPanning(true);
      setCursor('move');
    }

    var lastX = 0;
    var lastY = 0;

    if (transform !== '') {
      var matrix = transform.split(',');

      if (transform.indexOf('3d') === -1) {
        lastX = parseInt(matrix[4]);
        lastY = parseInt(matrix[5]);
      } else {
        lastX = parseInt(matrix[12]);
        lastY = parseInt(matrix[13]);
      }
    }

    if (!e.targetTouches) {
      // pand on desktop
      setStartX(e.pageX - lastX);
      setStartY(e.pageY - lastY);
    } else if (e.targetTouches.length === 1) {
      // pan on mobile device
      setStartX(e.targetTouches[0].pageX - lastX);
      setStartY(e.targetTouches[0].pageY - lastY);
    } else if (e.targetTouches.length > 1) {
      return;
    }
  };

  var updateChartScale = function updateChartScale(newScale) {
    var matrix = [];
    var targetScale = 1;

    if (transform === '') {
      setTransform('matrix(' + newScale + ', 0, 0, ' + newScale + ', 0, 0)');
    } else {
      matrix = transform.split(',');

      if (transform.indexOf('3d') === -1) {
        targetScale = Math.abs(window.parseFloat(matrix[3]) * newScale);

        if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
          matrix[0] = 'matrix(' + targetScale;
          matrix[3] = targetScale;
          setTransform(matrix.join(','));
        }
      } else {
        targetScale = Math.abs(window.parseFloat(matrix[5]) * newScale);

        if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
          matrix[0] = 'matrix3d(' + targetScale;
          matrix[5] = targetScale;
          setTransform(matrix.join(','));
        }
      }
    }
  };

  var zoomHandler = function zoomHandler(e) {
    var newScale = 1 + (e.deltaY > 0 ? -0.01 : 0.01);
    updateChartScale(newScale);
  };

  var changeHierarchy = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(draggedItemData, dropTargetId) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return dsDigger.removeNode(draggedItemData.id);

            case 2:
              _context.next = 4;
              return dsDigger.addChildren(dropTargetId, draggedItemData);

            case 4:
              setDS(_objectSpread({}, dsDigger.ds));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function changeHierarchy(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  function saveAs(uri, filename) {
    var link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename; //Firefox requires the link to be in the body

      document.body.appendChild(link); //simulate click

      link.click(); //remove the link when done

      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }

  function base64SvgToBase64Png(originalBase64, width, height, filename) {
    return new Promise(function (resolve) {
      var img = document.createElement('img');

      img.onload = function () {
        document.body.appendChild(img);
        var canvas = document.createElement('canvas');
        document.body.removeChild(img);
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          var data = canvas.toDataURL('image/jpeg');
          saveAs(data, filename + '.jpeg');
          resolve(data);
        } catch (e) {
          resolve(null);
        }
      };

      img.src = originalBase64;
    });
  }

  (0, _react.useImperativeHandle)(ref, function () {
    return {
      exportTo: function exportTo(exportFilename) {
        exportFilename = exportFilename || 'OrgChart';
        setExporting(true);
        var originalScrollLeft = container.current.scrollLeft;
        container.current.scrollLeft = 0;
        var originalScrollTop = container.current.scrollTop;
        container.current.scrollTop = 0;

        _domToImage.default.toSvg(chart.current, {
          width: chart.current.scrollWidth,
          height: chart.current.scrollHeight,
          onclone: function onclone(clonedDoc) {
            clonedDoc.querySelector('.orgchart').style.background = 'none';
            clonedDoc.querySelector('.orgchart').style.transform = '';
          }
        }).then(function (canvas) {
          var width, height;
          var aspectRatio = chart.current.scrollWidth / chart.current.scrollHeight;

          if (aspectRatio > 1) {
            width = Math.min(chart.current.scrollWidth, 16384);
            height = width / aspectRatio;
          } else {
            height = Math.min(chart.current.scrollHeight, 16384);
            width = height * aspectRatio;
          }

          base64SvgToBase64Png(canvas, width, height, exportFilename);
          setExporting(false);
          container.current.scrollLeft = originalScrollLeft;
          container.current.scrollTop = originalScrollTop;
        }, function () {
          setExporting(false);
          container.current.scrollLeft = originalScrollLeft;
          container.current.scrollTop = originalScrollTop;
        });
      },
      expandAllNodes: function expandAllNodes() {
        chart.current.querySelectorAll('.oc-node.hidden, .oc-hierarchy.hidden, .isSiblingsCollapsed, .isAncestorsCollapsed').forEach(function (el) {
          el.classList.remove('hidden', 'isSiblingsCollapsed', 'isAncestorsCollapsed');
        });
      }
    };
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: container,
    className: 'orgchart-container ' + containerClass,
    onWheel: zoom ? zoomHandler : undefined,
    onMouseUp: pan && panning ? panEndHandler : undefined
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: chart,
    className: 'orgchart ' + chartClass,
    style: {
      transform: transform,
      cursor: cursor
    },
    onClick: clickChartHandler,
    onMouseDown: pan ? panStartHandler : undefined,
    onMouseMove: pan && panning ? panHandler : undefined
  }, /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement(_ChartNode.default, {
    datasource: attachRel(ds, '00'),
    NodeTemplate: NodeTemplate,
    draggable: draggable,
    collapsible: collapsible,
    multipleSelect: multipleSelect,
    changeHierarchy: changeHierarchy,
    onClickNode: onClickNode
  }))), /*#__PURE__*/_react.default.createElement("a", {
    className: "oc-download-btn hidden",
    ref: downloadButton,
    href: dataURL,
    download: download
  }, "\xA0"), /*#__PURE__*/_react.default.createElement("div", {
    className: "oc-mask ".concat(exporting ? '' : 'hidden')
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "oci oci-spinner spinner"
  })));
});
ChartContainer.propTypes = propTypes;
ChartContainer.defaultProps = defaultProps;
var _default = ChartContainer;
exports.default = _default;