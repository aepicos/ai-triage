<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MdiIcon from './MdiIcon.vue'
import PriorityRangeSlider from './PriorityRangeSlider.vue'
import IgnoreRequestsPage from './IgnoreRequestsPage.vue'
import { issues as issuesData, type Issue } from './issues-data'
import { aiTriageIgnores } from './ai-triage-results'

// ── ProductCL components ──────────────────────────────────────────────────────
// Imported from local stubs — a file that approximates the real library API so
// this prototype can run without internal npm access.
//
// When handing off to engineering, change ONLY this import path:
//   FROM: './productcl-stubs'
//   TO:   '@snyk/productcl'   ← (or whatever the internal package name is)
//
// Component names, props, slot names, and emitted events are identical between
// the stubs and the real package. No template changes are needed.
// ─────────────────────────────────────────────────────────────────────────────
import {
  BaseAlert,
  BaseAvatarUsername,
  BaseBadge,
  BaseButton,
  BaseCaption,
  BaseCheckbox,
  BaseInput,
  BaseLayoutGap,
  BaseTabs,
} from './productcl-stubs'

import {
  mdiChevronDown,
  mdiChevronRight,
  mdiCog,
  mdiEye,
  mdiFilter,
  mdiGithub,
  mdiLinkVariant,
  mdiPencil,
  mdiPlusCircleOutline,
  mdiRefresh,
  // sidebar nav icons
  mdiViewDashboard,
  mdiFolderMultiple,
  mdiChartBox,
  mdiShieldAccount,
  mdiDatabase,
  mdiAccountSupervisor,
  mdiHelpCircle,
  mdiBell,
  mdiRobotOutline,
  mdiArrowRight,
  mdiClose,
} from '@mdi/js'

// ── Routing ───────────────────────────────────────────────────────────────────
type Page = 'projects' | 'ignore-requests'

const routes: Record<Page, string> = {
  'projects':        '/org/acme/project/ab12c345-6de7-8901-2345-67fg8h901ijk',
  'ignore-requests': '/acme/ignore-requests',
}

function pageFromPath(path: string): Page {
  for (const [page, route] of Object.entries(routes) as [Page, string][]) {
    if (path === route) return page
  }
  return 'projects'
}

const currentPage = ref<Page>(pageFromPath(window.location.pathname))

function navigate(page: Page) {
  if (currentPage.value === page) return
  history.pushState({ page }, '', routes[page])
  currentPage.value = page
}

function onPopState(e: PopStateEvent) {
  currentPage.value = e.state?.page ?? pageFromPath(window.location.pathname)
}

onMounted(() => {
  // Ensure the initial URL reflects the page (handles direct load at /)
  if (!Object.values(routes).includes(window.location.pathname)) {
    history.replaceState({ page: 'projects' }, '', routes['projects'])
  } else {
    history.replaceState({ page: currentPage.value }, '', window.location.pathname)
  }
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => window.removeEventListener('popstate', onPopState))

interface NavItem { label: string; path: string; page?: 'projects' | 'ignore-requests' }
const primaryNav: NavItem[] = [
  { label: 'Dashboard',        path: mdiViewDashboard },
  { label: 'Projects',         path: mdiFolderMultiple,    page: 'projects' },
  { label: 'Ignore requests',  path: mdiEye,               page: 'ignore-requests' },
  { label: 'Reports',          path: mdiChartBox },
  { label: 'Issues',           path: mdiShieldAccount },
  { label: 'Policies',         path: mdiDatabase },
  { label: 'Members',          path: mdiAccountSupervisor },
  { label: 'Settings',         path: mdiCog },
]
const utilNav: NavItem[] = [
  { label: 'Help',          path: mdiHelpCircle },
  { label: 'Notifications', path: mdiBell },
]

// Code icon (curly-braces / code analysis)
const mdiCodeAnalysis = 'M4 7v2c0 .55-.45 1-1 1H2v4h1c.55 0 1 .45 1 1v2c0 1.65 1.35 3 3 3h3v-2H7c-.55 0-1-.45-1-1v-2c0-1.3-.84-2.42-2-2.83v-.34C5.16 11.42 6 10.3 6 9V7c0-.55.45-1 1-1h3V4H7C5.35 4 4 5.35 4 7m17 3c-.55 0-1-.45-1-1V7c0-1.65-1.35-3-3-3h-3v2h3c.55 0 1 .45 1 1v2c0 1.3.84 2.42 2 2.83v.34c-1.16.41-2 1.52-2 2.83v2c0 .55-.45 1-1 1h-3v2h3c1.65 0 3-1.35 3-3v-2c0-.55.45-1 1-1h1v-4z'

const activePageTab = ref('overview')
const pageTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'history',  label: 'History' },
  { id: 'settings', label: 'Settings' },
]

const searchQuery   = ref('')
const priorityRange = ref({ min: 0, max: 1000 })
const issueScores   = issuesData.map(i => i.score)

// ── Retest ────────────────────────────────────────────────────────────────────
const RETEST_DURATION_MS = 6000
const retesting   = ref(false)
const retestDone  = ref(false)

function onRetest() {
  if (retesting.value) return
  retesting.value = true
  setTimeout(() => {
    retesting.value = false
    retestDone.value = true
    // Apply AI triage ignores
    for (const triage of aiTriageIgnores) {
      const issue = issues.value.find(i => i.id === triage.issueId)
      if (issue && !issue.ignored) {
        issue.ignored = true
        issue.ignoreInfo = {
          by: 'Snyk Code AI Triage',
          minutesAgo: 0,
          type: 'Not vulnerable',
          path: issue.filePath,
          expires: 'Never',
          reason: triage.reason,
          confidence: triage.confidence,
        }
      }
    }
  }, RETEST_DURATION_MS)
}

const severityFilters    = ref<string[]>([])
const statusFilters      = ref<string[]>(['open'])
const languageFilters    = ref<string[]>([])
const vulnTypeFilters    = ref<string[]>([])
const confidenceFilters  = ref<string[]>([])

function reviewLowConfidence() {
  severityFilters.value   = []
  statusFilters.value     = ['ignored']
  languageFilters.value   = []
  vulnTypeFilters.value   = []
  searchQuery.value       = ''
  priorityRange.value     = { min: 0, max: 1000 }
  confidenceFilters.value = ['Low']
}

// Filter section open/closed state
const filterOpen = ref<Record<string, boolean>>({
  severity:   true,
  score:      true,
  status:     true,
  confidence: true,
  languages:  true,
  vulnTypes:  true,
})

// Derived counts — all computed from the real issues array so they stay in sync

