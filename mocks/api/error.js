import { HttpResponse } from 'msw'

export default [
  {
    path: '/test/error/:status',
    method: 'get',
    handler: (res) => {
      // 这里是路径上的 :status
      const {status} = res.params 
      // 这里是params上的 status
      // const url = new URL(res.request.url)
      // const status = url.searchParams.get('status')
      return new HttpResponse(null, { status })
    }
  },
  
];
