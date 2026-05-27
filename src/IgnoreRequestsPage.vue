<script setup lang="ts">
import { ref, computed } from 'vue'
import MdiIcon from './MdiIcon.vue'
import {
  mdiClose,
  mdiMagnify,
  mdiPlus,
  mdiArrowDown,
  mdiTableColumn,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import { aiTriageIgnores } from './ai-triage-results'
import { issues } from './issues-data'

// Build indexes for fast lookup
const issueIndex = Object.fromEntries(issues.map(i => [i.id, i]))
const ignoreIndex = Object.fromEntries(aiTriageIgnores.map(i => [i.issueId, i]))

interface IgnoreRequest {
  id: string
  requestDate: string
  severity: 'high' | 'medium' | 'low'
  vulnerability: string
  repository: string
  branch: string
  cwe: string
  ignoreType: string
  expiration: string
  product: string
}

const searchQuery = ref('')

const activeFilters = ref([
  { key: 'target',    label: 'Target is',    value: 'acme/juice-shop' },
  { key: 'requestor', label: 'Requestor is', value: 'Snyk Code AI Triage' },
])

function removeFilter(key: string) {
  activeFilters.value = activeFilters.value.filter(f => f.key !== key)
}

// Derive rows from the real AI triage data — one row per suppressed issue
const allRequests: IgnoreRequest[] = aiTriageIgnores
  .map(ignore => {
    const issue = issueIndex[ignore.issueId]
    if (!issue) return null
    return {
      id: ignore.issueId,
      requestDate: 'Just now',
      severity: issue.severity as 'high' | 'medium' | 'low',
      vulnerability: issue.title,
      repository: 'acme/juice-shop',
      branch: 'main',
      cwe: issue.cwe,
      ignoreType: 'Not vulnerable',
      expiration: 'Never',
      product: 'Snyk Code',
    }
  })
  .filter((r): r is IgnoreRequest => r !== null)

const filteredRequests = computed(() => {
  if (!searchQuery.value.trim()) return allRequests
  const q = searchQuery.value.toLowerCase()
  return allRequests.filter(r =>
    r.vulnerability.toLowerCase().includes(q) ||
    r.cwe.toLowerCase().includes(q) ||
    r.id.toLowerCase().includes(q)
  )
})

// ── Drawer state ──────────────────────────────────────────────────────────────
const drawerIndex = ref<number | null>(null)

const selectedRequest = computed(() =>
  drawerIndex.value !== null ? filteredRequests.value[drawerIndex.value] ?? null : null
)

const selectedIgnore = computed(() =>
  selectedRequest.value ? (ignoreIndex[selectedRequest.value.id] ?? null) : null
)

function openDrawer(index: number) { drawerIndex.value = index }
function closeDrawer() { drawerIndex.value = null }
function prevRequest() {
  if (drawerIndex.value === null) return
  drawerIndex.value = Math.max(0, drawerIndex.value - 1)
}
function nextRequest() {
  if (drawerIndex.value === null) return
  drawerIndex.value = Math.min(filteredRequests.value.length - 1, drawerIndex.value + 1)
}

const severityColor = (s: string) => {
  if (s === 'high')   return 'var(--pcl-color-severity-high-base, #ce5019)'
  if (s === 'medium') return 'var(--pcl-color-severity-medium-base, #d68000)'
  return 'var(--pcl-color-severity-low-base, #88879e)'
}

const confidenceColor = (c?: string) => {
  if (c === 'High')   return 'var(--pcl-color-severity-low-base, #2d7a3a)'
  if (c === 'Medium') return 'var(--pcl-color-severity-medium-base, #d68000)'
  if (c === 'Low')    return 'var(--pcl-color-severity-high-base, #ce5019)'
  return 'var(--pcl-color-ui-dimmed)'
}
</script>

<template>
  <div class="main-area">

    <!-- Page header -->
    <div class="page-header">
      <div class="page-header-top">
        <div class="breadcrumbs">
          <a href="#" class="breadcrumb-link" @click.prevent>acme</a>
        </div>
      </div>

      <div class="page-header-title">
        <div class="product-icon" aria-hidden="true">
          <!-- eye icon, matching the nav item -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"/>
          </svg>
        </div>
        <h1 class="page-title">Ignore requests</h1>
      </div>

      <!-- Description -->
      <p class="ir-description">
        Manage requests for ignoring Snyk-detected issues. Learn more about
        <a href="#" class="ir-link" @click.prevent>ignore requests</a>
        and their data
        <a href="#" class="ir-link" @click.prevent>retention policy</a>.
      </p>

    </div>

    <!-- Page body -->
    <div class="page-body">
      <div class="ir-toolbar">

        <!-- Left: active filter chips + Add filter -->
        <div class="ir-filter-row">
          <div
            v-for="f in activeFilters"
            :key="f.key"
            class="ir-filter-chip"
          >
            <span class="ir-chip-label">{{ f.label }}:</span>
            <span class="ir-chip-value">{{ f.value }}</span>
            <button class="ir-chip-remove" @click="removeFilter(f.key)" :aria-label="`Remove ${f.label} filter`">
              <MdiIcon :path="mdiClose" :size="12" />
            </button>
          </div>
          <button class="ir-add-filter-btn">
            <MdiIcon :path="mdiPlus" :size="14" aria-hidden="true" />
            Add filter
          </button>
        </div>

        <!-- Right: search + modify columns -->
        <div class="ir-toolbar-actions">
          <div class="ir-search">
            <MdiIcon :path="mdiMagnify" :size="16" style="color:var(--pcl-color-ui-dimmed);flex-shrink:0" aria-hidden="true" />
            <input
              v-model="searchQuery"
              class="ir-search-input"
              placeholder="Search ignores"
            />
          </div>
          <div class="ir-toolbar-divider" aria-hidden="true"></div>
          <button class="ir-modify-btn">
            <MdiIcon :path="mdiTableColumn" :size="14" aria-hidden="true" />
            Modify columns
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="ir-table-wrap">
        <table class="ir-table">
          <thead>
            <tr class="ir-thead-row">
              <th class="ir-th ir-th--id">Id</th>
              <th class="ir-th ir-th--date">Request date</th>
              <th class="ir-th ir-th--by">Requested by</th>
              <th class="ir-th ir-th--sev">
                <button class="ir-sort-btn">
                  Severity
                  <MdiIcon :path="mdiArrowDown" :size="13" aria-hidden="true" />
                </button>
              </th>
              <th class="ir-th ir-th--vuln">Vulnerability</th>
              <th class="ir-th ir-th--repo">Repository</th>
              <th class="ir-th ir-th--branch">Branch</th>
              <th class="ir-th ir-th--cwe">CWE</th>
              <th class="ir-th ir-th--type">Ignore type</th>
              <th class="ir-th ir-th--exp">Expiration</th>
              <th class="ir-th ir-th--prod">Scanner</th>
              <th class="ir-th ir-th--review">Review</th>
              <th class="ir-th ir-th--action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(req, index) in filteredRequests"
              :key="req.id"
              class="ir-row"
              :class="{ 'ir-row--selected': drawerIndex === index }"
              @click="openDrawer(index)"
            >
              <!-- Id -->
              <td class="ir-td ir-td--id">
                <span class="ir-id-text">{{ req.id.slice(0, 7) }}…</span>
              </td>

              <!-- Request date -->
              <td class="ir-td">{{ req.requestDate }}</td>

              <!-- Requested by — AI triage sparkle avatar -->
              <td class="ir-td ir-td--by">
                <div class="ir-requester">
                  <div class="ir-ai-avatar" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 10L19.25 7.25L22 6L19.25 4.75L18 2L16.75 4.75L14 6L16.75 7.25L18 10ZM12.5 11.5L10 6L7.5 11.5L2 14L7.5 16.5L10 22L12.5 16.5L18 14L12.5 11.5Z"/>
                    </svg>
                  </div>
                  <span class="ir-requester-name">Snyk Code AI Triage</span>
                </div>
              </td>

              <!-- Severity -->
              <td class="ir-td ir-td--sev">
                <div
                  class="ir-sev-badge"
                  :style="{ background: severityColor(req.severity) }"
                  :aria-label="`${req.severity} severity`"
                >{{ req.severity[0].toUpperCase() }}</div>
              </td>

              <!-- Vulnerability -->
              <td class="ir-td ir-td--vuln">
                <span class="ir-vuln-name">{{ req.vulnerability }}</span>
              </td>

              <!-- Repository -->
              <td class="ir-td">
                <a href="#" class="ir-link" @click.prevent>{{ req.repository }}</a>
              </td>

              <!-- Branch -->
              <td class="ir-td">{{ req.branch }}</td>

              <!-- CWE -->
              <td class="ir-td">{{ req.cwe }}</td>

              <!-- Ignore type -->
              <td class="ir-td">{{ req.ignoreType }}</td>

              <!-- Expiration -->
              <td class="ir-td">{{ req.expiration }}</td>

              <!-- Snyk Product -->
              <td class="ir-td">{{ req.product }}</td>

              <!-- Review status -->
              <td class="ir-td">
                <span class="ir-badge-pending">Pending</span>
              </td>

              <!-- Action -->
              <td class="ir-td ir-td--action" @click.stop>
                <button class="ir-manage-btn" @click="openDrawer(index)">Manage</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Request detail drawer ─────────────────────────────────────────── -->
    <Transition name="ir-drawer">
      <div v-if="selectedRequest" class="ir-drawer-overlay" @click.self="closeDrawer" aria-modal="true" role="dialog">
        <div class="ir-drawer">

          <!-- Drawer header -->
          <div class="ir-drawer-header">
            <div class="ir-drawer-header-inner">
              <div class="ir-drawer-title-row">
                <!-- eye icon -->
                <svg class="ir-drawer-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"/>
                </svg>
                <span class="ir-drawer-title-text">REQUEST TO IGNORE BY SNYK CODE AI TRIAGE</span>
                <span class="ir-badge-pending" style="flex-shrink:0">Pending</span>
              </div>
              <button class="ir-drawer-close" @click="closeDrawer" aria-label="Close drawer">
                <MdiIcon :path="mdiClose" :size="16" />
              </button>
            </div>
            <!-- Tabs -->
            <div class="ir-drawer-tabs">
              <button class="ir-drawer-tab ir-drawer-tab--active">Request details</button>
              <button class="ir-drawer-tab">Comments</button>
            </div>
          </div>

          <!-- Drawer body -->
          <div class="ir-drawer-body">

            <!-- REQUEST section -->
            <div class="ir-drawer-section">
              <p class="ir-drawer-section-label">REQUEST</p>

              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Request Id</span>
                <span class="ir-drawer-row-value ir-drawer-mono">{{ selectedRequest.id }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Request from source</span>
                <span class="ir-drawer-row-value">Snyk Code</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Requested date</span>
                <span class="ir-drawer-row-value">Just now</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Requested by</span>
                <div class="ir-drawer-row-value ir-drawer-requester">
                  <div class="ir-ai-avatar" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 10L19.25 7.25L22 6L19.25 4.75L18 2L16.75 4.75L14 6L16.75 7.25L18 10ZM12.5 11.5L10 6L7.5 11.5L2 14L7.5 16.5L10 22L12.5 16.5L18 14L12.5 11.5Z"/>
                    </svg>
                  </div>
                  <span>Snyk Code AI Triage</span>
                </div>
              </div>
              <div class="ir-drawer-row ir-drawer-row--top">
                <span class="ir-drawer-row-label">Ignore reason</span>
                <span class="ir-drawer-row-value ir-drawer-reason">{{ selectedIgnore?.reason ?? '—' }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">AI confidence</span>
                <span
                  class="ir-drawer-row-value"
                  :style="{ color: confidenceColor(selectedIgnore?.confidence), fontWeight: 500 }"
                >{{ selectedIgnore?.confidence ?? '—' }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Ignore type</span>
                <span class="ir-drawer-row-value">{{ selectedRequest.ignoreType }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Expiration</span>
                <span class="ir-drawer-row-value">{{ selectedRequest.expiration }}</span>
              </div>
            </div>

            <!-- VULNERABILITY section -->
            <div class="ir-drawer-section">
              <p class="ir-drawer-section-label">VULNERABILITY</p>

              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Title</span>
                <div class="ir-drawer-row-value ir-drawer-requester">
                  <div
                    class="ir-sev-badge"
                    :style="{ background: severityColor(selectedRequest.severity) }"
                    :aria-label="`${selectedRequest.severity} severity`"
                    style="flex-shrink:0"
                  >{{ selectedRequest.severity[0].toUpperCase() }}</div>
                  <span>{{ selectedRequest.vulnerability }}</span>
                </div>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Vulnerability information</span>
                <a href="#" class="ir-link ir-drawer-row-value" @click.prevent>{{ selectedRequest.cwe }}</a>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Repository</span>
                <span class="ir-drawer-row-value">{{ selectedRequest.repository }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Branch</span>
                <span class="ir-drawer-row-value">{{ selectedRequest.branch }}</span>
              </div>
              <div class="ir-drawer-row">
                <span class="ir-drawer-row-label">Scanner</span>
                <span class="ir-drawer-row-value">{{ selectedRequest.product }}</span>
              </div>
            </div>

          </div>

          <!-- Drawer footer -->
          <div class="ir-drawer-footer">
            <div class="ir-drawer-footer-nav">
              <button class="ir-drawer-nav-btn" @click="prevRequest" :disabled="drawerIndex === 0" aria-label="Previous request">
                <MdiIcon :path="mdiChevronUp" :size="16" />
              </button>
              <button class="ir-drawer-nav-btn" @click="nextRequest" :disabled="drawerIndex === filteredRequests.length - 1" aria-label="Next request">
                <MdiIcon :path="mdiChevronDown" :size="16" />
              </button>
            </div>
            <button class="ir-drawer-cancel-btn">
              <!-- trash icon -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Cancel request
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Page header reuse ───────────────────────────────────────────────────── */
.main-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--pcl-color-ui-bg);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-xs, 8px);
  padding: var(--pcl-space-xs, 8px) var(--pcl-space-l, 24px) var(--pcl-space-xs, 8px) var(--pcl-space-l, 24px);
  border-bottom: 1px solid var(--pcl-color-ui-border);
  flex-shrink: 0;
  background: var(--pcl-color-ui-bg);
}

.page-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--pcl-space-xxs, 4px);
}

.breadcrumbs { display: flex; align-items: center; gap: 12px; }

.breadcrumb-link {
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.breadcrumb-link:hover { color: var(--pcl-color-ui-body); }


.page-header-title { display: flex; align-items: center; gap: 8px; }

.product-icon {
  width: 20px; height: 20px;
  border-radius: 4px;
  background: var(--pcl-color-brand-dark-purple, #471694);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.page-title {
  font-size: 18px; font-weight: 400;
  color: var(--pcl-color-ui-heading);
  line-height: 24px; margin: 0;
}

.ir-description {
  font-size: 13px;
  color: var(--pcl-color-ui-dimmed);
  line-height: 20px;
  margin: 0;
}

.ir-link {
  color: var(--pcl-color-ui-link);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ir-link:hover { text-decoration: none; }

/* ── Page body ───────────────────────────────────────────────────────────── */
.page-body {
  flex: 1;
  overflow-y: auto;
  background: var(--pcl-color-ui-canvas);
  display: flex;
  flex-direction: column;
}

/* ── Toolbar ─────────────────────────────────────────────────────────────── */
.ir-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 24px;
  background: var(--pcl-color-ui-bg);
  border-bottom: 1px solid var(--pcl-color-ui-border-light, #f2f1f4);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.ir-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Active filter chip */
.ir-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 4px 0 8px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
  font-size: 13px;
  color: var(--pcl-color-ui-body);
}

.ir-chip-label { color: var(--pcl-color-ui-dimmed); }
.ir-chip-value { font-weight: 500; }

.ir-chip-remove {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px;
  border: none; background: none; cursor: pointer; padding: 0;
  color: var(--pcl-color-ui-dimmed);
  border-radius: 2px;
  flex-shrink: 0;
}
.ir-chip-remove:hover { background: var(--pcl-color-ui-hover); color: var(--pcl-color-ui-body); }

.ir-add-filter-btn {
  display: inline-flex; align-items: center; gap: 4px;
  height: 28px; padding: 0 8px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
  font-size: 14px; font-weight: 500;
  color: var(--pcl-color-ui-body);
  cursor: pointer; font-family: inherit;
}
.ir-add-filter-btn:hover { background: var(--pcl-color-ui-canvas); }

/* Right-side toolbar actions */
.ir-toolbar-actions {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}

.ir-search {
  display: flex; align-items: center; gap: 4px;
  height: 28px; padding: 0 8px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
}

.ir-search-input {
  border: none; outline: none; background: transparent;
  font-size: 14px; color: var(--pcl-color-ui-body);
  font-family: inherit; width: 160px;
}
.ir-search-input::placeholder { color: var(--pcl-color-ui-dimmed); }

.ir-toolbar-divider {
  width: 1px; height: 20px;
  background: var(--pcl-color-ui-border);
  flex-shrink: 0;
}

.ir-modify-btn {
  display: inline-flex; align-items: center; gap: 4px;
  height: 28px; padding: 0 8px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
  font-size: 14px; font-weight: 500;
  color: var(--pcl-color-ui-body);
  cursor: pointer; font-family: inherit;
}
.ir-modify-btn:hover { background: var(--pcl-color-ui-canvas); }

/* ── Table ───────────────────────────────────────────────────────────────── */
.ir-table-wrap {
  flex: 1;
  overflow-x: auto;
  background: var(--pcl-color-ui-bg);
  padding: 0 24px 24px;
}

.ir-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  white-space: nowrap;
}

/* Header row */
.ir-thead-row {
  background: #fcfcfd;
  border-top: 1px solid var(--pcl-color-ui-border);
}

.ir-thead-row th {
  position: sticky;
  top: 0;
  background: #fcfcfd;
  z-index: 1;
  box-shadow: inset 0 -1px 0 var(--pcl-color-ui-border);
}

.ir-th {
  padding: 10px 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  text-align: left;
  white-space: nowrap;
}

.ir-sort-btn {
  display: inline-flex; align-items: center; gap: 4px;
  background: none; border: none; padding: 0; cursor: pointer;
  font-size: 14px; font-weight: 500;
  color: var(--pcl-color-ui-heading);
  font-family: inherit;
}

/* Column widths */
.ir-th--id,    .ir-td--id    { width: 88px; }
.ir-th--date                 { width: 106px; }
.ir-th--by,    .ir-td--by    { width: 170px; }
.ir-th--sev,   .ir-td--sev   { width: 72px; }
.ir-th--vuln,  .ir-td--vuln  { width: 200px; white-space: normal; }
.ir-th--repo                 { width: 140px; }
.ir-th--branch               { width: 80px; }
.ir-th--cwe                  { width: 84px; }
.ir-th--type                 { width: 120px; }
.ir-th--exp                  { width: 90px; }
.ir-th--prod                 { width: 100px; }
.ir-th--review               { width: 96px; }
.ir-th--action, .ir-td--action { width: 88px; text-align: right; }

/* Data rows */
.ir-row {
  border-bottom: 1px solid var(--pcl-color-ui-border-light, #f2f1f4);
}
.ir-row:hover { background: var(--pcl-color-ui-canvas); }

.ir-td {
  padding: 10px 8px;
  vertical-align: middle;
  color: var(--pcl-color-ui-body);
  font-size: 14px;
}

/* Id cell */
.ir-id-text {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: var(--pcl-color-ui-body);
}

/* Requester cell */
.ir-requester { display: flex; align-items: center; gap: 6px; }

.ir-ai-avatar {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b28d9, #145deb);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #fff;
}

.ir-requester-name {
  font-size: 13px;
  color: var(--pcl-color-ui-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

/* Severity badge */
.ir-sev-badge {
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 10px; font-weight: 700;
  flex-shrink: 0;
}

/* Vulnerability name */
.ir-vuln-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
}

/* Pending badge */
.ir-badge-pending {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 128px;
  border: 1px solid #fdd3b6;
  background: #fff4ed;
  color: #b6540b;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* Manage button */
.ir-manage-btn {
  display: inline-flex; align-items: center;
  height: 28px; padding: 0 12px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
  font-size: 14px; font-weight: 500;
  color: var(--pcl-color-ui-body);
  cursor: pointer; font-family: inherit;
  white-space: nowrap;
}
.ir-manage-btn:hover { background: var(--pcl-color-ui-canvas); }

/* ── Row selected state ──────────────────────────────────────────────────── */
.ir-row { cursor: pointer; }
.ir-row--selected { background: var(--pcl-color-state-selected-bg, #f4f8ff) !important; }
.ir-row--selected:hover { background: var(--pcl-color-state-selected-bg, #f4f8ff) !important; }

/* ── Drawer overlay ──────────────────────────────────────────────────────── */
.ir-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 200;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.ir-drawer {
  width: 520px;
  max-width: 90vw;
  height: 100%;
  background: var(--pcl-color-ui-bg);
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 24px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* ── Drawer header ───────────────────────────────────────────────────────── */
.ir-drawer-header {
  flex-shrink: 0;
  border-bottom: 1px solid var(--pcl-color-ui-border);
  background: var(--pcl-color-ui-bg);
}

.ir-drawer-header-inner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 16px 16px 12px;
  position: relative;
}

.ir-drawer-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding-right: 8px;
}

.ir-drawer-icon {
  color: var(--pcl-color-ui-dimmed);
  flex-shrink: 0;
}

.ir-drawer-title-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pcl-color-ui-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ir-drawer-close {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border: none; background: none; cursor: pointer; padding: 0;
  color: var(--pcl-color-ui-dimmed);
  border-radius: 4px;
  flex-shrink: 0;
}
.ir-drawer-close:hover { background: var(--pcl-color-ui-hover); color: var(--pcl-color-ui-body); }

/* ── Drawer tabs ─────────────────────────────────────────────────────────── */
.ir-drawer-tabs {
  display: flex;
  gap: 4px;
  padding: 0 16px 12px;
}

.ir-drawer-tab {
  display: flex; align-items: center; justify-content: center;
  height: 32px; padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: none;
  font-size: 14px; font-weight: 400;
  color: var(--pcl-color-ui-heading);
  cursor: pointer; font-family: inherit;
  white-space: nowrap;
}
.ir-drawer-tab:hover { background: var(--pcl-color-ui-canvas); }

.ir-drawer-tab--active {
  background: var(--pcl-color-state-selected-bg, #f4f8ff);
  border-color: var(--pcl-color-blue-20, #b5ccfa);
  color: var(--pcl-color-state-selected-text, #145deb);
}
.ir-drawer-tab--active:hover { background: var(--pcl-color-state-selected-bg, #f4f8ff); }

/* ── Drawer body ─────────────────────────────────────────────────────────── */
.ir-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Drawer sections ─────────────────────────────────────────────────────── */
.ir-drawer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ir-drawer-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pcl-color-ui-dimmed);
  margin: 0 0 2px;
}

/* ── Drawer rows ─────────────────────────────────────────────────────────── */
.ir-drawer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

.ir-drawer-row--top { align-items: flex-start; }

.ir-drawer-row-label {
  flex-shrink: 0;
  width: 168px;
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  line-height: 20px;
}

.ir-drawer-row-value {
  flex: 1;
  font-size: 14px;
  color: var(--pcl-color-ui-heading);
  line-height: 20px;
  word-break: break-word;
}

.ir-drawer-mono {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
}

.ir-drawer-requester {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ir-drawer-reason {
  color: var(--pcl-color-ui-body);
  line-height: 1.5;
}

/* ── Drawer footer ───────────────────────────────────────────────────────── */
.ir-drawer-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--pcl-color-ui-border);
  background: var(--pcl-color-ui-bg);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ir-drawer-footer-nav {
  display: flex;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  overflow: hidden;
}

.ir-drawer-nav-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: none;
  border-right: 1px solid var(--pcl-color-ui-border);
  background: var(--pcl-color-ui-bg);
  color: var(--pcl-color-ui-body);
  cursor: pointer; padding: 0;
}
.ir-drawer-nav-btn:last-child { border-right: none; }
.ir-drawer-nav-btn:hover:not(:disabled) { background: var(--pcl-color-ui-canvas); }
.ir-drawer-nav-btn:disabled { color: var(--pcl-color-ui-dimmed); cursor: not-allowed; opacity: 0.5; }

.ir-drawer-cancel-btn {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  background: var(--pcl-color-ui-bg);
  font-size: 14px; font-weight: 500;
  color: var(--pcl-color-ui-body);
  cursor: pointer; font-family: inherit;
}
.ir-drawer-cancel-btn:hover { background: var(--pcl-color-ui-canvas); }

/* ── Drawer transition ───────────────────────────────────────────────────── */
.ir-drawer-enter-active,
.ir-drawer-leave-active {
  transition: opacity 0.18s ease;
}
.ir-drawer-enter-active .ir-drawer,
.ir-drawer-leave-active .ir-drawer {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.ir-drawer-enter-from,
.ir-drawer-leave-to {
  opacity: 0;
}
.ir-drawer-enter-from .ir-drawer,
.ir-drawer-leave-to .ir-drawer {
  transform: translateX(100%);
}
</style>
