import request from 'supertest'
import {jest} from '@jest/globals'

// Mock the service module used by controllers before importing the app
const serviceMock = {
  createPost: jest.fn(),
  getPostById: jest.fn(),
  deletePost: jest.fn(),
  addLike: jest.fn(),
  getPostsByAuthor: jest.fn(),
  addComment: jest.fn(),
  findPostsByTags: jest.fn(),
  findPostsByPeriod: jest.fn(),
  updatePost: jest.fn(),
}

jest.unstable_mockModule('../src/services/post.service.js', () => ({
  default: serviceMock,
}))

// Mock authentication to simulate an authenticated user by default
const authMock = jest.fn((req, res, next) => {
  // default authenticated principal
  req.principal = {username: 'Alex', roles: []}
  return next()
})

jest.unstable_mockModule('../src/middlewares/authentication.middleware.js', () => ({
  default: authMock,
}))

// Import app after mocks are in place
const {default: app} = await import('../src/app.js')

describe('Forum API routes (supertest)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('POST /forum/post/:author creates a post (201)', async () => {
    const created = {_id: '1', title: 't', content: 'c', author: 'Alex'}
    serviceMock.createPost.mockResolvedValueOnce(created)

    const res = await request(app)
      .post('/forum/post/Alex')
      .send({title: 't', content: 'c'})

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual(created)
    expect(serviceMock.createPost).toHaveBeenCalledWith('Alex', {title: 't', content: 'c'})
  })

  test('POST /forum/post/:author by non-owner returns 403', async () => {
    // principal is Alex by default, but path author is John → should be forbidden
    const res = await request(app)
      .post('/forum/post/John')
      .send({title: 't', content: 'c'})
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('POST /forum/post/:author validation error (400)', async () => {
    const res = await request(app)
      .post('/forum/post/Alex')
      .send({title: 'only-title'}) // missing content

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({code: 400, error: 'Bad request'})
  })

  test('GET /forum/post/:id returns post (200)', async () => {
    const post = {_id: '42'}
    serviceMock.getPostById.mockResolvedValueOnce(post)
    const res = await request(app).get('/forum/post/42')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(post)
  })

  test('GET /forum/post/:id not found (404 via service error)', async () => {
    const err = new Error('Post with id 99 not found')
    err.statusCode = 404
    serviceMock.getPostById.mockRejectedValueOnce(err)
    const res = await request(app).get('/forum/post/99')
    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({code: 404, error: 'Not found'})
  })

  test('PATCH /forum/post/:id/like returns 204', async () => {
    serviceMock.addLike.mockResolvedValueOnce({_id: '10', likes: 1})
    const res = await request(app).patch('/forum/post/10/like')
    expect(res.statusCode).toBe(204)
    expect(res.text).toBe('')
  })

  test('DELETE /forum/post/:id by moderator allowed (200)', async () => {
    // Set principal as moderator and mock original author as someone else
    authMock.mockImplementationOnce((req, _res, next) => {
      req.principal = {username: 'Mod', roles: ['MODERATOR']}
      return next()
    })
    serviceMock.getPostById.mockResolvedValueOnce({author: 'Other'})
    const deleted = {_id: '55'}
    serviceMock.deletePost.mockResolvedValueOnce(deleted)
    const res = await request(app).delete('/forum/post/55')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(deleted)
  })

  test('DELETE /forum/post/:id by non-owner non-moderator → 403', async () => {
    serviceMock.getPostById.mockResolvedValueOnce({author: 'Other'})
    const res = await request(app).delete('/forum/post/56')
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('PATCH /forum/post/:id non-owner → 403', async () => {
    serviceMock.getPostById.mockResolvedValueOnce({author: 'Other'})
    const res = await request(app).patch('/forum/post/77').send({title: 'x'})
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('PATCH /forum/post/:id/comment/:commenter wrong user → 403', async () => {
    // principal default is Alex; commenter is John → forbidden
    const res = await request(app)
      .patch('/forum/post/88/comment/John')
      .send({message: 'hi'})
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('GET /forum/posts/author/:author is permit-all (no auth) → 200', async () => {
    // For this test, temporarily simulate unauthenticated request by clearing principal in middleware
    authMock.mockImplementationOnce((req, _res, next) => {
      // Do not set req.principal because /forum/posts/* should be permit-all
      return next()
    })
    const list = [{_id: '1'}]
    serviceMock.getPostsByAuthor.mockResolvedValueOnce(list)
    const res = await request(app).get('/forum/posts/author/John')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(list)
  })

  test('Unknown route returns JSON 404 from error middleware', async () => {
    const res = await request(app).get('/unknown')
    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({code: 404, error: 'Not found'})
  })
})
