const request = require("supertest");
const app = require("../app.js");

describe('GET /api/users', () => {
    test('should respond with a 404 status code if given invalid endpoint', () => {
        return request(app)
        .get("/api/uzers")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Page not found")
        })
    })
});
