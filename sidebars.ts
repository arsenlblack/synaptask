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
      'api/authentication',
      'api/error_codes',
    {
      type: 'category',
      label: 'REST API',
      items: [
        {
          type: 'doc',
          id: 'api/rest/get_health',
          label: 'Healthcheck Endpoint',
        },
        {
          type: 'doc',
          id: 'api/rest/get_graph',
          label: 'Get graph',
        },
        {
          type: 'doc',
          id: 'api/rest/get_trash',
          label: 'Get trash',
        },
        {
          type: 'category',
          label: 'Node endpoints',
          items: [
            {
              type: 'doc',
              id: 'api/rest/node/add',
              label: 'Add',
            },
            {
              type: 'doc',
              id: 'api/rest/node/update',
              label: 'Update',
            },
            {
              type: 'doc',
              id: 'api/rest/node/trash',
              label: 'Trash',
            },
            {
              type: 'doc',
              id: 'api/rest/node/restore',
              label: 'Restore',
            },
            {
              type: 'doc',
              id: 'api/rest/node/delete',
              label: 'Delete',
            },
            {
              type: 'doc',
              id: 'api/rest/node/publish',
              label: 'Publish',
            },
            {
              type: 'doc',
              id: 'api/rest/node/publish_update',
              label: 'Update published',
            },
            {
              type: 'doc',
              id: 'api/rest/node/unpublish',
              label: 'Unpublish',
            },
            {
              type: 'doc',
              id: 'api/rest/node/embed',
              label: 'Embed',
            },
            {
              type: 'doc',
              id: 'api/rest/node/unembed',
              label: 'Unembed',
            },
            {
              type: 'doc',
              id: 'api/rest/node/access',
              label: 'Share',
            },
            {
              type: 'doc',
              id: 'api/rest/node/access_update',
              label: 'Update sharing',
            },
            {
              type: 'doc',
              id: 'api/rest/node/access_revoke',
              label: 'Revoke sharing',
            },
          ]
        },
        {
          type: 'category',
          label: 'Link endpoints',
          items: [
            {
              type: 'doc',
              id: 'api/rest/link/add',
              label: 'Add',
            },
            {
              type: 'doc',
              id: 'api/rest/link/update',
              label: 'Update',
            },
            {
              type: 'doc',
              id: 'api/rest/link/swap',
              label: 'Swap',
            },
            {
              type: 'doc',
              id: 'api/rest/link/trash',
              label: 'Move to trash',
            },
            {
              type: 'doc',
              id: 'api/rest/link/restore',
              label: 'Restore',
            },
            {
              type: 'doc',
              id: 'api/rest/link/delete',
              label: 'Delete',
            },
          ]
        },
        {
          type: 'category',
          label: 'History',
          items: [
            {
              type: 'doc',
              id: 'api/rest/history/get',
              label: 'Get',
            },
            {
              type: 'doc',
              id: 'api/rest/history/undo',
              label: 'Undo',
            },
            {
              type: 'doc',
              id: 'api/rest/history/redo',
              label: 'Redo',
            },
          ]
        },
      ],
    },
    {
      type: 'category',
      label: 'WebSocket',
      items: [
        {
          type: 'doc',
          id: 'api/ws/connect',
          label: 'Connection',
        },
        {
          type: 'doc',
          id: 'api/ws/get_graph',
          label: 'Get graph',
        },
        {
          type: 'doc',
          id: 'api/ws/get_trash',
          label: 'Get trash',
        },
        {
          type: 'category',
          label: 'Node events',
          items: [
            {
              type: 'doc',
              id: 'api/ws/node/add',
              label: 'Add',
            },
            {
              type: 'doc',
              id: 'api/ws/node/update',
              label: 'Update',
            },
            {
              type: 'doc',
              id: 'api/ws/node/trash',
              label: 'Move to trash',
            },
            {
              type: 'doc',
              id: 'api/ws/node/restore',
              label: 'Restore',
            },
            {
              type: 'doc',
              id: 'api/ws/node/delete',
              label: 'Create',
            },
            {
              type: 'doc',
              id: 'api/ws/node/publish',
              label: 'Publish',
            },
            {
              type: 'doc',
              id: 'api/ws/node/publish_update',
              label: 'Update publushed',
            },
            {
              type: 'doc',
              id: 'api/ws/node/unpublish',
              label: 'Unpublish',
            },
            {
              type: 'doc',
              id: 'api/ws/node/embed',
              label: 'Embed',
            },
            {
              type: 'doc',
              id: 'api/ws/node/unembed',
              label: 'Unembed',
            },
            {
              type: 'doc',
              id: 'api/ws/node/access',
              label: 'Share',
            },
            {
              type: 'doc',
              id: 'api/ws/node/access_update',
              label: 'Update sharing',
            },
            {
              type: 'doc',
              id: 'api/ws/node/access_revoke',
              label: 'Revoke sharing',
            },
          ]
        },
        {
          type: 'category',
          label: 'Link events',
          items: [
            {
              type: 'doc',
              id: 'api/ws/link/add',
              label: 'Add',
            },
            {
              type: 'doc',
              id: 'api/ws/link/update',
              label: 'Update',
            },
            {
              type: 'doc',
              id: 'api/ws/link/swap',
              label: 'Swap',
            },
            {
              type: 'doc',
              id: 'api/ws/link/trash',
              label: 'Move to trash',
            },
            {
              type: 'doc',
              id: 'api/ws/link/restore',
              label: 'Restore',
            },
            {
              type: 'doc',
              id: 'api/ws/link/delete',
              label: 'Delete',
            },
          ]
        },
        {
          type: 'category',
          label: 'History',
          items: [
            {
              type: 'doc',
              id: 'api/ws/history/get',
              label: 'Get',
            },
            {
              type: 'doc',
              id: 'api/ws/history/undo',
              label: 'Undo',
            },
            {
              type: 'doc',
              id: 'api/ws/history/redo',
              label: 'Redo',
            },
          ]
        },
      ],
    },
  ],
};


export default sidebars;
