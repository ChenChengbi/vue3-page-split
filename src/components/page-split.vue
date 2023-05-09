<template>
  <div
    :id="resizeLinePaneId"
    class="resize-line-pane"
    :class="isVertical ? 'pane-vertical' : 'pane-horizontal'"
  >
    <div :id="pane1stId" class="pane pane-1st">
      <slot name="first"></slot>
    </div>
    <div
      :id="resizeLineId"
      class="resize-line"
      :class="isVertical ? 'resize-vertical' : 'resize-horizontal'"
    >
      <div class="tip" :class="isVertical ? 'vertical' : 'horizontal'">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
    <div :id="pane2ndId" class="pane pane-2nd">
      <slot name="second"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  // name: "PageSplit",
  data() {
    return {
      resizeLinePaneId: `resize-line-pane-${this.geneRamdId()}`,
      resizeLineId: `resize-line-${this.geneRamdId()}`,
      pane1stId: `pane-1st-${this.geneRamdId()}`,
      pane2ndId: `pane-2nd-${this.geneRamdId()}`,
      resizeTimeout: null,
      interval: 500,
    };
  },
  props: {
    // 面板位置，可以是 0~1 代表百分比
    distribute: {
      type: Number,
      default: 0.5,
      validator: function (value) {
        return value > 0 && value < 1;
      },
    },
    // 调整模式(true:ResizeLine垂直摆放,false:ResizeLine水平摆放)
    isVertical: {
      type: Boolean,
      default: true,
    },
    // 分割线的宽度
    lineThickness: {
      type: Number,
      default: 6,
      validator: function (value) {
        return value >= 6;
      },
    },
    // 分割线中是否有三条杠
    hasLineTip: {
      type: Boolean,
      default: true,
    },
    // 分割线的背景颜色
    backgroundColor: {
      type: String,
      default: "#a0cfff",
    },
    // 分割线的鼠标hover后的颜色
    hoverColor: {
      type: String,
      default: "#409eff",
    },
    // 分割线是否有box-shadow样式
    hasBoxShadow: {
      type: Boolean,
      default: true,
    },
    // 左组件/上组件的最小宽度/高度，必须>=0
    firstMinValue: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0;
      },
    },
    // 右组件/下组件的最小宽度/高度，必须>=0
    secondMinValue: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0;
      },
    },
    // 左组件/上组件是否需要遮挡层（如果组件内有iframe，是需要有遮挡层的，否则鼠标进入iframe区域后，是发送不到鼠标移动事件的）
    isFirstComponentMasked: {
      type: Boolean,
      default: false,
    },
    // 右组件/下组件是否需要遮挡层（如果组件内有iframe，是需要有遮挡层的，否则鼠标进入iframe区域后，是发送不到鼠标移动事件的）
    isSecondComponentMasked: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isVertical: function () {
      this.init();
    },
    distribute: function () {
      this.init();
    },
  },
  mounted() {
    this.init();
    // window.addEventListener("optimizedResize", this.$_handleWindowResize);
    window.addEventListener("resize", this.$_eventCallback, false);
  },
  unmounted() {
    // window.removeEventListener("optimizedResize", this.$_handleWindowResize);
    window.removeEventListener("resize", this.$_eventCallback);
  },
  methods: {
    init() {
      const resizeLinePane = document.getElementById(this.resizeLinePaneId);
      const resizeLine = document.getElementById(this.resizeLineId);
      const firstComponent = document.getElementById(this.pane1stId);
      const secondComponent = document.getElementById(this.pane2ndId);

      // 设置一些样式
      resizeLine.style.backgroundColor = this.backgroundColor;
      if (this.hasBoxShadow) resizeLine.style.boxShadow = "0px 0px 1px inset";

      if (this.hasLineTip) {
        let tipLines = resizeLine
          .getElementsByClassName("tip")[0]
          .getElementsByClassName("line");

        for (const line of tipLines) {
          line.style.backgroundColor = this.hoverColor;
        }
      }

      // 初始化左右/上下组件的宽度--start
      let componentsSizeSum = this.isVertical
        ? resizeLinePane.offsetWidth
        : resizeLinePane.offsetHeight;
      // resize line 占据整个页面尺寸的比例
      let resizeLineRate = this.lineThickness / componentsSizeSum;

      // ---------------------------------------------------------------------
      let firstComponentMinRate = 0,
        secondComponentMinRate = 0;

      // 如果两边的组件有设置最小宽度
      if (this.firstMinValue > 0) {
        firstComponentMinRate = this.firstMinValue / componentsSizeSum;
      }

      if (this.secondMinValue > 0) {
        secondComponentMinRate = this.secondMinValue / componentsSizeSum;
      }
      // ---------------------------------------------------------------------

      let halfResizeLineRate = resizeLineRate / 2;

      let firstComponentRate = this.distribute - halfResizeLineRate;
      let secondComponentRate = 1 - this.distribute - halfResizeLineRate;

      // ---------------------------------------------------------------------
      if (firstComponentMinRate > firstComponentRate) {
        firstComponentRate = firstComponentMinRate;
        secondComponentRate = 1 - firstComponentRate - resizeLineRate;
      } else if (secondComponentMinRate > secondComponentRate) {
        secondComponentRate = secondComponentMinRate;
        firstComponentRate = 1 - secondComponentRate - resizeLineRate;
      }
      // ---------------------------------------------------------------------

      let firstComponentSize = firstComponentRate * 100;
      let secondComponentSize = secondComponentRate * 100;

      if (this.isVertical) {
        firstComponent.style.width = firstComponentSize + "%";
        secondComponent.style.width = secondComponentSize + "%";
        resizeLine.style.width = this.lineThickness + "px";

        firstComponent.style.height = null;
        secondComponent.style.height = null;
        resizeLine.style.height = null;
      } else {
        firstComponent.style.height = firstComponentSize + "%";
        secondComponent.style.height = secondComponentSize + "%";
        resizeLine.style.height = this.lineThickness + "px";

        firstComponent.style.width = null;
        secondComponent.style.width = null;
        resizeLine.style.width = null;
      }
      // 初始化左右/上下组件的宽度--end

      let firstMinValue = this.firstMinValue; // 左侧最小宽度
      let secondMinValue = this.secondMinValue; // 右侧最小宽度
      let isVertical = this.isVertical;
      let startValue, old1stComponentSize, old2ndComponentSize;

      // 当按下鼠标
      resizeLine.onmousedown = (e) => {
        this.$emit("resizeLineStartMove");

        let firstMaskNode, secondMaskNode;
        let firstOriginPosition, secondOriginPosition;

        componentsSizeSum = isVertical
          ? resizeLinePane.offsetWidth
          : resizeLinePane.offsetHeight;

        if (this.isFirstComponentMasked) {
          let { maskNode, originPosition } = this.$_addMask(firstComponent);
          firstMaskNode = maskNode;
          firstOriginPosition = originPosition;
        }

        if (this.isSecondComponentMasked) {
          let { maskNode, originPosition } = this.$_addMask(secondComponent);
          secondMaskNode = maskNode;
          secondOriginPosition = originPosition;
        }

        e = e || window.event;
        // 开始坐标值
        startValue = isVertical ? e.clientX : e.clientY;
        // 原来的宽度
        old1stComponentSize =
          firstComponent[isVertical ? "offsetWidth" : "offsetHeight"];
        old2ndComponentSize =
          secondComponent[isVertical ? "offsetWidth" : "offsetHeight"];

        // console.log("old1stComponentSize :>> ", old1stComponentSize);
        // console.log("old2ndComponentSize :>> ", old2ndComponentSize);

        // 当鼠标移动
        // https://stackoverflow.com/questions/56807253/added-non-passive-event-listener-to-a-scroll-blocking-touchmove-event-conside
        document.onmousemove = (e) => {
          this.$emit("resizeLineMove", e);

          // 移动的时候的坐标值
          let endValue = isVertical ? e.clientX : e.clientY;

          // 最新的第1个组件的宽度
          let new1stComponentSize =
            old1stComponentSize + (endValue - startValue);

          // 如果第1个组件本来就刚好等于最小值，并且鼠标移动方向还在尝试缩小第1个组件，则直接返回即可
          if (
            old1stComponentSize === firstMinValue &&
            new1stComponentSize < firstMinValue
          ) {
            return;
          }

          // 最新的第2个组件的宽度
          let new2ndComponentSize =
            old2ndComponentSize + (startValue - endValue);

          // 如果第2个组件本来就刚好等于最小值，并且鼠标移动方向还在尝试缩小第2个组件，则直接返回即可
          if (
            old2ndComponentSize === secondMinValue &&
            new2ndComponentSize < secondMinValue
          ) {
            return;
          }

          if (new1stComponentSize < firstMinValue) {
            // 左侧过小
            new1stComponentSize = firstMinValue;
            // 推算出右侧
            new2ndComponentSize =
              old2ndComponentSize + (old1stComponentSize - new1stComponentSize);
          } else if (new2ndComponentSize < secondMinValue) {
            // 右侧过小
            new2ndComponentSize = secondMinValue;
            // 推算出左侧
            new1stComponentSize =
              old1stComponentSize + (old2ndComponentSize - new2ndComponentSize);
          }

          let _new1stComponentPercent =
            (new1stComponentSize / componentsSizeSum) * 100;
          let _new2ndComponentPercent =
            (new2ndComponentSize / componentsSizeSum) * 100;

          // if (this.hasFirstComponent) {
          //   firstComponent.style[isVertical ? "width" : "height"] =
          //     new1stComponentSize + "px";
          // }
          // if (this.hasSecondComponent) {
          //   secondComponent.style[isVertical ? "width" : "height"] =
          //     new2ndComponentSize + "px";
          // }

          firstComponent.style[isVertical ? "width" : "height"] =
            _new1stComponentPercent + "%";
          secondComponent.style[isVertical ? "width" : "height"] =
            _new2ndComponentPercent + "%";
        };
        // 当松开鼠标
        document.onmouseup = () => {
          this.$emit("resizeLineEndMove");

          if (this.isFirstComponentMasked) {
            this.$_removeMask(
              firstComponent,
              firstMaskNode,
              firstOriginPosition
            );
          }

          if (this.isSecondComponentMasked) {
            this.$_removeMask(
              secondComponent,
              secondMaskNode,
              secondOriginPosition
            );
          }

          // 置空事件
          document.onmousemove = null;
          document.onmouseup = null;
          // IE释放全局捕获
          resizeLine.releaseCapture && resizeLine.releaseCapture();
        };
        // IE取消默认行为,设置全局捕获
        resizeLine.setCapture && resizeLine.setCapture();
        return false;
      };

      // 当鼠标移到Resize Line上面(此处不用onmouseover是因为onmouseover有事件冒泡，连resize line里的tip->line都会捕获事件，引起变色)
      resizeLine.onmouseenter = (e) => {
        this.$_addClass(resizeLine, "resize-hover");
        e.target.style.backgroundColor = this.hoverColor;
      };
      // 当鼠标从Resize Line移走(此处不用onmouseout是因为onmouseout有事件冒泡，连resize line里的tip->line都会捕获事件，引起变色)
      resizeLine.onmouseleave = (e) => {
        this.$_removeClass(resizeLine, "resize-hover");
        e.target.style.backgroundColor = this.backgroundColor;
      };
    },

    // 当窗口调整大小的时侯，让resizeline的相对位置不变
    $_handleWindowResize() {
      let resizeLinePane = document.getElementById(this.resizeLinePaneId);
      let resizeLine = document.getElementById(this.resizeLineId);
      // let firstComponent = resizeLine.previousSibling;
      // let secondComponent = resizeLine.nextSibling;
      const firstComponent = document.getElementById(this.pane1stId);
      const secondComponent = document.getElementById(this.pane2ndId);

      // 缩放后整个面板的尺寸(像素)
      let componentsSizeSum = this.isVertical
        ? resizeLinePane.offsetWidth
        : resizeLinePane.offsetHeight;

      // 缩放前左右/上下组件的尺寸(百分比)
      let firstComponentSize = (
        this.isVertical
          ? firstComponent.style.width
          : firstComponent.style.height
      ).slice(0, -1); // 去掉最后的%号
      let secondComponentSize = (
        this.isVertical
          ? secondComponent.style.width
          : secondComponent.style.height
      ).slice(0, -1);

      // 缩放前 resize line 的占比(百分比)
      let originalRlPercent = 100 - firstComponentSize - secondComponentSize;
      // 缩放后 resize line 的占比(百分比)
      let recentRlPercent = (this.lineThickness / componentsSizeSum) * 100;

      let difference = recentRlPercent - originalRlPercent;
      let firstComponentSizeNew = firstComponentSize - difference / 2;
      let secondComponentSizeNew = secondComponentSize - difference / 2;

      if (this.isVertical) {
        firstComponent.style.width = firstComponentSizeNew + "%";
        secondComponent.style.width = secondComponentSizeNew + "%";
      } else {
        firstComponent.style.height = firstComponentSizeNew + "%";
        secondComponent.style.height = secondComponentSizeNew + "%";
      }
    },

    $_addClass(dom, cls) {
      if (dom.className.indexOf(cls) < 0) {
        dom.className = dom.className + " " + cls;
      }
    },

    $_removeClass(dom, cls) {
      dom.className = dom.className.replace(cls, "").trim();
    },

    /**
     * @description 为左右/上下组件添加一个遮挡层
     * @param {Dom} parentNode 需要放置遮挡层的节点，一般就是上面的firstComponent、secondComponent
     * @returns {Object} 结构如下：
     * {
     *    mask: 遮挡层节点（一般就是一个div）
     *    originPosition：parentNode的position的原来的值，记下这个值是因为本方法会将parentNode的position改为relative
     * }
     */
    $_addMask(parentNode) {
      let originPosition = parentNode.style.position;
      parentNode.style.position = "relative";
      let mask = document.createElement("div");
      mask.style.backgroundColor = "transparent";
      mask.style.position = "absolute";
      mask.style.width = "100%";
      mask.style.height = "100%";
      mask.style.top = "0";
      mask.style.left = "0";
      parentNode.appendChild(mask);
      return {
        maskNode: mask,
        originPosition: originPosition,
      };
    },

    /**
     * @description 从左右/上下组件删除一个遮挡层
     * @param {Dom} parentNode 需要放置遮挡层的节点，一般就是上面的firstComponent、secondComponent
     * @param {Dom} maskNode 遮挡层节点（一般就是一个div）
     * @param {String} originPositionOfParendNode parentNode的position的原来的值
     */
    $_removeMask(parentNode, maskNode, originPositionOfParendNode) {
      parentNode.removeChild(maskNode);
      parentNode.style.position = originPositionOfParendNode;
    },

    /**
     * 如果用原生的resize事件，将会损耗大量资源，因为resize事件触发的次数非常多
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resize_event#settimeout
     */
    $_eventCallback() {
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(() => {
          this.resizeTimeout = null;
          this.$_handleWindowResize();
        }, this.interval);
      }
    },

    geneRamdId() {
      return Number.parseInt(Math.random() * 100000);
    },
  },
};
</script>
<style lang="scss" scoped>
@use "sass:math";
// 分割线的粗细
$thickness: 6px;
$tip-width: 80px;
// $resize-background-color: #a0cfff;
// $resize-hover-color: #409eff;