const severityCounts = computed(() => ({
  high:   issuesData.filter(i => i.severity === 'high').length,
  medium: issuesData.filter(i => i.severity === 'medium').length,
  low:    issuesData.filter(i => i.severity === 'low').length,
}))

const statusCounts = computed(() => ({
  open:    issues.value.filter(i => !i.ignored).length,
  ignored: issues.value.filter(i =>  i.ignored).length,
}))

const confidenceCounts = computed(() => ({
  high:   issues.value.filter(i => i.ignoreInfo?.confidence === 'High').length,
  medium: issues.value.filter(i => i.ignoreInfo?.confidence === 'Medium').length,
  low:    issues.value.filter(i => i.ignoreInfo?.confidence === 'Low').length,
}))

// ── AI triage banner (post-retest) ────────────────────────────────────────────
const triageBannerDismissed = ref(false)
const showTriageBanner = computed(() => retestDone.value && !triageBannerDismissed.value)
const confidenceTotal = computed(() =>
  confidenceCounts.value.high + confidenceCounts.value.medium + confidenceCounts.value.low
)
const confidenceBarWidths = computed(() => {
  const t = confidenceTotal.value || 1
  return {
    high:   (confidenceCounts.value.high   / t * 100).toFixed(1) + '%',
    medium: (confidenceCounts.value.medium / t * 100).toFixed(1) + '%',
    low:    (confidenceCounts.value.low    / t * 100).toFixed(1) + '%',
  }
})

const languageCounts = computed(() => ({
  typescript: issuesData.filter(i => i.filePath.endsWith('.ts')).length,
  javascript: issuesData.filter(i => i.filePath.endsWith('.js')).length,
}))

const vulnTypes = computed(() => {
  const counts: Record<string, number> = {}
  for (const issue of issuesData) {
    counts[issue.title] = (counts[issue.title] || 0) + 1
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
})

const issues = ref<Issue[]>(issuesData)

const filteredIssues = computed(() => {
  return issues.value.filter(issue => {

    // ── Status ───────────────────────────────────────────────────────────────
    // Empty selection = no constraint. Otherwise at least one value must match.
    if (statusFilters.value.length > 0) {
      const wantOpen    = statusFilters.value.includes('open')
      const wantIgnored = statusFilters.value.includes('ignored')
      if (!(wantOpen && !issue.ignored) && !(wantIgnored && issue.ignored)) return false
    }

    // ── Severity ─────────────────────────────────────────────────────────────
    if (severityFilters.value.length > 0 && !severityFilters.value.includes(issue.severity)) {
      return false
    }

    // ── AI triage confidence ──────────────────────────────────────────────────
    if (confidenceFilters.value.length > 0) {
      const c = issue.ignoreInfo?.confidence
      if (!c || !confidenceFilters.value.includes(c)) return false
    }

    // ── Vulnerability type ────────────────────────────────────────────────────
    if (vulnTypeFilters.value.length > 0 && !vulnTypeFilters.value.includes(issue.title)) {
      return false
    }

    // ── Language ─────────────────────────────────────────────────────────────
    if (languageFilters.value.length > 0) {
      const lang = issue.filePath.endsWith('.ts') ? 'typescript'
                 : issue.filePath.endsWith('.js') ? 'javascript'
                 : ''
      if (!languageFilters.value.includes(lang)) return false
    }

    // ── Priority score (range) ────────────────────────────────────────────────
    if (issue.score < priorityRange.value.min || issue.score > priorityRange.value.max) return false

    // ── Search query ─────────────────────────────────────────────────────────
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      if (
        !issue.title.toLowerCase().includes(q) &&
        !issue.filePath.toLowerCase().includes(q) &&
        !issue.cwe.toLowerCase().includes(q) &&
        !issue.cweTitle.toLowerCase().includes(q) &&
        !issue.description.toLowerCase().includes(q)
      ) return false
    }

    return true
  })
})

// Returns the CSS color value for a given severity level
const severityColor = (s: string): string => {
  if (s === 'critical') return 'var(--pcl-color-severity-critical-base, #7f00ff)'
  if (s === 'high')     return 'var(--pcl-color-severity-high-base, #ce5019)'
  if (s === 'medium')   return 'var(--pcl-color-severity-medium-base, #c97d15)'
  return 'var(--pcl-color-severity-low-base, #88879e)'
}

