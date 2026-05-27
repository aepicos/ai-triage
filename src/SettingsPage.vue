<script setup lang="ts">
import { ref } from 'vue'
import MdiIcon from './MdiIcon.vue'
import {
  mdiChevronRight,
  mdiArrowRight,
  mdiTune,
  mdiChartBar,
  mdiAccountKey,
  mdiFolderMultiple,
  mdiBell,
  mdiPackageVariantClosed,
  mdiCloud,
  mdiViewGridOutline,
  mdiLinkVariant,
  mdiPuzzleOutline,
  mdiSourceBranch,
  mdiGithub,
  mdiPlusCircleOutline,
  mdiInformationOutline,
  mdiRobotOutline,
} from '@mdi/js'

// Same custom code icon as main app
const mdiCodeAnalysis = 'M4 7v2c0 .55-.45 1-1 1H2v4h1c.55 0 1 .45 1 1v2c0 1.65 1.35 3 3 3h3v-2H7c-.55 0-1-.45-1-1v-2c0-1.3-.84-2.42-2-2.83v-.34C5.16 11.42 6 10.3 6 9V7c0-.55.45-1 1-1h3V4H7C5.35 4 4 5.35 4 7m17 3c-.55 0-1-.45-1-1V7c0-1.65-1.35-3-3-3h-3v2h3c.55 0 1 .45 1 1v2c0 1.3.84 2.42 2 2.83v.34c-1.16.41-2 1.52-2 2.83v2c0 .55-.45 1-1 1h-3v2h3c1.65 0 3-1.35 3-3v-2c0-.55.45-1 1-1h1v-4z'

const scanningEnabled = ref(true)
const fixAgentEnabled  = ref(true)
const aiTriageEnabled  = ref(true)
</script>

