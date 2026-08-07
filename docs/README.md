# Documentation Index

Dokumentasi teknis Sicoco Design System. Pilih topik yang ingin dipelajari:

## Core Systems

- **[Dark Mode](./dark-mode.md)** — Sistem dark mode berbasis CSS variables, color palette inversion, custom ring variables, theme switching
- **Config Preset** (TBD) — `lib/config/configPreset.ts` dan `tailwind.config.js` setup
- **Color System** (TBD) — Cara kerja color tokens, palette scale 50-950, theme variants

## Components

- **Button** (TBD) — Variants, sizes, outlined, light mode
- **Badge** (TBD) — Variants solid/soft, sizes, closeable
- **Form Inputs** (TBD) — Input, Textarea, PinInput dengan validasi
- **DataTable v2** (TBD) — Virtual scroll, sorting, filtering, pinning

## Features

- **[DataTable Pin Props](./datatable-pin-props.md)** — Automatic column pinning via props
- **[DataTable Default Sort](./datatable-default-sort.md)** — Default sort configuration
- **[DataTable Performance Optimization](./datatable-performance-optimization.md)** — Performance tips & best practices
- **[DataTable Virtual Scroll Updates](./datatable-virtual-scroll-updates.md)** — Virtual scroll implementation
- **[Sorting Feature](./sorting-feature.md)** — Sorting system overview
- **[Form Validation System](./form-validation-system.md)** — Vuelidate integration, custom validators, e2e tests
- **[Custom Validator E2E Tests](./custom-validator-e2e-tests.md)** — Testing custom validators

## Contributing

- **[Agent Prompt Template](./agent-prompt-template.md)** — Template untuk AI agent contribution

## Conventions

- **Component Best Practices** (TBD) — Cara membuat component baru dengan CVA + Tailwind
- **CSS Variable Patterns** (TBD) — kapan pakai `--color-*` vs `--ring-*` vs custom var

---

## Quick Reference

### File Structure

```
lib/
├── config/
│   ├── configPreset.ts    # Tailwind preset: colors, boxShadow, ring vars
│   └── tailwind.css       # Default theme CSS variables
├── components/
│   ├── button/
│   ├── checkbox/
│   ├── radio/
│   ├── switch/
│   └── ...
└── utils/
    └── tw-merge.ts        # cn() utility

src/
├── assets/
│   └── index.css          # Dark mode + purple theme overrides
├── pages/
│   └── ...
└── components/
    └── ...
docs/                       # You are here
```

### Common Tasks

| Task | Where to look |
|---|---|
| Add new color | `lib/config/tailwind.css` + `src/assets/index.css` + `lib/config/configPreset.ts` |
| Add new component | `lib/components/{name}/` with CVA pattern |
| Modify dark mode behavior | `src/assets/index.css` |
| Modify theme palette | `lib/config/tailwind.css` (light) + `src/assets/index.css` (dark, purple) |
| Add custom shadow/ring | Define `--ring-{name}` var + reference in `boxShadow` config |
| Toggle dark mode | `document.documentElement.setAttribute('data-mode', 'dark')` |
| Toggle theme | `document.documentElement.setAttribute('data-theme', 'purple')` |