function highlightDescription(text: string, highlights: string[]): string {
  let result = text
  for (const h of highlights) {
    result = result.replace(
      new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      `<a href="#" class="desc-highlight" onclick="return false">${h}</a>`,
    )
  }
  return result
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Renders a code line as safe HTML, wrapping secretText in a highlight mark
function highlightCodeLine(text: string, secretText?: string): string {
  const escaped = escapeHtml(text)
  if (!secretText) return escaped
  const escapedSecret = escapeHtml(secretText)
  return escaped.replace(
    escapedSecret,
    `<mark class="secret-highlight">${escapedSecret}</mark>`,
  )
}

// suppress unused warning — BaseLayoutGap is imported for handoff reference
void BaseLayoutGap
</script>

<template>
  <div class="app-shell">

    <!-- ══ PROTOTYPE-ONLY ══════════════════════════════════════════════════
         .sidebar — custom div standing in for AppSideBar + AppNavigation.
         DELETE when real PCL components are implemented.
         ══════════════════════════════════════════════════════════════════ -->
    <nav class="sidebar" aria-label="Main navigation">
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <MdiIcon :path="mdiRobotOutline" :size="16" style="color:#fff;opacity:0.9" />
          <span>snyk</span>
        </div>
      </div>
      <div class="sidebar__nav">
        <div
          v-for="item in primaryNav"
          :key="item.label"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': item.page && currentPage === item.page }"
          @click="item.page && navigate(item.page)"
        >
          <MdiIcon :path="item.path" :size="18" />
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="sidebar__util-nav">
        <div v-for="item in utilNav" :key="item.label" class="sidebar__item sidebar__item--util">
          <MdiIcon :path="item.path" :size="18" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </nav>
    <!-- ══ END PROTOTYPE-ONLY ════════════════════════════════════════════ -->

    <!-- Ignore requests page -->
    <IgnoreRequestsPage v-if="currentPage === 'ignore-requests'" />

    <div v-else class="main-area">

      <!-- Page header: breadcrumbs + title + tabs — unified bg-white block -->
      <!-- PRODUCTION-SAFE -->
      <div class="page-header">

        <!-- Row 1: breadcrumbs left · actions right -->
        <div class="page-header-top">
          <div class="breadcrumbs">
            <a href="#" class="breadcrumb-link" @click.prevent>acme</a>
            <MdiIcon :path="mdiChevronRight" :size="16" style="color:var(--pcl-color-ui-dimmed)" aria-hidden="true" />
            <a href="#" class="breadcrumb-link" @click.prevent>Projects</a>
            <MdiIcon :path="mdiChevronRight" :size="16" style="color:var(--pcl-color-ui-dimmed)" aria-hidden="true" />
            <a href="#" class="breadcrumb-link" @click.prevent>acme/juice-shop</a>
            <BaseBadge>master</BaseBadge>
          </div>
          <div class="page-header-actions">
            <button class="header-btn" type="button">
              <MdiIcon :path="mdiGithub" :size="14" aria-hidden="true" />
              Open on GitHub
            </button>
            <button class="header-btn header-btn--icon" type="button" aria-label="Settings">
              <MdiIcon :path="mdiCog" :size="16" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Row 2: product icon + page title -->
        <div class="page-header-title">
          <div class="product-icon" aria-hidden="true">
            <MdiIcon :path="mdiCodeAnalysis" :size="12" style="color:#fff" />
          </div>
          <h1 class="page-title">Code analysis</h1>
        </div>

        <!-- Row 3: tabs -->
        <BaseTabs v-model="activePageTab" :tabs="pageTabs" />

      </div>

      <!-- Page body scroll area -->
      <div class="page-body">

        <!-- Alert banner: pre-retest warning → post-retest success -->
        <BaseAlert v-if="!retestDone" variant="warning" size="page">
          <strong>Snyk Code AI triage has run.</strong> Retest the project to capture recent policy updates and ignored issues.
        </BaseAlert>
        <BaseAlert v-else variant="success" size="page" :dismissible="true">
          <strong>The project was successfully retested.</strong>
        </BaseAlert>

        <!-- Summary section: snapshot · metadata · issues tab — all one canvas-bg block -->
        <!-- PRODUCTION-SAFE -->
        <div class="summary-section">

          <!-- Snapshot row: all inline -->
          <div class="snapshot-bar">
            <span class="snapshot-text">Created Thu 14th Aug 2025</span>
            <span class="snapshot-dot" aria-hidden="true">·</span>
            <span class="snapshot-text">
              Snapshot for commit&nbsp;<a href="#" class="snapshot-link" @click.prevent>e12c282</a>&nbsp;taken by snyk.io 2 minutes ago
            </span>
            <span class="snapshot-dot" aria-hidden="true">·</span>
            <button class="retest-btn" :class="{ 'retest-btn--busy': retesting }" type="button" :disabled="retesting" @click="onRetest">
              <span v-if="retesting" class="retest-spinner" aria-hidden="true"></span>
              <MdiIcon v-else :path="mdiRefresh" :size="14" aria-hidden="true" />
              Retest
            </button>
          </div>

          <!-- Metadata flex row -->
          <div class="metadata-row">
            <div class="meta-item">
              <span class="meta-label">Imported by</span>
              <BaseAvatarUsername name="Wile E." initials="W" size="small" />
            </div>
            <div class="meta-item">
              <span class="meta-label">Project owner</span>
              <BaseButton variant="link">
                <template #leftIcon><MdiIcon :path="mdiPlusCircleOutline" :size="14" aria-hidden="true" /></template>
                Add
              </BaseButton>
            </div>
            <div class="meta-item">
              <span class="meta-label">Environment</span>
              <BaseButton variant="link">
                <template #leftIcon><MdiIcon :path="mdiPlusCircleOutline" :size="14" aria-hidden="true" /></template>
                Add
              </BaseButton>
            </div>
            <div class="meta-item">
              <span class="meta-label">Business criticality</span>
              <BaseButton variant="link">
                <template #leftIcon><MdiIcon :path="mdiPlusCircleOutline" :size="14" aria-hidden="true" /></template>
                Add
              </BaseButton>
            </div>
            <div class="meta-item">
              <span class="meta-label">Lifecycle</span>
              <BaseButton variant="link">
                <template #leftIcon><MdiIcon :path="mdiPlusCircleOutline" :size="14" aria-hidden="true" /></template>
                Add
              </BaseButton>
            </div>
            <div class="meta-item meta-item--analysis">
              <span class="meta-label">Analysis summary</span>
              <span class="meta-value">
                639 analyzed files (86%) &nbsp;·&nbsp;
                <a href="#" class="snapshot-link" @click.prevent>Repo breakdown</a>
              </span>
            </div>
          </div>

          <!-- Issues tab -->
          <div class="issues-tab-bar">
            <div class="issues-tab-active">
              Issues
              <BaseBadge>{{ issues.length }}</BaseBadge>
            </div>
          </div>

        </div>

        <!-- Issues two-panel layout -->
        <!-- PRODUCTION-SAFE — filter sidebar + issue list layout -->
        <div class="issues-layout">

          <!-- Filters sidebar -->
          <aside class="filters-sidebar">

            <!-- Filter icon button -->
            <button class="filter-icon-btn" type="button" aria-label="Filters">
              <MdiIcon :path="mdiFilter" :size="16" aria-hidden="true" />
            </button>

            <!-- Severity -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.severity = !filterOpen.severity">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.severity ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">Severity</span>
              </button>
              <div v-if="filterOpen.severity" class="filter-options">
                <BaseCheckbox v-model="severityFilters" value="high"><span class="filter-label-row">High<span class="filter-count">{{ severityCounts.high }}</span></span></BaseCheckbox>
                <BaseCheckbox v-model="severityFilters" value="medium"><span class="filter-label-row">Medium<span class="filter-count">{{ severityCounts.medium }}</span></span></BaseCheckbox>
                <BaseCheckbox v-model="severityFilters" value="low"><span class="filter-label-row">Low<span class="filter-count">{{ severityCounts.low }}</span></span></BaseCheckbox>
              </div>
            </div>

            <!-- Priority score -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.score = !filterOpen.score">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.score ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">Priority score</span>
              </button>
              <div v-if="filterOpen.score" class="filter-options">
                <PriorityRangeSlider v-model="priorityRange" :min="0" :max="1000" :scores="issueScores" />
              </div>
            </div>

            <!-- Status -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.status = !filterOpen.status">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.status ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">Status</span>
              </button>
              <div v-if="filterOpen.status" class="filter-options">
                <BaseCheckbox v-model="statusFilters" value="open"><span class="filter-label-row">Open<span class="filter-count">{{ statusCounts.open }}</span></span></BaseCheckbox>
                <BaseCheckbox v-model="statusFilters" value="ignored"><span class="filter-label-row">Ignored<span class="filter-count">{{ statusCounts.ignored }}</span></span></BaseCheckbox>
              </div>
            </div>

            <!-- AI triage confidence -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.confidence = !filterOpen.confidence">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.confidence ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">AI triage confidence</span>
              </button>
              <div v-if="filterOpen.confidence" class="filter-options">
                <BaseCheckbox v-model="confidenceFilters" value="High"><span class="filter-label-row">High<span class="filter-count">{{ confidenceCounts.high }}</span></span></BaseCheckbox>
                <BaseCheckbox v-model="confidenceFilters" value="Medium"><span class="filter-label-row">Medium<span class="filter-count">{{ confidenceCounts.medium }}</span></span></BaseCheckbox>
                <BaseCheckbox v-model="confidenceFilters" value="Low"><span class="filter-label-row">Low<span class="filter-count">{{ confidenceCounts.low }}</span></span></BaseCheckbox>
              </div>
            </div>

            <!-- Languages -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.languages = !filterOpen.languages">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.languages ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">Languages</span>
              </button>
              <div v-if="filterOpen.languages" class="filter-options">
                <BaseCheckbox v-model="languageFilters" value="typescript"><span class="filter-label-row">TypeScript<span class="filter-count">{{ languageCounts.typescript }}</span></span></BaseCheckbox>
                <BaseCheckbox v-if="languageCounts.javascript > 0" v-model="languageFilters" value="javascript"><span class="filter-label-row">JavaScript<span class="filter-count">{{ languageCounts.javascript }}</span></span></BaseCheckbox>
              </div>
            </div>

            <!-- Vulnerability types -->
            <div class="filter-section">
              <button class="filter-section-header" @click="filterOpen.vulnTypes = !filterOpen.vulnTypes">
                <MdiIcon
                  :path="mdiChevronDown"
                  :size="14"
                  :style="{ transform: filterOpen.vulnTypes ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }"
                  aria-hidden="true"
                />
                <span class="filter-section-label">Vulnerability types</span>
              </button>
              <div v-if="filterOpen.vulnTypes" class="filter-options">
                <BaseCheckbox v-for="vt in vulnTypes" :key="vt.label" v-model="vulnTypeFilters" :value="vt.label"><span class="filter-label-row">{{ vt.label }}<span class="filter-count">{{ vt.count }}</span></span></BaseCheckbox>
              </div>
            </div>

          </aside>

          <!-- Issue list -->
          <div class="issue-list">

            <!-- AI triage summary banner (post-retest) -->
            <Transition name="triage-banner">
              <div v-if="showTriageBanner" class="triage-banner">

                <!-- Banner header -->
                <div class="triage-banner-header">
                  <div class="triage-banner-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="triage-banner-icon">
                      <path d="M18 10L19.25 7.25L22 6L19.25 4.75L18 2L16.75 4.75L14 6L16.75 7.25L18 10ZM12.5 11.5L10 6L7.5 11.5L2 14L7.5 16.5L10 22L12.5 16.5L18 14L12.5 11.5Z"/>
                    </svg>
                    <span class="triage-banner-label">Snyk Code AI Triage</span>
                  </div>
                  <div class="triage-banner-actions">
                    <a href="#" class="triage-banner-link" @click.prevent="navigate('ignore-requests')">
                      View all suppressed issues
                      <MdiIcon :path="mdiArrowRight" :size="13" aria-hidden="true" style="vertical-align:-2px" />
                    </a>
                    <span class="triage-banner-divider" aria-hidden="true">|</span>
                    <button class="triage-banner-close" @click="triageBannerDismissed = true" aria-label="Dismiss">
                      <MdiIcon :path="mdiClose" :size="16" />
                    </button>
                  </div>
                </div>

                <!-- Banner content -->
                <div class="triage-banner-content">

                  <!-- KPIs -->
                  <div class="triage-kpis">
                    <div class="triage-kpi">
                      <p class="triage-kpi-label">Issues evaluated</p>
                      <p class="triage-kpi-value">{{ issues.length }}</p>
                      <p class="triage-kpi-sub">From last scan</p>
                    </div>
                    <div class="triage-kpi">
                      <p class="triage-kpi-label">Issues suppressed</p>
                      <p class="triage-kpi-value">{{ statusCounts.ignored }}</p>
                      <p class="triage-kpi-sub">{{ Math.round(statusCounts.ignored / issues.length * 100) }}% of issues</p>
                    </div>
                    <div class="triage-kpi">
                      <p class="triage-kpi-label">Flagged for review</p>
                      <p class="triage-kpi-value">{{ confidenceCounts.low }}</p>
                      <p class="triage-kpi-sub">Manual review recommended</p>
                    </div>
                    <div class="triage-kpi triage-kpi--chart">
                      <p class="triage-kpi-label">Confidence distribution</p>
                      <div class="triage-conf-bar-wrap">
                        <div class="triage-conf-bar">
                          <div class="triage-conf-seg triage-conf-seg--high"   :style="{ width: confidenceBarWidths.high }"></div>
                          <div class="triage-conf-seg triage-conf-seg--medium" :style="{ width: confidenceBarWidths.medium }"></div>
                          <div class="triage-conf-seg triage-conf-seg--low"    :style="{ width: confidenceBarWidths.low }"></div>
                        </div>
                      </div>
                      <div class="triage-conf-legend">
                        <span class="triage-conf-item"><span class="triage-conf-dot triage-conf-dot--high"></span>High ({{ confidenceCounts.high }})</span>
                        <span class="triage-conf-item"><span class="triage-conf-dot triage-conf-dot--medium"></span>Medium ({{ confidenceCounts.medium }})</span>
                        <span class="triage-conf-item"><span class="triage-conf-dot triage-conf-dot--low"></span>Low ({{ confidenceCounts.low }})</span>
                      </div>
                    </div>
                  </div>

                  <!-- Low-confidence alert -->
                  <div v-if="confidenceCounts.low > 0" class="triage-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="triage-alert-icon">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    <p class="triage-alert-text">
                      <strong>{{ confidenceCounts.low }} finding{{ confidenceCounts.low === 1 ? '' : 's' }} suppressed with low confidence</strong>
                      — these decisions are less certain and warrant manual review before the next retest.
                      <button class="triage-alert-link" @click="reviewLowConfidence()">Review</button>
                    </p>
                  </div>

                </div>
              </div>
            </Transition>

            <!-- Search + controls bar (single row) -->
            <div class="search-controls-bar">
              <BaseInput v-model="searchQuery" placeholder="Search..." size="small" style="width:320px;flex-shrink:0" />
              <div class="controls-right">
                <BaseButton variant="link" size="small">
                  Group by none
                  <template #rightIcon><MdiIcon :path="mdiChevronDown" :size="14" aria-hidden="true" /></template>
                </BaseButton>
                <span class="controls-divider" aria-hidden="true">|</span>
                <BaseButton variant="link" size="small">
                  Sort by <strong class="controls-sort-bold">highest severity</strong>
                  <template #rightIcon><MdiIcon :path="mdiChevronDown" :size="14" aria-hidden="true" /></template>
                </BaseButton>
              </div>
            </div>

            <!-- Issue cards -->
            <div class="issue-cards">
              <div
                v-for="issue in filteredIssues"
                :key="issue.id"
                class="issue-card"
                :class="[`issue-card--${issue.severity}`, { 'issue-card--ignored': issue.ignored }]"
              >
                <!-- Absolute left severity accent strip -->
                <div
                  class="issue-severity-strip"
                  :style="{ background: severityColor(issue.severity) }"
                  aria-hidden="true"
                />

                <!-- Card header -->
                <div class="issue-card-header">
                  <div class="issue-card-header-left">
                    <!-- Title row: badge + title + link + ignored -->
                    <div class="issue-title-row">
                      <div
                        class="severity-circle"
                        :style="{ background: severityColor(issue.severity) }"
                        :aria-label="`${issue.severity} severity`"
                      >
                        {{ issue.severity[0].toUpperCase() }}
                      </div>
                      <span class="issue-title">{{ issue.title }}</span>
                      <a href="#" class="issue-link-icon" @click.prevent aria-label="Permalink">
                        <MdiIcon :path="mdiLinkVariant" :size="14" />
                      </a>
                      <span v-if="issue.ignored" class="badge-ignored">Ignored</span>
                    </div>
                    <!-- Subtitle: indented to align with title text -->
                    <div class="issue-subtitle">
                      <span class="subtitle-source">{{ issue.snykCode }}</span>
                      <span class="subtitle-sep" aria-hidden="true"> · </span>
                      <a href="#" class="subtitle-cwe" @click.prevent>{{ issue.cwe }}: {{ issue.cweTitle }}</a>
                    </div>
                  </div>
                  <div class="issue-card-score">
                    <span class="issue-score-value">{{ issue.score }}</span>
                    <span class="issue-score-label">Priority score</span>
                  </div>
                </div>

                <!-- Code section: file path header + code lines -->
                <div class="code-section">
                  <div class="code-file-header">
                    <span class="code-file-meta">
                      <a href="#" class="file-path-link" @click.prevent>{{ issue.filePath }}</a>
                      <span class="code-file-sep" aria-hidden="true"> | </span>
                      <span class="code-file-locations">{{ issue.steps }} location{{ issue.steps !== 1 ? 's' : '' }}</span>
                    </span>
                  </div>
                  <div class="code-snippet">
                    <div
                      v-for="line in issue.code.lines"
                      :key="line.num"
                      class="code-line"
                      :class="{ 'code-line--highlight': line.highlight }"
                    >
                      <span
                        class="line-num"
                        :class="{ 'line-num--highlight': line.highlight }"
                      >{{ line.num }}</span>
                      <code
                        class="line-text"
                        v-html="highlightCodeLine(line.text, line.highlight ? line.secretText : undefined)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <p
                  class="issue-description"
                  v-html="highlightDescription(issue.description, issue.descriptionHighlights)"
                />

                <!-- Learn more link -->
                <div class="issue-learn-more">
                  <a href="#" class="learn-link" @click.prevent>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0">
                      <path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9zm6.82 6L12 12.72 5.18 9 12 5.28zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73z"/>
                    </svg>
                    Learn about this type of vulnerability and how to fix it
                  </a>
                </div>

                <!-- Ignore info (expanded for ignored issues) -->
                <div v-if="issue.ignored && issue.ignoreInfo" class="ignore-info">
                  <div class="ignore-info-grid">
                    <div class="ignore-info-cell">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">
                        Ignored {{ issue.ignoreInfo.minutesAgo }} minutes ago by
                      </BaseCaption>
                      <!-- AI triage avatar: sparkle icon in gradient circle -->
                      <div v-if="issue.ignoreInfo.by === 'Snyk Code AI Triage'" class="ignore-avatar-row">
                        <div class="ai-triage-avatar">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M18 10L19.25 7.25L22 6L19.25 4.75L18 2L16.75 4.75L14 6L16.75 7.25L18 10ZM12.5 11.5L10 6L7.5 11.5L2 14L7.5 16.5L10 22L12.5 16.5L18 14L12.5 11.5Z"/>
                          </svg>
                        </div>
                        <span class="ignore-avatar-name">{{ issue.ignoreInfo.by }}</span>
                      </div>
                      <!-- Regular user avatar: initial circle + name -->
                      <div v-else class="ignore-avatar-row">
                        <div class="ignore-avatar-circle">{{ issue.ignoreInfo.by[0] }}</div>
                        <span class="ignore-avatar-name">{{ issue.ignoreInfo.by }}</span>
                      </div>
                    </div>
                    <div class="ignore-info-cell">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">Ignored path</BaseCaption>
                      <BaseCaption style="font-weight:600;color:var(--pcl-color-ui-body)">{{ issue.ignoreInfo.path }}</BaseCaption>
                    </div>
                    <div class="ignore-info-cell">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">Type</BaseCaption>
                      <BaseCaption style="font-weight:600;color:var(--pcl-color-ui-body)">{{ issue.ignoreInfo.type }}</BaseCaption>
                    </div>
                    <div class="ignore-info-cell">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">Expires</BaseCaption>
                      <BaseCaption style="font-weight:600;color:var(--pcl-color-ui-body)">{{ issue.ignoreInfo.expires }}</BaseCaption>
                    </div>
                    <div v-if="issue.ignoreInfo.confidence" class="ignore-info-cell">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">Confidence</BaseCaption>
                      <BaseCaption style="font-weight:600;color:var(--pcl-color-ui-body)">{{ issue.ignoreInfo.confidence }}</BaseCaption>
                    </div>
                    <div class="ignore-info-cell ignore-info-cell--full">
                      <BaseCaption style="color:var(--pcl-color-ui-dimmed)">Reason</BaseCaption>
                      <BaseCaption style="font-weight:600;color:var(--pcl-color-ui-body)">{{ issue.ignoreInfo.reason }}</BaseCaption>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="issue-actions">
                  <template v-if="issue.ignored">
                    <BaseButton size="small">
                      <template #leftIcon><MdiIcon :path="mdiEye" :size="14" aria-hidden="true" /></template>
                      Unignore
                    </BaseButton>
                    <BaseButton size="small">
                      <template #leftIcon><MdiIcon :path="mdiPencil" :size="14" aria-hidden="true" /></template>
                      Edit ignore
                    </BaseButton>
                  </template>
                  <template v-else>
                    <BaseButton size="small">
                      <template #leftIcon><MdiIcon :path="mdiEye" :size="14" aria-hidden="true" /></template>
                      Ignore issue
                    </BaseButton>
                  </template>
                  <BaseButton variant="primary" size="small">
                    View details
                    <template #rightIcon><MdiIcon :path="mdiChevronRight" :size="14" aria-hidden="true" /></template>
                  </BaseButton>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/*
  ════════════════════════════════════════════════════════════════════
  PCL TOKEN FALLBACKS
  ════════════════════════════════════════════════════════════════════
  Define every token used in this file so the prototype renders
  correctly without the real @snyk/productcl CSS being loaded.
  Values sourced from productcl-stubs.ts token references.
  ════════════════════════════════════════════════════════════════════
*/
:root {
  /* Surface colours */
  --pcl-color-ui-canvas:       #f9f8fa;
  --pcl-color-ui-bg:           #ffffff;

  /* Text colours */
  --pcl-color-ui-heading:      #1c1c21;
  --pcl-color-ui-body:         #555463;
  --pcl-color-ui-dimmed:       #727184;
  --pcl-color-ui-link:         #145deb;

  /* Border colours */
  --pcl-color-ui-border:       #d3d3d9;
  --pcl-color-ui-border-light: #f2f1f4;

  /* Interaction */
  --pcl-color-ui-hover:        rgba(0, 0, 0, 0.04);

  /* Severity */
  --pcl-color-severity-critical-base: #ab1a1a;
  --pcl-color-severity-high-base:     #ce5019;
  --pcl-color-severity-medium-base:   #d68000;
  --pcl-color-severity-low-base:      #88879e;

  /* Brand */
  --pcl-color-brand-midnight:    #21214c;
  --pcl-color-brand-dark-purple: #471694;
  --pcl-color-brand-white:       #ffffff;

  /* Neutral */
  --pcl-color-neutral-05: #f9f8fa;

  /* Radii */
  --pcl-radius-medium: 4px;

  /* Warning (matches BaseAlert warning variant) */
  --pcl-color-warning-bg:     #fff8e6;
  --pcl-color-warning-border: #ffd070;
  --pcl-color-warning-text:   #8a5c00;

  /* Spacing */
  --pcl-space-xxs: 4px;
  --pcl-space-xs:  8px;
  --pcl-space-s:   12px;
  --pcl-space-m:   16px;
  --pcl-space-l:   24px;
  --pcl-space-xl:  32px;
}

/*
  ════════════════════════════════════════════════════════════════════
  CSS ANNOTATION KEY
  ════════════════════════════════════════════════════════════════════
  PROTOTYPE-ONLY   — Styles a custom HTML element standing in for a
                     real PCL component. DELETE when that component
                     is implemented — PCL brings its own scoped CSS.

  PRODUCTION-SAFE  — Page-level or content-level styling that survives
                     after real PCL components are in place. Keep and
                     refine during the engineering handoff.
  ════════════════════════════════════════════════════════════════════
*/

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: 'Roboto', 'Inter', sans-serif; background: var(--pcl-color-ui-canvas); }

