import { HttpResponse } from 'msw'

export default [
  {
    path: '/404',
    method: 'get',
    handler: () => {
      return new HttpResponse(null, { status: 404 })
    }
  },
  {
    path: '/500',
    method: 'get',
    handler: () => {
      return new HttpResponse(null, { status: 500 })
    }
  },
];
