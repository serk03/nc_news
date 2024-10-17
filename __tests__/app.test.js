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
          // console.log(body);
          expect(body.msg).toBe("article not found");
        });
    });
      test("GET 400: Passed bad article ID", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          console.log(body);
          expect(body.msg).toBe("Bad Request");
      })
    });
})