/* ══ PROTOTYPE-ONLY ════════════════════════════════════════════════
   App shell + sidebar — standing in for App + AppSideBar + AppNavigation.
   DELETE this block when real PCL components are implemented.
   ══════════════════════════════════════════════════════════════════ */
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 223px;
  flex-shrink: 0;
  background: var(--pcl-color-brand-midnight, #21214c);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}

.sidebar__header {
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.sidebar__nav {
  flex: 1;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.sidebar__util-nav {
  padding: 8px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--pcl-radius-medium);
  cursor: pointer;
  font-size: 15px;
  color: rgba(211,211,217,0.8);
  transition: background 0.1s, color 0.1s;
  user-select: none;
}

.sidebar__item:hover {
  background: rgba(255,255,255,0.06);
  color: #fff;
}

.sidebar__item--active {
  background: var(--pcl-color-brand-dark-purple, #471694);
  color: #fff;
}

.sidebar__item--util {
  color: rgba(211,211,217,0.6);
}
/* ══ END PROTOTYPE-ONLY ════════════════════════════════════════════ */

/* PRODUCTION-SAFE — main content area layout */
.main-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--pcl-color-ui-bg);
}

/* PRODUCTION-SAFE — page header: breadcrumbs + title + tabs unified block */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 24px 0;
  border-bottom: 1px solid var(--pcl-color-ui-border);
  flex-shrink: 0;
  background: var(--pcl-color-ui-bg);
}

