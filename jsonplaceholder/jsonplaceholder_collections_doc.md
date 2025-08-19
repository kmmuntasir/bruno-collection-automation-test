# JSONPlaceholder — Complete API Reference

Base URL: `https://jsonplaceholder.typicode.com`

> JSONPlaceholder is a **fake** REST API. Reads are real; writes (POST/PUT/PATCH/DELETE) return realistic responses but do **not** persist.  
> See the official guide for behavior and examples. [Guide]

---

## Resources & Endpoints

### Posts
- **Collection**: `GET /posts`
- **Single**: `GET /posts/{id}`
- **Create**: `POST /posts`
- **Replace**: `PUT /posts/{id}`
- **Update**: `PATCH /posts/{id}`
- **Delete**: `DELETE /posts/{id}`
- **Nested**:  
  - `GET /posts/{id}/comments`  
- **Common fields**: `id`, `userId`, `title`, `body`

### Comments
- **Collection**: `GET /comments`
- **Single**: `GET /comments/{id}`
- **Create/Replace/Update/Delete**: standard verbs on `/comments/{id}`
- **Nested**:  
  - `GET /comments?postId={postId}`
- **Fields**: `id`, `postId`, `name`, `email`, `body`

### Albums
- **Collection**: `GET /albums`
- **Single**: `GET /albums/{id}`
- **Nested**:  
  - `GET /albums/{id}/photos`
  - `GET /albums?userId={userId}`
- **Fields**: `id`, `userId`, `title`

### Photos
- **Collection**: `GET /photos`
- **Single**: `GET /photos/{id}`
- **Nested**:  
  - `GET /photos?albumId={albumId}`
- **Fields**: `id`, `albumId`, `title`, `url`, `thumbnailUrl`

### Todos
- **Collection**: `GET /todos`
- **Single**: `GET /todos/{id}`
- **Nested**:  
  - `GET /todos?userId={userId}`
- **Fields**: `id`, `userId`, `title`, `completed`

### Users
- **Collection**: `GET /users`
- **Single**: `GET /users/{id}`
- **Nested**:  
  - `GET /users/{id}/posts`  
  - `GET /users/{id}/albums`  
  - `GET /users/{id}/todos`
- **Fields**: `id`, `name`, `username`, `email`, `address{...}`, `phone`, `website`, `company{...}`

> **Note:** The “nested” endpoints above are convenience routes commonly used with JSONPlaceholder relations. See the guide’s examples for `/posts/{id}/comments` and query-by-foreign-key like `?userId=1`. [Guide]

---

## Query Parameters (Filtering, Pagination, Sorting, Search)

These are powered by **json-server** conventions and work on JSONPlaceholder.

### Basic field filters
- Equality on any field:  
  - `/posts?userId=1`  
  - `/users?id=3` or multiple values `/users?id=3&id=5`
- Deep field match using dot-notation (json-server feature):  
  - `/comments?author.name=typicode` *(when such nested data exists)*

### Ranged / negation / pattern operators
- Greater/Less or equal: `_{field}_gte`, `_{field}_lte`  
  - `/posts?views_gte=10&views_lte=20`
- Not equal: `_{field}_ne`  
  - `/posts?id_ne=1`
- “Like” (regex/substring): `_{field}_like`  
  - `/posts?title_like=server`

### Full-text search
- `q` (matches across string fields):  
  - `/posts?q=internet`

### Sorting
- `_sort` and `_order` (`ASC`|`DESC`):  
  - `/posts?_sort=views&_order=DESC`  
  - `/posts/1/comments?_sort=votes&_order=ASC`

### Pagination (two styles you’ll see)
- Page/limit (adds RFC5988 `Link` header):  
  - `/posts?_page=2&_limit=10`  
  - Response headers include `Link: <...>; rel="first" | "prev" | "next" | "last"`
- Offset/limit (also exposes total):  
  - `/posts?_start=10&_limit=10`  
  - Response header `X-Total-Count: <number>`

### Embed/Expand relationships
- `_embed` (include children) and `_expand` (include parent):  
  - `/posts?_embed=comments` → posts with embedded `comments[]`  
  - `/comments?_expand=post` → each comment with its `post` object

---

## Request/Response Examples

### List posts (paged & sorted)
```
GET /posts?_page=1&_limit=5&_sort=id&_order=DESC
```
- 200 OK  
- Headers: `Link`, potentially `X-Total-Count`  
- Body: `[{ id, userId, title, body }, ...]`

### Filter comments for two posts
```
GET /comments?postId=1&postId=2
```

### Search todos text + filter by user
```
GET /todos?q=vero&userId=1
```

### Embed comments under posts
```
GET /posts?_embed=comments
```

### Expand parent post inside comments
```
GET /comments?_expand=post
```

### Create a post (fake-write)
```
POST /posts
Content-Type: application/json

{ "title": "foo", "body": "bar", "userId": 1 }
```
- 201 Created  
- Body echoes new resource with a generated `id`  
- **Note:** The change is **not** persisted (simulated write).

### Replace vs. Patch a post (fake-write)
```
PUT /posts/1
{ "id": 1, "title": "new", "body": "replaced", "userId": 1 }

PATCH /posts/1
{ "title": "just this field" }
```
- 200 OK with updated JSON bodies (simulation only).

### Delete a post (fake-write)
```
DELETE /posts/1
```
- 200 OK / 204 No Content (no real deletion on server).

---

## Status Codes (typical)
- `200 OK` — successful GET/PUT/PATCH
- `201 Created` — successful POST with created body
- `204 No Content` — successful DELETE (sometimes 200 with body)
- `404 Not Found` — resource id not found
- `400 Bad Request` — malformed inputs (rare in this mock; depends on request)

---

## Tips & Combinations

- **Chain filters + sort + pagination** freely:  
  `GET /photos?albumId=10&_sort=id&_order=ASC&_page=3&_limit=25`
- **Multiple same-name params** are supported for OR-style filters:  
  `GET /users?id=1&id=2&id=5`
- **Read totals for pagers** using `X-Total-Count` when paginating.  
- **Use `q` and `_like` together** for coarse + fine search.  
- **Model N+1 avoidance** with `_embed`/`_expand` to fetch related data in one call.

---

## Resource Counts (approximate dataset size)
- `/posts` 100, `/comments` 500, `/albums` 100, `/photos` 5000, `/todos` 200, `/users` 10.

---

## Notes
- CORS enabled; works in browser, cURL, Postman, etc.  
- No auth; HTTPS supported.  
- Great for demos, tests, tutorials, and mocking CRUD flows.
