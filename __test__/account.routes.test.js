import request from 'supertest'
import {jest} from '@jest/globals'

// Mock user account service used by controller
const userServiceMock = {
  register: jest.fn(),
  getUser: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
  changeRole: jest.fn(),
  changePassword: jest.fn(),
}

jest.unstable_mockModule('../src/services/userAccount.service.js', () => ({
  default: userServiceMock,
}))

// Mock authentication: default to john as authenticated user with no roles
const authMock = jest.fn((req, res, next) => {
  req.principal = {username: 'john', roles: []}
  return next()
})

jest.unstable_mockModule('../src/middlewares/authentication.middleware.js', () => ({
  default: authMock,
}))

const {default: app} = await import('../src/app.js')

describe('Account API routes (supertest)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('POST /account/register is permit-all → 201', async () => {
    const created = {login: 'john', firstName: 'John', lastName: 'D', roles: ['USER']}
    userServiceMock.register.mockResolvedValueOnce(created)
    const res = await request(app)
      .post('/account/register')
      .send({login: 'john', password: 'p', firstName: 'John', lastName: 'D'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual(created)
  })

  test('POST /account/login requires auth and returns user (200)', async () => {
    const user = {login: 'john', roles: ['USER']}
    userServiceMock.getUser.mockResolvedValueOnce(user)
    const res = await request(app).post('/account/login')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(user)
  })

  test('GET /account/user/:login requires auth (200)', async () => {
    const user = {login: 'mary', roles: ['USER']}
    userServiceMock.getUser.mockResolvedValueOnce(user)
    const res = await request(app).get('/account/user/mary')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(user)
  })

  test('PATCH /account/user/:login owner can update (200)', async () => {
    const updated = {login: 'john', firstName: 'J'}
    userServiceMock.updateUser.mockResolvedValueOnce(updated)
    const res = await request(app)
      .patch('/account/user/john')
      .send({firstName: 'J'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(updated)
  })

  test('PATCH /account/user/:login non-owner gets 403', async () => {
    const res = await request(app)
      .patch('/account/user/other')
      .send({firstName: 'X'})
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('DELETE /account/user/:login owner can delete (200)', async () => {
    const deleted = {login: 'john'}
    // deleteUser path first checks owner/admin in controller; then calls service
    userServiceMock.deleteUser.mockResolvedValueOnce(deleted)
    const res = await request(app).delete('/account/user/john')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(deleted)
  })

  test('DELETE /account/user/:login admin can delete others (200)', async () => {
    authMock.mockImplementationOnce((req, res, next) => {
      req.principal = {username: 'admin', roles: ['ADMIN']}
      return next()
    })
    const deleted = {login: 'mary'}
    userServiceMock.deleteUser.mockResolvedValueOnce(deleted)
    const res = await request(app).delete('/account/user/mary')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(deleted)
  })

  test('PATCH /account/user/:login/role/:role only admin can add role (200)', async () => {
    authMock.mockImplementationOnce((req, res, next) => {
      req.principal = {username: 'admin', roles: ['ADMIN']}
      return next()
    })
    const updated = {login: 'john', roles: ['USER', 'MODERATOR']}
    userServiceMock.changeRole.mockResolvedValueOnce(updated)
    const res = await request(app).patch('/account/user/john/role/moderator')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(updated)
  })

  test('PATCH /account/user/:login/role/:role non-admin gets 403', async () => {
    const res = await request(app).patch('/account/user/john/role/moderator')
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({code: 403})
  })

  test('DELETE /account/user/:login/role/:role only admin can delete role (200)', async () => {
    authMock.mockImplementationOnce((req, res, next) => {
      req.principal = {username: 'admin', roles: ['ADMIN']}
      return next()
    })
    const updated = {login: 'john', roles: ['USER']}
    userServiceMock.changeRole.mockResolvedValueOnce(updated)
    const res = await request(app).delete('/account/user/john/role/moderator')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(updated)
  })

  test('PATCH /account/password owner can change password (204)', async () => {
    userServiceMock.changePassword.mockResolvedValueOnce({login: 'john'})
    const res = await request(app)
      .patch('/account/password')
      .send({password: 'newPass'})
    expect(res.statusCode).toBe(204)
    expect(res.text).toBe('')
  })
})
