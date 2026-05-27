/**
 * High-fidelity stubs for ProductCL components.
 * Visually match the Snyk design system without the private package.
 */
import { defineComponent, h, ref, type PropType, type VNode } from 'vue'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  heading:        'var(--pcl-color-ui-heading,#1c1c21)',
  body:           'var(--pcl-color-ui-body,#555463)',
  dimmed:         'var(--pcl-color-ui-dimmed,#727184)',
  border:         'var(--pcl-color-ui-border,#d3d3d9)',
  borderLight:    'var(--pcl-color-ui-border-light,#f2f1f4)',
  inputBorder:    'var(--pcl-color-input-border,#b3b2bd)',
  selectedBorder: 'var(--pcl-color-ui-link,#145deb)',
  bg:             'var(--pcl-color-ui-bg,#ffffff)',
  sidebarBg:      'var(--pcl-color-brand-midnight,#21214c)',
  sidebarActive:  'var(--pcl-color-purple-60,#471694)',
  sidebarText:    'var(--pcl-color-neutral-30,#d3d3d9)',
  sidebarDim:     'var(--pcl-color-neutral-60,#a2a1af)',
  sidebarSection: 'rgba(255,255,255,0.6)',
}

const font = (size = 14, weight = 400, color = T.body) =>
  `font-family:'Roboto',sans-serif;font-size:${size}px;font-weight:${weight};color:${color};line-height:1.4`

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const icon = (paths: string, color = 'currentColor', size = 16) =>
  h('svg', {
    width: size, height: size,
    viewBox: '0 0 16 16', fill: 'none',
    style: `flex-shrink:0;color:${color}`,
  }, paths.split('||').map(d =>
    d.startsWith('circle:')
      ? h('circle', { ...Object.fromEntries(d.slice(7).split(';').map(p => p.split('='))) })
      : h('path', { d, stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
  ))

const ICONS = {
  analytics:    'M2 12 L2 8 L5 8 L5 12||M6 12 L6 5 L9 5 L9 12||M10 12 L10 3 L13 3 L13 12||M1 12 L14 12',
  dashboard:    'M2 2 h5 v5 h-5 z||M9 2 h5 v5 h-5 z||M2 9 h5 v5 h-5 z||M9 9 h5 v5 h-5 z',
  projects:     'M1 4 h14 v9 a1 1 0 0 1 -1 1 H2 a1 1 0 0 1 -1 -1 z||M1 4 l2 -2 h4 l1 1 h1 a1 1 0 0 1 1 1',
  reports:      'M3 2 h10 a1 1 0 0 1 1 1 v10 a1 1 0 0 1 -1 1 H3 a1 1 0 0 1 -1 -1 V3 a1 1 0 0 1 1 -1 z||M5 6 h6||M5 8.5 h6||M5 11 h4',
  dependencies: 'circle:cx=8;cy=3;r=1.5;fill=currentColor||circle:cx=3;cy=12;r=1.5;fill=currentColor||circle:cx=13;cy=12;r=1.5;fill=currentColor||M8 4.5 L3 10.5||M8 4.5 L13 10.5',
  cloud:        'M4 11 a3.5 3.5 0 1 1 1.5 -6.5 A3 3 0 1 1 12 8 A2.5 2.5 0 0 1 12 13 H4',
  integrations: 'M6 2 h4 v3 h-4 z||M6 11 h4 v3 h-4 z||M8 5 v6||M2 6 h3 v4 H2 z||M11 6 h3 v4 h-3 z||M5 8 h-3||M14 8 h-3',
  inventory:    'M2 2 h4 v4 H2 z||M10 2 h4 v4 h-4 z||M2 10 h4 v4 H2 z||M10 10 h4 v4 h-4 z',
  members:      'circle:cx=8;cy=5;r=2.5;fill=none;stroke=currentColor;stroke-width=1.5||M2 14 a6 6 0 0 1 12 0',
  settings:     'circle:cx=8;cy=8;r=2;fill=none;stroke=currentColor;stroke-width=1.5||M8 1 v2||M8 13 v2||M1 8 h2||M13 8 h2||M3.05 3.05 l1.41 1.41||M11.54 11.54 l1.41 1.41||M3.05 12.95 l1.41 -1.41||M11.54 4.46 l1.41 -1.41',
  help:         'circle:cx=8;cy=8;r=6;fill=none;stroke=currentColor;stroke-width=1.5||M6 6 a2 2 0 1 1 2 2 v1||circle:cx=8;cy=11;r=0.5;fill=currentColor',
  bell:         'M8 2 a4 4 0 0 1 4 4 v3 l1 2 H3 l1 -2 V6 a4 4 0 0 1 4 -4 z||M6.5 13 a1.5 1.5 0 0 0 3 0',
  menu:         'M2 4 h12||M2 8 h12||M2 12 h12',
  chevronDown:  'M4 6 l4 4 l4 -4',
  chevronRight: 'M6 4 l4 4 l-4 4',
  plus:         'M8 3 v10||M3 8 h10',
  sort:         'M3 5 h10||M5 8 h6||M7 11 h2',
  search:       'circle:cx=6.5;cy=6.5;r=4;fill=none;stroke=currentColor;stroke-width=1.5||M10 10 l3.5 3.5',
  globe:        'circle:cx=8;cy=8;r=6;fill=none;stroke=currentColor;stroke-width=1.5||M8 2 a4 6 0 0 1 0 12||M8 2 a-4 6 0 0 0 0 12||M2 8 h12',
  terminal:     'M2 3 h12 a1 1 0 0 1 1 1 v8 a1 1 0 0 1 -1 1 H2 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 z||M4 7 l2 2 l-2 2||M8 11 h4',
  arrowSwap:    'M4 4 v8||M4 12 l-2 -2||M4 12 l2 -2||M12 4 v8||M12 4 l-2 2||M12 4 l2 2',
  dots:         'circle:cx=4;cy=8;r=1;fill=currentColor||circle:cx=8;cy=8;r=1;fill=currentColor||circle:cx=12;cy=8;r=1;fill=currentColor',
  arrowLeft:    'M10 4 l-4 4 l4 4||M6 8 h8',
  arrowRight:   'M6 4 l4 4 l-4 4||M2 8 h8',
  arrowDown:    'M8 3 v10||M4 9 l4 4 l4 -4',
  pencil:       'M11 2 l3 3 L5 14 H2 v-3 Z||M9.5 3.5 l3 3',
  altList:      'circle:cx=3;cy=4.5;r=1;fill=currentColor||M6 4.5 h8||circle:cx=3;cy=8;r=1;fill=currentColor||M6 8 h8||circle:cx=3;cy=11.5;r=1;fill=currentColor||M6 11.5 h8',
}

const Ico = (name: keyof typeof ICONS, color = 'currentColor', size = 14) =>
  icon(ICONS[name], color, size)

// ── Chromes ───────────────────────────────────────────────────────────────────

export const AppPage = defineComponent({
  name: 'AppPage',
  setup(_, { slots }) {
    return () => h('div', {
      style: 'display:flex;min-height:100vh;background:#f8f8fa',
    }, [
      slots.sidebar?.(),
      h('div', { style: 'flex:1;min-width:0;overflow:auto' }, slots.default?.()),
    ])
  },
})

export const AppSideBar = defineComponent({
  name: 'AppSideBar',
  // ── Token reference (all verified against Figma node 8340:37234 + variables.css) ──────────
  // color.brand.midnight = #21214c  sidebar bg
  // color.purple.60      = #471694  active nav item bg         (Figma: bg-[var(--token('color.purple.60'),#471694)])
  // color.neutral.00     = #ffffff  active text / section labels base color
  // color.neutral.20     = #e4e3e8  account name text          (Figma: text-[color:var(--token('color.neutral.20'),#e4e3e8)])
  // color.neutral.30     = #d3d3d9  inactive nav text          (Figma: text-[color:var(--token('color.neutral.30'),#d3d3d9)])
  // color.neutral.40     = #c3c2cb  group org name text        (Figma: text-[color:var(--token('color.neutral.40'),#c3c2cb)])
  // color.neutral.80     = #555463  active-section border      (Figma: border-[var(--token('color.neutral.80'),#555463)])
  // space.xxs = 4px   space.xs = 8px   space.s = 12px   space.m = 16px
  // Active nav section bg: #1e1e36 (Figma data-name="Active Nav")
  // Section label: 12px/600, tracking 1.44px, uppercase, color.neutral.00
  //   TENANT opacity 80%, GROUP/ORG opacity 60%
  // Nav item inner: pl:8px(space.xs) pr:4px(space.xxs) py:6px; radius:4px
  // Nav item text: 16px/400, tracking 0.1px (Product/Default typography)
  // Nav icon: 18px, opacity 50% inactive
  // Avatar size: 24px; gradients from Figma assets
  setup() {
    const SIDEBAR_BG   = '#21214c' // color.brand.midnight
    const ACTIVE_BG    = '#471694' // color.purple.60
    const ACTIVE_SEC   = '#1e1e36' // active-nav section bg (Figma)
    const SEC_BORDER   = '#555463' // color.neutral.80
    const NAV_TEXT     = '#d3d3d9' // color.neutral.30
    const NAV_WHITE    = '#ffffff' // color.neutral.00
    const GROUP_TEXT   = '#c3c2cb' // color.neutral.40 (inactive org name)
    const ACCOUNT_TEXT = '#e4e3e8' // color.neutral.20

    const nav: { label: string; icon: keyof typeof ICONS; active?: boolean }[] = [
      { label: 'Dashboard',    icon: 'dashboard' },
      { label: 'Projects',     icon: 'projects' },
      { label: 'Reports',      icon: 'reports' },
      { label: 'Dependencies', icon: 'dependencies' },
      { label: 'Cloud',        icon: 'cloud' },
      { label: 'Integrations', icon: 'integrations' },
      { label: 'Inventory',    icon: 'inventory', active: true },
      { label: 'Members',      icon: 'members' },
      { label: 'Settings',     icon: 'settings' },
    ]

    // Section label: 12px/600, 1.44px letter-spacing, uppercase, color.neutral.00
    // TENANT uses opacity 0.8, GROUP/ORG use opacity 0.6 (per Figma)
    const sectionLabel = (label: string, opacity = 0.6) =>
      h('div', {
        style: `padding-bottom:4px;padding-left:8px;padding-right:8px`, // space.xxs bottom, space.xs sides
      }, h('p', {
        style: `font-family:'Roboto',sans-serif;font-size:12px;font-weight:600;line-height:14px;letter-spacing:1.44px;text-transform:uppercase;color:${NAV_WHITE};opacity:${opacity};white-space:nowrap;margin:0`,
      }, label))

    // Nav item: inner pl:8px pr:4px py:6px, text 16px/400, icon 18px, radius 4px
    const navItem = (label: string, ico: keyof typeof ICONS, active = false) =>
      h('div', { style: 'padding:0 8px' }, // outer: px space.xs
        h('div', {
          style: [
            'display:flex;align-items:center;justify-content:space-between',
            `padding:6px 4px 6px 8px`,  // pl:space.xs pr:space.xxs py:6px (per Figma)
            'border-radius:4px',         // Figma: rounded-[4px]
            'cursor:pointer',
            active ? `background:${ACTIVE_BG}` : '',
          ].filter(Boolean).join(';'),
        }, [
          h('div', { style: 'display:flex;align-items:center;gap:8px' }, [ // gap: space.xs
            h('span', {
              style: `display:inline-flex;flex-shrink:0;opacity:${active ? 1 : 0.5}`,
            }, Ico(ico, active ? NAV_WHITE : NAV_TEXT, 18)), // 18px per Figma
            h('p', {
              // Product/Default: 16px/400, tracking 0.1px (Figma confirmed)
              style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${active ? NAV_WHITE : NAV_TEXT};margin:0;opacity:${active ? 1 : 0.8};white-space:nowrap`,
            }, label),
          ]),
        ])
      )

    // Org switcher row: avatar 24px + label + swap icon
    const orgRow = (letter: string, gradient: string, label: string, textColor: string) =>
      h('div', {
        style: `display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:4px;cursor:pointer`, // gap space.xs, py space.xxs, px space.xs
      }, [
        h('div', { style: 'opacity:0.5;flex-shrink:0' }, // avatar at 50% when not active org
          h('div', {
            style: `width:24px;height:24px;border-radius:100px;background:${gradient};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`,
          }, h('p', {
            style: `font-family:'Roboto',sans-serif;font-size:13px;font-weight:400;line-height:18px;color:#f9f8fa;margin:0`, // color.neutral.05
          }, letter))
        ),
        h('p', {
          style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${textColor};flex:1;margin:0;white-space:nowrap`,
        }, label),
        Ico('arrowSwap', NAV_TEXT, 20),
      ])

    return () => h('nav', {
      style: `width:223px;background:${SIDEBAR_BG};min-height:100vh;flex-shrink:0;display:flex;flex-direction:column;box-shadow:10px 0 15px 0 rgba(131,131,168,0.15)`,
    }, [

      // ── Header: SnykLogo + collapse button ──────────────────────────────────
      // Padding: pl:space.m(16px) pr:space.s(12px) py:space.s(12px) per Figma
      h('div', {
        style: `padding:12px 12px 12px 16px;display:flex;align-items:center;gap:8px;background:${SIDEBAR_BG}`,
      }, [
        // BaseSnykLogo: "light" variant, 70.5px × 32px (Figma dimensions)
        h('div', { style: 'flex:1;display:flex;align-items:center' }, [
          h('div', {
            style: 'height:32px;display:inline-flex;align-items:center;gap:6px',
          }, [
            // Dog mark (simplified)
            h('div', {
              style: 'width:32px;height:32px;display:flex;align-items:center;justify-content:center',
            }, h('svg', { width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none' }, [
              h('rect', { width: 28, height: 28, rx: 4, fill: 'rgba(255,255,255,0.15)' }),
              h('text', { x: '4', y: '20', style: `font-family:'Roboto',sans-serif;font-size:13px;font-weight:700;fill:#fff` }, 'snyk'),
            ])),
          ]),
        ]),
        // Collapse button: color rgba(255,255,255,0.5) per AppSideBar source
        h('button', {
          style: `background:none;border:none;cursor:pointer;padding:0;display:inline-flex;align-items:center;color:rgba(255,255,255,0.5);width:20px;height:20px`,
        }, Ico('menu', 'currentColor', 20)),
      ]),

      // ── Main content: fills height, two sections (top nav + footer) ──────────
      h('div', { style: 'display:flex;flex-direction:column;flex:1;justify-content:space-between' }, [

        // ── Top: Tenant nav + Group switcher + Active nav section ──────────────
        h('div', { style: 'display:flex;flex-direction:column' }, [

          // TENANT nav (px:4px py:8px per Figma "Tenant Nav" padding)
          h('div', { style: 'padding:8px 4px' }, [
            sectionLabel('Tenant', 0.8), // opacity 0.8 per Figma TENANT label
            h('div', { style: 'padding-bottom:8px' }, [
              navItem('Analytics', 'analytics'),
            ]),
          ]),

          // GROUP switcher (pt:12px pb:8px px:4px — no dark bg)
          h('div', { style: 'padding:12px 4px 8px' }, [
            sectionLabel('Group', 0.6),
            orgRow('G', 'linear-gradient(-45deg, rgb(229,85,172) 0%, rgb(249,144,72) 100%)', 'GoofLTD', GROUP_TEXT),
          ]),

          // ACTIVE NAV SECTION: bg #1e1e36, border top+bottom neutral.80 (#555463)
          // Contains: Org switcher + all nav items
          h('div', {
            style: `background:${ACTIVE_SEC};border-top:1px solid ${SEC_BORDER};border-bottom:1px solid ${SEC_BORDER}`,
          }, [
            // ORGANIZATION switcher (pt:12px pb:8px px:4px per Figma)
            h('div', { style: 'padding:12px 4px 8px' }, [
              sectionLabel('Organization', 0.6),
              // Active org — avatar NOT at 50% opacity (it's the selected org); white text
              h('div', {
                style: `display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:4px;cursor:pointer`,
              }, [
                h('div', {
                  style: `width:24px;height:24px;border-radius:100px;background:linear-gradient(135deg, rgb(75,214,181) 0%, rgb(22,137,130) 100%);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`, // vibe-to-dark-teal gradient (Figma)
                }, h('p', { style: `font-family:'Roboto',sans-serif;font-size:13px;font-weight:400;line-height:18px;color:#f9f8fa;margin:0` }, 'F')),
                h('p', { style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${NAV_WHITE};flex:1;margin:0;white-space:nowrap` }, 'Financial'),
                Ico('arrowSwap', NAV_TEXT, 20),
              ]),
            ]),
            // Nav items (pb:8px per Figma "Nav" padding)
            h('div', { style: 'padding-bottom:8px' },
              nav.map(item => navItem(item.label, item.icon, item.active))
            ),
          ]),
        ]),

        // ── Footer: Help + Product updates + Account ────────────────────────────
        h('div', { style: 'display:flex;flex-direction:column' }, [
          // Help (with dropdown chevron at 50% opacity per Figma)
          h('div', { style: 'padding:0 8px' },
            h('div', {
              style: 'display:flex;align-items:center;gap:8px;padding:6px 4px 6px 8px;border-radius:4px;cursor:pointer',
            }, [
              h('div', { style: 'display:flex;align-items:center;gap:8px;flex:1' }, [
                Ico('help', NAV_TEXT, 18),
                h('p', { style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${NAV_TEXT};margin:0` }, 'Help'),
                h('span', { style: 'opacity:0.5' }, Ico('chevronDown', NAV_TEXT, 12)), // dropdown arrow per Figma
              ]),
            ])
          ),
          // Product updates
          h('div', { style: 'padding:0 8px' },
            h('div', {
              style: 'display:flex;align-items:center;gap:8px;padding:6px 4px 6px 8px;border-radius:4px;cursor:pointer',
            }, [
              Ico('bell', NAV_TEXT, 18),
              h('p', { style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${NAV_TEXT};margin:0` }, 'Product updates'),
            ])
          ),
          // Account row: pl:6px pr:8px py:8px, avatar 24px, electric-blue→purple gradient
          h('div', { style: 'padding:8px' },
            h('div', {
              style: 'display:flex;align-items:center;gap:8px;padding:8px 8px 8px 6px;border-radius:4px;cursor:pointer',
            }, [
              h('div', {
                style: `width:24px;height:24px;border-radius:100px;background:linear-gradient(135deg, rgb(20,93,235) 0%, rgb(144,67,198) 100%);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`, // electric-blue-to-purple (Figma)
              }, h('p', { style: `font-family:'Roboto',sans-serif;font-size:13px;font-weight:400;line-height:18px;color:#f9f8fa;margin:0` }, 'A')),
              h('p', { style: `font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0.1px;color:${ACCOUNT_TEXT};flex:1;margin:0;white-space:nowrap` }, 'Account name'), // color.neutral.20
              h('span', { style: 'opacity:0.5' }, Ico('chevronDown', NAV_TEXT, 12)),
            ])
          ),
        ]),
      ]),
    ])
  },
})

