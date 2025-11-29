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

  test('Unknown route returns JSON 404 from error middleware', async () => {
    const res = await request(app).get('/unknown')
    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({code: 404, error: 'Not found'})
  })
})
