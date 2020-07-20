const supertest = require('supertest')
const uniqid = require('uniqid')
const faker = require('faker')
const dbHandler = require('../../datasources')
const { MONGODB_URL } = process.env
let app = null
let request = null

describe('Projects Component API E2E Test:', () => {
  let mockProject = {
    projectName: faker.name.title(),
    description: faker.name.jobDescriptor(),
    userId: null
  }

  const mockUser = {
    name: faker.name.findName(),
    phone: '09393424652',
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  let hashedCode = null
  let code = null
  let userToken = null

  beforeAll(async () => {
    await dbHandler.connect(`${MONGODB_URL}/${uniqid()}`)
    app = require('../../app').express
    request = supertest(app)
  })

  afterAll(async () => {
    await dbHandler.closeDatabase()
  })

  it('otp-check', () => {
    return request
      .post('/api/v1/auth/otp-check')
      .send({ phone: mockUser.phone })
      .expect(200)
      .then(res => {
        expect(res.body.Result.registered).toEqual(false)
        hashedCode = res.body.Result.hashedCode
        code = res.body.Result.code
      })
  })

  it('signup', () => {
    const user = { ...mockUser, hashedCode, code }
    return request
      .post('/api/v1/auth/signup')
      .send(user)
      .expect(200)
      .then(res => {
        expect(res.body.Result).toEqual(
          expect.objectContaining({
            token: expect.any(String)
          })
        )
        userToken = res.body.Result.token
      })
  })

  it('healthCheck', () => {
    const expected = { Result: 'Ok', Success: true }
    return request
      .get('/api/v1/projects/healthCheck')
      .set({ Authorization: userToken })
      .expect(200)
      .expect(res => expect(res.body).toEqual(expect.objectContaining(expected)))
  })

  it('Create a project', () => {
    return request
      .post('/api/v1/projects')
      .set({ Authorization: userToken })
      .send(mockProject)
      .expect(200)
      .expect(res => {
        expect(res.body.Result).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            projectName: expect.any(String),
            description: expect.any(String)
          })
        )
        mockProject = res.body.Result
      })
  })

  it('Get a project', () => {
    return request
      .get(`/api/v1/projects?_id=${mockProject._id}`)
      .set({ Authorization: userToken })
      .send(mockProject)
      .expect(200)
      .expect(res => {
        expect(res.body.Result.Total).toBeGreaterThanOrEqual(1)
        expect(res.body.Result.Result.length).toBeGreaterThanOrEqual(1)
      })
  })

  it('Update a project', () => {
    return request
      .put(`/api/v1/projects/${mockProject._id}`)
      .set({ Authorization: userToken })
      .send({ projectName: 'Node vs Deno' })
      .expect(200)
      .expect(res => {
        expect(res.body.Result.projectName).toEqual('Node vs Deno')
        mockProject = res.body.Result
      })
  })

  it('Remove a project', () => {
    return request
      .delete(`/api/v1/projects/${mockProject._id}`)
      .set({ Authorization: userToken })
      .expect(200)
      .then(res => expect(res.body.Result._id).toEqual(mockProject._id))
  })
})