// ── Layout ────────────────────────────────────────────────────────────────────

const GAP_SIZES: Record<string, string> = {
  xsmall: '8px', small: '16px', medium: '24px', large: '32px', xlarge: '40px',
}
function resolveGap(size: string | number): string {
  if (typeof size === 'number') return `${size}px`
  return GAP_SIZES[size] ?? size
}

export const BaseLayoutGap = defineComponent({
  name: 'BaseLayoutGap',
  props: {
    direction: { type: String as PropType<'row' | 'column'>, default: 'row' },
    // Real component: named string ('xsmall'=8px,'small'=16px,'medium'=24px,'large'=32px,'xlarge'=40px)
    // Stub also accepts raw numbers (px) for backwards-compat with prototype usages
    size:      { type: [Number, String], default: 'xsmall' },
    alignment: { type: String, default: 'center' },
    wrapper:   { type: String, default: 'div' },
    wrap:      { type: Boolean, default: false }, // rows always wrap in real component
  },
  setup(props, { slots }) {
    return () => h(props.wrapper, {
      style: [
        'display:flex',
        `flex-direction:${props.direction}`,
        `gap:${resolveGap(props.size)}`,
        props.direction === 'row' ? 'flex-wrap:wrap' : '',
        `align-items:${props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : props.alignment === 'normal' ? 'normal' : props.direction === 'column' ? 'flex-start' : props.alignment}`,
        'list-style:none;padding:0;margin:0',
      ].filter(Boolean).join(';'),
    }, slots.default?.())
  },
})

export const BaseLayoutSpaceBetween = defineComponent({
  name: 'BaseLayoutSpaceBetween',
  props: { align: { type: String, default: 'center' } },
  setup(props, { slots }) {
    return () => h('div', {
      style: `display:flex;justify-content:space-between;align-items:${props.align};width:100%;gap:8px`,
    }, slots.default?.())
  },
})

// ── Typography ────────────────────────────────────────────────────────────────

export const BaseHeading = defineComponent({
  name: 'BaseHeading',
  // Real component: levels 1-7, default 2; semanticLevel overrides HTML tag (1-6)
  props: {
    level:         { type: Number, default: 2 },
    semanticLevel: { type: Number, default: undefined },
  },
  setup(props, { slots }) {
    // level 1-7 visual sizes (approximate typography tokens)
    const fontSizes: Record<number, string> = {
      1: '24px', 2: '20px', 3: '18px', 4: '16px', 5: '14px', 6: '13px', 7: '12px',
    }
    return () => {
      const tag = `h${Math.min(props.semanticLevel ?? props.level, 6)}`
      return h(tag, {
        style: `margin:0;font-size:${fontSizes[props.level] ?? '14px'};font-weight:400;color:${T.heading};line-height:1.3;font-family:'Roboto',sans-serif`,
      }, slots.default?.())
    }
  },
})

export const BaseCaption = defineComponent({
  name: 'BaseCaption',
  setup(_, { slots }) {
    return () => h('span', {
      style: `font-size:12px;color:${T.dimmed};line-height:1.4;font-family:'Roboto',sans-serif`,
    }, slots.default?.())
  },
})

// ── Navigation ────────────────────────────────────────────────────────────────

export const BaseBreadcrumbs = defineComponent({
  name: 'BaseBreadcrumbs',
  props: {
    items: { type: Array as PropType<{ label: string; href?: string }[]>, default: () => [] },
  },
  setup(props) {
    return () => h('div', {
      style: `display:flex;align-items:center;gap:2px;${font(13, 400, T.dimmed)}`,
    },
      props.items.flatMap((item, i) => [
        item.href
          ? h('a', { href: item.href, style: `color:${T.dimmed};text-decoration:none` }, item.label)
          : h('span', {}, item.label),
        i < props.items.length - 1
          ? h('span', { style: `padding:0 2px` }, Ico('chevronRight', T.dimmed, 12))
          : null,
      ]).filter(Boolean)
    )
  },
})

export const BaseTabs = defineComponent({
  name: 'BaseTabs',
  props: {
    modelValue: { type: String, default: '' },
    tabs: { type: Array as PropType<{ id: string; label: string }[]>, default: () => [] },
    variant: { type: String as PropType<'underline' | 'pill'>, default: 'underline' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { style: `display:flex;gap:${props.variant === 'pill' ? '4px' : '0'};margin-top:4px` },
      props.tabs.map(tab => {
        const active = tab.id === props.modelValue
        if (props.variant === 'pill') {
          return h('div', {
            onClick: () => emit('update:modelValue', tab.id),
            style: [
              'padding:6px 8px',
              'border-radius:8px',
              'cursor:pointer',
              'transition:all .15s',
              font(14, 400, active ? T.selectedBorder : T.heading),
              active
                ? `background:var(--pcl-color-state-selected-bg,#f4f8ff);border:1px solid var(--pcl-color-state-selected-bg-alt,#b5ccfa)`
                : 'background:transparent;border:1px solid transparent',
            ].join(';'),
          }, tab.label)
        }
        return h('div', {
          onClick: () => emit('update:modelValue', tab.id),
          style: [
            'padding:10px 8px 11px',
            font(14, active ? 500 : 400, active ? T.heading : T.dimmed),
            'cursor:pointer',
            `border-bottom:3px solid ${active ? T.selectedBorder : 'transparent'}`,
            'margin-bottom:-1px',
            'transition:all .15s',
          ].join(';'),
        }, tab.label)
      })
    )
  },
})

// ── Buttons ───────────────────────────────────────────────────────────────────