/* Row 1 inside page header */
.page-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.breadcrumb-link {
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--pcl-color-ui-dimmed);
  cursor: pointer;
  white-space: nowrap;
}

.breadcrumb-link:hover { color: var(--pcl-color-ui-heading); }

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* PROTOTYPE-ONLY — compact outlined header buttons */
.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #b3b2bd;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  letter-spacing: 0.1px;
  line-height: 18px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.header-btn:hover { background: var(--pcl-color-ui-canvas); }

.header-btn--icon {
  width: 28px;
  height: 28px;
  padding: 0;
  justify-content: center;
}

/* Row 2: product icon + page title */
.page-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* PROTOTYPE-ONLY — 20×20 product icon */
.product-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--pcl-color-brand-dark-purple, #471694);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-title {
  font-size: 18px;
  font-weight: 400;
  color: var(--pcl-color-ui-heading);
  line-height: 24px;
  margin: 0;
}

/* PRODUCTION-SAFE — scrollable page body */
.page-body {
  flex: 1;
  overflow-y: auto;
  background: var(--pcl-color-ui-bg);
}

/* PRODUCTION-SAFE — summary section: snapshot + metadata + issues tab in one canvas block */
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 24px 0;
  background: var(--pcl-color-ui-canvas);
  border-bottom: 1px solid var(--pcl-color-ui-border);
  flex-shrink: 0;
}

