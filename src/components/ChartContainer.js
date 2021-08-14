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
  zoomoutLimit: PropTypes.number,
  zoominLimit: PropTypes.number,
  containerClass: PropTypes.string,
  chartClass: PropTypes.string,
  NodeTemplate: PropTypes.elementType,
  draggable: PropTypes.bool,
  collapsible: PropTypes.bool,
  multipleSelect: PropTypes.bool,
  onClickNode: PropTypes.func,
  onClickChart: PropTypes.func,
};

const defaultProps = {
  pan: false,
  zoomoutLimit: 0.5,
  zoominLimit: 7,
  containerClass: '',
  chartClass: '',
  draggable: false,
  collapsible: true,
  multipleSelect: false,
};

const ChartContainer = forwardRef(
  (
    {
      datasource,
      pan,
      zoomoutLimit,
      zoominLimit,
      containerClass,
      chartClass,
      NodeTemplate,
      draggable,
      collapsible,
      multipleSelect,
      onClickNode,
      onClickChart,
    },
    ref
  ) => {
    const container = useRef();
    const chart = useRef();
    const downloadButton = useRef();

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [panning, setPanning] = useState(false);
    const [cursor, setCursor] = useState('default');
    const [exporting, setExporting] = useState(false);
    const [dataURL, setDataURL] = useState('');
    const [download, setDownload] = useState('');
    const [zoom, setZoom] = useState('');

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
      let newX = 0;
      let newY = 0;
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
      console.warn(
        'aca debo manejar el pan considerando newX',
        newX,
        'newY',
        newY
      );
    };

    const panStartHandler = (e) => {
      if (e.target.closest('.oc-node')) {
        console.warn('no estoy paneando.');
        setPanning(false);
        return;
      } else {
        console.warn('estoy paneando!!');
        setPanning(true);
        setCursor('move');
      }
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
      zoomIn: (amount = 0.01) => {
        const newZoom = zoom + amount;
        chart.current.transform = `scale(${newZoom})`;
        console.warn('voy a poner zoom de', newZoom);
        setZoom(newZoom);
      },
      zoomOut: (amount = 0.01) => {
        const newZoom = zoom - amount;
        chart.current.transform = `scale(${newZoom})`;
        console.warn('voy a poner zoom de', newZoom);
        setZoom(newZoom);
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
          .then(
            (canvas) => {
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

              base64SvgToBase64Png(canvas, width, height, exportFilename);
              setExporting(false);
              container.current.scrollLeft = originalScrollLeft;
              container.current.scrollTop = originalScrollTop;
            },
            () => {
              setExporting(false);
              container.current.scrollLeft = originalScrollLeft;
              container.current.scrollTop = originalScrollTop;
            }
          );
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
        onMouseUp={pan && panning ? panEndHandler : undefined}
      >
        <div
          ref={chart}
          className={`orgchart ${
            exporting ? 'exporting-chart ' : ''
          } ${chartClass}`}
          style={{
            cursor: cursor,
          }}
          onClick={clickChartHandler}
          onMouseDown={pan ? panStartHandler : undefined}
          onMouseMove={pan && panning ? panHandler : undefined}
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
            />
          </ul>
        </div>
        <a
          className="oc-download-btn hidden"
          ref={downloadButton}
          href={dataURL}
          download={download}
        >
          &nbsp;
        </a>
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
