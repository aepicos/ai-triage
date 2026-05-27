<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: { min: number; max: number }
  min?: number
  max?: number
  scores: number[]
}>(), { min: 0, max: 1000 })

const emit = defineEmits<{
  (e: 'update:modelValue', v: { min: number; max: number }): void
}>()

const localMin = ref(props.modelValue.min)
const localMax = ref(props.modelValue.max)

watch(() => props.modelValue, v => {
  localMin.value = v.min
  localMax.value = v.max
})

function emitChange() {
  emit('update:modelValue', { min: localMin.value, max: localMax.value })
}

function onMinSlide() {
  if (localMin.value >= localMax.value) localMin.value = localMax.value - 1
  emitChange()
}
function onMaxSlide() {
  if (localMax.value <= localMin.value) localMax.value = localMin.value + 1
  emitChange()
}
function onMinNumber() {
  localMin.value = Math.max(props.min, Math.min(localMin.value, localMax.value - 1))
  emitChange()
}
function onMaxNumber() {
  localMax.value = Math.min(props.max, Math.max(localMax.value, localMin.value + 1))
  emitChange()
}

// Give min thumb priority when it would otherwise be stuck behind max
const minZIndex = computed(() => localMin.value >= localMax.value - 20 ? 4 : 2)

// Track fill between the two handles
const fillStyle = computed(() => {
  const span = props.max - props.min
  const l = ((localMin.value - props.min) / span) * 100
  const r = 100 - ((localMax.value - props.min) / span) * 100
  return { left: `${l}%`, right: `${r}%` }
})

// ── Histogram ───────────────────────────────────────────────────────────────
const BUCKETS = 18
const SVG_W   = 200
const SVG_H   = 36

function smooth(arr: number[], radius = 2): number[] {
  return arr.map((_, i) => {
    let sum = 0, w = 0
    for (let d = -radius; d <= radius; d++) {
      const idx = i + d
      if (idx >= 0 && idx < arr.length) {
        const weight = 1 / (Math.abs(d) + 1)
        sum += arr[idx] * weight
        w   += weight
      }
    }
    return sum / w
  })
}

const histPath = computed(() => {
  const span   = props.max - props.min
  const bucket = span / BUCKETS
  const raw    = Array<number>(BUCKETS).fill(0)

  for (const s of props.scores) {
    const idx = Math.min(Math.floor((s - props.min) / bucket), BUCKETS - 1)
    if (idx >= 0) raw[idx]++
  }

  // Clamp smoothed bleed: zero out any bucket outside the first..last occupied raw bucket
  const firstFilled = raw.findIndex(v => v > 0)
  const lastFilled  = raw.length - 1 - [...raw].reverse().findIndex(v => v > 0)
  const counts = smooth(raw, 1).map((v, i) =>
    firstFilled < 0 || i < firstFilled || i > lastFilled ? 0 : v
  )
  const maxCount = Math.max(...counts, 1)
  const pH       = SVG_H - 4  // usable peak height

  type P = [number, number]
  const pts: P[] = counts.map((c, i) => [
    (i + 0.5) * (SVG_W / BUCKETS),
    SVG_H - (c / maxCount) * pH,
  ])

  function f(n: number) { return n.toFixed(2) }
  function cr2bez(p0: P, p1: P, p2: P, p3: P, t = 0.5): string {
    const cp1x = p1[0] + (p2[0] - p0[0]) * t / 3
    const cp1y = p1[1] + (p2[1] - p0[1]) * t / 3
    const cp2x = p2[0] - (p3[0] - p1[0]) * t / 3
    const cp2y = p2[1] - (p3[1] - p1[1]) * t / 3
    return `C ${f(cp1x)} ${f(cp1y)}, ${f(cp2x)} ${f(cp2y)}, ${f(p2[0])} ${f(p2[1])}`
  }

  const all: P[] = [
    [0, SVG_H], [0, pts[0][1]],
    ...pts,
    [SVG_W, pts[pts.length - 1][1]], [SVG_W, SVG_H],
  ]

  let d = `M ${f(all[0][0])} ${f(all[0][1])}`
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[Math.max(i - 1, 0)]
    const p1 = all[i]
    const p2 = all[i + 1]
    const p3 = all[Math.min(i + 2, all.length - 1)]
    d += ' ' + cr2bez(p0, p1, p2, p3)
  }
  return d + ' Z'
})

// Clip rect for the active (in-range) histogram overlay — in SVG user-space coords
const rangeClipX = computed(() =>
  ((localMin.value - props.min) / (props.max - props.min)) * SVG_W
)
const rangeClipW = computed(() =>
  ((localMax.value - localMin.value) / (props.max - props.min)) * SVG_W
)
</script>