export const BaseButton = defineComponent({
  name: 'BaseButton',
  props: {
    variant:  { type: String, default: 'default' },
    size:     { type: String, default: 'default' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const styles: Record<string, string> = {
      default:  `background:${T.bg};border:1px solid ${T.inputBorder};color:${T.body}`,
      primary:  `background:var(--pcl-color-ui-link,#145deb);border:1px solid var(--pcl-color-ui-link,#145deb);color:var(--pcl-color-brand-white,#ffffff)`,
      danger:   `background:var(--pcl-color-danger-base,#d8082d);border:1px solid var(--pcl-color-danger-base,#d8082d);color:var(--pcl-color-brand-white,#ffffff)`,
      selected: `background:var(--pcl-color-state-selected-bg,#f4f8ff);border:1px solid var(--pcl-color-state-selected-border,#145deb);color:var(--pcl-color-state-selected-text,#145deb)`,
      link:     `background:transparent;border:none;color:var(--pcl-color-ui-link,#145deb);padding:0`,
    }
    // font() always appends color:T.body — pass the variant's text colour explicitly
    // so the last color declaration in the joined style string is always correct.
    const variantText: Record<string, string> = {
      primary:  `var(--pcl-color-brand-white,#ffffff)`,
      danger:   `var(--pcl-color-brand-white,#ffffff)`,
      default:  T.body,
      selected: `var(--pcl-color-state-selected-text,#145deb)`,
      link:     `var(--pcl-color-ui-link,#145deb)`,
    }
    // small = 14px / 4px 8px (default), medium = 16px / 6px 12px (dialogs, CTAs)
    const sizes: Record<string, { pad: string; fs: number }> = {
      small:  { pad: '4px 8px',  fs: 14 },
      medium: { pad: '6px 12px', fs: 16 },
    }
    return () => {
      const sz = sizes[props.size] ?? sizes.small
      return h('button', {
        disabled: props.disabled,
        onClick: (e: Event) => { if (!props.disabled) emit('click', e) },
        style: [
          styles[props.variant] ?? styles.default,
          `padding:${sz.pad}`,
          'border-radius:4px',
          font(sz.fs, props.variant === 'link' ? 400 : 500, variantText[props.variant] ?? T.body),
          'cursor:pointer',
          'display:inline-flex',
          'align-items:center',
          'gap:4px',
          'white-space:nowrap',
          props.disabled ? 'opacity:.5;cursor:not-allowed' : '',
        ].filter(Boolean).join(';'),
      }, [slots.leftIcon?.(), slots.default?.(), slots.rightIcon?.()])}
  },
})

export const BaseIconButton = defineComponent({
  name: 'BaseIconButton',
  props: { tooltip: String },
  setup(props, { slots }) {
    return () => h('button', {
      title: props.tooltip,
      style: `background:transparent;border:none;cursor:pointer;padding:4px;color:${T.dimmed};border-radius:3px;display:inline-flex;align-items:center;justify-content:center`,
    }, slots.default?.() ?? Ico('dots', T.dimmed, 16))
  },
})

// ── Forms ─────────────────────────────────────────────────────────────────────

export const BaseInput = defineComponent({
  name: 'BaseInput',
  props: {
    modelValue:    { type: String, default: '' },
    label:         { type: String, default: '' },
    strongLabel:   { type: Boolean, default: false },
    placeholder:   { type: String, default: '' },
    type:          { type: String, default: 'text' },
    note:          { type: String, default: '' },
    invalid:       { type: Boolean, default: false },
    invalidMessage:{ type: String, default: '' },
    required:      { type: Boolean, default: false },
    disabled:      { type: Boolean, default: false },
    clearable:     { type: [Boolean, String], default: false },
    size:          { type: String as PropType<'small' | 'medium'>, default: 'medium' },
  },
  emits: ['update:modelValue', 'change', 'clear', 'blur'],
  setup(props, { emit, slots }) {
    const isSearch = props.type === 'search'
    return () => h('div', { style: 'display:flex;flex-direction:column;gap:4px' }, [
      props.label ? h('label', { style: font(14, props.strongLabel ? 500 : 400, T.body) }, props.label) : null,
      h('div', {
        style: `display:inline-flex;align-items:center;gap:6px;border:1px solid ${props.disabled ? T.border : T.inputBorder};border-radius:4px;padding:${props.size === 'small' ? '3px 6px' : '5px 8px'};background:${props.disabled ? '#f2f1f4' : T.bg};min-width:180px`,
      }, [
        isSearch ? icon(ICONS.search, T.dimmed, 14) : null,
        slots.prefix?.(),
        h('input', {
          type: props.type === 'search' ? 'text' : props.type,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          required: props.required,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
          style: `border:none;outline:none;${font(14, 400, props.disabled ? T.dimmed : T.body)};background:transparent;width:100%;${props.disabled ? 'cursor:not-allowed' : ''}`,
        }),
        props.clearable && props.modelValue
          ? h('button', {
              onClick: () => emit('update:modelValue', ''),
              style: `background:transparent;border:none;cursor:pointer;padding:0;color:${T.dimmed}`,
            }, '×')
          : null,
        slots.suffix?.(),
      ]),
      props.note ? h('span', { style: font(12, 400, T.dimmed) }, props.note) : null,
    ])
  },
})

// ── Overlays ──────────────────────────────────────────────────────────────────

export const BaseDropdown = defineComponent({
  name: 'BaseDropdown',
  setup(_, { slots }) {
    const open = ref(false)
    return () => h('div', { style: 'position:relative;display:inline-block' }, [
      h('div', { onClick: () => open.value = !open.value }, slots.handle?.()),
      open.value
        ? h('div', {
            style: `position:absolute;top:calc(100% + 4px);left:0;z-index:200;background:${T.bg};border:1px solid ${T.border};border-radius:6px;min-width:160px;padding:4px 0;box-shadow:0 4px 16px rgba(0,0,0,.12)`,
            onMouseleave: () => open.value = false,
          }, slots.dropdown?.())
        : null,
    ])
  },
})

// ── Data display ──────────────────────────────────────────────────────────────

export const BaseTable = defineComponent({
  name: 'BaseTable',
  props: {
    rows:       { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    // scrollable: enables horizontal scroll with CSS edge-shadow overflow indicator
    // Use for tables in narrow containers (detail panels, drawers).
    // Pairs with the .table-scroll-x class in style.css.
    scrollable: { type: Boolean, default: false },
    // minWidth: minimum table width when scrollable (px). Prevents columns squishing.
    minWidth:   { type: Number, default: 680 },
  },
  setup(props, { slots }) {
    const tableEl = h('table', {
      style: `width:100%;border-collapse:collapse${props.scrollable ? `;min-width:${props.minWidth}px` : ''}`,
    }, [
      h('thead', {}, h('tr', {}, slots.header?.())),
      h('tbody', {},
        props.rows.map(row =>
          h('tr', {
            style: `transition:background .1s`,
            onMouseenter: (e: Event) => ((e.currentTarget as HTMLElement).style.background = '#fafafa'),
            onMouseleave: (e: Event) => ((e.currentTarget as HTMLElement).style.background = ''),
          }, slots.row?.({ row }))
        )
      ),
    ])

    return () => h('div', { style: 'padding:16px 24px 24px' },
      h('div', {
        style: `background:${T.bg};border:1px solid ${T.border};border-radius:8px;overflow:hidden`,
      },
        // When scrollable: wrap table in .table-scroll-x for CSS edge shadows + overflow-x:auto
        props.scrollable
          ? h('div', { class: 'table-scroll-x' }, tableEl)
          : tableEl
      )
    )
  },
})

// ── Chips & badges ────────────────────────────────────────────────────────────

export const BaseChip = defineComponent({
  name: 'BaseChip',
  setup(_, { slots }) {
    return () => h('span', {
      style: `display:inline-flex;align-items:center;padding:2px 7px;border:1px solid ${T.border};border-radius:3px;${font(12, 400, T.body)};background:${T.bg};white-space:nowrap`,
    }, slots.default?.())
  },
})

// Branch pill (separate from tag chips — tighter, dimmed, used in asset name cell)
export const BranchPill = defineComponent({
  name: 'BranchPill',
  setup(_, { slots }) {
    return () => h('span', {
      style: `display:inline-flex;align-items:center;padding:1px 6px;border:1px solid ${T.borderLight};border-radius:3px;${font(11, 400, T.dimmed)};background:#f8f8fa;white-space:nowrap`,
    }, slots.default?.())
  },
})

// Circular class/avatar badge (used in "Class" column)
export const CircleBadge = defineComponent({
  name: 'CircleBadge',
  props: { label: { type: String, default: '' }, bg: { type: String, default: '#e9e8f0' } },
  setup(props) {
    return () => h('span', {
      style: `display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:${props.bg};${font(12, 500, T.body)};flex-shrink:0`,
    }, props.label)
  },
})

// Coverage/icon circle badge (Coverage, Test surface, Team columns)
export const IconCircle = defineComponent({
  name: 'IconCircle',
  props: {
    iconName: { type: String as PropType<keyof typeof ICONS>, default: 'globe' },
    tooltip:  { type: String, default: '' },
  },
  setup(props) {
    return () => h('span', {
      title: props.tooltip,
      style: `display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;border:1px solid ${T.border};background:${T.bg};cursor:default`,
    }, Ico(props.iconName as keyof typeof ICONS, T.dimmed, 13))
  },
})

// Real API: totals object matching the actual ProductCL BaseSeverity component
// Usage: <BaseSeverity :totals="{ issues: { critical: 40, high: 55, medium: 60, low: 45 } }" />
// Compact (letter-only): <BaseSeverity :totals="..." compact />
// Single level: <BaseSeverity :totals="..." :include-only-severities="['critical']" compact />
export const BaseSeverity = defineComponent({
  name: 'BaseSeverity',
  props: {
    totals: {
      type: Object as PropType<{
        issues: { critical: number; high: number; medium: number; low: number }
        licenses?: { high: number; medium: number; low: number }
      }>,
      default: () => ({ issues: { critical: 0, high: 0, medium: 0, low: 0 } }),
    },
    compact:  { type: Boolean, default: false },
    verbose:  { type: Boolean, default: false },
    dimmed:   { type: Boolean, default: false },
    size:     { type: String as PropType<'default' | 'small'>, default: 'default' },
    includeOnlySeverities: {
      type: Array as PropType<('critical' | 'high' | 'medium' | 'low')[]>,
      default: () => ['critical', 'high', 'medium', 'low'],
    },
  },
  setup(props) {
    const palette = {
      critical: { bg: '#ffdad8', text: '#9e261e', base: '#ab1a1a', label: 'C' },
      high:     { bg: '#ffdbcc', text: '#9b3d15', base: '#ce5019', label: 'H' },
      medium:   { bg: '#ffe8cd', text: '#925c1e', base: '#d68000', label: 'M' },
      low:      { bg: '#eeeeee', text: '#585675', base: '#88879e', label: 'L' },
    }
    // "none" state — count is 0 and not dimmed
    const none = { bg: '#e7e7e7', text: '#828282', base: '#bebebe' }

    return () => {
      const levels = (['critical', 'high', 'medium', 'low'] as const)
        .filter(l => props.includeOnlySeverities.includes(l))

      const allItems = levels.map(l => ({ level: l, count: props.totals?.issues?.[l] ?? 0, ...palette[l] }))
      // compact hides zero-count levels
      const items = props.compact ? allItems.filter(i => i.count > 0) : allItems

      return h('ul', {
        style: `display:flex;list-style:none;margin:0;padding:0;gap:8px;align-items:center`,
      }, items.map(item => {
        const isNone  = item.count === 0 && !props.dimmed
        const countBg = props.dimmed ? '#f2f1f4' : (isNone ? none.bg  : item.bg)
        const countFg = props.dimmed ? '#555463' : (isNone ? none.text : item.text)
        const baseBg  = props.dimmed ? '#727184' : (isNone ? none.base : item.base)
        const isSmall = props.size === 'small'
        const letterSize  = isSmall ? 20 : 24 // px — size.20 / size.24
        const borderR = '2px' // size.small.radius

        return h('li', {
          style: `display:flex;min-height:${isSmall ? 20 : 24}px;border-radius:${borderR};overflow:hidden;${isNone ? 'opacity:0.4' : ''}`,
        }, [
          // Count (left) — hidden in compact mode
          !props.compact && !props.verbose
            ? h('div', {
                style: `min-width:24px;width:34px;padding:0 8px;box-sizing:border-box;background:${countBg};color:${countFg};font-family:'Roboto',sans-serif;font-size:12px;font-weight:400;line-height:1;display:inline-flex;align-items:center;justify-content:center;border-right:1px solid var(--pcl-color-brand-white,#ffffff);border-radius:${borderR} 0 0 ${borderR}`,
              }, String(item.count))
            : null,
          // Letter (right) — always shown
          h('abbr', {
            title: `${item.level} severity`,
            style: [
              `min-width:${letterSize}px;padding:0 4px;background:${baseBg};color:var(--pcl-color-brand-white,#ffffff)`,
              `font-family:'Roboto',sans-serif;font-size:14px;font-weight:500;line-height:1`,
              `display:inline-flex;align-items:center;justify-content:center;text-decoration:none`,
              // In compact/verbose the letter also gets left border-radius
              (props.compact || props.verbose)
                ? `border-radius:${borderR}`
                : `border-radius:0 ${borderR} ${borderR} 0`,
            ].join(';'),
          }, item.label),
        ])
      }))
    }
  },
})

// ── Typography extras ─────────────────────────────────────────────────────────

export const BaseAllCaps = defineComponent({
  name: 'BaseAllCaps',
  // Real component: wrapper h3|span (default h3), size null|'medium'|'small'
  // Typography: body-small-strong = 14px/500; letter-spacing: 0.125em; text-transform: uppercase
  props: {
    wrapper: { type: String as PropType<'h3' | 'span'>, default: 'h3' },
    size:    { type: String as PropType<'medium' | 'small'>, default: undefined },
  },
  setup(props, { slots }) {
    return () => h(props.wrapper, {
      style: [
        font(14, 500, T.heading),
        'letter-spacing:0.125em',
        'text-transform:uppercase',
        'margin:0',
        props.size === 'small' ? 'font-size:11px' : '',
      ].filter(Boolean).join(';'),
    }, slots.default?.())
  },
})

// ── Badge ─────────────────────────────────────────────────────────────────────

export const BaseBadge = defineComponent({
  name: 'BaseBadge',
  props: {
    variant: { type: String as PropType<'default' | 'info' | 'success' | 'warn' | 'danger' | 'purple' | 'critical-severity' | 'high-severity' | 'medium-severity' | 'low-severity' | 'no-severity'>, default: 'default' },
  },
  setup(props, { slots }) {
    const styles: Record<string, string> = {
      default:            `background:var(--pcl-color-ui-canvas,#f9f8fa);border:1px solid ${T.border};color:${T.body}`,
      info:               'background:var(--pcl-color-blue-05,#eaf1ff);border:1px solid var(--pcl-color-blue-20,#b5ccfa);color:var(--pcl-color-blue-50,#0f47c6)',
      success:            'background:var(--pcl-color-green-05,#e6f7ec);border:1px solid var(--pcl-color-green-30,#8fd4a6);color:var(--pcl-color-green-60,#1a7a3c)',
      warn:               'background:var(--pcl-color-warn-bg,#fff4ed);border:1px solid var(--pcl-color-warn-bg-alt,#fdd3b6);color:var(--pcl-color-warn-text,#b6540b)',
      danger:             'background:var(--pcl-color-red-05,#fde8e9);border:1px solid var(--pcl-color-red-30,#f5a0a0);color:var(--pcl-color-red-60,#c01a2a)',
      purple:             'background:var(--pcl-color-purple-05,#f5eeff);border:1px solid var(--pcl-color-purple-20,#ceb2f2);color:var(--pcl-color-purple-60,#471694)',
      'critical-severity':'background:var(--pcl-color-severity-critical-bg,#ffdad8);border:1px solid var(--pcl-color-severity-critical-base,#ab1a1a);color:var(--pcl-color-severity-critical-text,#9e261e)',
      'high-severity':    'background:var(--pcl-color-severity-high-bg,#ffdbcc);border:1px solid var(--pcl-color-severity-high-base,#ce5019);color:var(--pcl-color-severity-high-text,#9b3d15)',
      'medium-severity':  'background:var(--pcl-color-severity-medium-bg,#ffe8cd);border:1px solid var(--pcl-color-severity-medium-base,#d68000);color:var(--pcl-color-severity-medium-text,#925c1e)',
      'low-severity':     'background:var(--pcl-color-severity-low-bg,#eeeeee);border:1px solid var(--pcl-color-severity-low-base,#88879e);color:var(--pcl-color-severity-low-text,#585675)',
      'no-severity':      `background:var(--pcl-color-ui-canvas,#f9f8fa);border:1px solid ${T.border};color:${T.body}`,
    }
    return () => h('span', {
      style: `display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:128px;${font(12, 500)};${styles[props.variant] ?? styles.default};white-space:nowrap`,
    }, slots.default?.())
  },
})

// ── Divider ───────────────────────────────────────────────────────────────────

export const BaseDivider = defineComponent({
  name: 'BaseDivider',
  // Real component: horizontal only, size controls margin (named string, default 'small')
  // Kept `vertical` prop for prototype backward-compat (not in real component)
  props: {
    size:     { type: String, default: 'small' },
    vertical: { type: Boolean, default: false }, // not in real API, kept for prototype compat
  },
  setup(props) {
    const margins: Record<string, string> = {
      xsmall: '8px', small: '16px', medium: '24px', large: '32px', xlarge: '40px',
    }
    return () => {
      if (props.vertical) {
        return h('div', {
          style: `width:1px;background:${T.border};align-self:stretch;flex-shrink:0`,
        })
      }
      const m = margins[props.size] ?? '16px'
      return h('div', {
        style: `border-top:1px solid ${T.border};margin:${m} 0`,
      })
    }
  },
})

// ── Copy to clipboard ─────────────────────────────────────────────────────────

export const BaseCopyToClipboard = defineComponent({
  name: 'BaseCopyToClipboard',
  props: { value: { type: String, default: '' } },
  setup(props) {
    const copied = ref(false)
    return () => h('button', {
      title: copied.value ? 'Copied!' : 'Copy to clipboard',
      onClick: () => {
        navigator.clipboard?.writeText(props.value)
        copied.value = true
        setTimeout(() => copied.value = false, 1500)
      },
      style: `background:transparent;border:none;cursor:pointer;padding:4px;display:inline-flex;align-items:center;color:${T.dimmed};border-radius:3px`,
    }, Ico('dots', copied.value ? '#145deb' : T.dimmed, 14)) // reuse dots as placeholder for copy icon
  },
})

// ── Pagination ────────────────────────────────────────────────────────────────

export const BasePaginationNav = defineComponent({
  name: 'BasePaginationNav',
  props: {
    modelValue: { type: Number, default: 1 },
    total:      { type: Number, default: 1 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const btn = (content: VNode[], disabled: boolean, onClick: () => void) =>
      h('button', {
        disabled,
        onClick,
        style: [
          `padding:5px 12px;border:1px solid ${T.border};border-radius:4px;background:${T.bg}`,
          font(14, 400, disabled ? T.dimmed : T.body),
          'cursor:pointer;display:inline-flex;align-items:center;gap:6px',
          disabled ? 'opacity:.5;cursor:not-allowed' : '',
        ].filter(Boolean).join(';'),
      }, content)

    return () => h('div', {
      style: 'display:flex;justify-content:center;align-items:center;gap:8px;padding:16px 24px',
    }, [
      btn([Ico('arrowLeft', T.dimmed, 14), h('span', {}, 'Previous')], props.modelValue <= 1,
        () => emit('update:modelValue', props.modelValue - 1)),
      btn([h('span', {}, 'Next'), Ico('arrowRight', T.dimmed, 14)], props.modelValue >= props.total,
        () => emit('update:modelValue', props.modelValue + 1)),
    ])
  },
})

// ── Layout (additional) ──────────────────────────────────────────────────────

export const BaseLayoutContainer = defineComponent({
  name: 'BaseLayoutContainer',
  setup(_, { slots }) {
    return () => h('div', {
      style: 'width:100%;max-width:1200px;margin:0 auto;padding:0 24px',
    }, slots.default?.())
  },
})

export const BaseLayoutTransitionExpand = defineComponent({
  name: 'BaseLayoutTransitionExpand',
  setup(_, { slots }) {
    return () => h('div', { style: 'overflow:hidden' }, slots.default?.())
  },
})

export const BaseLayoutTwoColumns = defineComponent({
  name: 'BaseLayoutTwoColumns',
  props: { gap: { type: Number, default: 24 } },
  setup(props, { slots }) {
    return () => h('div', {
      style: `display:grid;grid-template-columns:1fr 1fr;gap:${props.gap}px`,
    }, slots.default?.())
  },
})

export const BaseLayoutSidebar = defineComponent({
  name: 'BaseLayoutSidebar',
  props: {
    position: { type: String as PropType<'left' | 'right'>, default: 'left' },
    sidebarWidth: { type: [Number, String], default: 280 },
  },
  setup(props, { slots }) {
    const w = typeof props.sidebarWidth === 'number' ? `${props.sidebarWidth}px` : props.sidebarWidth
    const cols = props.position === 'left' ? `${w} 1fr` : `1fr ${w}`
    return () => h('div', {
      style: `display:grid;grid-template-columns:${cols};gap:24px;align-items:flex-start`,
    }, slots.default?.())
  },
})

export const BaseLayoutStrip = defineComponent({
  name: 'BaseLayoutStrip',
  setup(_, { slots }) {
    return () => h('div', {
      style: `display:flex;align-items:center;padding:8px 16px;border-bottom:1px solid ${T.border};gap:8px`,
    }, slots.default?.())
  },
})

// ── Typography (additional) ──────────────────────────────────────────────────

export const BaseProse = defineComponent({
  name: 'BaseProse',
  props: { size: { type: String as PropType<'default' | 'small'>, default: 'default' } },
  setup(props, { slots }) {
    const sz = props.size === 'small' ? 13 : 14
    return () => h('p', {
      style: `margin:0;${font(sz, 400, T.body)};line-height:1.6`,
    }, slots.default?.())
  },
})

export const BaseHighlight = defineComponent({
  name: 'BaseHighlight',
  setup(_, { slots }) {
    return () => h('mark', {
      style: `background:var(--pcl-color-brand-summer,#f9c748);color:${T.heading};border-radius:2px;padding:0 2px`,
    }, slots.default?.())
  },
})

// ── Chromes (additional) ──────────────────────────────────────────────────────

export const App = defineComponent({
  name: 'App',
  setup(_, { slots }) {
    return () => h('div', { style: 'display:flex;flex-direction:column;min-height:100vh' }, [
      slots.navigation?.(),
      h('div', { style: 'display:flex;flex:1' }, [
        slots.sidebar?.(),
        h('main', { style: 'flex:1;min-width:0' }, slots.default?.()),
      ]),
    ])
  },
})

export const AppNavigation = defineComponent({
  name: 'AppNavigation',
  setup(_, { slots }) {
    return () => h('header', {
      style: `height:52px;background:${T.bg};border-bottom:1px solid ${T.border};display:flex;align-items:center;padding:0 24px;gap:16px;position:sticky;top:0;z-index:100`,
    }, slots.default?.())
  },
})

export const AppContextBar = defineComponent({
  name: 'AppContextBar',
  setup(_, { slots }) {
    return () => h('div', {
      style: `height:36px;background:#f2f1f4;border-bottom:1px solid ${T.border};display:flex;align-items:center;padding:0 16px;gap:8px;${font(13, 400, T.dimmed)}`,
    }, slots.default?.())
  },
})

export const AppContextSwitcher = defineComponent({
  name: 'AppContextSwitcher',
  props: {
    label: { type: String, default: '' },
    variant: { type: String as PropType<'default' | 'inverted' | 'loading'>, default: 'default' },
  },
  setup(props) {
    return () => h('button', {
      style: `display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid ${T.border};border-radius:4px;background:${T.bg};cursor:pointer;${font(13, 400, T.body)}`,
    }, [
      h('span', {}, props.label || 'Select context'),
      icon(ICONS.chevronDown, T.dimmed, 12),
    ])
  },
})

export const AppFlowPage = defineComponent({
  name: 'AppFlowPage',
  setup(_, { slots }) {
    return () => h('div', {
      style: `min-height:100vh;background:var(--pcl-color-ui-canvas,#f9f8fa);display:flex;flex-direction:column`,
    }, [
      h('header', {
        style: `height:56px;background:${T.bg};border-bottom:1px solid ${T.border};display:flex;align-items:center;padding:0 32px;`,
      }, slots.header?.()),
      h('main', { style: 'flex:1;padding:32px' }, slots.default?.()),
    ])
  },
})

export const AppPageDrawer = defineComponent({
  name: 'AppPageDrawer',
  props: {
    modelValue: { type: Boolean, default: false },
    size: { type: String as PropType<'default' | 'large' | 'large-with-tabs'>, default: 'default' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const widths = { default: '480px', large: '640px', 'large-with-tabs': '720px' }
    return () => h('div', { style: 'display:flex;flex:1;min-width:0;overflow:hidden' }, [
      h('div', { style: 'flex:1;min-width:0' }, slots.default?.()),
      props.modelValue
        ? h('aside', {
            style: `width:${widths[props.size as keyof typeof widths]};background:${T.bg};border-left:1px solid ${T.border};display:flex;flex-direction:column;overflow:auto;flex-shrink:0`,
          }, [
            h('div', {
              style: `display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid ${T.border}`,
            }, [
              slots.drawerHeader?.(),
              h('button', {
                onClick: () => emit('update:modelValue', false),
                style: `background:transparent;border:none;cursor:pointer;padding:4px;color:${T.dimmed}`,
              }, icon(ICONS.plus, T.dimmed, 16)),
            ]),
            h('div', { style: 'flex:1;padding:16px;overflow:auto' }, slots.drawer?.()),
          ])
        : null,
    ])
  },
})

// ── Buttons (additional) ──────────────────────────────────────────────────────

export const BaseButtonBar = defineComponent({
  name: 'BaseButtonBar',
  setup(_, { slots }) {
    return () => h('div', {
      style: `display:inline-flex;border:1px solid ${T.inputBorder};border-radius:4px;overflow:hidden`,
    }, slots.default?.())
  },
})

export const BaseButtonDropdown = defineComponent({
  name: 'BaseButtonDropdown',
  props: { variant: { type: String, default: 'default' } },
  setup(props, { slots }) {
    const open = ref(false)
    const styles: Record<string, string> = {
      default: `background:${T.bg};border-color:${T.inputBorder};color:${T.body}`,
      primary: `background:var(--pcl-color-ui-link,#145deb);border-color:var(--pcl-color-ui-link,#145deb);color:var(--pcl-color-brand-white,#ffffff)`,
    }
    const s = styles[props.variant] ?? styles.default
    return () => h('div', { style: 'display:inline-flex;position:relative' }, [
      h('div', { style: 'display:inline-flex' }, [
        h('button', {
          style: `padding:4px 10px;border:1px solid;border-right:none;border-radius:4px 0 0 4px;cursor:pointer;${font(14, 400)};${s}`,
        }, slots.default?.()),
        h('button', {
          onClick: () => open.value = !open.value,
          style: `padding:4px 6px;border:1px solid;border-radius:0 4px 4px 0;cursor:pointer;${s}`,
        }, icon(ICONS.chevronDown, props.variant === 'primary' ? '#fff' : T.dimmed, 14)),
      ]),
      open.value ? h('div', {
        style: `position:absolute;top:calc(100% + 4px);left:0;z-index:200;background:${T.bg};border:1px solid ${T.border};border-radius:6px;min-width:160px;padding:4px 0;box-shadow:0 4px 16px rgba(0,0,0,.12)`,
        onMouseleave: () => open.value = false,
      }, slots.dropdown?.()) : null,
    ])
  },
})

// ── Forms (additional) ────────────────────────────────────────────────────────

export const BaseCheckbox = defineComponent({
  name: 'BaseCheckbox',
  props: {
    modelValue: { type: [Boolean, Array] as PropType<boolean | unknown[]>, default: false },
    value:      { type: [String, Number, Boolean], default: undefined },
    disabled:   { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const checked = () => Array.isArray(props.modelValue)
      ? props.modelValue.includes(props.value)
      : !!props.modelValue
    return () => h('label', {
      style: `display:inline-flex;align-items:center;gap:8px;cursor:${props.disabled ? 'not-allowed' : 'pointer'};${font(14, 400, props.disabled ? T.dimmed : T.body)}`,
    }, [
      h('input', {
        type: 'checkbox',
        checked: checked(),
        disabled: props.disabled,
        indeterminate: props.indeterminate,
        onChange: (e: Event) => {
          const el = e.target as HTMLInputElement
          if (Array.isArray(props.modelValue)) {
            const next = [...props.modelValue]
            if (el.checked) next.push(props.value)
            else next.splice(next.indexOf(props.value), 1)
            emit('update:modelValue', next)
          } else {
            emit('update:modelValue', el.checked)
          }
        },
        style: `width:14px;height:14px;margin:0;accent-color:#145deb`,
      }),
      slots.default?.(),
    ])
  },
})

export const BaseRadio = defineComponent({
  name: 'BaseRadio',
  props: {
    modelValue: { type: [String, Number, Boolean], default: '' },
    value:      { type: [String, Number, Boolean], required: true },
    disabled:   { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h('label', {
      style: `display:inline-flex;align-items:center;gap:8px;cursor:${props.disabled ? 'not-allowed' : 'pointer'};${font(14, 400, props.disabled ? T.dimmed : T.body)}`,
    }, [
      h('input', {
        type: 'radio',
        checked: props.modelValue === props.value,
        disabled: props.disabled,
        onChange: () => emit('update:modelValue', props.value),
        style: 'width:14px;height:14px;margin:0;accent-color:#145deb',
      }),
      slots.default?.(),
    ])
  },
})

export const BaseSelect = defineComponent({
  name: 'BaseSelect',
  props: {
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: 'Select…' },
    disabled:    { type: Boolean, default: false },
    options:     { type: Array as PropType<{ label: string; value: string | number }[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h('div', {
      style: `position:relative;display:inline-flex;align-items:center;border:1px solid ${props.disabled ? T.border : T.inputBorder};border-radius:4px;background:${props.disabled ? '#f2f1f4' : T.bg};`,
    }, [
      h('select', {
        value: props.modelValue,
        disabled: props.disabled,
        onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
        style: `appearance:none;border:none;outline:none;background:transparent;padding:5px 28px 5px 8px;width:100%;${font(14, 400, props.disabled ? T.dimmed : T.body)};cursor:${props.disabled ? 'not-allowed' : 'pointer'}`,
      }, [
        h('option', { value: '', disabled: true }, props.placeholder),
        ...props.options.map(o => h('option', { value: o.value }, o.label)),
        ...(slots.default?.() ?? []),
      ]),
      h('div', { style: 'position:absolute;right:8px;pointer-events:none' },
        icon(ICONS.chevronDown, T.dimmed, 14)),
    ])
  },
})

export const BaseTextarea = defineComponent({
  name: 'BaseTextarea',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled:    { type: Boolean, default: false },
    monospace:   { type: Boolean, default: false },
    height:      { type: [Number, String], default: 80 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('textarea', {
      value: props.modelValue,
      placeholder: props.placeholder,
      disabled: props.disabled,
      rows: 4,
      onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value),
      style: [
        `border:1px solid ${props.disabled ? T.border : T.inputBorder}`,
        `border-radius:4px;padding:8px;width:100%;resize:vertical`,
        `height:${typeof props.height === 'number' ? `${props.height}px` : props.height}`,
        font(14, 400, props.disabled ? T.dimmed : T.body),
        props.monospace ? "font-family:'Roboto Mono',monospace" : '',
        `background:${props.disabled ? '#f2f1f4' : T.bg};outline:none`,
        props.disabled ? 'cursor:not-allowed' : '',
      ].filter(Boolean).join(';'),
    })
  },
})

export const BaseToggle = defineComponent({
  name: 'BaseToggle',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled:   { type: Boolean, default: false },
    alignment:  { type: String as PropType<'left' | 'right'>, default: 'left' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h('label', {
      style: `display:inline-flex;align-items:center;gap:8px;cursor:${props.disabled ? 'not-allowed' : 'pointer'};flex-direction:${props.alignment === 'right' ? 'row-reverse' : 'row'}`,
    }, [
      h('div', {
        onClick: () => { if (!props.disabled) emit('update:modelValue', !props.modelValue) },
        style: [
          'width:34px;height:20px;border-radius:10px;position:relative;transition:background .15s',
          `background:${props.modelValue ? '#145deb' : T.border}`,
          props.disabled ? 'opacity:.5' : '',
        ].filter(Boolean).join(';'),
      }, [
        h('span', {
          style: [
            'position:absolute;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.25)',
            `left:${props.modelValue ? '17px' : '3px'}`,
          ].join(';'),
        }),
      ]),
      slots.default && h('span', { style: font(14, 400, props.disabled ? T.dimmed : T.body) }, slots.default?.()),
    ])
  },
})

export const BaseMultiselect = defineComponent({
  name: 'BaseMultiselect',
  props: {
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
    placeholder: { type: String, default: 'Select options…' },
    options:     { type: Array as PropType<{ label: string; value: string }[]>, default: () => [] },
    disabled:    { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false)
    return () => h('div', { style: 'position:relative' }, [
      h('div', {
        onClick: () => { if (!props.disabled) open.value = !open.value },
        style: `display:flex;flex-wrap:wrap;gap:4px;min-height:34px;padding:4px 28px 4px 8px;border:1px solid ${T.inputBorder};border-radius:4px;background:${props.disabled ? '#f2f1f4' : T.bg};cursor:${props.disabled ? 'not-allowed' : 'pointer'};align-items:center;position:relative`,
      }, [
        props.modelValue.length === 0
          ? h('span', { style: font(14, 400, T.dimmed) }, props.placeholder)
          : props.modelValue.map(v => h('span', {
              style: `display:inline-flex;align-items:center;gap:4px;padding:1px 6px;background:#eaf1ff;border:1px solid #b5ccfa;border-radius:3px;${font(12, 400, '#0f47c6')}`,
            }, [
              v,
              h('span', {
                onClick: (e: Event) => {
                  e.stopPropagation()
                  emit('update:modelValue', props.modelValue.filter(x => x !== v))
                },
                style: 'cursor:pointer;margin-left:2px;line-height:1',
              }, '×'),
            ])),
        h('div', { style: 'position:absolute;right:8px;top:50%;transform:translateY(-50%);pointer-events:none' },
          icon(ICONS.chevronDown, T.dimmed, 14)),
      ]),
      open.value ? h('div', {
        style: `position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:200;background:${T.bg};border:1px solid ${T.border};border-radius:6px;max-height:200px;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,.12);padding:4px 0`,
        onMouseleave: () => open.value = false,
      }, props.options.map(o => h('div', {
        onClick: () => {
          const val = props.modelValue.includes(o.value)
            ? props.modelValue.filter(v => v !== o.value)
            : [...props.modelValue, o.value]
          emit('update:modelValue', val)
        },
        style: `padding:7px 12px;${font(14, 400, T.body)};cursor:pointer;display:flex;align-items:center;gap:8px;background:${props.modelValue.includes(o.value) ? '#f4f8ff' : 'transparent'}`,
      }, [
        h('input', { type: 'checkbox', checked: props.modelValue.includes(o.value), style: 'accent-color:#145deb', readOnly: true }),
        o.label,
      ]))) : null,
    ])
  },
})

export const BaseDatePicker = defineComponent({
  name: 'BaseDatePicker',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Select date…' },
    disabled:    { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', {
      style: `display:inline-flex;align-items:center;gap:6px;border:1px solid ${T.inputBorder};border-radius:4px;padding:5px 8px;background:${props.disabled ? '#f2f1f4' : T.bg};cursor:${props.disabled ? 'not-allowed' : 'pointer'}`,
    }, [
      icon(ICONS.arrowSwap, T.dimmed, 14), // calendar-like icon approximation
      h('input', {
        type: 'date',
        value: props.modelValue,
        disabled: props.disabled,
        onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        style: `border:none;outline:none;${font(14, 400, T.body)};background:transparent;cursor:inherit`,
      }),
    ])
  },
})

export const BaseRangeSlider = defineComponent({
  name: 'BaseRangeSlider',
  props: {
    modelValue: { type: [Number, Array] as PropType<number | number[]>, default: 50 },
    min:  { type: Number, default: 0 },
    max:  { type: Number, default: 100 },
    step: { type: Number, default: 1 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('input', {
      type: 'range',
      value: Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue,
      min: props.min, max: props.max, step: props.step,
      onInput: (e: Event) => emit('update:modelValue', Number((e.target as HTMLInputElement).value)),
      style: 'width:100%;accent-color:#145deb',
    })
  },
})

export const BaseFieldset = defineComponent({
  name: 'BaseFieldset',
  props: { legend: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('fieldset', {
      style: `border:1px solid ${T.border};border-radius:6px;padding:12px 16px;`,
    }, [
      props.legend ? h('legend', { style: font(13, 500, T.dimmed) }, props.legend) : null,
      slots.default?.(),
    ])
  },
})

export const BaseToken = defineComponent({
  name: 'BaseToken',
  props: {
    locked:   { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, emit }) {
    return () => h('span', {
      style: `display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border:1px solid ${T.inputBorder};border-radius:4px;background:${T.bg};${font(13, 400, T.body)};${props.disabled ? 'opacity:.5' : ''}`,
    }, [
      slots.default?.(),
      !props.locked && !props.disabled
        ? h('span', {
            onClick: () => (emit as any)('remove'),
            style: `cursor:pointer;color:${T.dimmed};margin-left:2px`,
          }, '×')
        : null,
    ])
  },
})

export const BaseInputNote = defineComponent({
  name: 'BaseInputNote',
  props: {
    variant: { type: String as PropType<'info' | 'warning' | 'success' | 'danger'>, default: 'info' },
  },
  setup(props, { slots }) {
    const colors: Record<string, string> = {
      info: T.dimmed, warning: '#d68000', success: '#1a7a3c', danger: '#c01a2a',
    }
    return () => h('span', {
      style: `display:block;margin-top:4px;${font(12, 400, colors[props.variant] ?? T.dimmed)}`,
    }, slots.default?.())
  },
})

export const BaseInputSubmit = defineComponent({
  name: 'BaseInputSubmit',
  props: {
    size:     { type: String, default: 'default' },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('button', {
      type: 'submit',
      disabled: props.disabled,
      style: `background:#145deb;border:1px solid #145deb;color:#fff;padding:${props.size === 'small' ? '3px 10px' : '5px 14px'};border-radius:4px;${font(14, 500, '#fff')};cursor:${props.disabled ? 'not-allowed' : 'pointer'};${props.disabled ? 'opacity:.5' : ''}`,
    }, slots.default?.() ?? 'Submit')
  },
})

// ── Multiselect implementations ───────────────────────────────────────────────

const makeTagsInput = (name: string, placeholder: string) => defineComponent({
  name,
  props: {
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
    placeholder: { type: String, default: placeholder },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref('')
    const add = () => {
      if (input.value.trim()) {
        emit('update:modelValue', [...props.modelValue, input.value.trim()])
        input.value = ''
      }
    }
    return () => h('div', {
      style: `display:flex;flex-wrap:wrap;gap:4px;min-height:34px;padding:4px 8px;border:1px solid ${T.inputBorder};border-radius:4px;background:${T.bg};align-items:center`,
    }, [
      ...props.modelValue.map(v => h('span', {
        style: `display:inline-flex;align-items:center;gap:4px;padding:1px 6px;background:#eaf1ff;border:1px solid #b5ccfa;border-radius:3px;${font(12, 400, '#0f47c6')}`,
      }, [v, h('span', { onClick: () => emit('update:modelValue', props.modelValue.filter(x => x !== v)), style: 'cursor:pointer' }, '×')])),
      h('input', {
        value: input.value,
        placeholder: props.modelValue.length === 0 ? props.placeholder : '',
        onInput: (e: Event) => input.value = (e.target as HTMLInputElement).value,
        onKeydown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } },
        style: `border:none;outline:none;${font(14, 400, T.body)};background:transparent;min-width:80px`,
      }),
    ])
  },
})

export const BaseTagsInput       = makeTagsInput('BaseTagsInput', 'Add tag…')
export const BaseTagsFilterInput = makeTagsInput('BaseTagsFilterInput', 'Filter…')
export const BaseCVEInput        = makeTagsInput('BaseCVEInput', 'CVE-YYYY-NNNNN')
export const BaseCWEInput        = makeTagsInput('BaseCWEInput', 'CWE-NNN')
export const BaseSnykIdInput     = makeTagsInput('BaseSnykIdInput', 'SNYK-…')

export const BaseUserSelector = defineComponent({
  name: 'BaseUserSelector',
  props: {
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
    placeholder: { type: String, default: 'Add user…' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', {
      style: `display:flex;flex-wrap:wrap;gap:6px;padding:6px 8px;border:1px solid ${T.inputBorder};border-radius:4px;background:${T.bg};align-items:center;min-height:36px`,
    }, [
      ...props.modelValue.map(u => h('span', {
        style: `display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border:1px solid ${T.border};border-radius:128px;background:#f4f8ff;${font(13, 400, T.body)}`,
      }, [
        h('span', { style: `width:20px;height:20px;border-radius:50%;background:#4a5568;display:inline-flex;align-items:center;justify-content:center;${font(11, 500, '#fff')}` }, u[0]?.toUpperCase()),
        u,
        h('span', { onClick: () => emit('update:modelValue', props.modelValue.filter(x => x !== u)), style: 'cursor:pointer;color:#727184' }, '×'),
      ])),
      h('input', {
        placeholder: props.modelValue.length === 0 ? props.placeholder : '',
        style: `border:none;outline:none;${font(14, 400, T.body)};background:transparent;min-width:100px`,
      }),
    ])
  },
})

// ── Data display (additional) ─────────────────────────────────────────────────

export const BaseTableHeaderCell = defineComponent({
  name: 'BaseTableHeaderCell',
  props: {
    sorted: { type: String as PropType<'asc' | 'desc' | undefined>, default: undefined },
    width:  { type: [Number, String], default: undefined },
  },
  setup(props, { slots }) {
    return () => h('th', {
      style: props.width ? `width:${typeof props.width === 'number' ? `${props.width}px` : props.width}` : undefined,
    }, [
      h('div', { style: 'display:flex;align-items:center;gap:4px' }, [
        slots.default?.(),
        props.sorted ? icon(props.sorted === 'asc' ? ICONS.arrowDown : ICONS.arrowDown, T.dimmed, 12) : null,
      ]),
    ])
  },
})

export const BaseContentSection = defineComponent({
  name: 'BaseContentSection',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('section', {
      style: `background:${T.bg};border:1px solid ${T.border};border-radius:8px;overflow:hidden`,
    }, [
      (props.title || slots.header)
        ? h('div', {
            style: `padding:12px 16px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between`,
          }, [
            slots.header?.() ?? h('div', { style: font(16, 400, T.heading) }, props.title),
            slots.sidebar?.(),
          ])
        : null,
      h('div', { style: 'padding:16px' }, slots.default?.()),
    ])
  },
})

export const BaseContentHeader = defineComponent({
  name: 'BaseContentHeader',
  setup(_, { slots }) {
    return () => h('div', {
      style: `padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${T.border}`,
    }, slots.default?.())
  },
})

export const BaseContentTable = defineComponent({
  name: 'BaseContentTable',
  props: {
    rows: { type: Array as PropType<{ label: string; value: string }[]>, default: () => [] },
  },
  setup(props, { slots }) {
    return () => h('dl', {
      style: 'display:flex;flex-direction:column;gap:8px;margin:0',
    }, [
      ...props.rows.map(row => h('div', {
        style: 'display:flex;align-items:baseline;gap:8px',
      }, [
        h('dt', { style: `width:180px;flex-shrink:0;${font(14, 400, T.dimmed)}` }, row.label),
        h('dd', { style: `margin:0;${font(14, 400, T.body)}` }, row.value),
      ])),
      slots.default?.(),
    ])
  },
})

export const BaseContentAccordion = defineComponent({
  name: 'BaseContentAccordion',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    const open = ref(true)
    return () => h('div', {
      style: `border:1px solid ${T.border};border-radius:6px;overflow:hidden`,
    }, [
      h('button', {
        onClick: () => open.value = !open.value,
        style: `width:100%;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:${T.bg};border:none;cursor:pointer;${font(14, 500, T.heading)}`,
      }, [
        slots.title?.() ?? h('span', {}, props.title),
        h('span', { style: `transform:rotate(${open.value ? '180deg' : '0deg'});transition:transform .2s` },
          icon(ICONS.chevronDown, T.dimmed, 14)),
      ]),
      open.value ? h('div', {
        style: `padding:12px 14px;border-top:1px solid ${T.borderLight};background:${T.bg}`,
      }, slots.default?.()) : null,
    ])
  },
})