.resize-line-pane {
  width: 100%;
  height: 100%;
  display: flex;
  &.pane-vertical {
    flex-direction: row;
  }
  &.pane-horizontal {
    flex-direction: column;
  }
  .pane {
    overflow-y: auto;
  }
  .resize-line {
    // background-color: $resize-background-color;
    // box-shadow: 0px 0px 1px inset;
    &.resize-vertical {
      // 窗口缩小，本分隔带的宽度会缩小，原因是 flex-shrink 默认值为 1，故设置为 0
      flex-shrink: 0;
      // width: $thickness;
      height: 100%;
      cursor: w-resize;
    }

    &.resize-horizontal {
      width: 100%;
      // height: $thickness;
      cursor: s-resize;
    }

    .tip {
      margin: auto;
      &.vertical {
        width: $thickness;
        height: $tip-width;
        position: relative;
        top: 40%;
        .line {
          width: 1px;
          height: $tip-width;
          margin-left: 1px;
          // background-color: $resize-hover-color;
          float: left;
        }
      }

      &.horizontal {
        width: $tip-width;
        height: $thickness;
        position: relative;
        top: calc(50% - #{math.div($thickness, 2)});
        // left: calc(50% - #{$tip-width / 2});
        .line {
          height: 1px;
          width: $tip-width;
          margin-bottom: 1px;
          // background-color: $resize-hover-color;
        }
      }
    }
  }
}

// .resize-hover {
// background-color: $resize-hover-color;
// }
</style>