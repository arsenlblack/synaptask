import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';


const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/nodes',
        'concepts/links',
        'concepts/accesses',
        'concepts/history',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/authentication',
        {
          type: 'category',
          label: 'WebSocket',
          items: ['api/ws/connect', 'api/ws/get_graph'],
        },
        {
          type: 'category',
          label: 'REST',
          items: ['api/rest/get_graph'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/fetch-graph',
        'guides/create-node',
        'guides/share-access',
      ],
    },
  ],
};


export default sidebars;
