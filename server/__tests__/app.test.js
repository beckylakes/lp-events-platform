const request = require("supertest");
const app = require("../app.js");
const connectDB = require("../database/connection.js");
const seed = require("../database/seed/seed.js");
const testData = require("../database/data/test-data/index.js");

beforeAll(async () => {
  await connectDB(); // Connect to the database before all tests
});

// Seed the database before each test to have a fresh state
beforeEach(async () => {
  await seed(testData);
});

// Close the database connection after all tests have completed
afterAll(async () => {
  await require("mongoose").disconnect(); // Disconnect after all tests are done
});

describe("GET /api/users", () => {
  test("should respond with a 404 status code if given invalid endpoint", () => {
    return request(app)
      .get("/api/uzers")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Page not found");
      });
  });

//   describe("GET /api/users", () => {
//     test("should respond with an array of user objects", () => {
//       return request(app)
//         .get("/api/users")
//         .expect(200)
//         .then((response) => {
//           expect(response.body.users).toBeInstanceOf(Array);
//           expect(response.body.users.length).toBeGreaterThan(0);
//           response.body.users.forEach((user) => {
//             expect(user).toEqual(
//               expect.objectContaining({
//                 name: expect.any(String),
//                 email: expect.any(String),
//                 role: expect.any(String),
//               })
//             );
//           });
//         });
//     });
//   });
});
