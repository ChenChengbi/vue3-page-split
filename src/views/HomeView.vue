<!--
 * @Author: Billy
 * @Date: 2023-05-08 10:46:05
 * @LastEditors: Billy
 * @LastEditTime: 2023-05-08 12:06:40
 * @Description: 请输入
-->
<script setup>
import PageSplit from "@/components/page-split.vue";
</script>

<template>
  <PageSplit
    :distribute="0.2"
    :lineThickness="6"
    :isVertical="true"
    :firstMinValue="300"
    @resizeLineStartMove="onresizeLineStartMove"
    @resizeLineMove="onResizeLineMove"
    @resizeLineEndMove="onresizeLineEndMove"
  >
    <template v-slot:first>
      <h1>A</h1>
    </template>
    <template v-slot:second>
      <h1>B</h1>
    </template>
  </PageSplit>
</template>

<script>
export default {
  methods: {
    onresizeLineStartMove: function () {
      // console.log("onresizeLineStartMove");
    },
    onResizeLineMove: function (e) {
      // console.log("onResizeLineMove :>> ", e);
    },
    onresizeLineEndMove: function () {
      // console.log("onresizeLineEndMove");
    },
  },
};
</script>