export const BaseExpandable = defineComponent({
  name: 'BaseExpandable',
  props: {
    size:    { type: String, default: 'default' },
    variant: { type: String, default: 'default' },
  },
  setup(_, { slots }) {
    const open = ref(false)
    return () => h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [
      h('div', {
        style: 'display:flex;align-items:center;gap:8px;cursor:pointer',
        onClick: () => open.value = !open.value,
      }, [
        slots.header?.() ?? slots.title?.(),
        h('span', { style: `transform:rotate(${open.value ? '180deg' : '0deg'});transition:transform .2s` },
          icon(ICONS.chevronDown, T.dimmed, 14)),
      ]),
      open.value ? slots.default?.() : null,
    ])
  },
})

export const BaseCodeBlock = defineComponent({
  name: 'BaseCodeBlock',
  props: {
    language:  { type: String, default: '' },
    showLines: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('div', {
      style: `position:relative;background:#1e1e2e;border-radius:6px;overflow:hidden`,
    }, [
      props.language ? h('div', {
        style: `padding:6px 12px;border-bottom:1px solid rgba(255,255,255,.1);${font(11, 500, '#7c7c9a')};text-transform:uppercase;letter-spacing:.5px`,
      }, props.language) : null,
      h('pre', {
        style: `margin:0;padding:16px;overflow-x:auto;${font(13, 400, '#cdd6f4')};font-family:'Roboto Mono',monospace;line-height:1.6`,
      }, h('code', {}, slots.default?.())),
      h('button', {
        title: 'Copy',
        style: `position:absolute;top:8px;right:8px;background:rgba(255,255,255,.1);border:none;border-radius:4px;padding:4px 8px;cursor:pointer;${font(11, 400, '#cdd6f4')}`,
      }, 'Copy'),
    ])
  },
})

