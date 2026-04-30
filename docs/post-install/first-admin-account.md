---
sidebar_position: 1
---

# First Admin Account

CourseForge has no built-in default admin. The **first account
registered through the public sign-up form is automatically promoted
to admin**. Every subsequent registration is a regular student.

## Steps

1. Open `https://learn.client.com` in a browser.
2. Click **Sign Up**.
3. Enter the client's email, a name, and a password (min 8 chars).
4. Submit. You land on the storefront, logged in.
5. Open `/admin` — the admin panel should load. If it does, this
   account is the admin.

:::warning
Do this **before** sharing the URL with anyone else. If a student
accidentally registers first, they become admin and you have to wipe
the database to recover.
:::

## Verifying admin status

```bash
docker compose exec postgres psql -U courseforge -d courseforge \
  -c "SELECT id, email, role FROM \"user\" ORDER BY \"createdAt\";"
```

The first row should have `role = 'admin'`.

## Promoting an extra admin

If the client wants a second admin (a co-founder, an assistant), do
it from the database — there is no UI yet:

```bash
docker compose exec postgres psql -U courseforge -d courseforge \
  -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'second@client.com';"
```

The user must already have registered (so the row exists). They will
see the `/admin` link on next page load.

## Resetting if you registered the wrong account first

```bash
docker compose down
docker volume rm courseforge_pgdata
docker compose up -d --build
```

This wipes everything — only do this when no real students or
courses exist yet.
