import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';


const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'API',
      items: ['api/overview','api/auth','api/branch','api/node'],
    },
  ],

};

export default sidebars;