// ── Navigation (additional) ───────────────────────────────────────────────────

export const BaseNavigation = defineComponent({
  name: 'BaseNavigation',
  props: {
    items: { type: Array as PropType<{ id: string; label: string; active?: boolean; separator?: boolean }[]>, default: () => [] },
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () => h('nav', {
      style: `display:flex;flex-direction:column;gap:2px`,
    }, props.items.map(item =>
      item.separator
        ? h('hr', { style: `margin:8px 0;border:none;border-top:1px solid ${T.border}` })
        : h('div', {
            onClick: () => emit('select', item.id),
            style: [
              `padding:7px 12px;border-radius:4px;cursor:pointer`,
              font(14, item.active ? 500 : 400, item.active ? T.heading : T.body),
              item.active ? `background:#f4f8ff;color:#145deb` : '',
            ].filter(Boolean).join(';'),
          }, item.label)
    ))
  },
})

export const BaseItemNav = defineComponent({
  name: 'BaseItemNav',
  props: {
    items: { type: Array as PropType<{ id: string; label: string; active?: boolean }[]>, default: () => [] },
  },
  emits: ['select'],
  setup(props, { emit, slots }) {
    return () => h('div', {
      style: `display:flex;flex-direction:column`,
    }, [
      ...props.items.map(item => h('div', {
        onClick: () => emit('select', item.id),
        style: [
          `display:flex;align-items:center;padding:8px 12px;cursor:pointer;border-bottom:1px solid ${T.borderLight}`,
          font(14, 400, item.active ? T.heading : T.body),
          item.active ? `border-left:2px solid #145deb;padding-left:10px` : `border-left:2px solid transparent`,
        ].join(';'),
      }, item.label)),
      slots.default?.(),
    ])
  },
})

