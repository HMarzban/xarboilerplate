const jwtJsDecode = require("jwt-js-decode")
const supertest = require("supertest")
const uniqid = require("uniqid")
const faker = require("faker")
const dbHandler = require("../../datasources")
const { MONGODB_URL } = process.env
let app = null
let request = null

describe("Tasks Component API E2E Test:", () => {
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

	const mockUser1 = {
		name: faker.name.findName(),
		phone: "09393424651",
		userName: faker.internet.userName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	}

	const mockUser2 = {
		name: faker.name.findName(),
		phone: "09393424652",
		userName: faker.internet.userName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	}

	let userToken1 = null
	let userToken2 = null

	beforeAll(async () => {
		await dbHandler.connect(`${MONGODB_URL}/${uniqid()}`)
		app = require("../../app").express
		request = supertest(app)
	})

	afterAll(async () => {
		await dbHandler.closeDatabase()
	})

	it("suignup users", async done => {
		const check1 = await request.post("/api/v1/auth/otp-check").send({ phone: mockUser1.phone })
		expect(check1.status).toBe(200)
		expect(check1.body.Result.registered).toEqual(false)

		const check2 = await request.post("/api/v1/auth/otp-check").send({ phone: mockUser2.phone })
		expect(check2.status).toBe(200)
		expect(check2.body.Result.registered).toEqual(false)

		const user1 = {
			...mockUser1,
			hashedCode: check1.body.Result.hashedCode,
			code: check1.body.Result.code,
		}
		const signup1 = await request.post("/api/v1/auth/signup").send(user1)
		expect(signup1.body.Result).toEqual(expect.objectContaining({ token: expect.any(String) }))
		userToken1 = signup1.body.Result.token

		const user2 = {
			...mockUser2,
			hashedCode: check2.body.Result.hashedCode,
			code: check2.body.Result.code,
		}
		const signup2 = await request.post("/api/v1/auth/signup").send(user2)
		expect(signup2.body.Result).toEqual(expect.objectContaining({ token: expect.any(String) }))
		userToken2 = signup2.body.Result.token

		done()
	})

	it("Create a project", () => {
		return request
			.post("/api/v1/projects")
			.set({ Authorization: userToken1 })
			.send(mockProject)
			.expect(200)
			.expect(res => {
				expect(res.body.Result).toEqual(
					expect.objectContaining({
						_id: expect.any(String),
						projectName: expect.any(String),
						description: expect.any(String),
					}),
				)
				mockProject = res.body.Result
			})
	})

	it("Create a tasks", () => {
		return request
			.post(`/api/v1/tasks/project/${mockProject._id}`)
			.set({ Authorization: userToken1 })
			.send(mockTask)
			.expect(200)
			.expect(res => {
				expect(res.body.Result.projectId).toEqual(mockProject._id)
				expect(res.body.Result.state).toEqual("pending")
				mockTask = res.body.Result
			})
	})

	it("Assign a task to user", () => {
		const jwt = jwtJsDecode.jwtDecode(userToken2)
		return request
			.put(`/api/v1/tasks/${mockTask._id}`)
			.set({ Authorization: userToken1 })
			.send({ userAssignment: { name: jwt.payload.name, _id: jwt.payload._id } })
			.expect(200)
			.expect(res => {
				expect(res.body.Result._id).toEqual(mockTask._id)
				expect(res.body.Result.userAssignment._id).toEqual(jwt.payload._id)
			})
	})

	it("Get a tasks", () => {
		return request
			.get(`/api/v1/tasks/${mockTask._id}`)
			.set({ Authorization: userToken1 })
			.expect(200)
			.expect(res => {
				expect(res.body.Result.projectId).toEqual(mockTask.projectId)
				expect(res.body.Result.state).toEqual("pending")
			})
	})

	it("Fetch all Tasks", () => {
		return request
			.get(`/api/v1/tasks/project/${mockProject._id}`)
			.set({ Authorization: userToken1 })
			.expect(200)
			.expect(res => {
				expect(res.body.Result.Total).toBeGreaterThanOrEqual(1)
				expect(res.body.Result.Result.length).toBeGreaterThanOrEqual(1)
			})
	})

	it("auth middelware check", () => {
		return request
			.delete(`/api/v1/tasks/${mockTask._id}`)
			.expect(403)
			.then(res => expect(res.body.message).toEqual("Auth token required"))
	})

	it("Remove a task", () => {
		return request
			.delete(`/api/v1/tasks/${mockTask._id}`)
			.set({ Authorization: userToken1 })
			.expect(200)
			.then(res => expect(res.body.Result._id).toEqual(mockTask._id))
	})
})
