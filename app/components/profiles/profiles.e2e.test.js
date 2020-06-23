const jwtJsDecode = require("jwt-js-decode")
const supertest = require("supertest")
const uniqid = require("uniqid")
const faker = require("faker")
const dbHandler = require("../../datasources")
const { MONGODB_URL } = process.env
let app = null
let request = null

describe("Profile Component API E2E Test:", () => {
	const mockUser = {
		name: faker.name.findName(),
		phone: "09393424652",
		userName: faker.internet.userName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	}

	let mockProject = {
		projectName: faker.name.title(),
		description: faker.name.jobDescriptor(),
		userId: null,
	}

	let mockTask = {
		title: faker.name.title(),
		projectId: null,
		content: faker.name.jobDescriptor(),
		userAssignment: null,
	}

	let hashedCode = null
	let code = null
	let userToken = null

	beforeAll(async () => {
		await dbHandler.connect(`${MONGODB_URL}/${uniqid()}`)
		app = require("../../app").express
		request = supertest(app)
	})

	afterAll(async () => {
		await dbHandler.closeDatabase()
	})

	it("otp-check", () => {
		return request
			.post("/api/v1/auth/otp-check")
			.send({ phone: mockUser.phone })
			.expect(200)
			.then(res => {
				expect(res.body.Result.registered).toEqual(false)
				hashedCode = res.body.Result.hashedCode
				code = res.body.Result.code
			})
	})

	it("signup", () => {
		const user = { ...mockUser, hashedCode, code }
		return request
			.post("/api/v1/auth/signup")
			.send(user)
			.expect(200)
			.then(res => {
				expect(res.body.Result).toEqual(
					expect.objectContaining({
						token: expect.any(String),
					}),
				)
				userToken = res.body.Result.token
			})
	})

	it("Create a project & tasks", async done => {
		const resProject = await request
			.post("/api/v1/projects")
			.set({ Authorization: userToken })
			.send(mockProject)
		mockProject = resProject.body.Result

		const resTask = await request
			.post(`/api/v1/tasks/project/${mockProject._id}`)
			.set({ Authorization: userToken })
			.send(mockTask)
		mockTask = resTask.body.Result

		done()
	})

	it("healthCheck", () => {
		const expected = { Result: "Ok", Success: true }
		return request
			.get("/api/v1/profiles/healthCheck")
			.set({ Authorization: userToken })
			.expect(200)
			.expect(res => expect(res.body).toEqual(expect.objectContaining(expected)))
	})

	it("Getting profile data", () => {
		return request
			.get("/api/v1/profiles")
			.set({ Authorization: userToken })
			.expect(200)
			.then(res => {
				expect(res.body.Result).toEqual(
					expect.objectContaining({
						profile: expect.any(Object),
						tasks: expect.any(Array),
						projects: expect.any(Array),
					}),
				)
			})
	})

	it("Update a user profile", () => {
		return request
			.put(`/api/v1/profiles`)
			.set({ Authorization: userToken })
			.send({ name: "jojo" })
			.expect(200)
			.then(res => expect(res.body.Result.name).toEqual("jojo"))
	})

	it("Remove a user profile", () => {
		const jwt = jwtJsDecode.jwtDecode(userToken)
		return request
			.delete(`/api/v1/profiles`)
			.set({ Authorization: userToken })
			.expect(200)
			.then(res => expect(res.body.Result._id).toEqual(jwt.payload._id))
	})
})
