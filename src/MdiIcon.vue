<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24"
    :aria-hidden="$attrs['aria-label'] || $attrs['aria-labelledby'] ? undefined : true"
    style="display:inline-block;fill:currentColor;vertical-align:text-top">
    <path :d="path" />
  </svg>
</template>
<script setup lang="ts">
defineProps<{ path: string; size?: number }>()
</script>
