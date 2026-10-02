# Before We Start
### Read this before the workshop. Ten minutes.

---

## 1. The question the whole morning answers

You have written programs. They were one program.

**What happens when one program is no longer enough?** When fifty developers need to work on it
at once, when one feature needs ten times more capacity than the rest, when a bug in a minor
screen takes the entire product offline?

That is what microservices are for. They are also frequently a mistake. By 1:30 you should be
able to tell the difference.

---

## 2. Four words

| Word | Meaning |
|---|---|
| **Monolith** | One codebase, one process, one deployable thing. How almost everything starts |
| **Microservice** | A small service that owns **one business job** and **its own data**, and can be deployed on its own |
| **Container** | A sealed box holding your program and everything it needs to run |
| **Kubernetes** | A system that runs lots of containers and **keeps them running** — if one dies, it replaces it |

Don't worry about containers and Kubernetes yet. We start those from zero in Session 3.

---

## 3. The trade-off to keep in mind

> **Microservices trade simplicity for independence.**

| Monolith | Microservices |
|---|---|
| Simple to build, run and debug | Complicated: many moving parts |
| Everything ships together | Each piece ships on its own |
| Everything fails together | One piece can fail alone |
| Everything scales together | Scale just the busy part |

Neither is "better". The question is always: *do we need the independence enough to pay for the
complexity?*

---

## 4. One thing that will surprise you

Inside one program, calling another part is a **function call**. It can still throw an error, but
it does not cross a network, and it is fast.

Between two services, that same call goes **over a network**. It can be slow. It can hang. It can
fail. It can succeed *after* you gave up waiting — and you have no way to tell those last two
apart.

> Almost every difficult idea in this workshop exists to deal with that single change.

---

## Before you arrive

- [ ] You have a **GitHub account** and know your password
- [ ] You have opened it once and can sign in
- [ ] You have read sections 1–4 above

**That is the entire list.** No installs, no Docker Hub, no credit card.

> If you have never used a terminal, that is fine. Every command you need is written out in full
> and can be copied.

---

## 5. Commands you will meet

You are not expected to know any of these yet.

| Command | What it does |
|---|---|
| `node server.js` | Run a program |
| `docker compose up` | Start several services together |
| `docker compose ps` | List what is running |
| `kubectl get pods` | Ask Kubernetes what it is running |
| `kubectl scale ...` | Ask for more copies of one service |

---

## 6. Bring an answer to this

Think of an app you use often — Swiggy, Instagram, your college portal, anything.

> 🎯 **Name three separate "jobs" inside it that could plausibly be built by three different
> teams.**
>
> 1. `________________________`
> 2. `________________________`
> 3. `________________________`

Bring that to Session 1. You have just done the hardest part of microservices design, which is
deciding where one piece ends and the next begins.