/* PRODUCTION-SAFE — snapshot inline row */
.snapshot-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.snapshot-text {
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  line-height: 20px;
}

.snapshot-dot {
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  line-height: 20px;
}

.snapshot-link {
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--pcl-color-ui-dimmed);
}

/* PROTOTYPE-ONLY — compact Retest pill button */
.retest-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #b3b2bd;
  border-radius: 4px;
  padding: 2px 6px 2px 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  letter-spacing: 0.1px;
  line-height: 18px;
  cursor: pointer;
  font-family: inherit;
}

.retest-btn:hover:not(:disabled) { background: var(--pcl-color-ui-bg); }
.retest-btn--busy { opacity: 0.6; cursor: default; }

.retest-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: retest-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes retest-spin {
  to { transform: rotate(360deg); }
}

/* ── AI triage banner ────────────────────────────────────────────────────── */
.triage-banner {
  flex-shrink: 0;
  border: 1px solid var(--pcl-color-ui-border-light, #f2f1f4);
  border-radius: 8px;
  margin: var(--pcl-space-m, 16px) var(--pcl-space-l, 24px) 0 var(--pcl-space-l, 24px);
  background: var(--pcl-color-ui-canvas);
  overflow: hidden;
}

/* header row */
.triage-banner-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 16px;
}

