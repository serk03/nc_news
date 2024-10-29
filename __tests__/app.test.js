const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../nc_news_app/app");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
require('jest-sorted');

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET 200: Respond with an array containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET 200: return all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe(" /api/articles/:article_id", () => {
  test("GET 200: return an article object by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 400: Passed bad ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET 404: Returns error if article is not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("/api/articles",()=>{
  test("GET 200: returns articles with correct properties",()=>{
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        })
  })
})
})

describe("/api/articles/:article_id/comments",()=>{
  test("GET 200: returns specifc article with all related comments",()=>{
     return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body})=>{
           expect(body.comments).toHaveLength(11);
            body.comments.forEach((comment) => {
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.created_at).toBe("string");
         
        })
      })
  })
  test("GET 200: returns specifc article with all related comments starting with most recent",()=>{
  return request(app)
  .get("/api/articles/1/comments")
  .expect(200)
  .then(({body})=>{
    expect(body.comments).toBeSortedBy('created_at', {
    descending: true,
  })
})
  })
  // 404 - ID does not exist
  //check if the article exist, using existing function
  // if not throw error if does not exist,
  // if article exist __then call article
  
  //if given invalid id, throw error
   test("GET 404: Returns error if article does not exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
      test("GET 400: Passed bad article ID", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      })
    });
})

describe("/api/articles/:article_id/comments",()=>{
  test("GET 200: Should add a comment to an article and return the posted comment",()=>{
    const newItem = {
      username:"butter_bridge",
      body:"Hello New World"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newItem)  
    .expect(200)
    .then(({body})=>{
      expect(body)
        body.comments.forEach((comment) => {
        expect(comment.body).toEqual("Hello New World");
        expect(comment.votes).toEqual(0);
        expect(comment.author).toEqual("butter_bridge");
        expect(comment.article_id).toEqual(1);
        expect(typeof comment.created_at).toBe("string");
      })
    }) 
  })
  /// Tests to check for
    // invalid articleID = 400
    // article not found = 404
    // Username not found = 404
    // empty object = 400 bad request
    // Bad request body is null
    test("POST 400: Passed invalid article ID", () => {
      const newItem = {
      username:"butter_bridge",
      body:"Hello New World"
    }
      return request(app)
        .post("/api/articles/notAnID/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      })
    });

    test("POST 404: Returns error if article does not exist", () => {
      const newItem = {
      username:"butter_bridge",
      body:"Hello New World"
    }
      return request(app)
        .post("/api/articles/999/comments")
        .send(newItem)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });

    test("POST 404: Returns error if username is not found", () => {
      const newItem = {
      username:"butter_bug",
      body:"Hello New World"
    }
      return request(app)
        .post("/api/articles/1/comments")
        .send(newItem)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username not found");
        });
    });
    test("POST 400: Returns error if passed empty object", () => {
      const newItem = {}
      return request(app)
        .post("/api/articles/1/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      })
    });
    test("POST 400: Returns error if passed object with NULL as body", () => {
        const newItem = {
        username:"butter_bug",
        body: null
    }
      return request(app)
        .post("/api/articles/1/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      })
    });
  })




  describe("/api/articles/:article_id",()=>{
    test("PATCH 200: Returns a given article by article id with votes increased",()=>{
      const newVotes ={inc_votes: 1};
      return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({body})=>{
         expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      })   
    })
    test("PATCH 400: Returns error if passed empty object",()=>{
      const newVotes ={};
      return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
       .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
    })
  })
   test("PATCH 400: Returns error if passed a string data type", () => {
      const newVotes ="inc_votes: 1";
      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
   test("PATCH 400: Returns error if passed a null data type", () => {
      const newVotes ={inc_votes: null};
      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
     test("PATCH 400: Passed invalid article ID", () => {
      const newVotes ={inc_votes: 1};
      return request(app)
        .patch("/api/articles/notAnID")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      })
    });
    test("PATCH 404: Returns error if username is not found", () => {
      const newVotes ={inc_votes: 1};
      return request(app)
        .patch("/api/articles/9999")
        .send(newVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
})

describe("/api/comments/:comment_id",()=>{
  test("DELETE 200: Removes a comments by a given comment_id",()=>{
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
    })
  test("DELETE 404: Returns error if commentID is not found",()=>{
    return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("article not found");
    })
  })
  test("DELETE 400: Returns error if commentID is invalid",()=>{
    return request(app)
    .delete("/api/comments/notAnId")
    .expect(400)
    .then(({body})=>{
     expect(body.msg).toBe("Bad Request");
  })
  })
})

