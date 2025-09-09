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
          editUrl: 'https://github.com/synaptask-space/synaptask/edit/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'SynapTask',
      logo: { alt: 'SynapTask', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs' },
        { href: 'https://github.com/synaptask-space/synaptask', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [{ label: 'Introduction', to: '/docs/intro' }] },
        { title: 'More', items: [{ label: 'GitHub', href: 'https://github.com/synaptask-space/synaptask' }] },
      ],
      copyright: `© ${new Date().getFullYear()} SynapTask.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
