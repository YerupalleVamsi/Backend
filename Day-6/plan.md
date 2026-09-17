# Blog API — Design Spec

**Phase 3 Mini Project — worked example**

> A design contract. No code. If you handed this to another dev, they could
> build the API without asking a single question.

Base URL: `/api/v1`

---

## Conventions (decide these once, apply everywhere)

- Resources are **plural nouns**: `/posts`, not `/post`.
- **Methods** carry the verb: `GET` read, `POST` create, `PUT` replace,
  `PATCH` partial update, `DELETE` remove.
- **Lists are lean, singles are fat** — a collection returns a trimmed shape;
  the single-resource endpoint returns the full shape.
- **404** for a missing resource, never `null`, never an empty object.
- Filtering, sorting, and pagination live in the **query string**, never the path.
- Timestamps are ISO 8601 strings (`"2026-01-14T09:30:00Z"`).

---

## Users

| Method | URL              | Description            | Success |
|--------|------------------|------------------------|---------|
| GET    | /users           | List users             | 200     |
| POST   | /users           | Create a user          | 201     |
| GET    | /users/:id       | Get one user           | 200     |
| PATCH  | /users/:id       | Update user fields     | 200     |
| DELETE | /users/:id       | Delete a user          | 204     |
| GET    | /users/:id/posts | Posts written by user  | 200     |

**Collection** — `GET /users`
```json
[
  { "id": 1, "username": "alice", "avatarUrl": "/img/alice.png" }
]
```

