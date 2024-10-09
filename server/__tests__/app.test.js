const request = require("supertest");
const app = require("../app.js");
// const connectDB = require("../database/connection.js");
const seed = require("../database/seed/seed.js");
const testData = require("../database/data/test-data/index.js");
const User = require("../db-models/userModel.js");
const Event = require("../db-models/eventModel.js");

// Connect & seed db before running test suite to ensure consistent data
beforeEach(async () => {
  await seed(testData); // Seed the database with consistent data
  const user = await User.findOne();
  validUserId = user._id.toString();
  dateCreated = user.createdAt.toISOString();
  const event = await Event.findOne();
  validEventId = event._id.toString();
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
          createdAt: `${dateCreated}`,
          updatedAt: expect.any(String),
        });
        expect(user.createdEvents).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
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
          createdAt: `${dateCreated}`,
          updatedAt: expect.any(String),
        });
        expect(user.createdEvents).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
      });
  });
});

describe("POST /api/users", () => {
  test("should respond with 400 status and error message when required fields are missing", () => {
    const invalidUserData = {
      email: "invalidUser@email.com",
    };

    return request(app)
      .post("/api/users")
      .send(invalidUserData)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 201 status and return newly created user for valid data", () => {
    const validUserData = {
      name: "Valid User",
      email: "validuser@email.com",
      password: "securepassword123",
      role: "member",
    };

    return request(app)
      .post("/api/users")
      .send(validUserData)
      .expect(201)
      .then((response) => {
        const { user } = response.body;
        expect(user).toEqual(expect.any(Object));
        expect(user.name).toBe(validUserData.name);
        expect(user.email).toBe(validUserData.email);
        expect(user.role).toBe(validUserData.role);
      });
  });
});

describe("DELETE /api/users/:user_id", () => {
  test("should respond with 404 status when given non-existent id", () => {
    return request(app)
      .delete("/api/users/66feec40084c536f65f2e987")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User Not Found");
      });
  });

  test("should respond with 400 status when given invalid id", () => {
    return request(app)
      .delete("/api/users/invalid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 204 status when user is deleted (no return)", () => {
    return request(app).delete(`/api/users/${validUserId}`).expect(204);
  });
});

describe("GET /api/events", () => {
  test("should respond with an array of expected length", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(events).toBeInstanceOf(Array);
        expect(events).toHaveLength(4);
      });
  });

  test("should respond with an event object with expected properties", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(events).toHaveLength(4);
        events.forEach((event) => {
          expect(event).toMatchObject({
            _id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            location: expect.any(String),
            date: expect.any(String),
            startTime: expect.any(String),
            endTime: expect.any(String),
            createdBy: expect.any(String),
            price: expect.any(Number),
            attendees: expect.any(Array),
            isPaid: expect.any(Boolean),
            tags: expect.any(Array),
          });
        });
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("should respond with 404 status and error message with valid non-existent event id", () => {
    return request(app)
      .get("/api/events/66feec40084c536f65f2e987")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event Not Found");
      });
  });

  test("should respond with 400 status and error message with invalid event id", () => {
    return request(app)
      .get("/api/events/invalid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status and event data for valid event id", () => {
    return request(app)
      .get(`/api/events/${validEventId}`)
      .expect(200)
      .then((response) => {
        const { event } = response.body;
        expect(event).toEqual(expect.any(Object));
        expect(event._id).toBe(validEventId);
      });
  });
});

describe("PATCH /api/events/:event_id", () => {
  test("should respond with a 404 status with non-existent event id", () => {
    return request(app)
      .patch("/api/events/66feec40084c536f65f2e987")
      .send({ title: "neweventtitle" })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Event Not Found");
      });
  });

  test("should respond with a 400 status code if event id is invalid", () => {
    return request(app)
      .patch("/api/events/invalid-id")
      .send({ title: "neweventtitle" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status code and return updated event with nothing else changing", () => {
    return request(app)
      .patch(`/api/events/${validEventId}`)
      .send({ title: "Happy Hour at Local Bar" })
      .expect(200)
      .then((response) => {
        const { event } = response.body;
        expect(event).toMatchObject({
          _id: `${validEventId}`,
          title: "Happy Hour at Local Bar",
          description:
            "Join us for a relaxing community yoga session to improve your flexibility and mental clarity.",
          location: "Central Park, New York",
          date: "2024-11-10T00:00:00.000Z",
          startTime: "2024-11-10T09:00:00.000Z",
          endTime: "2024-11-10T10:30:00.000Z",
          createdBy: `${validUserId}`,
          price: 0,
          attendees: [],
          isPaid: false,
          tags: ["yoga", "health", "community"],
        });
      });
  });

  test("should return unchanged event object if no changes are made", () => {
    return request(app)
      .patch(`/api/events/${validEventId}`)
      .send({})
      .expect(200)
      .then((response) => {
        const { event } = response.body;
        expect(event).toMatchObject({
          _id: `${validEventId}`,
          title: "Community Yoga",
          description:
            "Join us for a relaxing community yoga session to improve your flexibility and mental clarity.",
          location: "Central Park, New York",
          date: "2024-11-10T00:00:00.000Z",
          startTime: "2024-11-10T09:00:00.000Z",
          endTime: "2024-11-10T10:30:00.000Z",
          createdBy: `${validUserId}`,
          price: 0,
          attendees: [],
          isPaid: false,
          tags: ["yoga", "health", "community"],
        });
      });
  });
});

describe("POST /api/events", () => {
  test("should respond with 400 status and error message when required fields are missing", () => {
    const invalidEventData = {
      title: "Best Event Ever",
    };

    return request(app)
      .post("/api/events")
      .send(invalidEventData)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 201 status and return newly created event for valid data", () => {
    const validEventData = {
      title: "Valid and Exciting Event",
      description: "This is a test description",
      location: "On Venus",
      date: new Date("3000-10-04").toISOString(),
      startTime: new Date().toISOString(),
      createdBy: `${validUserId}`,
    };

    return request(app)
      .post("/api/events")
      .send(validEventData)
      .expect(201)
      .then((response) => {
        const { event } = response.body;
        expect(event).toEqual(expect.any(Object));
        expect(event.title).toBe(validEventData.title);
        expect(event.description).toBe(validEventData.description);
        expect(event.location).toBe(validEventData.location);
        expect(event.date).toBe(validEventData.date);
        expect(event.startTime).toBe(validEventData.startTime);
        expect(event.createdBy).toBe(validEventData.createdBy);
      });
  });
});

describe("DELETE /api/events/:event_id", () => {
  test("should respond with 404 status when given non-existent id", () => {
    return request(app)
      .delete("/api/events/66feec40084c536f65f2e987")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event Not Found");
      });
  });

  test("should respond with 400 status when given invalid id", () => {
    return request(app)
      .delete("/api/events/invalid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should respond with 204 status when user is deleted (no return)", () => {
    return request(app).delete(`/api/events/${validEventId}`).expect(204);
  });
});

describe.only("GET TicketMaster events /api/tikcetmaster/events", () => {
  test("should respond with TicketMaster event object", () => {
    return request(app)
      .get("/api/ticketmaster/events")
      .expect(200)
      .then((response) => {
        const {events} = response.body
        expect(events).toBeInstanceOf(Array)
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
