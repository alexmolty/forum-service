import request from 'supertest'
import {jest} from '@jest/globals'

// Use real authentication middleware but mock the User model methods it relies on
const userFindByIdMock = jest.fn()

jest.unstable_mockModule('../src/models/user.js', () => ({
  default: { findById: userFindByIdMock },
}))

// Mock controllers/services used by routes so we can isolate middleware behavior
// Post service needs minimal stubs
const postServiceMock = {
  getPostsByAuthor: jest.fn().mockResolvedValue([]),
  getPostById: jest.fn().mockResolvedValue({}),
  addLike: jest.fn().mockResolvedValue({}),
  createPost: jest.fn().mockResolvedValue({}),
  addComment: jest.fn().mockResolvedValue({}),
  findPostsByTags: jest.fn().mockResolvedValue([]),
  findPostsByPeriod: jest.fn().mockResolvedValue([]),
  updatePost: jest.fn().mockResolvedValue({}),
  deletePost: jest.fn().mockResolvedValue({}),
}

jest.unstable_mockModule('../src/services/post.service.js', () => ({
  default: postServiceMock,
}))

// User account service minimal mocks
const userServiceMock = {
  register: jest.fn().mockResolvedValue({}),
  getUser: jest.fn().mockResolvedValue({}),
}

jest.unstable_mockModule('../src/services/userAccount.service.js', () => ({
  default: userServiceMock,
}))

// Now import app with real authentication middleware
const {default: app} = await import('../src/app.js')

function basic(login, password) {
  const token = Buffer.from(`${login}:${password}`).toString('base64')
  return `Basic ${token}`
}

describe('Authentication middleware (integration behavior)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Protected route without Authorization returns 401', async () => {
    // Any protected route, e.g., GET /forum/post/1
    const res = await request(app).get('/forum/post/1')
    expect(res.statusCode).toBe(401)
    expect(res.body).toMatchObject({code: 401})
  })

  test('Permit-all route /account/register works without auth', async () => {
    const res = await request(app)
      .post('/account/register')
      .send({login: 'a', password: 'p', firstName: 'A', lastName: 'B'})
    expect(res.statusCode).toBe(201)
  })

  test('Permit-all forum list route /forum/posts/author/:author works without auth', async () => {
    const res = await request(app).get('/forum/posts/author/someone')
    expect(res.statusCode).toBe(200)
  })

  test('Protected route with valid Basic passes (200)', async () => {
    // Mock a user record with matching password
    userFindByIdMock.mockResolvedValueOnce({
      roles: ['USER'],
      comparePassword: async (p) => p === 'secret',
    })
    const res = await request(app)
      .get('/forum/post/2')
      .set('Authorization', basic('john', 'secret'))
    expect(res.statusCode).toBe(200)
  })

  test('Protected route with invalid Basic returns 401', async () => {
    userFindByIdMock.mockResolvedValueOnce({
      roles: ['USER'],
      comparePassword: async () => false,
    })
    const res = await request(app)
      .get('/forum/post/3')
      .set('Authorization', basic('john', 'wrong'))
    expect(res.statusCode).toBe(401)
  })
})
