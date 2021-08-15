import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { selectNodeService } from './service';
import JSONDigger from 'json-digger';
import domtoimage from 'dom-to-image';
import ChartNode from './ChartNode';
import './ChartContainer.css';

const propTypes = {
  datasource: PropTypes.object.isRequired,
  pan: PropTypes.bool,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  containerClass: PropTypes.string,
  chartClass: PropTypes.string,
  NodeTemplate: PropTypes.elementType,
  draggable: PropTypes.bool,
  collapsible: PropTypes.bool,
  multipleSelect: PropTypes.bool,
  onClickNode: PropTypes.func,
  onClickChart: PropTypes.func,
  toggleableSiblings: PropTypes.bool,
};

const defaultProps = {
  pan: false,
  minZoom: 0.5,
  maxZoom: 7,
  containerClass: '',
  chartClass: '',
  draggable: false,
  collapsible: true,
  multipleSelect: false,
  toggleableSiblings: true,
};

const ChartContainer = forwardRef(
  (
    {
      datasource,
      pan,
      minZoom,
      maxZoom,
      containerClass,
      chartClass,
      NodeTemplate,
      draggable,
      collapsible,
      multipleSelect,
      onClickNode,
      onClickChart,
      toggleableSiblings,
    },
    ref
  ) => {
    const container = useRef();
    const chart = useRef();

    const [panning, setPanning] = useState(false);
    const [cursor, setCursor] = useState('default');
    const [exporting, setExporting] = useState(false);
    const [pos, setPos] = useState({
      left: 0,
      top: 0,
      x: 0,
      y: 0,
    });
    const [zoom, setZoom] = useState(1);

    const attachRel = (data, flags) => {
      data.relationship =
        flags + (data.children && data.children.length > 0 ? 1 : 0);
      if (data.children) {
        data.children.forEach(function (item) {
          attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
        });
      }
      return data;
    };

    const [ds, setDS] = useState(datasource);
    useEffect(() => {
      setDS(datasource);
    }, [datasource]);

    const dsDigger = new JSONDigger(datasource, 'id', 'children');

    const clickChartHandler = (event) => {
      if (!event.target.closest('.oc-node')) {
        if (onClickChart) {
          onClickChart();
        }
        selectNodeService.clearSelectedNodeInfo();
      }
    };

    const panEndHandler = () => {
      setPanning(false);
      setCursor('default');
    };

    const panHandler = (e) => {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      container.current.scrollTop = pos.top - dy;
      container.current.scrollLeft = pos.left - dx;
    };

    const panStartHandler = (e) => {
      setPos({
        left: container.current.scrollLeft,
        top: container.current.scrollTop,
        x: e.clientX,
        y: e.clientY,
      });
      setPanning(true);
      setCursor('grab');
    };

    const changeHierarchy = async (draggedItemData, dropTargetId) => {
      await dsDigger.removeNode(draggedItemData.id);
      await dsDigger.addChildren(dropTargetId, draggedItemData);
      setDS({ ...dsDigger.ds });
    };

    function saveAs(uri, filename) {
      var link = document.createElement('a');
      if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    }

    function base64SvgToBase64Png(originalBase64, width, height, filename) {
      return new Promise((resolve) => {
        let img = document.createElement('img');
        img.onload = function () {
          document.body.appendChild(img);
          let canvas = document.createElement('canvas');
          document.body.removeChild(img);
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          try {
            let data = canvas.toDataURL('image/jpeg');
            saveAs(data, filename + '.jpeg');
            resolve(data);
          } catch (e) {
            resolve(null);
          }
        };
        img.src = originalBase64;
      });
    }

    useImperativeHandle(ref, () => ({
      resetZoom: () => {
        chart.current.style.transform = `scale(${1})`;
        setZoom(1);
      },
      zoomIn: (amount = 0.05) => {
        const newZoom = zoom + amount;
        if (newZoom <= maxZoom) {
          chart.current.style.transform = `scale(${newZoom})`;
          setZoom(newZoom);
        }
      },
      zoomOut: (amount = 0.05) => {
        const newZoom = zoom - amount;
        if (newZoom > 0 && newZoom > minZoom) {
          chart.current.style.transform = `scale(${newZoom})`;
          setZoom(newZoom);
        }
      },
      exportTo: (exportFilename) => {
        exportFilename = exportFilename || 'OrgChart';
        setExporting(true);
        const originalScrollLeft = container.current.scrollLeft;
        container.current.scrollLeft = 0;
        const originalScrollTop = container.current.scrollTop;
        container.current.scrollTop = 0;

        domtoimage
          .toSvg(chart.current, {
            width: chart.current.scrollWidth,
            height: chart.current.scrollHeight,
            onclone: function (clonedDoc) {
              clonedDoc.querySelector('.orgchart').style.background = 'none';
              clonedDoc.querySelector('.orgchart').style.transform = '';
            },
          })
          .then((canvas) => {
            let width, height;
            const aspectRatio =
              chart.current.scrollWidth / chart.current.scrollHeight;

            if (aspectRatio > 1) {
              width = Math.min(chart.current.scrollWidth, 16384);
              height = width / aspectRatio;
            } else {
              height = Math.min(chart.current.scrollHeight, 16384);
              width = height * aspectRatio;
            }

            base64SvgToBase64Png(canvas, width, height, exportFilename).then(
              () => {
                setExporting(false);
                container.current.scrollLeft = originalScrollLeft;
                container.current.scrollTop = originalScrollTop;
              }
            );
          });
      },
      expandAllNodes: () => {
        chart.current
          .querySelectorAll(
            '.oc-node.hidden, .oc-hierarchy.hidden, .isSiblingsCollapsed, .isAncestorsCollapsed'
          )
          .forEach((el) => {
            el.classList.remove(
              'hidden',
              'isSiblingsCollapsed',
              'isAncestorsCollapsed'
            );
          });
      },
    }));

    return (
      <div
        ref={container}
        className={`orgchart-container ${
          exporting ? 'exporting-chart-container ' : ''
        } ${containerClass}`}
        style={{
          cursor: cursor,
        }}
        onMouseUp={pan && panning ? panEndHandler : undefined}
        onMouseDown={pan ? panStartHandler : undefined}
        onMouseMove={pan && panning ? panHandler : undefined}
      >
        <div
          ref={chart}
          className={`orgchart ${
            exporting ? 'exporting-chart ' : ''
          } ${chartClass}`}
          onClick={clickChartHandler}
        >
          <ul>
            <ChartNode
              datasource={attachRel(ds, '00')}
              NodeTemplate={NodeTemplate}
              draggable={draggable}
              collapsible={collapsible}
              multipleSelect={multipleSelect}
              changeHierarchy={changeHierarchy}
              onClickNode={onClickNode}
              toggleableSiblings={toggleableSiblings}
            />
          </ul>
        </div>
        <div className={`oc-mask ${exporting ? '' : 'hidden'}`}>
          <i className="oci oci-spinner spinner"></i>
        </div>
      </div>
    );
  }
);

ChartContainer.propTypes = propTypes;
ChartContainer.defaultProps = defaultProps;

export default ChartContainer;