.triage-banner-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.triage-banner-icon {
  color: var(--pcl-color-ui-dimmed);
  flex-shrink: 0;
}

.triage-banner-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pcl-color-ui-dimmed);
  white-space: nowrap;
}

.triage-banner-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.triage-banner-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 14px;
  color: var(--pcl-color-ui-link);
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;
}
.triage-banner-link:hover { text-decoration: none; }

.triage-banner-divider {
  font-size: 14px;
  color: var(--pcl-color-ui-border);
  user-select: none;
}

.triage-banner-close {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border: none; background: none; cursor: pointer; padding: 0;
  color: var(--pcl-color-ui-dimmed);
  border-radius: 4px;
}
.triage-banner-close:hover { background: var(--pcl-color-ui-canvas); color: var(--pcl-color-ui-body); }

/* content area */
.triage-banner-content {
  border-top: 1px solid var(--pcl-color-ui-border-light, #f2f1f4);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* KPI row */
.triage-kpis {
  display: flex;
  align-items: flex-start;
}

.triage-kpi {
  flex: 1;
}

.triage-kpi--chart {
  flex: 1.4;
}

.triage-kpi-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  margin: 0 0 10px;
  line-height: 18px;
}

.triage-kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--pcl-color-ui-heading);
  line-height: 28px;
  margin: 0;
}

.triage-kpi-sub {
  font-size: 12px;
  color: var(--pcl-color-ui-dimmed);
  margin: 0;
  line-height: 16px;
}

/* confidence bar chart */
.triage-conf-bar-wrap {
  padding: 8px 0;
}

.triage-conf-bar {
  display: flex;
  gap: 2px;
  height: 8px;
  border-radius: 128px;
  overflow: hidden;
  box-shadow: 0 0 0 2px var(--pcl-color-ui-bg);
}

.triage-conf-seg { height: 100%; border-radius: 0; }
.triage-conf-seg--high   { background: #2d9283; }
.triage-conf-seg--medium { background: #e27122; }
.triage-conf-seg--low    { background: #d8082d; }

.triage-conf-legend {
  display: flex;
  gap: 16px;
}

.triage-conf-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--pcl-color-ui-dimmed);
  white-space: nowrap;
}

.triage-conf-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--pcl-color-ui-bg);
}
.triage-conf-dot--high   { background: #2d9283; }
.triage-conf-dot--medium { background: #e27122; }
.triage-conf-dot--low    { background: #d8082d; }

/* low-confidence alert */
.triage-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  background: var(--pcl-color-warn-bg, #fff4ed);
  border: 1px solid var(--pcl-color-warn-bg-alt, #fdd3b6);
  border-radius: 4px;
}

.triage-alert-icon {
  color: var(--pcl-color-warn-text, #b6540b);
  flex-shrink: 0;
  margin-top: 1px;
}

.triage-alert-text {
  font-size: 14px;
  color: var(--pcl-color-warn-text, #b6540b);
  margin: 0;
  line-height: 20px;
}

.triage-alert-link {
  border: none; background: none; padding: 0;
  font: inherit; cursor: pointer;
  color: var(--pcl-color-ui-link, #145deb);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.triage-alert-link:hover { text-decoration: none; }

/* transition */
.triage-banner-enter-active,
.triage-banner-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.triage-banner-enter-from,
.triage-banner-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* PRODUCTION-SAFE — link text (breadcrumbs, inline body links) */
.link-text {
  color: var(--pcl-color-ui-link);
  text-decoration: none;
  font-size: 13px;
}

.link-text:hover { text-decoration: underline; }

/* PRODUCTION-SAFE — metadata flex row */
.metadata-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 0 0;
  min-width: 0;
}

.meta-item--analysis {
  flex: 2 0 0;
}

.meta-label {
  font-size: 14px;
  color: var(--pcl-color-ui-dimmed);
  font-weight: 400;
  line-height: 20px;
}

.meta-value {
  font-size: 14px;
  font-weight: 400;
  color: var(--pcl-color-ui-heading);
  line-height: 20px;
}

/* PRODUCTION-SAFE — issues tab bar */
.issues-tab-bar {
  display: flex;
}

.issues-tab-active {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0 12px;
  border-bottom: 4px solid var(--pcl-color-ui-link);
  border-radius: 4px 4px 0 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--pcl-color-ui-heading);
  margin-bottom: -1px;
  cursor: default;
}

/* PRODUCTION-SAFE — two-column issues layout */
.issues-layout {
  display: flex;
  align-items: flex-start;
  background: var(--pcl-color-ui-canvas);
  min-height: 100%;
}

/* PRODUCTION-SAFE — filter sidebar */
.filters-sidebar {
  width: 264px;
  flex-shrink: 0;
  padding: var(--pcl-space-m) var(--pcl-space-l);
  background: var(--pcl-color-ui-bg);
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-m);
  overflow-y: auto;
}

/* PROTOTYPE-ONLY — filter icon button at top of sidebar */
.filter-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: var(--pcl-radius-medium);
  background: var(--pcl-color-ui-bg);
  cursor: pointer;
  color: var(--pcl-color-ui-dimmed);
  padding: 0;
}

.filter-icon-btn:hover {
  background: var(--pcl-color-ui-canvas);
}

/* PRODUCTION-SAFE — individual filter section */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-xs);
}

/* PROTOTYPE-ONLY — section header toggle button */
.filter-section-header {
  display: flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--pcl-color-ui-dimmed);
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.filter-section-header:hover { color: var(--pcl-color-ui-heading); }

.filter-section-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: inherit;
}

/* PRODUCTION-SAFE — filter options list */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-xs);
  padding-left: var(--pcl-space-xs);
}
.filter-options label { width: 100%; }
.filter-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}
.filter-count {
  color: var(--pcl-color-ui-dimmed);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

/* PRODUCTION-SAFE — right issue list panel */
.issue-list {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--pcl-color-ui-bg);
}

