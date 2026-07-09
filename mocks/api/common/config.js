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
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://avatars.githubusercontent.com/u/9276835?s=400&u=c7dc09e69d8bec0b056ee69e084131b5dd81fbcd&v=4',
    name: 'Super Admin',
    userId: 1
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://avatars.githubusercontent.com/u/9276835?s=400&u=c7dc09e69d8bec0b056ee69e084131b5dd81fbcd&v=4',
    name: 'Normal Editor',
    userId: 2
  }
}
