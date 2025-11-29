// ESM-friendly Jest mocking with dynamic import
// We mock the repository module before importing the service

import {jest} from '@jest/globals'

const repoMock = {
  createPost: jest.fn(),
  getPostById: jest.fn(),
  addLike: jest.fn(),
  getPostsByAuthor: jest.fn(),
  addComment: jest.fn(),
  deletePost: jest.fn(),
  findPostsByTags: jest.fn(),
  findPostsByPeriod: jest.fn(),
  updatePost: jest.fn(),
}

// Mock repository module
jest.unstable_mockModule('../src/repositories/post.repository.js', () => ({
  ...repoMock,
}))

// Dynamically import the service after setting up mocks
const {default: postService} = await import('../src/services/post.service.js')

describe('PostService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createPost delegates to repository and returns created post', async () => {
    const input = {title: 't', content: 'c'}
    const created = {...input, author: 'Alex', _id: '1'}
    repoMock.createPost.mockResolvedValueOnce(created)

    const result = await postService.createPost('Alex', input)

    expect(repoMock.createPost).toHaveBeenCalledWith({title: 't', content: 'c', author: 'Alex'})
    expect(result).toEqual(created)
  })

  test('getPostById returns post when found', async () => {
    const post = {_id: 'p1'}
    repoMock.getPostById.mockResolvedValueOnce(post)
    const result = await postService.getPostById('p1')
    expect(repoMock.getPostById).toHaveBeenCalledWith('p1')
    expect(result).toBe(post)
  })

  test('getPostById throws 404 when not found', async () => {
    repoMock.getPostById.mockResolvedValueOnce(null)
    await expect(postService.getPostById('nope')).rejects.toMatchObject({
      message: 'Post with id nope not found',
      statusCode: 404,
    })
  })

  test('addLike updates and returns updated doc; throws 404 if not found', async () => {
    const updated = {_id: 'x', likes: 1}
    repoMock.addLike.mockResolvedValueOnce(updated)
    await expect(postService.addLike('x')).resolves.toBe(updated)
    expect(repoMock.addLike).toHaveBeenCalledWith('x')

    repoMock.addLike.mockResolvedValueOnce(null)
    await expect(postService.addLike('missing')).rejects.toMatchObject({statusCode: 404})
  })

  test('addComment returns updated post; 404 if base post missing', async () => {
    // Not found
    repoMock.getPostById.mockResolvedValueOnce(null)
    await expect(postService.addComment('a1', 'john', 'hi')).rejects.toMatchObject({statusCode: 404})

    // Found, then add
    repoMock.getPostById.mockResolvedValueOnce({_id: 'a1'})
    const updated = {_id: 'a1', comments: [{user: 'john', message: 'hi'}]}
    repoMock.addComment.mockResolvedValueOnce(updated)
    const result = await postService.addComment('a1', 'john', 'hi')
    expect(repoMock.addComment).toHaveBeenCalledWith('a1', {user: 'john', message: 'hi'})
    expect(result).toBe(updated)
  })

  test('deletePost returns deleted post or throws 404', async () => {
    const deleted = {_id: 'z'}
    repoMock.deletePost.mockResolvedValueOnce(deleted)
    await expect(postService.deletePost('z')).resolves.toBe(deleted)
    repoMock.deletePost.mockResolvedValueOnce(null)
    await expect(postService.deletePost('missing')).rejects.toMatchObject({statusCode: 404})
  })

  test('findPostsByTags splits tags and delegates to repo', async () => {
    const posts = [{_id: '1'}]
    repoMock.findPostsByTags.mockResolvedValueOnce(posts)
    const result = await postService.findPostsByTags('a,b,c')
    expect(repoMock.findPostsByTags).toHaveBeenCalledWith(['a','b','c'])
    expect(result).toBe(posts)
  })

  test('findPostsByPeriod builds query and calls repo', async () => {
    const posts = [{_id: '1'}]
    repoMock.findPostsByPeriod.mockResolvedValueOnce(posts)
    const result = await postService.findPostsByPeriod('2024-01-01', '2024-01-02')
    expect(repoMock.findPostsByPeriod).toHaveBeenCalled()
    const arg = repoMock.findPostsByPeriod.mock.calls[0][0]
    expect(arg.$gte instanceof Date).toBe(true)
    expect(arg.$lte instanceof Date).toBe(true)
    expect(result).toBe(posts)
  })

  test('updatePost returns updated or throws 404', async () => {
    const upd = {_id: 'u1', title: 'T'}
    repoMock.updatePost.mockResolvedValueOnce(upd)
    await expect(postService.updatePost('u1', {title: 'T'})).resolves.toBe(upd)
    repoMock.updatePost.mockResolvedValueOnce(null)
    await expect(postService.updatePost('u1', {title: 'T'})).rejects.toMatchObject({statusCode: 404})
  })
})