export const ThePagination = defineComponent({
  name: 'ThePagination',
  props: {
    modelValue:  { type: Number, default: 1 },
    total:       { type: Number, default: 1 },
    perPage:     { type: Number, default: 20 },
    totalItems:  { type: Number, default: 0 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => {
      const start = (props.modelValue - 1) * props.perPage + 1
      const end   = Math.min(props.modelValue * props.perPage, props.totalItems)
      return h('div', {
        style: `display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-top:1px solid ${T.border};${font(13, 400, T.dimmed)}`,
      }, [
        props.totalItems ? h('span', {}, `${start}–${end} of ${props.totalItems}`) : null,
        h('div', { style: 'display:flex;gap:4px;align-items:center' }, [
          h('button', {
            disabled: props.modelValue <= 1,
            onClick: () => emit('update:modelValue', props.modelValue - 1),
            style: `padding:4px 10px;border:1px solid ${T.border};border-radius:4px;background:${T.bg};cursor:pointer;${font(13, 400, T.body)};${props.modelValue <= 1 ? 'opacity:.5;cursor:not-allowed' : ''}`,
          }, '← Prev'),
          h('span', { style: `padding:4px 8px;${font(13, 400, T.body)}` }, `${props.modelValue} / ${props.total}`),
          h('button', {
            disabled: props.modelValue >= props.total,
            onClick: () => emit('update:modelValue', props.modelValue + 1),
            style: `padding:4px 10px;border:1px solid ${T.border};border-radius:4px;background:${T.bg};cursor:pointer;${font(13, 400, T.body)};${props.modelValue >= props.total ? 'opacity:.5;cursor:not-allowed' : ''}`,
          }, 'Next →'),
        ]),
      ])
    }
  },
})

// ── Overlays (additional) ─────────────────────────────────────────────────────

export const BaseDialog = defineComponent({
  name: 'BaseDialog',
  props: {
    open:        { type: Boolean, default: false },
    title:       { type: String, default: '' },
    dismissible: { type: Boolean, default: true },
    noPadding:   { type: Boolean, default: false },
    size:        { type: String as PropType<'small' | 'medium' | 'large'>, default: 'small' },
    // Prototype-only: anchors the dialog top-right corner to these viewport coords
    // so the close button sits directly over the trigger element.
    anchorTop:   { type: Number, default: undefined },
    anchorRight: { type: Number, default: undefined },
  },
  emits: ['close', 'clickOutside'],
  setup(props, { slots, emit }) {
    const widths = { small: '480px', medium: '640px', large: '800px' }
    return () => {
      if (!props.open) return null
      const anchored = props.anchorTop !== undefined && props.anchorRight !== undefined
      const panelStyle = anchored
        ? `position:fixed;top:${props.anchorTop}px;right:${props.anchorRight}px;z-index:1000;background:${T.bg};border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,.18);width:${widths[props.size]};max-height:90vh;display:flex;flex-direction:column;overflow:hidden`
        : `position:relative;background:${T.bg};border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.2);width:${widths[props.size]};max-height:90vh;display:flex;flex-direction:column;overflow:hidden`

      const panel = h('div', { style: panelStyle }, [
        h('div', {
          style: `display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid ${T.border}`,
        }, [
          slots.header?.({ id: 'dialog-title' }) ?? h('div', { style: font(18, 400, T.heading) }, props.title),
          props.dismissible ? h('button', {
            onClick: () => emit('close'),
            style: `background:transparent;border:none;cursor:pointer;padding:4px;color:${T.dimmed};display:inline-flex;align-items:center;justify-content:center`,
          }, h('span', { style: 'display:inline-flex;transform:rotate(45deg)' }, icon(ICONS.plus, T.dimmed, 16))) : null,
        ]),
        h('div', { style: `flex:1;overflow-y:auto;padding:${props.noPadding ? '0' : '20px'}` }, slots.default?.()),
        slots.actions ? h('div', {
          style: `padding:12px 20px;border-top:1px solid ${T.border};display:flex;justify-content:flex-end;gap:8px`,
        }, slots.actions?.()) : null,
      ])

      if (anchored) return panel
      return h('div', {
        style: 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center',
      }, [
        h('div', {
          style: 'position:absolute;inset:0;background:rgba(0,0,0,.4)',
          onClick: (e: MouseEvent) => { emit('clickOutside', e); if (props.dismissible) emit('close') },
        }),
        panel,
      ])
    }
  },
})

export const BasePopover = defineComponent({
  name: 'BasePopover',
  props: { open: { type: Boolean, default: false } },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    return () => h('div', { style: 'position:relative;display:inline-block' }, [
      h('div', { onClick: () => emit('update:open', !props.open) }, slots.handle?.()),
      props.open ? h('div', {
        style: `position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:${T.bg};border:1px solid ${T.border};border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:12px;min-width:200px`,
      }, slots.default?.()) : null,
    ])
  },
})

export const BaseTooltip = defineComponent({
  name: 'BaseTooltip',
  props: { content: { type: String, default: '' } },
  setup(props, { slots }) {
    const show = ref(false)
    return () => h('div', {
      style: 'position:relative;display:inline-flex',
      onMouseenter: () => show.value = true,
      onMouseleave: () => show.value = false,
    }, [
      slots.default?.(),
      show.value && props.content ? h('div', {
        style: `position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1c1c21;color:#fff;padding:4px 8px;border-radius:4px;${font(12, 400, '#fff')};white-space:nowrap;pointer-events:none;z-index:500`,
      }, props.content) : null,
    ])
  },
})

// ── Feedback ──────────────────────────────────────────────────────────────────

export const BaseAlert = defineComponent({
  name: 'BaseAlert',
  props: {
    variant:     { type: String as PropType<'info' | 'warning' | 'danger' | 'success'>, default: 'info' },
    size:        { type: String, default: 'default' },
    dismissible: { type: Boolean, default: false },
    inline:      { type: Boolean, default: false },
  },
  emits: ['dismiss'],
  setup(props, { slots, emit }) {
    const dismissed = ref(false)
    const palette: Record<string, { bg: string; border: string; color: string; icon: string }> = {
      info:    { bg: '#eaf1ff', border: '#b5ccfa', color: '#0f47c6', icon: '●' },
      warning: { bg: '#fff8e6', border: '#ffd070', color: '#8a5c00', icon: '▲' },
      danger:  { bg: '#fde8e9', border: '#f5a0a0', color: '#c01a2a', icon: '●' },
      success: { bg: '#e6f7ec', border: '#8fd4a6', color: '#1a7a3c', icon: '✓' },
    }
    return () => {
      if (dismissed.value) return null
      const s = palette[props.variant] ?? palette.info
      return h('div', {
        style: [
          `display:flex;align-items:flex-start;gap:10px;padding:${props.inline ? '6px 10px' : '12px 16px'}`,
          `background:${s.bg};border-color:${s.border};border-style:solid;border-width:${props.size === 'page' ? '1px 0' : '1px'};border-radius:${props.inline || props.size === 'page' ? '0' : '6px'}`,
          font(14, 400, s.color),
        ].join(';'),
      }, [
        h('span', { style: font(14, 600, s.color) }, s.icon),
        h('div', { style: 'flex:1;min-width:0' }, slots.default?.()),
        props.dismissible ? h('button', {
          onClick: () => { dismissed.value = true; emit('dismiss') },
          style: `background:transparent;border:none;cursor:pointer;padding:0;${font(14, 400, s.color)}`,
        }, '×') : null,
      ])
    }
  },
})

export const BaseToastItem = defineComponent({
  name: 'BaseToastItem',
  props: {
    variant: { type: String as PropType<'success' | 'danger'>, default: 'success' },
  },
  setup(props, { slots }) {
    const colors = { success: { bg: '#e6f7ec', border: '#8fd4a6', color: '#1a7a3c' }, danger: { bg: '#fde8e9', border: '#f5a0a0', color: '#c01a2a' } }
    const s = colors[props.variant]
    return () => h('div', {
      style: `display:flex;align-items:center;gap:10px;padding:10px 14px;background:${s.bg};border:1px solid ${s.border};border-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,.12);max-width:360px;${font(14, 400, s.color)}`,
    }, slots.default?.())
  },
})

export const BaseLoadingSpinner = defineComponent({
  name: 'BaseLoadingSpinner',
  props: {
    size:   { type: String as PropType<'small' | 'default' | 'large'>, default: 'default' },
    inline: { type: Boolean, default: false },
  },
  setup(props) {
    const sz = { small: 16, default: 24, large: 40 }[props.size] ?? 24
    return () => h('div', {
      style: `display:${props.inline ? 'inline-flex' : 'flex'};align-items:center;justify-content:center`,
    }, [
      h('div', {
        style: `width:${sz}px;height:${sz}px;border:2px solid ${T.border};border-top-color:#145deb;border-radius:50%;animation:spin .7s linear infinite`,
      }),
      h('style', {}, '@keyframes spin{to{transform:rotate(360deg)}}'),
    ])
  },
})