<template>
  <div class="sp-shell">

    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <header class="sp-header">
      <div class="sp-header-inner">
        <nav class="sp-breadcrumbs" aria-label="Breadcrumb">
          <a href="#" class="sp-breadcrumb-link" @click.prevent>acme</a>
          <MdiIcon :path="mdiChevronRight" :size="16" class="sp-breadcrumb-sep" aria-hidden="true" />
          <span class="sp-breadcrumb-current">Settings</span>
        </nav>
        <button class="sp-goto-btn" type="button">
          Go to Group Settings
          <MdiIcon :path="mdiArrowRight" :size="14" aria-hidden="true" />
        </button>
      </div>
    </header>

    <!-- ── Scrollable body ─────────────────────────────────────────────────── -->
    <div class="sp-body">
      <div class="sp-content">
        <div class="sp-layout">

          <!-- ── Sidebar nav ───────────────────────────────────────────────── -->
          <nav class="sp-sidebar" aria-label="Settings navigation">

            <!-- Organisation settings -->
            <div class="sp-nav-section">
              <div class="sp-nav-section-header">Organisation settings</div>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiTune" :size="16" class="sp-nav-icon" aria-hidden="true" />
                General
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiChartBar" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Usage
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiAccountKey" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Service accounts
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiFolderMultiple" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Automated collections
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiBell" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Notifications
              </a>
            </div>

            <!-- Products and features -->
            <div class="sp-nav-section">
              <div class="sp-nav-section-header">Products and features</div>
              <a href="#" class="sp-nav-item sp-nav-item--active" @click.prevent aria-current="page">
                <MdiIcon :path="mdiCodeAnalysis" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Snyk Code
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiPackageVariantClosed" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Snyk Open Source
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiCloud" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Snyk IaC
              </a>
            </div>

            <!-- Integrations -->
            <div class="sp-nav-section">
              <div class="sp-nav-section-header">Integrations</div>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiViewGridOutline" :size="16" class="sp-nav-icon" aria-hidden="true" />
                General
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiLinkVariant" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Snyk Broker
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiPuzzleOutline" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Authorized Snyk apps
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiSourceBranch" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Bitbucket Cloud
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiSourceBranch" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Bitbucket Server
              </a>
              <a href="#" class="sp-nav-item" @click.prevent>
                <MdiIcon :path="mdiGithub" :size="16" class="sp-nav-icon" aria-hidden="true" />
                GitHub
              </a>
              <a href="#" class="sp-nav-item sp-nav-item--dimmed" @click.prevent>
                <MdiIcon :path="mdiPlusCircleOutline" :size="16" class="sp-nav-icon" aria-hidden="true" />
                Add integration
              </a>
            </div>

            <!-- Snyk preview item -->
            <div class="sp-nav-preview">
              <MdiIcon :path="mdiRobotOutline" :size="16" class="sp-nav-icon" aria-hidden="true" />
              Snyk preview
            </div>

          </nav>

          <!-- ── Main content ───────────────────────────────────────────────── -->
          <main class="sp-main">

            <!-- Content header -->
            <div class="sp-content-header">
              <h1 class="sp-heading">Snyk Code</h1>
              <p class="sp-intro">
                To analyze your code for vulnerabilities we temporarily clone the repository or upload your code.<br>
                Cloned or uploaded code is cached according to our
                <a href="#" class="sp-intro-link" @click.prevent>data retention policy</a>.
              </p>
            </div>

            <!-- Settings cards -->
            <div class="sp-cards">

              <!-- Card: Snyk Code scanning ─────────────────────────────────── -->
              <div class="sp-card">
                <div class="sp-card-content">
                  <div class="sp-card-left">
                    <h2 class="sp-card-title">Snyk Code scanning</h2>
                    <p class="sp-card-body">After being enabled, you must import / re-import projects to scan them.</p>
                    <a href="#" class="sp-more-info" @click.prevent>
                      <MdiIcon :path="mdiInformationOutline" :size="14" aria-hidden="true" />
                      More info
                    </a>
                  </div>
                  <div class="sp-card-right">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="scanningEnabled"
                      class="sp-toggle"
                      :class="{ 'sp-toggle--on': scanningEnabled }"
                      @click="scanningEnabled = !scanningEnabled"
                    >
                      <span class="sp-toggle-input">
                        <span class="sp-toggle-pill"></span>
                        <span class="sp-toggle-knob"></span>
                        <span class="sp-toggle-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </span>
                      </span>
                      <span class="sp-toggle-label-text">Enable Snyk Code scanning</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card: Fix Agent ──────────────────────────────────────────── -->
              <div class="sp-card" :class="{ 'sp-card--disabled': !scanningEnabled }">
                <div class="sp-card-content">
                  <div class="sp-card-left">
                    <h2 class="sp-card-title">Fix Agent</h2>
                    <p class="sp-card-body">Enable Snyk Fix Agent to automatically fix code vulnerabilities through fully supported IDEs such as VS Code and JetBrains. Supported languages: Java, JavaScript, Python, and TypeScript. See the documentation link below for information on training and data handling.</p>
                    <a href="#" class="sp-more-info" @click.prevent>
                      <MdiIcon :path="mdiInformationOutline" :size="14" aria-hidden="true" />
                      More info
                    </a>
                  </div>
                  <div class="sp-card-right">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="fixAgentEnabled && scanningEnabled"
                      :disabled="!scanningEnabled"
                      class="sp-toggle"
                      :class="{ 'sp-toggle--on': fixAgentEnabled && scanningEnabled }"
                      @click="fixAgentEnabled = !fixAgentEnabled"
                    >
                      <span class="sp-toggle-input">
                        <span class="sp-toggle-pill"></span>
                        <span class="sp-toggle-knob"></span>
                        <span class="sp-toggle-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </span>
                      </span>
                      <span class="sp-toggle-label-text">Enable Fix Agent</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card: AI Triage Agent ────────────────────────────────────── -->
              <div class="sp-card" :class="{ 'sp-card--disabled': !scanningEnabled }">
                <div class="sp-card-content">
                  <div class="sp-card-left">
                    <div class="sp-card-title-row">
                      <h2 class="sp-card-title">AI Triage Agent</h2>
                      <span class="sp-badge-new">New</span>
                    </div>
                    <p class="sp-card-body">The Snyk AI Triage Agent scans your Source Code Manager (SCM) to gather context around issues that are false positives and can be ignored. Supported SCMs: Bitbucket, GitHub, and Gitlab.</p>
                    <a href="#" class="sp-more-info" @click.prevent>
                      <MdiIcon :path="mdiInformationOutline" :size="14" aria-hidden="true" />
                      More info
                    </a>
                  </div>
                  <div class="sp-card-right">
                    <!-- Toggle with sub-note -->
                    <div class="sp-toggle-group">
                      <button
                        type="button"
                        role="switch"
                        :aria-checked="aiTriageEnabled && scanningEnabled"
                        :disabled="!scanningEnabled"
                        class="sp-toggle sp-toggle--wide-gap"
                        :class="{ 'sp-toggle--on': aiTriageEnabled && scanningEnabled }"
                        @click="aiTriageEnabled = !aiTriageEnabled"
                      >
                        <span class="sp-toggle-input">
                          <span class="sp-toggle-pill"></span>
                          <span class="sp-toggle-knob"></span>
                          <span class="sp-toggle-check" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          </span>
                        </span>
                        <span class="sp-toggle-label-text">Enable AI Triage Agent</span>
                      </button>
                      <p class="sp-toggle-note">Watch the world zoom past as you lie comfortably in the overtaking lane of software security! Whoosh!</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────────────────────────── */
