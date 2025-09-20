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
        'concepts/account',
        'concepts/history',
        'concepts/trash',
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
          items: [
            'api/ws/connect',
            'api/ws/get_graph',
            'api/ws/node_add',
            'api/ws/link_add',
          ],
        },
        {
          type: 'category',
          label: 'REST',
          items: [
            'api/rest/get_graph',
            'api/rest/get_health',
            'api/rest/post_node',
            'api/rest/post_link',
          ],
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