/* PRODUCTION-SAFE — combined search + controls single bar */
.search-controls-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--pcl-space-m) var(--pcl-space-l) 0 var(--pcl-space-l);
  background: var(--pcl-color-ui-bg);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: auto;
}

.controls-divider {
  color: var(--pcl-color-ui-border);
  font-size: 14px;
  padding: 0 4px;
  user-select: none;
  line-height: 1;
}

/* Override BaseButton link colour to dimmed for Group/Sort controls */
.controls-right button,
.controls-right a {
  color: var(--pcl-color-ui-dimmed) !important;
}

.controls-sort-bold {
  font-weight: 600;
}

/* PRODUCTION-SAFE — issue cards container */
.issue-cards {
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-m);
  padding: var(--pcl-space-m) var(--pcl-space-l);
  background: var(--pcl-color-ui-bg);
}

/* PRODUCTION-SAFE — individual issue card */
.issue-card {
  border: 1px solid var(--pcl-color-ui-border, #c8c8d6);
  border-radius: 8px;
  overflow: hidden;
  background: var(--pcl-color-ui-bg);
  position: relative;
}

/* PRODUCTION-SAFE — absolute left severity accent strip */
.issue-severity-strip {
  position: absolute;
  left: 0;
  top: 16px;
  width: 4px;
  height: 44px;
  border-radius: 0 4px 4px 0;
}

.issue-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
}

.issue-card-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  padding-left: 16px;
  gap: 0;
}

.issue-score-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  color: var(--pcl-color-ui-heading);
  font-variant-numeric: tabular-nums;
}

.issue-score-label {
  font-size: 14px;
  line-height: 20px;
  color: var(--pcl-color-ui-dimmed);
  white-space: nowrap;
}

.issue-card-header-left {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 4px;
  flex: 1;
  min-width: 0;
}

.issue-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* PRODUCTION-SAFE — circular severity indicator badge */
.severity-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0;
}

.issue-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--pcl-color-ui-heading);
  line-height: 24px;
}

.badge-ignored {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 128px;
  border: 1px solid var(--pcl-color-warning-border);
  background: var(--pcl-color-warning-bg);
  color: var(--pcl-color-warning-text);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.issue-link-icon {
  color: var(--pcl-color-ui-dimmed);
  display: flex;
  align-items: center;
  text-decoration: none;
}

.issue-link-icon:hover { color: var(--pcl-color-ui-link); }

/* PRODUCTION-SAFE — subtitle row with source + CWE link */
.issue-subtitle {
  padding-left: 32px; /* 24px circle + 8px gap = aligns with title text */
  font-size: 14px;
  line-height: 20px;
  color: var(--pcl-color-ui-dimmed);
}

.subtitle-source {
  color: var(--pcl-color-ui-dimmed);
}

.subtitle-sep {
  color: var(--pcl-color-ui-dimmed);
  padding: 0 2px;
}

.subtitle-cwe {
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--pcl-color-ui-dimmed);
}

.subtitle-cwe:hover { opacity: 0.8; }

/* PRODUCTION-SAFE — code section (file header + lines) */
.code-section {
  background-color: var(--pcl-color-ui-canvas);
  border-block: 1px solid var(--pcl-color-ui-border-light);
}

.code-file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--pcl-color-ui-canvas);
  border-bottom: 1px solid var(--pcl-color-ui-border-light);
}

.code-file-meta {
  font-size: 12px;
  font-family: 'SF Mono', 'Roboto Mono', 'Fira Code', monospace;
  display: flex;
  align-items: center;
  gap: 0;
}

.file-path-link {
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--pcl-color-ui-dimmed);
  font-size: inherit;
  font-family: inherit;
}

.file-path-link:hover { text-decoration: none; }

.code-file-sep {
  color: var(--pcl-color-ui-dimmed);
  padding: 0 4px;
}

.code-file-locations {
  color: var(--pcl-color-ui-dimmed);
}

/* PRODUCTION-SAFE — code snippet block */
.code-snippet {
  background: var(--pcl-color-ui-canvas);
  font-family: 'SF Mono', 'Roboto Mono', 'Fira Code', monospace;
  font-size: 12px;
  overflow-x: auto;
  padding: 4px 0;
}

.code-line {
  display: flex;
  gap: 16px;
  padding: 2px 16px;
  white-space: nowrap;
}

.code-line--highlight {
  background: #fdede7;
}

.line-num {
  color: var(--pcl-color-ui-dimmed);
  min-width: 28px;
  text-align: right;
  user-select: none;
  flex-shrink: 0;
  font-size: 12px;
}

.line-num--highlight {
  color: #dd4300;
}

.line-text {
  color: var(--pcl-color-ui-body);
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: inherit;
}

/* PRODUCTION-SAFE — inline secret value highlight within code */
.secret-highlight {
  background: #f7c9b8;
  color: #b80313;
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
}

.issue-description {
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  padding: 14px 16px 8px;
  margin: 0;
  line-height: 1.55;
}

/* PRODUCTION-SAFE — description highlighted terms (link-style) */
.desc-highlight {
  color: var(--pcl-color-ui-link);
  text-decoration: underline;
  text-decoration-color: var(--pcl-color-ui-link);
  cursor: pointer;
}

/* PRODUCTION-SAFE — learn more link row */
.issue-learn-more {
  padding: 2px 16px 16px;
}

.learn-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--pcl-color-ui-dimmed);
}

.learn-link:hover { text-decoration: none; }

/* PRODUCTION-SAFE — ignore info expanded panel */
.ignore-info {
  background: var(--pcl-color-warning-bg);
  border: 1px solid var(--pcl-color-warning-border);
  border-radius: var(--pcl-radius-medium);
  padding: var(--pcl-space-xs);
  margin-inline: var(--pcl-space-m);
  margin-bottom: var(--pcl-space-m);
}

.ignore-info-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px 16px;
}

.ignore-info-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ignore-info-cell--full {
  grid-column: 1 / -1;
}

.ignore-avatar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-triage-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b28d9, #145deb);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.ignore-avatar-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 500;
  color: #fff;
}

.ignore-avatar-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--pcl-color-ui-body);
}

/* PRODUCTION-SAFE — issue action buttons row */
.issue-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 12px;
}
</style>