export const BaseSkeleton = defineComponent({
  name: 'BaseSkeleton',
  props: {
    width:  { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: 16 },
    radius: { type: [String, Number], default: 4 },
  },
  setup(props) {
    const w = typeof props.width  === 'number' ? `${props.width}px`  : props.width
    const h2 = typeof props.height === 'number' ? `${props.height}px` : props.height
    const r = typeof props.radius === 'number' ? `${props.radius}px` : props.radius
    return () => h('div', {
      style: `width:${w};height:${h2};border-radius:${r};background:linear-gradient(90deg,#f2f1f4 25%,#e8e7ef 50%,#f2f1f4 75%);background-size:200% 100%;animation:shimmer 1.4s infinite`,
    }, h('style', {}, '@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}'))
  },
})

export const BaseProgressBar = defineComponent({
  name: 'BaseProgressBar',
  props: {
    value:        { type: Number, default: 0 },
    max:          { type: Number, default: 100 },
    variant:      { type: String, default: 'default' },
    disabled:     { type: Boolean, default: false },
    withoutText:  { type: Boolean, default: false },
  },
  setup(props) {
    const pct = Math.min(100, Math.max(0, (props.value / props.max) * 100))
    const barColor = props.disabled ? T.dimmed : '#145deb'
    return () => h('div', { style: 'display:flex;flex-direction:column;gap:4px' }, [
      h('div', {
        style: `width:100%;height:8px;background:#f2f1f4;border-radius:128px;overflow:hidden`,
      }, [
        h('div', {
          style: `height:100%;width:${pct}%;background:${barColor};border-radius:128px;transition:width .3s`,
        }),
      ]),
      !props.withoutText ? h('span', { style: font(12, 400, T.dimmed) }, `${Math.round(pct)}%`) : null,
    ])
  },
})

export const BaseStatusBar = defineComponent({
  name: 'BaseStatusBar',
  props: {
    variant:  { type: String as PropType<'success' | 'failure' | 'in-progress'>, default: 'in-progress' },
    progress: { type: Number, default: undefined },
  },
  setup(props) {
    const palette = { success: '#1a7a3c', failure: '#c01a2a', 'in-progress': '#145deb' }
    const color = palette[props.variant] ?? '#145deb'
    const isIndeterminate = props.variant === 'in-progress' && props.progress === undefined
    return () => h('div', {
      style: `height:4px;background:#f2f1f4;border-radius:2px;overflow:hidden`,
    }, [
      isIndeterminate
        ? h('div', {
            style: `height:100%;width:40%;background:${color};border-radius:2px;animation:indeterminate 1.4s ease-in-out infinite`,
          }, h('style', {}, '@keyframes indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}'))
        : h('div', {
            style: `height:100%;width:${props.progress ?? (props.variant === 'success' ? 100 : props.variant === 'failure' ? 100 : 0)}%;background:${color};border-radius:2px;transition:width .3s`,
          }),
    ])
  },
})

// ── Filtering & Search ────────────────────────────────────────────────────────

export const BaseFilters = defineComponent({
  name: 'BaseFilters',
  props: {
    filters: {
      type: Array as PropType<{ id: string; label: string; type?: string; options?: { label: string; value: string }[] }[]>,
      default: () => [],
    },
  },
  setup(_, { slots }) {
    return () => h('div', {
      style: `display:flex;flex-direction:column;gap:1px;border:1px solid ${T.border};border-radius:6px;overflow:hidden`,
    }, slots.default?.())
  },
})

export const BaseSearchFilters = defineComponent({
  name: 'BaseSearchFilters',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search…' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [
      h('div', {
        style: `display:flex;align-items:center;gap:6px;border:1px solid ${T.inputBorder};border-radius:4px;padding:6px 10px;background:${T.bg}`,
      }, [
        icon(ICONS.search, T.dimmed, 14),
        h('input', {
          value: props.modelValue,
          placeholder: props.placeholder,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
          style: `border:none;outline:none;${font(14, 400, T.body)};background:transparent;flex:1`,
        }),
      ]),
      slots.default?.(),
    ])
  },
})

export const TheSidebarFilters = defineComponent({
  name: 'TheSidebarFilters',
  setup(_, { slots }) {
    return () => h('aside', {
      style: `width:240px;flex-shrink:0;border-right:1px solid ${T.border};padding:12px 0;background:${T.bg}`,
    }, slots.default?.())
  },
})

// ── Media & Iconography ───────────────────────────────────────────────────────

export const BaseAvatar = defineComponent({
  name: 'BaseAvatar',
  // Real props: url, email, name, size (xsmall/small/medium/large/xlarge), variant (default/group)
  props: {
    url:     { type: String, default: undefined },
    email:   { type: String, default: undefined },
    name:    { type: String, default: undefined },
    size:    { type: String as PropType<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'>, default: 'medium' },
    variant: { type: String as PropType<'default' | 'group'>, default: 'default' },
  },
  setup(props) {
    const pxMap = { xsmall: 24, small: 32, medium: 40, large: 48, xlarge: 56 }
    const fzMap = { xsmall: 10, small: 11, medium: 13, large: 16, xlarge: 20 }
    // Simple gradient palette for name-based avatars (approximates ProductCL gradients)
    const gradients = [
      'linear-gradient(135deg,#e040fb,#1a237e)',
      'linear-gradient(135deg,#f48fb1,#e57373)',
      'linear-gradient(135deg,#ffee58,#00897b)',
      'linear-gradient(135deg,#ab47bc,#1a237e)',
      'linear-gradient(135deg,#29b6f6,#00695c)',
    ]
    function getGradient(n: string) {
      let s = 0; for (let i = 0; i < n.length; i++) s += n.charCodeAt(i)
      return gradients[s % gradients.length]
    }
    function getInitials(n: string) {
      const parts = n.trim().split(/\s+/)
      return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : n.slice(0, 2).toUpperCase()
    }
    return () => {
      const sz = pxMap[props.size] ?? 40
      const fz = fzMap[props.size] ?? 13
      const radius = props.variant === 'group' ? '4px' : '50%'
      const imgSrc = props.url ?? (props.email ? `https://www.gravatar.com/avatar/${props.email}?d=404&s=${sz * 2}` : null)
      if (imgSrc) {
        return h('span', {
          style: `display:inline-flex;align-items:center;justify-content:center;width:${sz}px;height:${sz}px;border-radius:${radius};overflow:hidden;flex-shrink:0`,
        }, h('img', { src: imgSrc, style: 'width:100%;height:100%;object-fit:cover;display:block' }))
      }
      if (props.name) {
        return h('span', {
          style: `display:inline-flex;align-items:center;justify-content:center;width:${sz}px;height:${sz}px;border-radius:${radius};background:${getGradient(props.name)};flex-shrink:0`,
        }, h('span', { style: `${font(fz, 500, '#fff')};text-transform:uppercase;line-height:1` }, getInitials(props.name)))
      }
      // Blank fallback
      return h('span', {
        style: `display:inline-flex;align-items:center;justify-content:center;width:${sz}px;height:${sz}px;border-radius:${radius};background:#bdbcc9;flex-shrink:0`,
      })
    }
  },
})

export const BaseAvatarUsername = defineComponent({
  name: 'BaseAvatarUsername',
  props: {
    src:      { type: String, default: '' },
    initials: { type: String, default: '' },
    name:     { type: String, default: '' },
    email:    { type: String, default: '' },
    size:     { type: String, default: 'default' },
  },
  setup(props) {
    const sz = props.size === 'small' ? 24 : 32
    const fz = props.size === 'small' ? 10 : 13
    return () => h('div', { style: 'display:flex;align-items:center;gap:8px' }, [
      props.src
        ? h('img', { src: props.src, style: `width:${sz}px;height:${sz}px;border-radius:50%;object-fit:cover;flex-shrink:0` })
        : h('div', {
            style: `width:${sz}px;height:${sz}px;border-radius:50%;background:#4a5568;display:flex;align-items:center;justify-content:center;flex-shrink:0`,
          }, h('span', { style: font(fz, 500, '#fff') }, props.initials || '?')),
      h('div', { style: 'display:flex;flex-direction:column;min-width:0' }, [
        props.name  ? h('span', { style: font(14, 400, T.body) }, props.name)   : null,
        props.email ? h('span', { style: font(12, 400, T.dimmed) }, props.email) : null,
      ]),
    ])
  },
})

export const BaseGradientIcon = defineComponent({
  name: 'BaseGradientIcon',
  props: {
    name: { type: String, default: '' },
    size: { type: Number, default: 32 },
  },
  setup(props) {
    return () => h('div', {
      style: `width:${props.size}px;height:${props.size}px;border-radius:${props.size * 0.25}px;background:linear-gradient(135deg,#6b28d9,#145deb);display:flex;align-items:center;justify-content:center;flex-shrink:0`,
    }, h('span', { style: font(Math.round(props.size * 0.5), 700, '#fff') }, props.name?.[0]?.toUpperCase() ?? ''))
  },
})

// ── CliIcon product icon (from snyk/patchui-icons custom/Cli.vue)
// 24×24 viewBox, fill: currentColor. Rendered at 16px wide in the table Test surface column.
export const CliIcon = defineComponent({
  name: 'CliIcon',
  props: {
    size:  { type: Number, default: 16 },
    color: { type: String, default: 'currentColor' },
    label: { type: String, default: '' },
  },
  setup(props) {
    return () => h('svg', {
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: props.color,
      'aria-hidden': props.label ? undefined : 'true',
      'aria-label': props.label || undefined,
      role: props.label ? 'img' : undefined,
      style: 'display:inline-block;vertical-align:text-top;flex-shrink:0',
    }, [
      h('path', {
        d: 'M2 3v18c0 .7.3 1 1 1h18c.7 0 1-.3 1-1V3c0-.7-.3-1-1-1H3c-.7 0-1 .3-1 1zm3 11.5l3-3-3-3L6.5 7l4.5 4.5L6.5 16 5 14.5zM19 16h-7v-2h7v2z',
      }),
    ])
  },
})

// ── SnykOpenSource product icon (from snyk/patchui-icons product/SnykOpenSource.vue)
// Figma: SVG renders at 20px inside a 32px white circular container (size-[32px], rounded-[36px]).
// Gradient IDs are fixed — identical definitions, so re-use across rows is safe visually.
export const SnykOpenSource = defineComponent({
  name: 'SnykOpenSource',
  props: {
    size: { type: Number, default: 20 },
    // aria-label: omit when icon is decorative (accompanied by describing text/tooltip)
    label: { type: String, default: '' },
  },
  setup(props) {
    return () => h('svg', {
      width: props.size,
      height: props.size,
      viewBox: '0 0 56 56.36',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': props.label ? undefined : 'true',
      'aria-label': props.label || undefined,
      role: props.label ? 'img' : undefined,
      style: 'flex-shrink:0;display:block',
    }, [
      h('defs', {}, [
        h('linearGradient', {
          id: 'SnykOS-A',
          x1: '1.38', y1: '34.88', x2: '58.77', y2: '21.4',
          gradientTransform: 'matrix(1 0 0 -1 0 57.89)',
          gradientUnits: 'userSpaceOnUse',
        }, [
          h('stop', { offset: '0', 'stop-color': '#9043c6' }),
          h('stop', { offset: '1', 'stop-color': '#145deb' }),
        ]),
        h('linearGradient', {
          id: 'SnykOS-B',
          x1: '18.13', y1: '26.45', x2: '65.23', y2: '13.14',
          gradientTransform: 'matrix(1 0 0 -1 0 57.89)',
          gradientUnits: 'userSpaceOnUse',
        }, [
          h('stop', { offset: '0', 'stop-color': '#43b59a' }),
          h('stop', { offset: '1', 'stop-color': '#145deb' }),
        ]),
      ]),
      h('path', {
        d: 'M23.11 56.35a1.15 1.15 0 0 0 .37 0 1.21 1.21 0 0 0 .38 0c1.43-.48 2.79-1 4.08-1.58l-12.56-7.83-.11-.08a4.25 4.25 0 0 1-1.72-3.37A4.09 4.09 0 0 1 15.42 40l-.11-.07a4.17 4.17 0 0 1 0-6.75l.09-.07-.13-.11a4.15 4.15 0 0 1-1.72-3.37 4.09 4.09 0 0 1 2-3.57l18.56-11.54a4.16 4.16 0 0 1 4.28 0L47 19.84V8.26a1.17 1.17 0 0 0-.21-.72 1.24 1.24 0 0 0-.61-.45L23.84.05a1.23 1.23 0 0 0-.71 0L.82 7.09a1.24 1.24 0 0 0-.61.45 1.17 1.17 0 0 0-.21.72v14.08C0 40.25 7.34 51 23.11 56.35Z',
        style: 'fill:url(#SnykOS-A);fill-rule:evenodd',
      }),
      h('path', {
        d: 'M35.67 42.14a1.13 1.13 0 0 0 1.2 0l18.6-11.52a1.28 1.28 0 0 0 .53-1 1.3 1.3 0 0 0-.53-1l-18.6-11.54a1.13 1.13 0 0 0-1.2 0l-18.6 11.59a1.08 1.08 0 0 0-.52 1 1.15 1.15 0 0 0 .52 1Zm18-.75-16.8 10.4a1.13 1.13 0 0 1-1.2 0L19 41.39l-1.88 1.13a1.06 1.06 0 0 0-.52 1 1.27 1.27 0 0 0 .52 1l18.6 11.6a1.17 1.17 0 0 0 1.2 0l18.6-11.6a1.28 1.28 0 0 0 .53-1 1.26 1.26 0 0 0-.53-1Zm-16.8 3.45 16.8-10.4 1.8 1.12a1.15 1.15 0 0 1 0 1.94L36.87 49a1.17 1.17 0 0 1-1.2 0l-18.6-11.5a1.16 1.16 0 0 1 0-1.94L19 34.44l16.72 10.4a1.17 1.17 0 0 0 1.15 0Z',
        style: 'fill:url(#SnykOS-B);fill-rule:evenodd',
      }),
    ])
  },
})

export const BaseSnykLogo = defineComponent({
  name: 'BaseSnykLogo',
  props: {
    variant: { type: String, default: 'default' },
    color:   { type: String, default: '#6b28d9' },
  },
  setup(props) {
    return () => h('div', {
      style: `display:inline-flex;align-items:center;gap:6px`,
    }, [
      h('div', {
        style: `width:24px;height:24px;background:${props.color};border-radius:6px;display:flex;align-items:center;justify-content:center`,
      }, h('span', { style: font(12, 700, '#fff') }, 'S')),
      h('span', { style: font(15, 500, props.variant === 'inverted' ? '#fff' : T.heading) }, 'snyk'),
    ])
  },
})

// ── Labels (additional) ───────────────────────────────────────────────────────

export const BaseAnchor = defineComponent({
  name: 'BaseAnchor',
  props: {
    href:     { type: String, default: '#' },
    external: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('a', {
      href:   props.disabled ? undefined : props.href,
      target: props.external ? '_blank' : undefined,
      rel:    props.external ? 'noopener noreferrer' : undefined,
      style:  `color:${props.disabled ? T.dimmed : '#145deb'};text-decoration:none;cursor:${props.disabled ? 'not-allowed' : 'pointer'};display:inline-flex;align-items:center;gap:4px`,
    }, [
      slots.default?.(),
      props.external ? h('span', { style: font(10, 400, T.dimmed) }, '↗') : null,
    ])
  },
})

export const BaseDocsLink = defineComponent({
  name: 'BaseDocsLink',
  props: { href: { type: String, default: '#' } },
  setup(props, { slots }) {
    return () => h('a', {
      href: props.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      style: `color:#145deb;text-decoration:none;display:inline-flex;align-items:center;gap:4px;${font(13, 400, '#145deb')}`,
    }, [
      slots.default?.(),
      h('span', { style: font(10, 400, T.dimmed) }, '↗'),
    ])
  },
})

// ── Settings & Structure ──────────────────────────────────────────────────────

export const BaseSettingsSection = defineComponent({
  name: 'BaseSettingsSection',
  props: {
    title:   { type: String, default: '' },
    loading: { type: Boolean, default: false },
    withoutTitle: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('section', {
      style: 'display:flex;flex-direction:column;gap:16px',
    }, [
      !props.withoutTitle && (props.title || slots.title) ? h('div', {
        style: `border-bottom:1px solid ${T.border};padding-bottom:12px`,
      }, [
        h('div', { style: font(18, 400, T.heading) }, slots.title?.() ?? props.title),
        slots.description ? h('div', { style: `margin-top:4px;${font(14, 400, T.dimmed)}` }, slots.description?.()) : null,
      ]) : null,
      props.loading ? h('div', { style: 'display:flex;flex-direction:column;gap:12px' },
        [1, 2, 3].map(() => h('div', { style: `height:80px;background:#f2f1f4;border-radius:6px;animation:shimmer 1.4s infinite;background-size:200% 100%` }))
      ) : slots.default?.(),
    ])
  },
})

export const BaseSettingsSectionCard = defineComponent({
  name: 'BaseSettingsSectionCard',
  props: {
    variant: { type: String as PropType<'default' | 'danger'>, default: 'default' },
    icon:    { type: String, default: '' },
    badge:   { type: String, default: '' },
  },
  setup(props, { slots }) {
    const borderColor = props.variant === 'danger' ? '#f5a0a0' : T.border
    return () => h('div', {
      style: `background:${T.bg};border:1px solid ${borderColor};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:12px`,
    }, [
      h('div', {
        style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:12px',
      }, [
        h('div', { style: 'display:flex;flex-direction:column;gap:4px;flex:1' }, [
          slots.title ? h('div', { style: font(16, 400, T.heading) }, slots.title?.()) : null,
          slots.instructions ? h('div', { style: font(14, 400, T.dimmed) }, slots.instructions?.()) : null,
        ]),
        slots.badge?.() ?? (props.badge ? h('span', {
          style: `padding:2px 8px;background:#f9f8fa;border:1px solid ${T.border};border-radius:128px;${font(12, 500, T.dimmed)}`,
        }, props.badge) : null),
      ]),
      slots.default?.(),
    ])
  },
})

export const BaseBlock = defineComponent({
  name: 'BaseBlock',
  props: { variant: { type: String, default: 'default' } },
  setup(props, { slots }) {
    const styles: Record<string, string> = {
      default: `background:${T.bg};border:1px solid ${T.border}`,
      subtle:  `background:#f9f8fa;border:1px solid ${T.borderLight}`,
      info:    `background:#eaf1ff;border:1px solid #b5ccfa`,
      danger:  `background:#fde8e9;border:1px solid #f5a0a0`,
    }
    return () => h('div', {
      style: `${styles[props.variant] ?? styles.default};border-radius:6px;padding:12px 16px`,
    }, slots.default?.())
  },
})

export const BaseStepper = defineComponent({
  name: 'BaseStepper',
  props: {
    steps:     { type: Array as PropType<{ label: string; status?: 'complete' | 'current' | 'upcoming' }[]>, default: () => [] },
    direction: { type: String as PropType<'row' | 'column'>, default: 'row' },
  },
  setup(props) {
    return () => h('div', {
      style: `display:flex;flex-direction:${props.direction};gap:${props.direction === 'row' ? '0' : '0'};align-items:${props.direction === 'row' ? 'center' : 'flex-start'}`,
    }, props.steps.flatMap((step, i) => {
      const isComplete = step.status === 'complete'
      const isCurrent  = step.status === 'current'
      const color = isComplete ? '#145deb' : isCurrent ? '#145deb' : T.dimmed
      const bg    = isComplete ? '#145deb' : isCurrent ? '#fff' : '#f2f1f4'
      const border = isCurrent ? `2px solid #145deb` : 'none'
      const nodes = [
        h('div', { style: `display:flex;align-items:center;gap:8px;flex-shrink:0` }, [
          h('div', {
            style: `width:24px;height:24px;border-radius:50%;background:${bg};border:${border};display:flex;align-items:center;justify-content:center;flex-shrink:0`,
          }, isComplete
            ? h('span', { style: font(12, 700, '#fff') }, '✓')
            : h('span', { style: font(12, 400, color) }, String(i + 1))),
          h('span', { style: font(14, isCurrent ? 500 : 400, isCurrent ? T.heading : T.dimmed) }, step.label),
        ]),
      ]
      if (i < props.steps.length - 1 && props.direction === 'row') {
        nodes.push(h('div', { style: `flex:1;height:1px;background:${T.border};min-width:24px` }))
      }
      return nodes
    }))
  },
})

export const BaseTile = defineComponent({
  name: 'BaseTile',
  props: { href: { type: String, default: '#' } },
  setup(props, { slots }) {
    return () => h('a', {
      href: props.href,
      style: `display:block;background:${T.bg};border:1px solid ${T.border};border-radius:8px;padding:16px;text-decoration:none;transition:border-color .15s,box-shadow .15s`,
      onMouseenter: (e: Event) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#145deb'
        el.style.boxShadow = '0 2px 8px rgba(20,93,235,.12)'
      },
      onMouseleave: (e: Event) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = T.border
        el.style.boxShadow = ''
      },
    }, slots.default?.())
  },
})

