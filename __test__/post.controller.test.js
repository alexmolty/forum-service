import {jest} from '@jest/globals'

// Prepare a mock for the service that controller depends on
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

// Mock the service module before importing the controller (ESM pattern)
jest.unstable_mockModule('../src/services/post.service.js', () => ({
  default: serviceMock,
}))

// Import controller after setting up the mock
const {default: postController} = await import('../src/controllers/post.controller.js')

// Helpers to build mock req/res/next
function createReq({params = {}, body = {}, query = {}} = {}) {
  return {params, body, query}
}

function createRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.sendStatus = jest.fn().mockReturnValue(res)
  return res
}

function createNext() {
  return jest.fn()
}

describe('PostController unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createPost → 201 and body on success', async () => {
    const req = createReq({params: {author: 'Alex'}, body: {title: 't', content: 'c'}})
    const res = createRes()
    const next = createNext()
    const created = {_id: '1', title: 't', content: 'c', author: 'Alex'}
    serviceMock.createPost.mockResolvedValueOnce(created)

    await postController.createPost(req, res, next)

    expect(serviceMock.createPost).toHaveBeenCalledWith('Alex', {title: 't', content: 'c'})
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
    expect(next).not.toHaveBeenCalled()
  })

  test('createPost → calls next(error) on service error', async () => {
    const req = createReq({params: {author: 'Alex'}, body: {title: 't'}})
    const res = createRes()
    const next = createNext()
    const err = Object.assign(new Error('Bad request'), {statusCode: 400})
    serviceMock.createPost.mockRejectedValueOnce(err)

    await postController.createPost(req, res, next)

    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
  })

  test('getPostById → 200 with found post', async () => {
    const req = createReq({params: {id: '42'}})
    const res = createRes()
    const next = createNext()
    const post = {_id: '42'}
    serviceMock.getPostById.mockResolvedValueOnce(post)

    await postController.getPostById(req, res, next)

    expect(res.json).toHaveBeenCalledWith(post)
    expect(next).not.toHaveBeenCalled()
  })

  test('getPostById → next(404) when missing', async () => {
    const req = createReq({params: {id: '99'}})
    const res = createRes()
    const next = createNext()
    const err = Object.assign(new Error('not found'), {statusCode: 404})
    serviceMock.getPostById.mockRejectedValueOnce(err)

    await postController.getPostById(req, res, next)

    expect(next).toHaveBeenCalledWith(err)
  })

  test('deletePost → 200 with deleted doc', async () => {
    const req = createReq({params: {id: 'd1'}})
    const res = createRes()
    const next = createNext()
    const deleted = {_id: 'd1'}
    serviceMock.deletePost.mockResolvedValueOnce(deleted)

    await postController.deletePost(req, res, next)
    expect(res.json).toHaveBeenCalledWith(deleted)
    expect(next).not.toHaveBeenCalled()
  })

  test('addLike → 204 on success', async () => {
    const req = createReq({params: {id: 'p1'}})
    const res = createRes()
    const next = createNext()
    serviceMock.addLike.mockResolvedValueOnce({_id: 'p1', likes: 1})

    await postController.addLike(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  test('findPostsByAuthor → 200 with list', async () => {
    const req = createReq({params: {author: 'Alex'}})
    const res = createRes()
    const next = createNext()
    const list = [{_id: '1'}, {_id: '2'}]
    serviceMock.getPostsByAuthor.mockResolvedValueOnce(list)

    await postController.findPostsByAuthor(req, res, next)
    expect(serviceMock.getPostsByAuthor).toHaveBeenCalledWith('Alex')
    expect(res.json).toHaveBeenCalledWith(list)
  })

  test('addComment → 200 with updated', async () => {
    const req = createReq({params: {id: 'p1', commenter: 'john'}, body: {message: 'hi'}})
    const res = createRes()
    const next = createNext()
    const updated = {_id: 'p1', comments: [{user: 'john', message: 'hi'}]}
    serviceMock.addComment.mockResolvedValueOnce(updated)

    await postController.addComment(req, res, next)
    expect(serviceMock.addComment).toHaveBeenCalledWith('p1', 'john', 'hi')
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  test('findPostsByTags → 200 with list', async () => {
    const req = createReq({query: {values: 'js,node'}})
    const res = createRes()
    const next = createNext()
    const list = [{_id: '1'}]
    serviceMock.findPostsByTags.mockResolvedValueOnce(list)

    await postController.findPostsByTags(req, res, next)
    expect(serviceMock.findPostsByTags).toHaveBeenCalledWith('js,node')
    expect(res.json).toHaveBeenCalledWith(list)
  })

  test('findPostsByPeriod → 200 with list', async () => {
    const req = createReq({query: {dateFrom: '2024-01-01', dateTo: '2024-01-10'}})
    const res = createRes()
    const next = createNext()
    const list = [{_id: '1'}]
    serviceMock.findPostsByPeriod.mockResolvedValueOnce(list)

    await postController.findPostsByPeriod(req, res, next)
    expect(serviceMock.findPostsByPeriod).toHaveBeenCalledWith('2024-01-01', '2024-01-10')
    expect(res.json).toHaveBeenCalledWith(list)
  })

  test('updatePost → 200 with updated doc', async () => {
    const req = createReq({params: {id: 'u1'}, body: {title: 'T'}})
    const res = createRes()
    const next = createNext()
    const updated = {_id: 'u1', title: 'T'}
    serviceMock.updatePost.mockResolvedValueOnce(updated)

    await postController.updatePost(req, res, next)
    expect(serviceMock.updatePost).toHaveBeenCalledWith('u1', {title: 'T'})
    expect(res.json).toHaveBeenCalledWith(updated)
  })
})