.sp-shell {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--pcl-color-ui-canvas);
}

/* ── Page header ─────────────────────────────────────────────────────────── */
.sp-header {
  flex-shrink: 0;
  background: var(--pcl-color-ui-bg);
  border-bottom: 1px solid var(--pcl-color-ui-border);
}

.sp-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--pcl-space-m) var(--pcl-space-l);
}

.sp-breadcrumbs {
  display: flex;
  align-items: center;
}

.sp-breadcrumb-link {
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  text-decoration: none;
  line-height: 18px;
}
.sp-breadcrumb-link:hover { text-decoration: underline; text-underline-offset: 2px; }

.sp-breadcrumb-sep {
  color: var(--pcl-color-ui-dimmed);
  margin: 0 var(--pcl-space-xs);
}

.sp-breadcrumb-current {
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  line-height: 18px;
}

.sp-goto-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--pcl-color-ui-bg);
  border: 1px solid #b3b2bd;
  border-radius: var(--pcl-radius-medium);
  padding: 5px var(--pcl-space-xs);
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  letter-spacing: 0.1px;
  line-height: 18px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}
.sp-goto-btn:hover { background: var(--pcl-color-ui-canvas); }

/* ── Body / layout ───────────────────────────────────────────────────────── */
.sp-body {
  flex: 1;
  overflow-y: auto;
}

.sp-content {
  padding: var(--pcl-space-l) var(--pcl-space-l) 60px;
}

.sp-layout {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
.sp-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-m);
}

.sp-nav-section {
  display: flex;
  flex-direction: column;
}

.sp-nav-section-header {
  padding: var(--pcl-space-xs);
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-dimmed);
  line-height: 18px;
  letter-spacing: 0.1px;
}

.sp-nav-item {
  display: flex;
  align-items: center;
  gap: var(--pcl-space-xs);
  padding: 5px var(--pcl-space-xs);
  border-radius: var(--pcl-radius-medium);
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  line-height: 18px;
  letter-spacing: 0.1px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.1s;
}
.sp-nav-item:hover { background: var(--pcl-color-ui-hover); }