export const BaseTileSelectable = defineComponent({
  name: 'BaseTileSelectable',
  props: {
    modelValue: { type: Boolean, default: false },
    affordance: { type: String, default: 'default' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h('div', {
      onClick: () => emit('update:modelValue', !props.modelValue),
      style: [
        `display:block;background:${T.bg};border:2px solid ${props.modelValue ? '#145deb' : T.border}`,
        'border-radius:8px;padding:16px;cursor:pointer;transition:border-color .15s',
        props.modelValue ? 'box-shadow:0 0 0 3px rgba(20,93,235,.15)' : '',
      ].filter(Boolean).join(';'),
    }, [
      slots.default?.(),
      props.modelValue ? h('div', {
        style: `position:absolute;top:8px;right:8px;width:18px;height:18px;background:#145deb;border-radius:50%;display:flex;align-items:center;justify-content:center`,
      }, h('span', { style: font(10, 700, '#fff') }, '✓')) : null,
    ])
  },
})

export const BasePromo = defineComponent({
  name: 'BasePromo',
  props: {
    title:    { type: String, default: '' },
    noImage:  { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('div', {
      style: `background:linear-gradient(135deg,#f4f0ff,#eaf1ff);border:1px solid #d4c8f8;border-radius:8px;padding:20px;display:flex;align-items:flex-start;gap:16px`,
    }, [
      !props.noImage ? h('div', {
        style: 'width:48px;height:48px;background:linear-gradient(135deg,#6b28d9,#145deb);border-radius:10px;flex-shrink:0',
      }) : null,
      h('div', { style: 'flex:1;display:flex;flex-direction:column;gap:8px' }, [
        slots.badge?.(),
        h('div', { style: font(18, 400, T.heading) }, slots.title?.() ?? props.title),
        slots.default?.(),
      ]),
    ])
  },
})

export const BaseEmptyState = defineComponent({
  name: 'BaseEmptyState',
  props: {
    variant: {
      type: String as PropType<'high-five' | 'no-results' | 'all-secure' | 'generating' | 'contact-admin' | 'failure'>,
      default: 'no-results',
    },
    title:   { type: String, default: 'No results found' },
    message: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const icons: Record<string, string> = {
      'high-five':     '🙌',
      'no-results':    '🔍',
      'all-secure':    '🛡️',
      'generating':    '⚙️',
      'contact-admin': '🔒',
      'failure':       '⚠️',
    }
    return () => h('div', {
      style: 'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center;gap:12px',
    }, [
      h('div', { style: 'font-size:48px;line-height:1' }, icons[props.variant] ?? ''),
      h('div', { style: font(18, 400, T.heading) }, props.title),
      props.message ? h('p', { style: `${font(14, 400, T.dimmed)};max-width:400px` }, props.message) : null,
      slots.default?.(),
    ])
  },
})

export const BaseIssueMini = defineComponent({
  name: 'BaseIssueMini',
  props: {
    title:    { type: String, default: '' },
    severity: { type: String as PropType<'critical' | 'high' | 'medium' | 'low'>, default: 'medium' },
    cve:      { type: String, default: '' },
  },
  setup(props, { slots }) {
    const palette: Record<string, { bg: string; color: string }> = {
      critical: { bg: '#ffdad8', color: '#ab1a1a' },
      high:     { bg: '#ffdbcc', color: '#ce5019' },
      medium:   { bg: '#ffe8cd', color: '#d68000' },
      low:      { bg: '#eeeeee', color: '#88879e' },
    }
    const s = palette[props.severity] ?? palette.medium
    return () => h('div', {
      style: `display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid ${T.border};border-radius:6px;background:${T.bg}`,
    }, [
      h('span', {
        style: `padding:2px 6px;border-radius:3px;background:${s.bg};${font(11, 600, s.color)};text-transform:uppercase;flex-shrink:0;margin-top:2px`,
      }, props.severity[0].toUpperCase()),
      h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;gap:2px' }, [
        h('div', { style: font(14, 400, T.heading) }, props.title),
        props.cve ? h('div', { style: font(12, 400, T.dimmed) }, props.cve) : null,
        slots.default?.(),
      ]),
    ])
  },
})

// ── Utilities (passthrough wrappers) ──────────────────────────────────────────

export const UtilApplyPropsToChild = defineComponent({
  name: 'UtilApplyPropsToChild',
  setup(_, { slots }) { return () => slots.default?.() },
})

export const UtilDelayMount = defineComponent({
  name: 'UtilDelayMount',
  setup(_, { slots }) { return () => slots.default?.() },
})

export const UtilFitText = defineComponent({
  name: 'UtilFitText',
  setup(_, { slots }) {
    return () => h('div', { style: 'width:100%;overflow:hidden' }, slots.default?.())
  },
})

export const UtilFocusTrap = defineComponent({
  name: 'UtilFocusTrap',
  setup(_, { slots }) { return () => slots.default?.() },
})

export const UtilInfiniteScroll = defineComponent({
  name: 'UtilInfiniteScroll',
  emits: ['load'],
  setup(_, { slots }) { return () => slots.default?.() },
})

export const UtilMarkdownToHtml = defineComponent({
  name: 'UtilMarkdownToHtml',
  props: { content: { type: String, default: '' } },
  setup(props) {
    return () => h('div', {
      style: `${font(14, 400, T.body)};line-height:1.6`,
      innerHTML: props.content,
    })
  },
})

export const UtilScrollbars = defineComponent({
  name: 'UtilScrollbars',
  props: { direction: { type: String as PropType<'vertical' | 'horizontal' | 'both'>, default: 'vertical' } },
  setup(props, { slots }) {
    const overflow: Record<string, string> = {
      vertical: 'overflow-y:auto', horizontal: 'overflow-x:auto', both: 'overflow:auto',
    }
    return () => h('div', {
      style: `${overflow[props.direction] ?? 'overflow-y:auto'};height:100%`,
    }, slots.default?.())
  },
})

export const UtilWithDimensions = defineComponent({
  name: 'UtilWithDimensions',
  setup(_, { slots }) {
    return () => h('div', { style: 'width:100%;height:100%' }, slots.default?.({ width: 0, height: 0 }))
  },
})

// Re-export icons helper for use in App.vue
export { Ico, ICONS }
