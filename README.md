# Teamwork API

## Required Features
1. Admin can create an employee user account.
2. Admin/Employees can sign in.
3. Employees can post gifs.
4. Employees can write and post articles.
5. Employees can edit their articles.
6. Employees can delete their articles.
7. Employees can delete their gifs post.
8. Employees can comment on other colleagues' article post.
9. Employees can comment on other colleagues' gif post.
10. Employees can view all articles and gifs, showing the most recently posted articles or gifs first.
11. Employees can view a specific article.
12. Employees can view a specific gif post.

## Optional Features
- Employees can view all articles that belong to a category (tag).
- Employees can flag a comment, article and/or gif as inappropriate.
- Admin can delete a comment, article and/or gif flagged as inappropriate.

## API Endpoint
1. POST /auth/create-user
 - Admin can create an employee user account.
 - Request spec: (body) {
    "firstName": String,
    "lastName": String,
    "email": String,
    "password": String,
    "gender": String,
    "jobRole": String,
    "department": String,
    "address": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
    "message": "User account successfully created",
    "token" : String,
    "userId": Integer,
    ...
    }
   }
2. POST /auth/signin
 - Admin/Employees can sign in
 - Request spec: (body) {
    "email": String,
    "password": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
    "token" : String,
    "userId": Integer,
    ...
    }
   }
3. POST /gifs
 - Create a gif
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Request spec: (Body) {
    "image": image/gif,
    "title": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
    "gifId" : Integer,
    "message" : "GIF image successfully posted",
    "createdOn" : DateTime,
    "title" : String,
    "imageUrl" : String,
    ...
    }
   }
4. POST /articles
 - Create an article
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Request spec: (Body) {
    "title": String,
    "article": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message" : "Article successfully posted",
      "articleId" : Integer,
      "createdOn" : DateTime,
      "title" : String,
      ...
    }
  }
5. PATCH /articles/:articleId
 - Edit an article
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Request spec: (Body) {
    "title": String,
    "article": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message" : "Article successfully updated",
      "title" : String,
      "article" : String,
      ...
    }
   }
6. DELETE /articles/:articleId
 - Employees can delete their articles
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message": "Article successfully deleted",
      ...
    }
   }
7. DELETE /gifs/:gifId
 - Employees can delete their gifs
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message": "gif post successfully deleted",
      ...
    }
   }
8. POST /articles/:articleId/comment
 - Employees can comment on other colleagues' article post.
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Request spec: (body) {
    "comment": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message": "Comment successfully created",
      "createdOn": DateTime,
      "articleTitle": String,
      "article": String,
      "comment": String,
      ...
    }
   }
9. POST /gifs/<:gifId>/comment
 - Employees can comment on other colleagues' gif post.
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Request spec: (body) {
    "comment": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "message": "comment successfully created",
      "createdOn": DateTime,
      "gifTitle": String,
      "comment": String,
      ...
    }
   }
10. GET /feed
 - Employees can view all articles or gifs, showing the most recently posted articles or gifs first
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : [
    {
      "id": Integer,
      "createdOn": DateTime,
      "title": String,
      "article/url": String, //use url for gif post and article for articles
      "authorId" : Integer,
      ...
    }, {
      "id": Integer,
      "createdOn": DateTime,
      "title": String,
      "article/url": String, //use url for gif post and article for articles
      "authorId" : Integer,
      ...
    }, {
      "id": Integer,
      "createdOn": DateTime,
      "title": String,
      "article/url": String, //use url for gif post and article for articles
      "authorId" : Integer,
      ...
    },
   ]
  }
11. GET /articles/<:articleId>
 - Employees can view a specific article.
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "id": Integer,
      "createdOn": DateTime,
      "title": String,
      "article": String,
      "comments": [
        {
          "commentId": Integer,
          "comment": String,
          "authorId" : Integer,
        },
        {
          "commentId": Integer,
          "comment": String,
          "authorId" : Integer,
        },
      ]
    }
   }
12. GET /gifs/<:gifId>
 - Employees can view a specific gif post.
 - Request spec: (Header) {
    "token": String,
    ...
   }
 - Response spec: {
    "status" : "success",
    "data" : {
      "id": Integer,
      "createdOn": DateTime,
      "title": String,
      "url": String,
      "comments": [
        {
          "commentId": Integer,
          "authorId": Integer,
          "comment": String,
        },
        {
          "commentId": Integer,
          "useauthorIdrId": Integer,
          "comment": String,
        }
      ]
    }
   }
