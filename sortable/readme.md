# 拖动排序插件


#  使用
Sortable.create(el, {
    animation: 150,  // 动画
    handle: ".handle",  // 拖放元素的手柄
    ghostClass: "sortable-ghost",//定义拖动元素的class，可提前预设样式
    draggable:'.item' //被拖动的元素
});

GitHub原项目地址：
https://github.com/RubaXa/Sortable/ ，建议将Sortable.js下载到本地，GitHub上的例子在复制到本地运行，在 http://jsbin.com 上运行很多时候会报Sortable is not defined 的错误。

Sortable.js是用于在现代浏览器和触摸设备上重新拖放排序列表的JavaScript库，支持jQuery，Meteor，AngularJS，React，Polymer，Knockout和兼容任何CSS库。

特征
支持触摸设备和现代浏览器（包括IE9）
可以从一个列表拖动到另一个列表或在同一列表中
移动项目时的CSS动画
支持拖动手柄和可选文本
智能自动滚动
使用原生HTML5拖放API构建
支持任何CSS库
简单的API
不基于jQuery（但同样也支持）
安装
通过npm

$ npm install sortablejs --save

# 参数
var sortable = new Sortable(el, {
    group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
    sort: true,  //在列表内支持排序。 sorting inside list 
    delay: 0, // 时间以毫秒为单位来定义排序应该何时开始。 time in milliseconds to define when the sorting should start
    touchStartThreshold: 0, // 像素，在多少像素移动范围内课取消延迟拖动事件。 px, how many pixels the point should move before cancelling a delayed drag event
    disabled: false, // 如果设置为true，则禁用排序。 Disables the sortable if set to true.
    store: null,  // @see Store
    animation: 150,  // 毫秒，排序时移动物品的动画速度，`0`则表示无动画。  ms, animation speed moving items when sorting, `0` — without animation
    handle: ".my-handle",  // 列表项中拖动手柄选择，可以设置列表中item中的某个DOM节点为拖动的依据。 Drag handle selector within list items
    filter: ".ignore-elements",  // 选择不支持拖动的选择器（String或Function）。  Selectors that do not lead to dragging (String or Function)
    preventOnFilter: true, // 触发`filter`时调用`event.preventDefault()`。 Call `event.preventDefault()` when triggered `filter`
    draggable: ".item",  // 指定元素中的哪些项应该是可拖动的。 Specifies which items inside the element should be draggable
    ghostClass: "sortable-ghost",  // 拖放时，提前预设DOM节点的class名称，可在此class下定义相应的样式。 Class name for the drop placeholder
    chosenClass: "sortable-chosen",  // 选中时的DOM节点的class名称，可在此class下定义相应的样式。Class name for the chosen item
    dragClass: "sortable-drag",  // 拖放时的DOM节点的class名称，可在此class下定义相应的样式。Class name for the dragging item
    dataIdAttr: 'data-id',

    forceFallback: false,  // 忽略HTML5 DnD行为并强制回退使用。ignore the HTML5 DnD behaviour and force the fallback to kick in

    fallbackClass: "sortable-fallback",  //使用forceFallback时的克隆DOM元素的类名。 Class name for the cloned DOM Element when using forceFallback
    fallbackOnBody: false,  // 将克隆的DOM元素追加到Document中Body 。Appends the cloned DOM Element into the Document's Body
    fallbackTolerance: 0, // 以像素为单位指定鼠标在被视为拖动之前应移动多远。Specify in pixels how far the mouse should move before it's considered as a drag.

    scroll: true, // or HTMLElement
    scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... }, // 如果你有自定义滚动条scrollFn可用于自动滚动 。if you have custom scrollbar scrollFn may be used for autoscrolling
    scrollSensitivity: 30, // 鼠标必须靠近边缘多少px才能开始滚动。px, how near the mouse must be to an edge to start scrolling.
    scrollSpeed: 10, // 滚动速度。px

    setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
        dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
    },

    // Element is chosen
    onChoose: function (/**Event*/evt) {
        evt.oldIndex;  // element index within parent
    },

    // Element dragging started
    onStart: function (/**Event*/evt) {
        evt.oldIndex;  // element index within parent
    },

    // Element dragging ended
    onEnd: function (/**Event*/evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        evt.to;    // target list
        evt.from;  // previous list
        evt.oldIndex;  // element's old index within old parent
        evt.newIndex;  // element's new index within new parent
    },

    // Element is dropped into the list from another list
    onAdd: function (/**Event*/evt) {
        // same properties as onEnd
    },

    // Changed sorting within list
    onUpdate: function (/**Event*/evt) {
        // same properties as onEnd
    },

    // Called by any change to the list (add / update / remove)
    onSort: function (/**Event*/evt) {
        // same properties as onEnd
    },

    // Element is removed from the list into another list
    onRemove: function (/**Event*/evt) {
        // same properties as onEnd
    },

    // Attempt to drag a filtered element
    onFilter: function (/**Event*/evt) {
        var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
    },

    // Event when you move an item in the list or between lists
    onMove: function (/**Event*/evt, /**Event*/originalEvent) {
        // Example: http://jsbin.com/tuyafe/1/edit?js,output
        evt.dragged; // dragged HTMLElement
        evt.draggedRect; // TextRectangle {left, top, right и bottom}
        evt.related; // HTMLElement on which have guided
        evt.relatedRect; // TextRectangle
        originalEvent.clientY; // mouse position
        // return false; — for cancel
    },

    // Called when creating a clone of element
    onClone: function (/**Event*/evt) {
        var origEl = evt.item;
        var cloneEl = evt.clone;
    }
});
