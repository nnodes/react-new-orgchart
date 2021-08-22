![OrgChart](https://randomthimgs.blob.core.windows.net/randomthimgs/lomgo.png)

## Why use this fork?

- Panning is now drag-to-scroll based, deprecating the transform CSS property logic. This avoids [scrolling and visualization issues](https://stackoverflow.com/questions/45512317/css-transform-origin-center-overflow-scroll-not-full-width) when rendering a large OrgChart.

- Zooming is now scale() based. The main benefit of this change is that the ChartContainer module is simpler and easier to read when compared to the transformation-matrix splitting shenanigans. Using zoom() was a good enough alternative, but it is non-standard.

- Orgchart downloading is now handled by the dom-to-image library. Dom-to-image has [better predictability when dealing with large images](https://stackoverflow.com/questions/43755750/div-or-html-to-image-alternative-to-html2canvas), [doesn't screw up your snapshot when scrolling](https://stackoverflow.com/questions/36213275/html2canvas-does-not-render-full-div-only-what-is-visible-on-screen), and [is 70x faster](https://betterprogramming.pub/heres-why-i-m-replacing-html2canvas-with-html-to-image-in-our-react-app-d8da0b85eadf).

- Canvas maximum size limits are taken into account. Due to browser limitations, rendering a canvas with dimensions greater than 16384x16384 will result in a faulty, cropped snapshot. Thus, exporting a bulky OrgChart wasn't really possible. I solved this by scaling down any drawn images larger than the limit.

## Props

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>chartClass</td>
      <td>string</td>
      <td></td>
      <td>A css class to apply to the chart DOM node.</td>
    </tr>
    <tr>
      <td>containerClass</td>
      <td>string</td>
      <td></td>
      <td>Add an optional extra class name to .orgchart-container It could end up looking like class="orgchart-container xxx yyy".</td>
    </tr>
    <tr>
      <td>collapsible</td>
      <td>boolean</td>
      <td>true</td>
      <td>Allows expanding/collapsing the nodes.</td>
    </tr>
    <tr>
      <td>datasource</td>
      <td>object</td>
      <td></td>
      <td>datasource usded to build out structure of orgchart.</td>
    </tr>
    <tr>
      <td>draggable</td>
      <td>boolean</td>
      <td>false</td>
      <td>Allows dragging/dropping the nodes to the hierarchy of chart.</td>
    </tr>
    <tr>
      <td>multipleSelect</td>
      <td>boolean</td>
      <td>false</td>
      <td>If true, user can select multiple nodes by mouse clicking.</td>
    </tr>
    <tr>
      <td>NodeTemplate</td>
      <td>elementType</td>
      <td></td>
      <td>A Component that provides the node content Markup. This is a useful prop when you want to use your own styles and markup to create a custom orgchart node.</td>
    </tr>
    <tr>
      <td>onClickChart</td>
      <td>function</td>
      <td></td>
      <td>A callback fired when the orgchart is clicking.</td>
    </tr>
    <tr>
      <td>onClickNode</td>
      <td>function</td>
      <td></td>
      <td>A callback fired when the node is clicking.</td>
    </tr>
    <tr>
      <td>pan</td>
      <td>boolean</td>
      <td>false</td>
      <td>If true, the chart can be panned.</td>
    </tr>
    <tr>
      <td>zoom</td>
      <td>boolean</td>
      <td>false</td>
      <td>If true, the chart can be zoomed.</td>
    </tr>
    <tr>
      <td>maxZoom</td>
      <td>number</td>
      <td>7</td>
      <td>Represents the maximum possible zoom of the orgchart.</td>
    </tr>
    <tr>
      <td>minZoom</td>
      <td>number</td>
      <td>0.5</td>
      <td>Represents the minimum possible zoom of the orgchart.</td>
    </tr>
    <tr>
      <td>toggleableSiblings</td>
      <td>boolean</td>
      <td>true</td>
      <td>Whether or not siblings should be toggleable. If false, also hides horizontal arrows.</td>
    </tr>
    <tr>
      <td>loading</td>
      <td>boolean</td>
      <td>false</td>
      <td>Use this prop to trigger OrgChart's spinner on-demand.</td>
    </tr>
    <tr>
      <td>loadingComponent</td>
      <td>React Element</td>
      <td>&lt;i className="oci oci-spinner"&gt;&lt;/i&gt;</td>
      <td>Use your app's existing loading component to maintain design.</td>
    </tr>
    <tr>
      <td>defaultZoom</td>
      <td>number</td>
      <td>0.5</td>
      <td>Set the initial zoom.</td>
    </tr>
  </tbody>
</table>

## Methods

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>expandAllNodes</td>
      <td>User can use this method to expand all the nodes. Sample code: orgchartRef.current.expandAllNodes()</td>
    </tr>
    <tr>
      <td>exportTo</td>
      <td>User can use this method to export orgchart to png orge. Sample code: orgchartRef.current.exportTo(filename)</td>
    </tr>
    <tr>
      <td>zoomIn(amount)</td>
      <td>
        User can use this method to zoom-in on the orgchart div. Default zoom amount is 0.05.
      </td>
    </tr>
    <tr>
      <td>zoomIn(amount)</td>
      <td>
      User can use this method to zoom-out on the orgchart div. Default zoom amount is 0.05. 
      </td>
    </tr>
    <tr>
      <td>resetZoom()</td>
      <td>
      Resets zoom to defaultZoom.
      </td>
    </tr>
    <tr>
      <td>setExporting()</td>
      <td>
      Sets exporting state. Useful if you need any transformations before actually exporting.
      </td>
    </tr>
  </tbody>
</table>

## Install

```
npm install @jearaneda/react-new-orgchart
```
