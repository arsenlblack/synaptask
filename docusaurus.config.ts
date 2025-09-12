import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SynapTask Docs',
  tagline: 'Graph. Flow. Clarity.',
  favicon: 'img/logo.svg',

  future: { v4: true },

  url: 'https://docs.synaptask.space',
  baseUrl: '/',


  organizationName: 'arsenlblack',
  projectName: 'synaptask',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/arsenlblack/synaptask/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: 'img/social-card.png',
    navbar: {
      title: 'SynapTask',
      logo: { alt: 'SynapTask', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialSidebar', label: 'Docs', position: 'left' },
        { href: 'https://synaptask.space', label: 'App', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [{ label: 'Introduction', to: '/intro' }] },
        { title: 'App', items: [{ label: 'SynapTask.Space', to: 'https://synaptask.space' }] },
      ],
      copyright: `© ${new Date().getFullYear()} SynapTask.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
