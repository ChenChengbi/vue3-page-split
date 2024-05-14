# Vue Page Split

> Resizable splitted panels based on Vue3.

[Vue2 Version](https://www.npmjs.com/package/vue-page-split)

English | [简体中文](./README.md)

## 🌰 Demo
https://chenchengbi.github.io/vue-page-split/#/

## 📦 Install

``` bash
$ npm i vue3-page-split -S
```
## 🔨 Usage

How to use in Vue project.

```html
<template>
  <PageSplit :distribute="0.3" :lineThickness="6" :isVertical="true" @resizeLineStartMove="onresizeLineStartMove"
    @resizeLineMove="onResizeLineMove" @resizeLineEndMove="onresizeLineEndMove">
    <template v-slot:first>
      <h1>A</h1>
    </template>
    <template v-slot:second>
      <h1>B</h1>
    </template>
  </PageSplit>
</template>

<script setup>
import PageSplit from "vue3-page-split";
import "vue3-page-split/dist/style.css";

function onresizeLineStartMove() {
  console.log("onresizeLineStartMove");
}
function onResizeLineMove(e) {
  console.log("onResizeLineMove :>> ", e);
}
function onresizeLineEndMove() {
  console.log("onresizeLineEndMove");
}
</script>
```

## 🔠 Properties

| Property name           | type    | Default value | Description                                                               |
|-------------------------|---------|---------------|---------------------------------------------------------------------------|
| distribute              | Number  | 0.5           | Panel ratio, between 0 and 1.                                             |
| isVertical              | Boolean | true          | Split mode(true means vertical incision, otherwise horizontal incision).  |
| lineThickness           | Number  | 6             | Width of the split line.                                                  |
| hasLineTip              | Boolean | true          | There are three short lines inside the split line or not.                 |
| backgroundColor         | String  | "#a0cfff"     | Background color of the split line.                                       |
| hoverColor              | String  | "#409eff"     | Background color of the split line when mouse hovers over.                |
| hasBoxShadow            | Boolean | true          | Split line has box-shadow style or not.                                   |
| firstMinValue           | Number  | 0             | Width of the first partition, must >= 0.                                  |
| secondMinValue          | Number  | 0             | Width of the second partition, must >= 0.                                 |
| isFirstComponentMasked  | Boolean | false         | If there is transparent mask layer covered over the the first partition.  |
| isSecondComponentMasked | Boolean | false         | If there is transparent mask layer covered over the the second partition. |

Tip: Component Mask is for capturing mouse event.  
It is necessary when there is an iframe inside the page, because iframe will hide the mouse event from the page.

## 🎺 Events
This component will trigger three events.

| Event name          | Description | Return type  |
|---------------------|-------------|--------------|
| resizeLineStartMove | start move  | -            |
| resizeLineMove      | moving      | event object |
| resizeLineEndMove   | finish move | -            |


## 📷 Sample Pictures
In case of missing sample pictures, please go to the Homepage or Repository and check.

![GIF 1](https://gitee.com/bi2008/vue-page-split/raw/master/screenshot/vue-page-split-demo.gif)
![GIF 2](https://gitee.com/bi2008/vue-page-split/raw/master/screenshot/3.png)