<template>
  <div class="prs">

    <!-- Histogram + dual-handle track share the same vertical space -->
    <div class="prs-area">
      <svg class="prs-hist" :viewBox="`0 0 ${SVG_W} ${SVG_H}`" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id="prs-range-clip">
            <rect :x="rangeClipX" y="0" :width="rangeClipW" :height="SVG_H" />
          </clipPath>
        </defs>

        <!-- Full shape, dimmed (outside range) -->
        <path :d="histPath" fill="#88879e" fill-opacity="0.12" />
        <!-- Same shape, clipped to selected range (active) -->
        <path :d="histPath" fill="#88879e" fill-opacity="0.32" clip-path="url(#prs-range-clip)" />
      </svg>

      <!-- Track sits at the very bottom, overflowing 8px on each side -->
      <div class="prs-track">
        <div class="prs-track-bg"></div>
        <div class="prs-track-fill" :style="fillStyle"></div>
        <input
          type="range"
          class="prs-thumb"
          :style="{ zIndex: minZIndex }"
          :min="min" :max="max"
          v-model.number="localMin"
          @input="onMinSlide"
        />
        <input
          type="range"
          class="prs-thumb"
          style="z-index:3"
          :min="min" :max="max"
          v-model.number="localMax"
          @input="onMaxSlide"
        />
      </div>
    </div>

    <!-- Number inputs — half width -->
    <div class="prs-inputs">
      <input
        type="number"
        class="prs-number"
        :min="min" :max="localMax - 1"
        v-model.number="localMin"
        @change="onMinNumber"
      />
      <input
        type="number"
        class="prs-number"
        :min="localMin + 1" :max="max"
        v-model.number="localMax"
        @change="onMaxNumber"
      />
    </div>
  </div>
</template>

<style scoped>
.prs { display: flex; flex-direction: column; gap: 8px; width: 100%; }

/* ── Histogram + track container ─────────────────────────────────────────── */
.prs-area {
  position: relative;
  height: 52px;
  overflow: visible;  /* allow thumbs to bleed outside */
}

.prs-hist {
  position: absolute;
  inset: 0 0 16px 0;
  width: 100%;
  height: calc(100% - 16px);
}

/* Track overflows 8px (half thumb) on each side so handle centres reach the edges */
.prs-track {
  position: absolute;
  bottom: 0;
  left:  -8px;
  right: -8px;
  height: 20px;
  overflow: visible;
}

.prs-track-bg {
  position: absolute;
  inset: 0 8px;   /* pull back to the inner edges = track visual stays flush */
  margin: auto;
  height: 3px;
  border-radius: 2px;
  background: var(--pcl-color-ui-border);
  pointer-events: none;
}

.prs-track-fill {
  position: absolute;
  top: 0; bottom: 0;
  margin: auto;
  height: 3px;
  border-radius: 2px;
  background: var(--pcl-color-ui-dimmed);
  pointer-events: none;
  /* fill percentages are relative to .prs-track which is now wider by 16px;
     correct the offset so 0% maps to the left visual edge */
  left:  calc(v-bind('fillStyle.left') );
  right: calc(v-bind('fillStyle.right'));
}

/* ── Range inputs ────────────────────────────────────────────────────────── */
.prs-thumb {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  pointer-events: none;
  outline: none;
  cursor: pointer;
}

.prs-thumb::-webkit-slider-runnable-track {
  background: transparent;
  height: 3px;
}
.prs-thumb::-moz-range-track {
  background: transparent;
  height: 3px;
}

.prs-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--pcl-color-ui-body);
  border: 2px solid var(--pcl-color-ui-bg);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  cursor: grab;
  pointer-events: all;
  margin-top: -6.5px;
  transition: background 0.1s;
}
.prs-thumb::-webkit-slider-thumb:active { cursor: grabbing; background: var(--pcl-color-ui-heading); }

.prs-thumb::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--pcl-color-ui-body);
  border: 2px solid var(--pcl-color-ui-bg);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  cursor: grab;
  pointer-events: all;
  border: none;
}
.prs-thumb::-moz-range-thumb:active { cursor: grabbing; }

/* ── Number inputs (half width) ─────────────────────────────────────────── */
.prs-inputs {
  display: flex;
  justify-content: space-between;
}

.prs-number {
  flex: 0 0 auto;
  width: 56px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: var(--pcl-radius-medium);
  font-size: 13px;
  line-height: 28px;
  color: var(--pcl-color-ui-body);
  background: var(--pcl-color-ui-bg);
  font-family: inherit;
  outline: none;
  appearance: textfield;
  -moz-appearance: textfield;
}
.prs-number::-webkit-inner-spin-button,
.prs-number::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.prs-number:focus {
  border-color: var(--pcl-color-ui-dimmed);
  box-shadow: 0 0 0 2px rgba(114,113,132,0.15);
}
</style>