.sp-nav-item--active {
  background: var(--pcl-color-blue-10, #eaf1ff);
  color: var(--pcl-color-ui-link);
}
.sp-nav-item--active:hover { background: var(--pcl-color-blue-10, #eaf1ff); }

.sp-nav-item--dimmed { color: var(--pcl-color-ui-dimmed); }

.sp-nav-icon { flex-shrink: 0; }

.sp-nav-preview {
  display: flex;
  align-items: center;
  gap: var(--pcl-space-xs);
  padding: 7px var(--pcl-space-xs);
  border-radius: var(--pcl-radius-medium);
  border: 1px solid #e555ac;
  font-size: 14px;
  color: var(--pcl-color-ui-body);
  line-height: 18px;
  cursor: pointer;
  white-space: nowrap;
}

/* ── Main ────────────────────────────────────────────────────────────────── */
.sp-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sp-content-header {
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-xs);
  padding-bottom: var(--pcl-space-m);
  border-bottom: 1px solid var(--pcl-color-ui-border);
}

.sp-heading {
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  color: var(--pcl-color-ui-heading);
  margin: 0;
}

.sp-intro {
  font-size: 14px;
  line-height: 18px;
  color: var(--pcl-color-ui-dimmed);
  letter-spacing: 0.1px;
  margin: 0;
}

.sp-intro-link {
  color: var(--pcl-color-ui-dimmed);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.sp-intro-link:hover { color: var(--pcl-color-ui-heading); }

/* ── Cards ───────────────────────────────────────────────────────────────── */
.sp-cards {
  border: 1px solid var(--pcl-color-ui-border);
  border-radius: 4px;
  overflow: hidden;
  background: var(--pcl-color-ui-canvas);
}

.sp-card {
  background: var(--pcl-color-ui-bg);
  padding: var(--pcl-space-l);
}
.sp-card + .sp-card {
  border-top: 1px solid var(--pcl-color-ui-border);
}

.sp-card--disabled .sp-card-content {
  opacity: 0.4;
  pointer-events: none;
  user-select: none;
}

.sp-card-content {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.sp-card-left {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--pcl-space-xs);
  padding-right: var(--pcl-space-m);
}

.sp-card-title-row {
  display: flex;
  align-items: center;
  gap: var(--pcl-space-xs);
}

.sp-card-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: var(--pcl-color-ui-heading);
  margin: 0;
  white-space: nowrap;
}

.sp-badge-new {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--pcl-space-xs);
  background: var(--pcl-color-success-bg, #ecfcf8);
  border: 1px solid var(--pcl-color-success-bg-alt, #b4e4d9);
  border-radius: 128px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.24px;
  text-transform: uppercase;
  color: var(--pcl-color-success-text, #16706b);
  white-space: nowrap;
}

.sp-card-body {
  font-size: 14px;
  line-height: 18px;
  color: var(--pcl-color-ui-body);
  letter-spacing: 0.1px;
  margin: 0;
}

.sp-more-info {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--pcl-color-ui-link);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.sp-more-info:hover { text-decoration: none; }

.sp-card-right {
  flex: 1 0 0;
  min-width: 0;
  padding-top: var(--pcl-space-xs);
}

/* ── Toggle switch ───────────────────────────────────────────────────────── */
.sp-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--pcl-space-xs);    /* 8px between input and label */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

/* Wider gap variant for AI Triage card (matches 12px in Figma) */
.sp-toggle--wide-gap {
  gap: 12px;
}

/* Input container — clips the overhanging knob at on-state */
.sp-toggle-input {
  position: relative;
  width: 34px;
  height: 20px;
  flex-shrink: 0;
  overflow: hidden;
}

/* Pill / track */
.sp-toggle-pill {
  position: absolute;
  left: 0;
  top: 2px;
  width: 32px;
  height: 16px;
  border-radius: 10px;
  background: var(--pcl-color-ui-border, #d3d3d9);
  transition: background 0.15s ease;
}

.sp-toggle--on .sp-toggle-pill {
  background: var(--pcl-color-state-selected-bg-alt, #b5ccfa);
}

/* Knob */
.sp-toggle-knob {
  position: absolute;
  top: 2px;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.07);
  transition: left 0.15s ease, background 0.15s ease;
  z-index: 1;
}

.sp-toggle--on .sp-toggle-knob {
  left: 18px;
  background: var(--pcl-color-ui-link, #145deb);
  box-shadow: 0 1px 3px rgba(20, 93, 235, 0.35), 0 0 0 1px rgba(20, 93, 235, 0.15);
}

/* White checkmark icon overlaid on the blue knob when on */
.sp-toggle-check {
  position: absolute;
  left: 20px;
  top: 4px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.sp-toggle-check svg {
  width: 100%;
  height: 100%;
}
.sp-toggle--on .sp-toggle-check {
  opacity: 1;
}

.sp-toggle-label-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--pcl-color-ui-body);
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;
}

/* AI Triage toggle group (toggle + sub-note stacked) */
.sp-toggle-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sp-toggle-note {
  /* indent past toggle (34px) + gap (12px) to align with label */
  padding-left: 46px;
  font-size: 14px;
  line-height: 18px;
  color: var(--pcl-color-ui-dimmed);
  letter-spacing: 0.1px;
  margin: 0;
}
</style>
