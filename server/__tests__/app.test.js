const request = require("supertest");
const app = require("../app.js");
const bcrypt = require("bcrypt");
const seed = require("../database/seed/seed.js");
const testData = require("../database/data/test-data/index.js");
const User = require("../db-models/userModel.js");
const Event = require("../db-models/eventModel.js");

beforeAll(async () => {
  await seed(testData);
  const user = await User.findOne();
  validUserId = user._id.toString();
  dateCreated = user.createdAt.toISOString();
  const event = await Event.findOne();
  validEventId = event._id.toString();
  // updatedUserTime = user.updatedAt.toISOString();
});

afterAll(async () => {
  await require("mongoose").disconnect();
});

describe("GET /api/users", () => {
  test("should respond with an array of expected length", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(2);
      });
  });

  test("each user object should have expected properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(2);
        users.forEach((user) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: expect.any(String),
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
      .send({ username: "newusername" })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("User Not Found");
      });
  });

  test("should respond with a 400 status code if user id is invalid", () => {
    return request(app)
      .patch("/api/users/invalid-id")
      .send({ username: "newusername" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status code and return updated user with nothing else changing", () => {
    return request(app)
      .patch(`/api/users/${validUserId}`)
      .send({ username: "newusername" })
      .expect(200)
      .then((response) => {
        const { user } = response.body;
        expect(user).toMatchObject({
          _id: `${validUserId}`,
          username: "newusername",
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
          username: "newusername",
          avatar:
            "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          email: "qwerty@email.com",
          password: "abc123",
          role: "staff",
          attendingEvents: [],
          createdEvents: expect.any(Array),
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

  test("should return 400 when the email is already in use", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "random@email.com",
        password: "password123",
        username: "Another User",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Sorry! That email is already taken");
      });
  });

  test("should respond with 201 status and return newly created user for valid data", () => {
    const validUserData = {
      username: "Valid User",
      email: "validuser@email.com",
      password: "securepassword123",
      role: "member",
    };

    return request(app)
      .post("/api/users")
      .send(validUserData)
      .expect(201)
      .then((response) => {
        const { user, msg } = response.body;
        expect(msg).toBe("New user created");
        expect(user).toEqual(expect.any(Object));
        expect(user.username).toBe(validUserData.username);
        expect(user.email).toBe(validUserData.email);
        expect(user.role).toBe(validUserData.role);
      });
  });
});

describe("POST /api/users/login", () => {
  test("should return 401 when the email is incorrect", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "wrong@email.com",
        password: "bca123",
      })
      .expect(401)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Sorry! That user doesn't exist");
      });
  });

  test("should return 401 when the password is incorrect", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "random@email.com",
        password: "wrong123",
      })
      .expect(401)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Sorry! That password is incorrect");
      });
  });

  test("should return 200 and a success message on valid login", async () => {
    const hashedPassword = await bcrypt.hash("bca123", 12);
    await User.create({
      email: "extra@email.com",
      password: hashedPassword,
      username: "randomuser",
      role: "member",
    });

    return request(app)
      .post("/api/users/login")
      .send({
        email: "extra@email.com",
        password: "bca123",
      })
      .expect(200)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Logged in successfully");
      });
  });
});

