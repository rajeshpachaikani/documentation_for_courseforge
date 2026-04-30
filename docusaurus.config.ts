import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CourseForge Docs',
  tagline: 'Self-hosted, white-label course platform — sysadmin guide',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.courseforge.example.com',
  baseUrl: '/',

  organizationName: 'courseforge',
  projectName: 'documentaiton_for_courseforge',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl:
            'https://github.com/courseforge/documentaiton_for_courseforge/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CourseForge Docs',
      logo: {
        alt: 'CourseForge Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          href: 'https://github.com/courseforge/documentaiton_for_courseforge',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guide',
          items: [
            {
              label: 'Quick Install',
              to: '/docs/installation/quick-install',
            },
            {
              label: 'First Admin Account',
              to: '/docs/post-install/first-admin-account',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/operations/troubleshooting',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/courseforge/documentaiton_for_courseforge',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CourseForge. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
