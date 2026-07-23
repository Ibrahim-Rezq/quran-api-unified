import { defineConfig } from 'vitepress'

// The product docs site. Arabic is the default (primary) locale, RTL; English is the
// mirror under /en/. The engineering docs (the build plan) live alongside in /docs but
// are excluded from the published site via srcExclude.
export default defineConfig({
  base: '/quran-api-unified/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: [
    'architecture.md',
    'backlog.md',
    'run-locally.md',
    'stack.md',
    'workflow.md',
    'adr/**',
    'product/**',
  ],
  locales: {
    root: {
      label: 'العربية',
      lang: 'ar',
      dir: 'rtl',
      title: 'quran-api-unified',
      description: 'واجهة موحّدة لعدّة مزوّدات لبيانات القرآن: النصّ والصوت والترجمة والتفسير.',
      themeConfig: {
        nav: [
          { text: 'الدليل', link: '/' },
          { text: 'English', link: '/en/' },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      dir: 'ltr',
      title: 'quran-api-unified',
      description:
        'A unified interface over multiple Quran data providers: text, audio, translation, and tafsir.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/' },
          { text: 'العربية', link: '/' },
        ],
      },
    },
  },
})
