import {
  response
} from './response.js'
// import { faker } from "@faker-js/faker/locale/zh_CN";
import {
  faker
} from "@faker-js/faker";

import {
  users
} from './config.js'
import {
  formatTime
} from '@/core/utils/index.js'

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    author: faker.internet.username(), // before version 9.1.0, use userName()

    title: faker.word.words({
      // count: {
      //   min: 5,
      //   max: 10
      // }
    }),
    status: faker.helpers.arrayElement(['published', 'draft', 'deleted']),
    display_time: formatTime('yyyy-MM-dd hh:mm:ss', faker.date.anytime({
      refDate: '2020-01-01T00:00:00.000Z'
    })), // '2020-12-13T22:45:10.252Z'
    pageviews: faker.number.int({
      max: 5000
    }),

    avatar: faker.image.avatar(),
    // registeredAt: faker.date.past(),
  };
}

const list = faker.helpers.multiple(createRandomUser, {
  count: 30,
});

export default [{
  path: '/table/list',
  type: 'get',
  handler: async ({
    request
  }) => {
    const token = request.headers.get('token')
    const info = users[token]

    // mock error
    if (!info) {
      return response({
        status: -1,
      })
    }

    return response({
      body: {
        items: list,
        total: list.length,
      }
    })
  }
}, ]
