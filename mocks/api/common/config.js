export const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

export const users = {
  'admin-token': {
    introduction: 'I am a super administrator',
    avatar: 'https://avatars.githubusercontent.com/u/9276835?s=400&u=c7dc09e69d8bec0b056ee69e084131b5dd81fbcd&v=4',
    name: 'Super Admin',
    userId: 1
  },
  'editor-token': {
    introduction: 'I am an editor',
    avatar: 'https://avatars.githubusercontent.com/u/9276835?s=400&u=c7dc09e69d8bec0b056ee69e084131b5dd81fbcd&v=4',
    name: 'Normal Editor',
    userId: 2
  }
} 

// routes 为动态路由预留字段
export const permissions = {
  'admin-token': {
    roles: ['admin'],
    permissions: ['example:create', 'example:edit', 'example:delete', 'example:view'],
    routes: [],
  },
  'editor-token': {
    roles: ['editor'],
    permissions: ['example:create', 'example:edit', 'example:view'],
    routes: [],
  },
}