describe("POST /api/users/:user_id/attend", () => {
  test("should return 400 and error message with invalid event id", () => {
    return request(app)
      .post(`/api/users/${validUserId}/attend`)
      .send({ eventId: "invalidId1234" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should return 201 and message with valid event id and update user with new attendance array", () => {
    return request(app)
      .post(`/api/users/${validUserId}/attend`)
      .send({ eventId: validEventId })
      .expect(201)
      .then((response) => {
        const { user, msg } = response.body;
        expect(msg).toBe("You're going to this event!");
        expect(user).toBeInstanceOf(Object);
        expect(user._id).toBe(validUserId);
        expect(user.email).toBe("qwerty@email.com");
        expect(user.attendingEvents).toEqual([`${validEventId}`]);
      });
  });

  test("should return 400 and message with valid event id without changing attendance array if user already is attending", () => {
    return request(app)
      .post(`/api/users/${validUserId}/attend`)
      .send({ eventId: validEventId })
      .expect(400)
      .then((response) => {
        const { user, msg } = response.body;
        expect(msg).toBe("You're already attending this event!");
        expect(user).toBeInstanceOf(Object);
        expect(user._id).toBe(validUserId);
        expect(user.email).toBe("qwerty@email.com");
        expect(user.attendingEvents).toHaveLength(1);
        expect(user.attendingEvents).toEqual([`${validEventId}`]);
      });
  });
});

describe("POST /api/users/:user_id/ticketmaster/attend", () => {
  test("should return 404 if the user is not found (non-existent id)", () => {
    return request(app)
      .post(`/api/users/670d46b52000794ef12446a1/ticketmaster/attend`)
      .send({ eventId: validEventId })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("User Not Found");
      });
  });

  test("should return 400 if the user is not found (invalid id)", () => {
    return request(app)
      .post(`/api/users/invalidUserId/ticketmaster/attend`)
      .send({ eventId: validEventId })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should return 201 and update user with valid event ID", () => {
    return request(app)
      .post(`/api/users/${validUserId}/ticketmaster/attend`)
      .send({ eventId: "vvG1fZ9MD144Ni" })
      .expect(201)
      .then((response) => {
        const { user, msg } = response.body;
        expect(msg).toBe("You're going to this event!");
        expect(user).toBeInstanceOf(Object);
        expect(user._id).toBe(validUserId);
        expect(user.email).toBe("qwerty@email.com");
        expect(user.attendingEvents).not.toHaveLength(0);
      });
  });

  test("should return 400 if the user is already attending the event", () => {
    return request(app)
      .post(`/api/users/${validUserId}/ticketmaster/attend`)
      .send({ eventId: "vvG1fZ9MD144Ni" })
      .expect(400)
      .then((response) => {
        const { user, msg } = response.body;
        expect(msg).toBe("You're already attending this event!");
        expect(user).toBeInstanceOf(Object);
        expect(user._id).toBe(validUserId);
        expect(user.attendingEvents).toHaveLength(2);
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
        expect(events).toHaveLength(5);
      });
  });

  test("should respond with an event object with expected properties", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(events).toHaveLength(5);
        events.forEach((event) => {
          expect(event).toMatchObject({
            _id: expect.any(String),
            name: expect.any(String),
            info: expect.any(String),
            location: expect.any(String),
            date: expect.any(String),
            startTime: expect.any(String),
            price: expect.any(Number),
            attendees: expect.any(Array),
            isPaid: expect.any(Boolean),
            tags: expect.any(Array),
            images: expect.any(Array),
          });
          expect([null, expect.any(String)]).toContainEqual(event.endTime);
          expect([null, expect.any(String)]).toContainEqual(event.createdBy);
        });
      });
  });
});

