# Postman Testing Guide: MAC API

Here is a step-by-step guide to test the newly created APIs in Postman. The base URL for all local requests is `http://localhost:5001`.

---

## 1. Submit a Profile Request (Public)

This endpoint simulates a user submitting the form on the landing page.

- **Method**: `POST`
- **URL**: `http://localhost:5001/api/v1/requests`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (raw -> JSON):
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "role": "member",
    "message": "Testing the new flow"
  }
  ```

> [!NOTE]
> Check your email (or the console if email sending fails) after submitting. The admin (`mnnitathleticsclub@gmail.com` or whatever `SMTP_USER` is set to in `.env`) should receive a notification.

---

## 2. Admin Login (Protected Routes Setup)

Before you can approve or reject requests, you need an Admin token.

- **Method**: `POST`
- **URL**: `http://localhost:5001/api/v1/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (raw -> JSON):
  ```json
  {
    "email": "admin@mac.com",
    "password": "admin"
  }
  ```

**Action**: Copy the `token` string from the response. You will need this for the next two requests.

---

## 3. Get Pending Requests (Admin)

See the request you just submitted in step 1.

- **Method**: `GET`
- **URL**: `http://localhost:5001/api/v1/admin/requests`
- **Headers**:
  - `Authorization`: `Bearer YOUR_COPIED_TOKEN_HERE`

**Action**: Find the `_id` of the request you created in step 1 from the response array. Copy it.

---

## 4. Approve a Request (Admin)

Approve the request, which creates a user, generates a magic link, and emails the user.

- **Method**: `POST`
- **URL**: `http://localhost:5001/api/v1/admin/requests/:id/approve`
  - *(Replace `:id` in the URL with the `_id` you copied in step 3)*
- **Headers**:
  - `Authorization`: `Bearer YOUR_COPIED_TOKEN_HERE`
- **Body**: None required.

> [!NOTE]
> After running this, check the email address you used in step 1 (e.g., `test@example.com`). You should receive the magic link. **Copy the `token=` part from the URL in that email.**

---

## 5. Verify Magic Link (Member)

Simulate clicking the magic link from the email.

- **Method**: `GET`
- **URL**: `http://localhost:5001/api/v1/member/verify-token?token=THE_TOKEN_FROM_THE_EMAIL`
- **Headers**: None

**Action**: The response will contain a new session `token`. **Copy this token.** This is the member's session token.

---

## 6. Update Profile (Member)

Save changes to the member's profile.

- **Method**: `PUT`
- **URL**: `http://localhost:5001/api/v1/member/profile`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer YOUR_MEMBER_SESSION_TOKEN_HERE`
- **Body** (raw -> JSON):
  ```json
  {
    "name": "Updated Test User",
    "branch": "Mechanical Engineering",
    "batch": "2025",
    "events": "Shot Put, Discus Throw",
    "achievements": "Gold in Shot Put 2024"
  }
  ```

---

## 7. Get Profile (Member)

Verify the changes were saved.

- **Method**: `GET`
- **URL**: `http://localhost:5001/api/v1/member/profile`
- **Headers**:
  - `Authorization`: `Bearer YOUR_MEMBER_SESSION_TOKEN_HERE`

---

### Tips for Postman

> [!TIP]
> You can use Postman Environments to store the tokens automatically. For example, in the "Tests" tab of the Admin Login request, add `pm.environment.set("admin_token", pm.response.json().token);` and then use `{{admin_token}}` in the Authorization tab for admin routes. Do the same for the member token.