**Single** — `GET /users/:id`
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "bio": "Writes about backends.",
  "avatarUrl": "/img/alice.png",
  "createdAt": "2026-01-02T10:00:00Z"
}
```

> Note: `GET /users/:id` does **not** embed the user's posts. Posts are
> reached via `GET /users/:id/posts`. Keeps the response small and the two
> concerns decoupled. (Answers reflection Q3.)

---

## Posts

| Method | URL                    | Description              | Success |
|--------|------------------------|--------------------------|---------|
| GET    | /posts                 | List posts (filterable)  | 200     |
| POST   | /posts                 | Create a post            | 201     |
| GET    | /posts/:id             | Get one post (full)      | 200     |
| PUT    | /posts/:id             | Replace a post           | 200     |
| PATCH  | /posts/:id             | Update post fields       | 200     |
| DELETE | /posts/:id             | Delete a post            | 204     |
| GET    | /posts/:id/comments    | List comments on a post  | 200     |
| POST   | /posts/:id/comments    | Add a comment to a post  | 201     |

**Collection** — `GET /posts` (lean: no body, no comments)
```json
[
  {
    "id": 7,
    "title": "Understanding REST",
    "excerpt": "REST is a set of constraints, not a protocol...",
    "author": { "id": 1, "username": "alice" },
    "tags": ["rest", "http"],
    "commentCount": 4,
    "createdAt": "2026-01-14T09:30:00Z"
  }
]
```

**Single** — `GET /posts/:id` (fat: full body + related data)
```json
{
  "id": 7,
  "title": "Understanding REST",
  "body": "Full markdown/HTML content of the post...",
  "author": { "id": 1, "username": "alice" },
  "tags": ["rest", "http"],
  "comments": [
    { "id": 31, "body": "Great explainer!", "author": { "id": 2, "username": "bob" } }
  ],
  "createdAt": "2026-01-14T09:30:00Z",
  "updatedAt": "2026-01-14T11:02:00Z"
}
```

### Filtering, sorting, pagination — `GET /posts?...`
Answers reflection Q2: filters go in the **query string**.
```
GET /posts?tag=javascript&author=alice   → filter by tag AND author
GET /posts?sort=-createdAt               → newest first ( - = descending )
GET /posts?page=2&limit=20               → pagination
```
Paginated response wraps the array in a `data` + `meta` envelope so the client
knows there's more:
```json
{
  "data": [ /* array of lean posts */ ],
  "meta": { "page": 2, "limit": 20, "total": 137, "totalPages": 7 }
}
```

---

## Comments

Design decision (answers reflection Q1): **nested for list + create, flat for
single-item operations.** A comment needs a parent post to be born, but once it
has its own id, you address it directly instead of nesting two levels deep.

| Method | URL                  | Description                | Success |
|--------|----------------------|----------------------------|---------|
| GET    | /posts/:id/comments  | List comments for a post   | 200     |
| POST   | /posts/:id/comments  | Create comment on a post   | 201     |
| GET    | /comments/:id        | Get one comment            | 200     |
| PATCH  | /comments/:id        | Edit a comment             | 200     |
| DELETE | /comments/:id        | Delete a comment           | 204     |

**Collection** — `GET /posts/:id/comments`
```json
[
  {
    "id": 31,
    "body": "Great explainer!",
    "author": { "id": 2, "username": "bob" },
    "createdAt": "2026-01-14T10:15:00Z"
  }
]
```

**Single** — `GET /comments/:id`
```json
{
  "id": 31,
  "body": "Great explainer!",
  "author": { "id": 2, "username": "bob" },
  "postId": 7,
  "createdAt": "2026-01-14T10:15:00Z"
}
```

> Why not `DELETE /posts/:id/comments/:commentId`? It's two levels deep and the
> post id is redundant — the comment id alone identifies it. Flatten it.

---

## Tags

Tags are a classic many-to-many with posts. Two sane ways to "get posts for a
tag" — a dedicated nested route, or the filter you already built on `/posts`.
Both are shown; in practice `/posts?tag=` is usually enough.

| Method | URL              | Description             | Success |
|--------|------------------|-------------------------|---------|
| GET    | /tags            | List all tags           | 200     |
| POST   | /tags            | Create a tag            | 201     |
| GET    | /tags/:id        | Get one tag             | 200     |
| DELETE | /tags/:id        | Delete a tag            | 204     |
| GET    | /tags/:id/posts  | Posts carrying this tag  | 200     |

**Collection** — `GET /tags`
```json
[
  { "id": 3, "name": "rest", "postCount": 12 }
]
```

**Single** — `GET /tags/:id`
```json
{
  "id": 3,
  "name": "rest",
  "postCount": 12
}
```

---

## Stretch 1 — `POST /posts/:id/like`

Not RESTfully pure: `like` is a verb, and pure REST says URLs should be nouns.

**The tradeoff:**
- *Purist approach* — treat a like as a resource:
  `POST /posts/:id/likes` (create a like) and `DELETE /posts/:id/likes/:userId`
  (unlike). Technically correct, and it gives you a real `likes` collection you
  can query.
- *Pragmatic approach* — `POST /posts/:id/like` and `POST /posts/:id/unlike`.
  Reads naturally, trivial to implement, everyone understands it instantly.

**Verdict:** for a toggle that most apps only ever flip on/off per user, the
pragmatic verb-route is fine and extremely common. Reach for the purist
`likes` collection only if you need to *list who liked a post* — then modelling
likes as a real resource pays off.

```
POST   /posts/:id/like     → 200 { "liked": true,  "likeCount": 43 }
POST   /posts/:id/unlike   → 200 { "liked": false, "likeCount": 42 }
```

---

## Stretch 2 — Pagination design

**Query params**
```
?page=2&limit=20     → offset-based, simple, jump to any page (can drift if
                       rows are inserted mid-scroll)
?cursor=xyz&limit=20 → cursor-based, stable for infinite scroll, no random access
```

**Response shape** — wrap the array so metadata has somewhere to live:
```json
{
  "data": [ /* items */ ],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 137,
    "totalPages": 7
  },
  "links": {
    "next": "/api/v1/posts?page=3&limit=20",
    "prev": "/api/v1/posts?page=1&limit=20"
  }
}
```
Offset pagination is the right default for a blog admin listing; cursor
pagination is better for a public "load more" feed.

---

## Design decisions summary

| Question                                   | Decision                                        |
|--------------------------------------------|-------------------------------------------------|
| Top-level `/comments` route?               | Yes — for get/edit/delete of a single comment.  |
| List and create comments?                  | Nested under the post: `/posts/:id/comments`.   |
| `GET /posts?tag=&author=`?                 | Query string, combined with AND.                |
| Does `GET /users/:id` include posts?       | No — separate `/users/:id/posts`.               |
| Lean vs full response?                     | Lists trimmed, single resources full.           |
| Missing resource?                          | `404 { "error": "Not found" }`.                 |