describe("GET /api/ticketmaster/events", () => {
  test("should respond with TicketMaster event object", () => {
    return request(app)
      .get("/api/ticketmaster/events")
      .expect(200)
      .then((response) => {
        const responseBody = response.body;
        expect(responseBody).toBeInstanceOf(Object);
        if (Object.keys(responseBody).length === 0) {
          expect(responseBody).toEqual({});
        } else {
          const { events } = responseBody;
          expect(events).toBeInstanceOf(Array);
          events.forEach((event) => {
            expect(event).toMatchObject({
              name: expect.any(String),
              type: expect.any(String),
              id: expect.any(String),
              test: expect.any(Boolean),
              url: expect.any(String),
              locale: expect.any(String),
              images: expect.any(Array),
              sales: expect.any(Object),
              dates: expect.any(Object),
              classifications: expect.any(Array),
              _links: expect.any(Object),
            });

            // Check optional fields
            if (event.promoter) {
              expect(event.promoter).toBeInstanceOf(Object);
            }

            if (event.seatmap) {
              expect(event.seatmap).toBeInstanceOf(Object);
            }

            if (event.promoters) {
              expect(event.promoters).toBeInstanceOf(Array);
            }

            if (event.pleaseNote) {
              expect(event.pleaseNote).toEqual(expect.any(String));
            }

            if (event.outlets) {
              expect(event.outlets).toBeInstanceOf(Object);
            }

            if (event.info) {
              expect(event.info).toEqual(expect.any(String));
            }

            if (event.priceRanges) {
              expect(event.priceRanges).toBeInstanceOf(Array);
            }

            if (event.products) {
              expect(event.products).toBeInstanceOf(Array);
            }

            if (event.accessibility) {
              expect(event.accessibility).toBeInstanceOf(Object);
            }

            if (event.ticketLimit) {
              expect(event.ticketLimit).toBeInstanceOf(Object);
            }

            if (event.ageRestrictions) {
              expect(event.ageRestrictions).toBeInstanceOf(Object);
            }

            if (event.ticketing) {
              expect(event.ticketing).toBeInstanceOf(Object);
            }

            if (event._embedded) {
              expect(event._embedded).toBeInstanceOf(Object);
            }
          });
        }
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

describe("GET /api/ticketmaster/events/:event_id", () => {
  test("should return 404 when the id for Ticketmaster event is valid but non existent", () => {
    const invalidTMEventId = "vvG1fZ3MD144Ni";

    return request(app)
      .get(`/api/ticketmaster/events/${invalidTMEventId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event Not Found");
      });
  });

  test("should return 200 when the id for Ticketmaster event is valid", () => {
    const validTMEventId = "vvG1fZ9MD144Ni";

    return request(app)
      .get(`/api/ticketmaster/events/${validTMEventId}`)
      .expect(200)
      .then((response) => {
        const event = response.body;
        expect(event).toBeInstanceOf(Object);
        expect(event.ticketmasterId).toBe(validTMEventId);
        expect(event.isExternal).toBe(true);
      });
  });
});

describe("PATCH /api/events/:event_id", () => {
  test("should respond with a 404 status with non-existent event id", () => {
    return request(app)
      .patch("/api/events/66feec40084c536f65f2e987")
      .send({ username: "neweventtitle" })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Event Not Found");
      });
  });

  test("should respond with a 400 status code if event id is invalid", () => {
    return request(app)
      .patch("/api/events/invalid-id")
      .send({ username: "neweventtitle" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("should respond with 200 status code and return updated event with nothing else changing", () => {
    return request(app)
      .patch(`/api/events/${validEventId}`)
      .send({
        name: "Happy Hour at Local Bar",
        info: "Time to spare? Come join us and make some friends at your local pub.",
        tags: ["drink", "fun", "community"],
      })
      .expect(200)
      .then((response) => {
        const { event } = response.body;
        expect(event).toMatchObject({
          _id: `${validEventId}`,
          name: expect.any(String),
          info: "Time to spare? Come join us and make some friends at your local pub.",
          location: "Central Park, New York",
          date: expect.any(String),
          startTime: expect.any(String),
          endTime: expect.any(String),
          createdBy: `${validUserId}`,
          price: 0,
          attendees: [`${validUserId}`],
          isPaid: false,
          tags: ["drink", "fun", "community"],
          images: [],
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
          name: expect.any(String),
          info: "Time to spare? Come join us and make some friends at your local pub.",
          location: "Central Park, New York",
          date: expect.any(String),
          startTime: expect.any(String),
          endTime: expect.any(String),
          createdBy: `${validUserId}`,
          price: 0,
          attendees: [`${validUserId}`],
          isPaid: false,
          tags: ["drink", "fun", "community"],
          images: [],
        });
      });
  });
});

describe("POST /api/events", () => {
  test("should respond with 400 status and error message when required fields are missing", () => {
    const invalidEventData = {
      name: "Best Event Ever",
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
      name: "Valid and Exciting Event",
      info: "This is test info",
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
        expect(event.name).toBe(validEventData.name);
        expect(event.info).toBe(validEventData.info);
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
