const request = require("supertest");
const app = require("../app.js");
const connectDB = require("../database/connection.js");
const seed = require("../database/seed/seed.js");
const testData = require("../database/data/test-data/index.js");
const User = require("../db-models/userModel.js");

// Connect & seed db before running test suite to ensure consistent data
beforeEach(async () => {
  await seed(testData); // Seed the database with consistent data
  const user = await User.findOne();
  validUserId = user._id.toString();
  dateCreated = user.createdAt.toISOString();
  // updatedUserTime = user.updatedAt.toISOString();
});

// Close the database connection after all tests have completed
afterAll(async () => {
  await require("mongoose").disconnect(); // Disconnect after all tests are done
});

describe("GET /api/users", () => {
  test("should respond with an array of expected length", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(3);
      });
  });

  test("each user object should have expected properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(3);
        users.forEach((user) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            name: expect.any(String),
            avatar: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            role: expect.any(String),
            attendingEvents: expect.any(Array),
            createdEvents: expect.any(Array),
            // _v: expect.any(Date),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:user_id", () => {
  test("should respond with 404 status and error message with valid non-existent user id", () => {
    return request(app)
      .get("/api/users/66feec40084c536f65f2e987")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User Not Found");
      });
  });

  test("should respond with 400 status and error message with invalid user id", () => {
    return request(app)
      .get("/api/users/invalid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status and user data for valid user id", () => {
    return request(app)
      .get(`/api/users/${validUserId}`)
      .expect(200)
      .then((response) => {
        const { user } = response.body;
        expect(user).toEqual(expect.any(Object));
        expect(user._id).toBe(validUserId);
      });
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("should respond with a 404 status with non-existent user id", () => {
    return request(app)
      .patch("/api/users/66feec40084c536f65f2e987")
      .send({ name: "newusername" })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("User Not Found");
      });
  });

  test("should respond with a 400 status code if user id is invalid", () => {
    return request(app)
      .patch("/api/users/invalid-id")
      .send({ name: "newusername" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status code and return updated user with nothing else changing", () => {
    return request(app)
      .patch(`/api/users/${validUserId}`)
      .send({ name: "newusername" })
      .expect(200)
      .then((response) => {
        const { user } = response.body;
        expect(user).toMatchObject({
          _id: `${validUserId}`,
          name: "newusername",
          avatar:
            "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          email: "qwerty@email.com",
          password: "abc123",
          role: "staff",
          attendingEvents: [],
          createdEvents: [],
          createdAt: `${dateCreated}`,
          updatedAt: expect.any(String),
        });
      });
  });

  test("should return unchanged user object if no changes are made", () => {
    return request(app)
      .patch(`/api/users/${validUserId}`)
      .send({})
      .expect(200)
      .then((response) => {
        const { user } = response.body;
        expect(user).toMatchObject({
          _id: `${validUserId}`,
          name: "staffuser",
          avatar:
            "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          email: "qwerty@email.com",
          password: "abc123",
          role: "staff",
          attendingEvents: [],
          createdEvents: [],
          createdAt: `${dateCreated}`,
          updatedAt: expect.any(String),
        });
      });
  });
});

describe("GET Invalid endpoints /api/*", () => {
  test("should return 404 and error message if given invalid endpoint", () => {
    return request(app)
      .get("/api/wrongendpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Page Not Found");
      });
  });
});
