import {
  setupWorker
} from 'msw/browser'
import handlers from './handlers';
// console.log(handlers)
const worker = new setupWorker();
worker.use(...handlers)
// worker.events.on('request:start', ({
//   requestId,
//   request
// }) => {
//   const url = new URL(request.url)
//   if (url.pathname.includes('/dev-api')) {
//     console.log('Outgoing:', request.method, request.url, requestId)
//   }
// })
export {
  worker
};
