# System Design for Modern Microservices
### Principles, Patterns & Practices

You will take one application, run it as a **monolith**, rebuild it as **four microservices**,
deliberately **break** it, then deploy it to **Kubernetes** — scaling one part and rolling out a
new version.

**Nothing to install.** Everything runs in your browser.

---

## Start here

**1. Before the workshop** — read [Before-We-Start.md](Before-We-Start.md). Ten minutes, and it
ends with a question to bring with you.

**2. In the lab** — work down [Workshop-Lab-Handout.md](Workshop-Lab-Handout.md). Tick every box.

**3. To open your workspace** — on this repository: **Code** → **Codespaces** →
**Create codespace on main**. Usually a couple of minutes. Node, Docker, `kubectl` and `minikube`
are already installed — you start the cluster yourself in Session 3.

> 💡 **Stop your Codespace when you finish.** ☰ menu → *My Codespaces* → **Stop**.

---

## The four sessions

| Session | You will |
|---|---|
| **1. Introduction to Microservices** | Run a monolith, then draw service boundaries for a real system |
| **2. Architectural Patterns** | Run four services, then break one and watch the shop stay open |
| **3. Containerization & Orchestration** | Open the box: images, containers, and why Kubernetes exists |
| **4. Hands-on & Industry Insights** | Deploy to Kubernetes, scale one service, ship v2, roll it back |

Each session ends with a **5-question quiz**. There is a take-home **assignment** at the end.

---

## The files

| File | What it is |
|---|---|
| [Before-We-Start.md](Before-We-Start.md) | **Read first.** The vocabulary and what to bring |
| [Workshop-Lab-Handout.md](Workshop-Lab-Handout.md) | **The labs.** Every step, with checkboxes and troubleshooting |
| [Quizzes.md](Quizzes.md) | The four quizzes. Mark your own |
| [Notes.md](Notes.md) | **The full notes.** Every concept, a glossary, interview questions |
| [Takeaway-Sheet.md](Takeaway-Sheet.md) | **One page for revision.** Print it |
| [Assignment.md](Assignment.md) | The take-home assignment — build a fifth service and deploy it |
| [lab-starter/](lab-starter/README.md) | The bookstore application you will work with |

---

## What you will build

A bookstore, as four independent services:

```
                    ┌─────────────┐
   your browser ──► │   gateway   │   the only public door
                    └──────┬──────┘
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
         catalog        orders    recommendations
        the books     purchases    "you may like"
                                   (breaks on purpose)
```

Plus the **same application written as a monolith**, so you can compare them side by side.

Everything is plain Node with **zero libraries to install**, so you can read every line.

---

## What you need

| Thing | Required? |
|---|---|
| A GitHub account | **Yes** — with Codespaces access and free quota left |
| Docker Hub account | No |
| Anything installed on your laptop | No |
| Prior Docker or Kubernetes experience | **No.** We start from zero in Session 3 |

> If your Codespace will not start on the day, say so immediately — you will pair with someone
> else rather than lose the morning to it.

---

## Why this material argues both sides

You will spend as much time on **when not to use microservices** as on how to build them.

Teams often adopt them when a well-organised monolith would have served better, and the
resulting "distributed monolith" is harder to work with than what it replaced. Knowing where
that line sits matters more — in an interview and in a real job — than reciting patterns.

---

## When something breaks

The lab handout ends with a troubleshooting table covering the dozen things that actually go
wrong. Check it first.

If you are stuck for more than a couple of minutes, **ask**. Losing time to an environment
problem teaches you nothing.
