const request = require("supertest");
const app = require("../app.js");
const connectDB = require("../database/connection.js");
const seed = require("../database/seed/seed.js");
const testData = require("../database/data/test-data/index.js");

// Connect to the database before all tests
beforeAll(async () => {
  await connectDB();
});

// Seed the database before each test
beforeEach(async () => {
  await seed(testData);
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

describe('GET /api/users/:user_id', () => {
    test('should respond with 404 status and error message with non-existent user id', () => {
        return request(app)
        .get("/api/users/66feec40084c536f65f2e987")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("User Not Found")
        })
    });

    test('should respond with 400 status and error message with invalid user id', () => {
        return request(app)
        .get("/api/users/invalid-id")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    });

    // test('should respond with single user object', () => {
    //     return request(app).get("/api/users/")
    // }); TBC <----------------
    
    
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
