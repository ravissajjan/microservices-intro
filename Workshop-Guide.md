# Workshop Guide
### System Design for Modern Microservices — Principles, Patterns & Practices

Everything except the labs and the assignment is in this one file: the pre-read, the full notes,
the four quizzes, the revision bank, all the answers, and a condensed revision sheet.

The labs are in [Workshop-Lab-Handout.md](Workshop-Lab-Handout.md). The take-home brief is in
[Assignment.md](Assignment.md).

---

## How to use this file

| When | Read |
|---|---|
| **Before the workshop** | [Part 1 — Before we start](#part-1--before-we-start) · ten minutes, ends with a question to bring |
| **During / after each session** | [Part 2 — Notes](#part-2--notes), then that session's quiz in [Part 3](#part-3--quizzes) |
| **After each quiz** | [Part 4 — Answers](#part-4--answers) · your instructor reads the quiz answers out on the day |
| **Revising for the viva** | Part 3's revision bank, then [Part 5 — Revision sheet](#part-5--revision-sheet) |

| Session | Labs in the handout | Notes | Quiz |
|---|---|---|---|
| 1 — Introduction to Microservices | 1A, 1B | §1–§4 | Quiz 1 |
| 2 — Architectural Patterns | 2A, 2B | §5–§8 | Quiz 2 |
| 3 — Containerization & Orchestration | 3A, 3B, 3C | §9–§11 | Quiz 3 |
| 4 — Practices & Production | 4A, 4B, 4C, 4D | §12–§18 | Quiz 4 |

Every notes section says which lab it explains and which quiz question it answers, so you can go
straight to the part you need.

---
---

# PART 1 — Before we start
### Read this before the workshop. Ten minutes.

## The question the whole morning answers

You have written programs. They were one program.

**What happens when one program is no longer enough?** When fifty developers need to work on it
at once, when one feature needs ten times more capacity than the rest, when a bug in a minor
screen takes the entire product offline?

That is what microservices are for. They are also frequently a mistake. By 1:30 you should be
able to tell the difference.

## Four words

| Word | Meaning |
|---|---|
| **Monolith** | One codebase, one process, one deployable thing. How almost everything starts |
| **Microservice** | A small service that owns **one business job** and **its own data**, and can be deployed on its own |
| **Container** | A sealed box holding your program and everything it needs to run |
| **Kubernetes** | A system that runs lots of containers and **keeps them running** — if one dies, it replaces it |

Don't worry about containers and Kubernetes yet. We start those from zero in Session 3.

## The trade-off to keep in mind

> **Microservices trade simplicity for independence.**

| Monolith | Microservices |
|---|---|
| Simple to build, run and debug | Complicated: many moving parts |
| Everything ships together | Each piece ships on its own |
| Everything fails together | One piece can fail alone |
| Everything scales together | Scale just the busy part |

Neither is "better". The question is always: *do we need the independence enough to pay for the
complexity?*

## One thing that will surprise you

Inside one program, calling another part is a **function call**. It can still throw an error, but
it does not cross a network, and it is fast.

Between two services, that same call goes **over a network**. It can be slow. It can hang. It can
fail. It can succeed *after* you gave up waiting — and you have no way to tell those last two
apart.

> Almost every difficult idea in this workshop exists to deal with that single change.

## Before you arrive

- [ ] You have a **GitHub account** and know your password
- [ ] You have opened it once and can sign in
- [ ] You have read Part 1 of this file

**That is the entire list.** No installs, no Docker Hub, no credit card.

> If you have never used a terminal, that is fine. Every command you need is written out in full
> and can be copied.

## Commands you will meet

You are not expected to know any of these yet.

| Command | What it does |
|---|---|
| `node server.js` | Run a program |
| `docker compose up` | Start several services together |
| `docker compose ps` | List what is running |
| `kubectl get pods` | Ask Kubernetes what it is running |
| `kubectl scale ...` | Ask for more copies of one service |

## Bring an answer to this

Think of an app you use often — Swiggy, Instagram, your college portal, anything.

> 🎯 **Name three separate "jobs" inside it that could plausibly be built by three different
> teams.**
>
> 1. `________________________`
> 2. `________________________`
> 3. `________________________`

Bring that to Session 1. You have just done the hardest part of microservices design, which is
deciding where one piece ends and the next begins.

---
---

# PART 2 — Notes

Read alongside the labs, or afterwards. The sections follow the same order as the handout.

---

## SESSION 1 — Introduction to Microservices

### 1. The monolith, fairly

*Explains Lab 1A · answers Quiz 1 Q1*

**Monolith** = one codebase, one process, one deployable unit.

Most successful software started as one, and plenty of large systems still are. Its genuine
advantages are real and often undersold:

| Monolith strength | Why |
|---|---|
| Simple | One repo, one build, one thing to run |
| Fast | A function call, not a network request |
| Easy to debug | One stack trace covers the whole request |
| Transactional | One database means real ACID transactions |
| Cheap | One deployment pipeline, one thing to monitor |

Its weaknesses only appear at scale — of **team size** more than traffic:

| Monolith weakness | What it feels like |
|---|---|
| Ships together | A one-line fix waits for everyone else's release |
| Fails together | A memory leak in a minor feature takes the whole site down |
| Scales together | Black Friday means running five copies of *everything* |
| Tangled | After a few years nobody dares touch the middle |
| One technology | Stuck with the language you chose on day one |

> **The honest summary:** microservices do not make a system better. They trade *simplicity*
> for *independence*. Only make that trade when you need the independence.

### 2. What a microservice actually is

*Answers Quiz 1 Q4 and Q5*

**Microservice** = a small, independently deployable service that owns one business capability
and its own data.

Four words carry all the weight:

| Word | Meaning | Test |
|---|---|---|
| **Independently deployable** | Ship it without shipping anything else | Can you deploy it on a Friday alone? |
| **Owns one capability** | It has a clear business job | Can you name it in one sentence with no "and"? |
| **Owns its data** | No other service reads its tables | Could you swap its database without telling anyone? |
| **Small** | Small in *responsibility*, not lines of code | Can one team hold it in their heads? |

> ⚠️ **"Small" is the most misunderstood word here.** A microservice is not small because it is
> under 500 lines. It is small because it does *one thing*. Splitting by line count produces
> dozens of tiny services that cannot do anything useful alone.

### 3. Service boundaries

*Explains Lab 1B · answers Quiz 1 Q3*

This is the hardest part of the whole subject, and the part tools cannot help with.

**Service boundary** = the line around one business capability that one team can own, change and
deploy without asking anybody else.

#### How to find them

- **Follow the business, not the code.** `orders`, `payments`, `shipping` are capabilities.
  `controllers`, `models`, `utils` are layers — splitting by those gives you a distributed mess.
- **Follow the teams.** Conway's Law: a system's structure ends up mirroring the organisation
  that built it. Plan for it rather than fighting it.
- **Follow the data.** If two things need the same table constantly, they are probably one service.
- **Follow the change.** Things that always change together belong together.

#### The distributed monolith

The classic failure. You split into services, but they all call each other constantly, share one
database, and must be deployed together.

> You now have all the complexity of microservices and none of the independence.
> **This is worse than the monolith you started with.**

Warning signs: you cannot deploy one service alone · one schema change breaks three services ·
your local setup needs all nine services running · every feature touches four repositories.

### 4. When not to use microservices

*Answers Quiz 1 Q2 and Quiz 4 Q5*

Be able to argue this — it is the most common interview question on the topic.

| Do not, if | Because |
|---|---|
| The team is small | You will have more services than developers |
| The domain is new | You do not know the boundaries yet, and wrong ones are expensive to move |
| There is no automated deployment | You have just multiplied your manual releases by ten |
| You cannot monitor well | A failure will be invisible across ten services |
| The system is small | The network calls will cost more than they save |

> **The pragmatic path most teams take:** start as a **modular monolith** — one deployable, but
> with clean internal boundaries. When one module genuinely needs to scale or ship separately,
> lift *that* one out. Boundaries proven in code are far cheaper to extract than boundaries
> guessed on a whiteboard.

---

## SESSION 2 — Architectural Patterns

### 5. API Gateway

*Explains Lab 2A · answers Quiz 2 Q1*

**API Gateway** = one public entry point in front of many private services.

```
browser ──► gateway ──┬──► catalog          (no public port)
                      ├──► orders           (no public port)
                      └──► recommendations  (no public port)
```

Why not let the browser call each service directly?

| Without a gateway | With a gateway |
|---|---|
| The client must know every service address | It knows one |
| Every service needs its own auth, CORS, rate limiting | Handled once, centrally |
| Splitting a service breaks every client | Clients never notice |
| Every service is exposed to the internet | Only one is |

**The cost:** it is a single point of failure and it can become a dumping ground for logic that
belongs in the services. Keep it thin — routing, auth, rate limiting. Not business rules.

### 6. Service discovery

*Explains Lab 2A · answers Quiz 2 Q2 and Quiz 3 Q5*

Containers are created and destroyed constantly, and their IP addresses change every time.
Hard-coding addresses cannot work.

**Service discovery** = finding a service by **name** instead of by address.

```yaml
CATALOG_URL: http://catalog:3001    # "catalog" is a name, not an address
```

Docker Compose and Kubernetes both run an internal DNS server that resolves those names to
whatever IPs are currently alive. When you scaled `catalog` to 5, the same name started
load-balancing across all five, and the gateway never knew.

> 📌 The workshop's proof: the gateway's configuration was **byte-identical** on Compose and on
> Kubernetes. Two completely different platforms, one unchanged application.

### 7. Synchronous vs asynchronous

*Background · answers revision question R2.1*

| | Synchronous (HTTP) | Asynchronous (events) |
|---|---|---|
| Caller | Waits for a reply | Fires and forgets |
| Coupling | Tight — callee must be up now | Loose — callee can be down |
| Good for | "Give me the book list" | "An order was placed" |
| Risk | Slow callee makes you slow | Harder to trace and debug |

**Event-driven architecture**: services announce that something *happened* and do not care who
listens. `orders` logs `EVENT PUBLISHED order.placed` — in a real system that goes to Kafka,
RabbitMQ or SNS, and email, analytics and shipping each react independently. Adding a fourth
listener requires no change to `orders` at all.

> **Rule of thumb:** use synchronous calls when you need an answer *to continue*. Use events to
> tell the world something *happened*.

### 8. Designing for resilience

*Explains Lab 2B · answers Quiz 2 Q3, Q4 and Q5*

In a monolith, a function call cannot "be down". Across a network, every call can fail, hang, or
succeed slowly — and slow is often worse than down.

| Pattern | What it does |
|---|---|
| **Timeout** | Give up after N seconds instead of waiting forever |
| **Retry** | Try again — but only for *transient* failures, and with a limit |
| **Fallback** | Return a reduced answer instead of an error |
| **Circuit breaker** | After repeated failures, stop calling for a while and fail instantly |
| **Bulkhead** | Isolate resources so one struggling dependency cannot consume them all |

#### Cascading failure

The thing all of these exist to prevent:

```
recommendations gets slow
   → gateway requests pile up waiting
      → gateway runs out of connections
         → catalog and orders requests cannot get through either
            → the ENTIRE SITE is down, because of an optional feature
```

One 1-second timeout and a fallback stop the whole chain at step one.

#### Essential vs optional

The judgement call that makes it architecture rather than coding:

| Dependency | Essential? | Behaviour when it fails |
|---|---|---|
| `catalog` | **Yes** | Fail honestly — there is no shop without books |
| `orders` | **Yes** | Fail honestly — never pretend to take money |
| `recommendations` | **No** | Degrade quietly — hide the panel, keep selling |

**Graceful degradation** = losing a feature instead of losing the system.

---

## SESSION 3 — Containerization & Orchestration

### 9. Docker in one page

*Explains Lab 3A · answers Quiz 3 Q1 and Q2*

| Term | Meaning |
|---|---|
| **Dockerfile** | The recipe — a text file of build instructions |
| **Image** | The sealed, read-only package built from it |
| **Container** | A running copy of an image |
| **Registry** | Where images are stored and shared (Docker Hub, ECR, GHCR) |

```
Dockerfile  --build-->  Image  --run-->  Container
```

An image is **immutable**; containers are **disposable**. One image can run many containers —
which is exactly what happened when you scaled `catalog` to 5.

```dockerfile
FROM node:22-alpine        # base image to start from
WORKDIR /app               # working folder inside the image
COPY server.js ./          # copy the code in
EXPOSE 3001                # documents the port - does NOT publish it
CMD ["node", "server.js"]  # runs when the container starts
```

> **`EXPOSE` vs `-p`** — the most common confusion. `EXPOSE` is a note in the recipe.
> Publishing a port (`-p`, or `ports:` in compose) is what actually connects it to the outside.
> In this workshop only the gateway has `ports:`, which is why the other three are private.

### 10. Why orchestration

*Explains Lab 3B · answers Quiz 3 Q3*

Docker Compose runs containers on **one machine**. Docker does have restart policies, but this
project sets none — so when you killed a container, nothing brought it back.

**Orchestration** = running containers across many machines and keeping them in the state you
asked for.

| | Docker Compose | Kubernetes |
|---|---|---|
| Machines | One | Many |
| Container dies | Stays dead unless you set a restart policy | A controller creates a replacement Pod |
| Scaling | Manual | Manual or automatic |
| Rolling updates | No | Built in |
| Good for | Development | Production |

### 11. Kubernetes objects

*Explains Lab 3C · answers Quiz 3 Q4*

| Object | Job | Everyday equivalent |
|---|---|---|
| **Pod** | One running container (usually) | One worker |
| **Deployment** | Keeps N pods alive, handles updates | A supervisor |
| **Service** | One stable address in front of pods | The shop's phone number |
| **Node** | A machine in the cluster | A branch office |

A **Service** finds pods by **label**, not by name or IP, which is why pods can be replaced
freely without anything else needing to know.

---

## SESSION 4 — Practices & Production

### 12. Desired state and self-healing

*Explains Labs 4A and 4B · answers Quiz 4 Q1 and Q2*

The central idea:

> You declare **what** you want. Kubernetes continuously compares that with reality and repairs
> the difference. You never write the **how**.

Delete a pod and a replacement appears in seconds. Nobody is paged. That is **self-healing**.

The object doing the repairing is the **Deployment**. A Pod cannot bring itself back — it is the
thing that was deleted. Whenever you are asked "what replaced it", the answer is the controller
that was told to keep N copies running.

### 13. Independent scaling

*Explains Lab 4C · answers Quiz 4 Q3*

What the added complexity buys you:

```bash
kubectl scale deployment catalog --replicas=5   # browsing is popular
# orders stays at 1                             # ordering is rare
```

The monolith could not do this. You would have had to run five copies of *everything*, including
the parts under no load at all. That is the whole argument for independent scaling: capacity goes
where the traffic is, and you pay for nothing else.

### 14. Rolling updates

*Explains Lab 4D · answers Quiz 4 Q4*

```bash
kubectl set image deployment/catalog catalog=bookstore-catalog:v2
kubectl rollout status deployment/catalog
kubectl rollout undo deployment/catalog        # instant rollback
```

Pods are replaced a few at a time, so the old and new versions overlap rather than the service
stopping completely. Staying available *through* the rollout also needs readiness probes and
spare capacity — the workshop manifest has neither, which is why you may see a brief gap.

### 15. Security, briefly

*Background — not examined in Quiz 4*

| Practice | Why |
|---|---|
| Only the gateway is public | Everything else has no route from the internet |
| Authenticate at the gateway | One place to get it right |
| Do not trust internal traffic blindly | A compromised service is inside your network |
| Never hardcode secrets | Use environment variables and a secret store |
| Use supported, minimal base images | Old base images carry known vulnerabilities |
| Do not run containers as root | Limits the damage if one is compromised |
| Scan images in your pipeline | Vulnerabilities arrive in dependencies you never chose |

### 16. What you now need that you did not before

*Answers revision question R4.3 · a common interview question*

Microservices move complexity; they do not remove it. The bill arrives here:

| You now need | Because |
|---|---|
| **Centralised logging** | A single request touches four services' logs |
| **Distributed tracing** | "Which service made this slow?" is otherwise unanswerable |
| **Monitoring per service** | Averages across the system hide a single sick service |
| **Automated deployment** | Ten services cannot be released by hand |
| **Contract discipline** | Changing an API can break a service you have never met |

> If you cannot afford these, you cannot afford microservices. That is the honest test.

### 17. Data across services

*Answers Quiz 1 Q5 · revision questions R4.1 and R4.2*

The hardest real problem, and where most designs fail.

- **No shared database.** The moment two services share tables they can no longer be deployed
  independently — you have built a distributed monolith.
- **Duplicate a little data.** It is normal for `orders` to keep the book title it sold, rather
  than calling `catalog` on every screen.
- **Eventual consistency.** Across services you can no longer rely on a single ACID transaction.
  Often "correct within a second or two" is fine — but you must *decide* that deliberately, and
  per invariant. "Your recommendations are stale" and "you were charged twice" are not the same
  risk.
- **Saga pattern**, for a business transaction spanning services: a sequence of local steps, each
  with a compensating undo if a later step fails.

### 18. Case studies

*Answers revision question R4.5*

| Company | The pressure | What it cost them |
|---|---|---|
| **Amazon** (2001→) | A monolith no team could release independently | Invented "two-pizza teams" and the service-owns-its-data rule |
| **Netflix** (2008→) | A database corruption halted DVD shipping for three days | Years of migration; built Hystrix, Eureka and chaos engineering to survive it |
| **Uber** | ~2,200 services; a simple feature could need changes across many of them | Grouped them into ~70 **domains**, each behind a gateway, with layered dependency rules ("DOMA") |

> Notice the third row. Uber did not go back to a monolith, and did not simply merge everything
> into a few large services — they put **explicit interfaces in front of groups of services** so
> callers depend on one thing instead of twenty. **More services is not automatically better.**
> Several well-known companies have also publicly moved features back *into* monoliths after
> finding the operational cost exceeded the benefit.
>
> Source: [Introducing Domain-Oriented Microservice Architecture](https://www.uber.com/blog/microservice-architecture/), Uber, 23 July 2020.

### 📌 Summary

1. Microservices trade **simplicity** for **independence**. Only trade when you need it.
2. A microservice is independently deployable, owns one capability, and owns its data.
3. **Boundaries** follow business capabilities and teams — never code layers.
4. A **distributed monolith** is worse than a monolith. Watch for it.
5. **API Gateway** = one door. **Service discovery** = find by name, never by IP.
6. Every network call can fail: **timeout**, **fallback**, **circuit breaker**.
7. Decide per dependency whether it is **essential** or **optional**. That is architecture.
8. `Dockerfile → image → container`. Images are immutable, containers disposable.
9. Kubernetes repairs reality to match your **desired state** — self-healing, scaling, rolling updates.
10. You now need logging, tracing, monitoring and automation. That is the bill.

---
---

# PART 3 — Quizzes

**On the day.** Four quizzes, one at the end of each session. **Five questions each.**
Circle one answer per question. Mark your own — your instructor reads out the answers.

**Afterwards.** A revision bank of twenty more multiple-choice questions and twelve written
ones, for revision and viva preparation.

**All answers are in [Part 4](#part-4--answers), with explanations.** Don't look during the
session; do use them afterwards, because the explanations say *why* the tempting wrong answers
are wrong.

**Score yourself:** 5/5 excellent · 4/5 solid · 3/5 review the notes · below 3 ask a question now.

Name: `________________________`  Quiz total: `____ / 20`

---

## The four quizzes — on the day

### QUIZ 1 — Introduction to Microservices
*After Session 1. Score: ____ / 5*

**1. What most accurately defines a monolith?**
- **a)** One codebase deployed as a single unit
- **b)** Badly written or poorly structured code
- **c)** An application that does not use a database
- **d)** Any application older than five years

**2. A team of four is building their first product and has no users yet. What is usually the right choice?**
- **a)** Microservices, so they never have to go through a migration later on
- **b)** Microservices, because that is what modern engineering teams do
- **c)** A monolith, because it is simpler and they do not yet know the boundaries
- **d)** One service per developer, so everyone owns their own deployable

**3. Two features always change together and always ship together. They should most likely be:**
- **a)** In two services, so they can stay independent
- **b)** In the same service, deployed as one unit
- **c)** In two services sharing a single database
- **d)** In the API gateway, which calls both

**4. Which is a genuine advantage of microservices?**
- **a)** There is less total code to write than in a monolith
- **b)** There are fewer moving parts that can fail at runtime
- **c)** Debugging a request across the system becomes easier
- **d)** You can scale and deploy one part without touching the rest

**5. "Database per service" means:**
- **a)** Every service is required to use a different database product from all of the others
- **b)** Each service owns its own data and other services cannot reach into it directly
- **c)** Each service needs its own physical server to store that data on
- **d)** Every database must be duplicated so that a backup always exists

---

### QUIZ 2 — Architectural Patterns
*After Session 2. Score: ____ / 5*

**1. What is the main job of an API Gateway?**
- **a)** To store the application's data on behalf of every service
- **b)** To give clients a single entry point in front of many private services
- **c)** To remove the need for any service to use a database
- **d)** To compile and package the application before it is deployed to production

**2. In `CATALOG_URL: http://catalog:3001`, what is `catalog`?**
- **a)** A fixed IP address, written into the configuration
- **b)** A folder on disk that the gateway reads from
- **c)** A service name, resolved by the platform's DNS
- **d)** A username that the gateway authenticates with

**3. You stopped the recommendations service and the shop kept selling books. This is called:**
- **a)** Graceful degradation
- **b)** Load balancing
- **c)** Horizontal scaling
- **d)** Service discovery

**4. Why does the gateway put a 1-second timeout on the recommendations call?**
- **a)** To reduce the amount of network traffic the system pays for
- **b)** To keep the gateway code shorter and easier to read
- **c)** So one slow service cannot make every page slow and eventually take the site down
- **d)** Because the HTTP specification requires that every request carries a timeout value

**5. Stopping `catalog` broke the whole page, but stopping `recommendations` did not. The reason is:**
- **a)** Catalog was written in a different programming language from the other three services
- **b)** Catalog is essential, and the team decided no useful fallback exists for it
- **c)** Recommendations has fewer lines of code, so it matters less to the system
- **d)** Catalog was started first, so it holds the network connection open

---

### QUIZ 3 — Containerization & Orchestration
*After Session 3. Score: ____ / 5*

**1. What is the relationship between an image and a container?**
- **a)** They are two words for the same thing
- **b)** An image is a running copy of a container
- **c)** A container is a running copy of an image
- **d)** An image runs inside a container

**2. In a Dockerfile, what does `FROM node:22-alpine` do?**
- **a)** Downloads your source code into the image being built
- **b)** Starts from an existing image that already has Node installed
- **c)** Sets the port that the application will listen on
- **d)** Runs the application once the image has finished building successfully

**3. You killed a container in this workshop's Compose setup and it stayed dead. Why?**
- **a)** The image became corrupted at the moment the container was killed
- **b)** Compose needs root privileges before it is allowed to restart anything
- **c)** Compose only restarts stopped containers on a fixed schedule that it runs periodically
- **d)** No restart policy is set, and Compose will not maintain a number of healthy copies

**4. Which correctly matches the Kubernetes objects?**
- **a)** Pod = a running container · Deployment = keeps N pods alive · Service = a stable address
- **b)** Pod = a physical machine · Deployment = a container · Service = a database
- **c)** Pod = a stable address · Deployment = a physical machine · Service = a running container
- **d)** They are three different names for the same underlying object in the API

**5. The gateway's `CATALOG_URL` was unchanged when you moved from Compose to Kubernetes. Why does that matter?**
- **a)** It does not matter, it was a coincidence of how the lab was written
- **b)** Because both platforms resolve service names, so the application code is portable
- **c)** Because Kubernetes reads the same docker-compose.yml file directly when it starts up
- **d)** Because the IP address of the catalog service happened to stay the same

---

### QUIZ 4 — Practices & Production
*After Session 4. Score: ____ / 5*

**1. You deleted a pod and a new one appeared by itself. Which object made that happen?**
- **a)** The Pod
- **b)** The Service
- **c)** The Deployment
- **d)** The container image

**2. "Desired state" means:**
- **a)** The state that the system was in the last time it was known to be working correctly
- **b)** You declare what you want, and the platform continuously repairs reality to match
- **c)** A backup of the cluster taken immediately before a deployment
- **d)** The final step of a rolling update, once every pod is replaced

**3. You scaled `catalog` to 5 and left `orders` at 1. What is the point?**
- **a)** Catalog is a far more important service than orders, so it deserves more of the cluster resources
- **b)** Kubernetes schedules more efficiently when a Deployment has an odd number of pods
- **c)** You can give capacity to the busy part without paying for the rest — impossible in a monolith
- **d)** Having more pods of any service makes every future deployment complete faster

**4. What does a rolling update do?**
- **a)** Replaces instances gradually so the service stays available throughout
- **b)** Stops every instance, then starts them all again on the new version
- **c)** Rolls the database back to the state it was in the previous day
- **d)** Applies updates only during a scheduled weekend maintenance window

**5. Which is the strongest reason NOT to adopt microservices?**
- **a)** Writing the application code itself takes noticeably longer than it would in an equivalent monolith
- **b)** They use more disk space and memory than an equivalent monolith would use
- **c)** Your team is small, the boundaries are unclear, and the operational cost exceeds the benefit
- **d)** They cannot be run at all without Kubernetes or a managed cloud provider

---

## The revision bank — afterwards

**Not used during the workshop.** These are for revision, viva preparation and interviews.
Twenty more multiple-choice questions, then twelve you have to answer in your own words.

### R1 — Principles (after Session 1)

**R1.1 Conway's Law says:**
- **a)** A system's structure ends up mirroring the organisation that built it
- **b)** Systems become slower as they grow larger
- **c)** Every microservice should have exactly one developer
- **d)** The first version of any system should be thrown away

**R1.2 What is a "distributed monolith"?**
- **a)** A monolith running on more than one machine for redundancy
- **b)** A very large microservice that does too many things
- **c)** Services that must be deployed together and share a database — the cost of both, the benefit of neither
- **d)** A monolith that has been rewritten in more than one language

**R1.3 A "modular monolith" is:**
- **a)** A monolith with no external dependencies at all
- **b)** One deployable unit, but with clean internal boundaries between its parts
- **c)** Another name for microservices
- **d)** A monolith split across several repositories

**R1.4 Which statement about the word "small" in "microservice" is correct?**
- **a)** A microservice should be under 500 lines of code
- **b)** Small means it must run in under 100 MB of memory
- **c)** Small means it must be written and maintained by a single developer
- **d)** Small refers to responsibility — it does one thing — not to line count

**R1.5 You split a system by `controllers`, `models` and `utils`. What have you built?**
- **a)** A textbook microservices architecture
- **b)** A distributed monolith, because every feature change touches all three
- **c)** A modular monolith
- **d)** A correctly layered system, which is the recommended approach

### R2 — Patterns (after Session 2)

**R2.1 Which call is best suited to being asynchronous (an event)?**
- **a)** "Give me the list of books to display on this page"
- **b)** "Is this user's password correct?"
- **c)** "An order was placed" — so email, analytics and shipping can each react
- **d)** "What is the current price of this item?"

**R2.2 A circuit breaker does what?**
- **a)** Restarts a service that has crashed
- **b)** Spreads requests evenly across several copies of a service
- **c)** Encrypts the traffic travelling between two services
- **d)** After repeated failures, stops calling a service for a while and fails immediately

**R2.3 Why is a *slow* dependency often more dangerous than one that is completely down?**
- **a)** A failure returns instantly, but slow calls pile up and exhaust your connections
- **b)** Slow responses use more bandwidth than failures do
- **c)** Slow services corrupt data, whereas failed ones do not
- **d)** It is not — a service being down is always worse

**R2.4 What is the main *risk* of the API Gateway pattern?**
- **a)** It makes the client code more complicated
- **b)** It exposes every internal service to the internet
- **c)** It is a single point of failure and tends to accumulate logic that belongs in the services
- **d)** It prevents you from using more than one programming language

**R2.5 A retry is appropriate for which kind of failure?**
- **a)** Any failure at all — you should always retry
- **b)** A transient one, such as a brief network blip, and with a strict limit
- **c)** A validation error, such as a malformed request
- **d)** A permission error, such as an invalid password

### R3 — Containers & orchestration (after Session 3)

**R3.1 What does `EXPOSE 3001` in a Dockerfile actually do?**
- **a)** Publishes port 3001 so your browser can reach the container
- **b)** Documents the port — it does not publish anything by itself
- **c)** Forces the application to listen on port 3001
- **d)** Opens port 3001 in the host machine's firewall

**R3.2 In the workshop, why can your browser not reach `catalog` directly?**
- **a)** Catalog has no `ports:` entry, so nothing connects it to the outside
- **b)** Catalog rejects any request that does not come from the gateway
- **c)** Catalog listens only on IPv6, which the browser does not use
- **d)** Docker blocks all traffic to containers unless you disable it

**R3.3 You changed one line in `catalog/server.js`. What must happen before Kubernetes runs it?**
- **a)** Nothing — Kubernetes reads the source file directly from disk
- **b)** Restart the pod; it re-reads the source code on startup
- **c)** Edit the running container in place with `kubectl edit`
- **d)** Rebuild the image, make it available to the cluster, then update the Deployment

**R3.4 "An image is immutable" means:**
- **a)** It cannot be deleted once it has been built
- **b)** It can only be run by the user account that built it
- **c)** Once built it never changes — to change anything you build a new one
- **d)** Its files are read-only inside the running container

**R3.5 Why did the workshop use `minikube image load`?**
- **a)** Because the cluster has its own image store and cannot see the ones you built
- **b)** To compress the images so that the pods start faster
- **c)** Because Kubernetes is unable to build container images itself
- **d)** To scan the images for vulnerabilities before deploying them

### R4 — Practice & production (after Session 4)

**R4.1 Two services both need a customer's name. Which is the WORST option?**
- **a)** One service calls the other's API whenever it needs the name
- **b)** One service keeps a copy of the name, updated when it changes
- **c)** The name is duplicated deliberately and allowed to be briefly out of date
- **d)** Both services read and write the same table in a shared database

**R4.2 "Eventual consistency" means:**
- **a)** Different services may briefly disagree, then converge on the same answer
- **b)** The data will eventually be lost unless it is backed up
- **c)** Consistency checks are run in a batch at the end of each day
- **d)** The database eventually becomes inconsistent and must be rebuilt

**R4.3 Which capability is NOT essentially required before adopting microservices?**
- **a)** Automated deployment
- **b)** Centralised logging
- **c)** A service mesh such as Istio or Linkerd
- **d)** Per-service monitoring

**R4.4 Why is distributed tracing needed in a way it was not for a monolith?**
- **a)** Because microservices generate more log data overall
- **b)** Because one user request now passes through several services, and no single log shows the whole journey
- **c)** Because containers delete their logs when they stop running
- **d)** Because Kubernetes does not support logging natively

**R4.5 Uber grouped roughly 2,200 microservices into about 70 domains, each behind a gateway. The lesson is:**
- **a)** Microservices do not work at very large scale
- **b)** Every company should eventually return to a monolith
- **c)** Services should be split strictly by programming language
- **d)** More services is not automatically better; too many becomes unmanageable

### R5 — Answer in your own words

Two or three sentences each. These are the ones most likely to be asked in a viva or interview.

1. Define a microservice without using the word "small".
2. Your friend's team of three wants to rewrite their working monolith as microservices. Give the two strongest questions you would ask before they start.
3. Explain a cascading failure to someone who has never heard the term.
4. Why can you not simply hard-code another service's IP address?
5. When would you choose an event over a direct HTTP call?
6. What does "graceful degradation" mean? Give an example from an app you use.
7. What is the difference between an image and a container?
8. What does Docker Compose NOT do, that Kubernetes does?
9. Explain "desired state" and why it produces self-healing.
10. Why is independent scaling impossible in a monolith?
11. Name three things you must have in place operationally before microservices are a good idea.
12. Your system has ten services and every feature change requires you to modify four of them. What has gone wrong, and what is it called?

---
---

# PART 4 — Answers

> ⚠️ **Do not read this during the workshop.** Your instructor reads the quiz answers out after
> each quiz, and the only person a peek cheats is you. They are printed here so you can revise
> afterwards.

## Answers — the four quizzes

Each answer says **why**, and where useful, why a tempting wrong option is wrong.

### Quiz 1 — Introduction

1. **a** — a monolith is defined by its *deployment shape*: one codebase, shipped as one unit.
   *Not b — plenty of monoliths are beautifully written. "Monolith" is not an insult.*
2. **c** — a monolith. With no users, the boundaries are still guesses, and a wrong boundary is
   far more expensive to move later than a module is to extract.
3. **b** — the same service. If two things always change and ship together, splitting them just
   puts a network call in the middle of one idea.
4. **d** — independent scaling and deployment.
   *a, b and c are the **costs** of microservices, not the benefits: you write more total code,
   you get more things that can fail, and debugging spans several services.*
5. **b** — each service owns its data and nobody else reaches in.
   *Not a — every service may happily use PostgreSQL. The rule is about **ownership**, not product.*

### Quiz 2 — Patterns

1. **b** — one public entry point in front of many private services.
2. **c** — a service name, resolved by the platform's DNS. Containers move and their IPs change;
   names do not.
3. **a** — graceful degradation: losing a *feature* instead of losing the *system*.
4. **c** — to prevent a cascading failure. Without the timeout, waiting requests pile up until
   the gateway runs out of connections and the whole site dies — caused by an optional feature.
5. **b** — `catalog` is an essential dependency and the team decided no useful fallback exists.
   *This is a design decision, not a property of the code. It is the most important idea in
   Session 2.*

### Quiz 3 — Containers & Orchestration

1. **c** — a container is a running copy of an image. One image → many containers, which is
   exactly what you saw when you scaled `catalog` to 5.
2. **b** — start from an existing image that already has Node installed. You never install Node
   yourself; it arrives inside the base image.
3. **d** — no restart policy is set in `docker-compose.yml`. Docker *can* restart containers if
   you ask it to; what it will not do is keep a declared number of healthy copies running. That
   gap is the entire reason orchestration exists.
4. **a** — Pod = one running container · Deployment = keeps N pods alive · Service = a stable
   address in front of them.
5. **b** — both platforms resolve service names, so the same application code runs unchanged on
   either. Your `CATALOG_URL` never changed, and that is what makes the design portable.

### Quiz 4 — Practices & Production

1. **c** — the **Deployment**. Its only job is to keep the declared number of pods running.
   *Not a — the Pod is what was deleted; it cannot resurrect itself.*
2. **b** — you declare what you want and the platform continuously repairs reality to match.
   Because that comparison never stops, self-healing is automatic rather than scripted.
3. **c** — you gave capacity to the busy part and paid nothing for the rest. In a monolith you
   would have had to run five copies of the entire shop, including the parts under no load.
4. **a** — instances are replaced gradually, so the service stays available throughout.
5. **c** — small team, unclear boundaries, and operational cost exceeding the benefit.
   *a, b and d are either false or trivial. The real reason is always organisational, not technical.*

## Answers — the revision bank

**R1** — 1: **a** · 2: **c** · 3: **b** · 4: **d** · 5: **b**

**R2** — 1: **c** · 2: **d** · 3: **a** · 4: **c** · 5: **b**

**R3** — 1: **b** · 2: **a** · 3: **d** · 4: **c** · 5: **a**

**R4** — 1: **d** · 2: **a** · 3: **c** · 4: **b** · 5: **d**

**R5 — what a good answer contains**

1. Independently deployable · owns one business capability · owns its own data.
2. *"What problem are you solving that the monolith cannot?"* and *"Can you deploy, monitor and debug ten services with three people?"*
3. One service slows down → callers pile up waiting → they run out of connections → services that had nothing to do with the original fault also fail → the whole system is down.
4. Containers are created and destroyed constantly and their IP addresses change every time. Names stay stable; the platform resolves them.
5. When you are announcing that something *happened* and do not need an answer to continue. Use HTTP when you need the reply before you can proceed.
6. Losing a feature instead of losing the system — e.g. a shopping site whose recommendation panel is empty but which still takes orders.
7. An image is the sealed, immutable package; a container is a running copy of it. One image → many containers.
8. Compose runs on one machine and does not watch containers — a dead one stays dead. Kubernetes maintains desired state, restarts, scales and does rolling updates.
9. You declare what you want; the platform continuously compares that with reality and fixes the difference. Because the comparison never stops, a deleted pod is replaced automatically.
10. Everything is one deployable unit, so adding capacity means running more copies of the *entire* application, including the parts under no load.
11. Any three of: automated deployment · centralised logging · distributed tracing · per-service monitoring · API contract discipline.
12. The services are not really independent — they are coupled and must change together. This is a **distributed monolith**.

## Answers — the lab "Predict first" questions

> Guess before you read. The lab is worthless if you read the answer first.

| Where | Question | Answer |
|---|---|---|
| Lab 2B step 4 | Stop `catalog`? | The page goes **red** — but only after a refresh, because the book list is fetched once on page load. There is no fallback because there is no shop without books |
| Lab 3A | Is the gateway sharing traffic with `catalog-solo`? | **No.** Different network, different name. Containers need a shared network *and* a name — which is the whole point of service discovery |
| Lab 3B | What brings a killed container back? | **Nothing here.** No restart policy is set, and Compose will not maintain a healthy replica count. This is the gap Kubernetes fills |
| Lab 4B | Delete a pod? | A replacement appears within seconds. The **Deployment** did it |

---
---

# PART 5 — Revision sheet
### Condensed. Print it. Revise from it.

Everything here is covered in depth in Part 2 — this is the compressed version.

## Every idea as a picture

| Concept | Picture |
|---|---|
| **Monolith** | One big **shop** — one door, one till, one power switch |
| **Microservices** | A **market** of small stalls, each with its own owner and stock |
| **Service boundary** | The **wall** between two stalls — who owns what |
| **API Gateway** | The market's **single entrance** |
| **Service discovery** | Asking for a stall **by name**, not by GPS coordinates |
| **Timeout** | You will wait 1 minute for coffee, then leave |
| **Fallback** | No coffee? Here is tea. You are not sent home |
| **Graceful degradation** | One stall shut; **the market stays open** |
| **Cascading failure** | One blocked aisle, and nobody in the market can move |
| **Image → container** | A **recipe** → the **meal** cooked from it |
| **Pod** | One **worker** |
| **Deployment** | A **supervisor**: "always keep 3 at the counter" |
| **Service (K8s)** | The shop's **phone number** — staff change, number doesn't |

## The trade ⭐

> **Microservices trade SIMPLICITY for INDEPENDENCE.**
> Only make the trade when you need the independence.

| | Monolith | Microservices |
|---|---|---|
| Deploy · scale · fail | All together | One at a time |
| Debugging | One stack trace | Four services' logs |
| A call to another part | Function call | **Network call that can fail** |
| Best for | Small team, new domain | Many teams, proven boundaries |

## The five-second checks

- **Is it a microservice?** Independently deployable · owns one capability · owns its data ·
  small in *responsibility*, not lines.
- **Where is the boundary?** Split by **business capability**, never by code layer. If two things
  always change, deploy or need the same data together — one service.
- **Should we do this at all?** No, if the team is small, the domain is new, deployment is manual,
  or monitoring is weak. Start with a **modular monolith** and extract.
- **Is this a distributed monolith?** Must deploy together + share a database = yes, and it is
  worse than the monolith you started with.
- **Is this dependency essential?** Essential → fail honestly. Optional → degrade quietly.
  *That decision is architecture, not coding.*

## Commands worth remembering

```bash
docker build -t bookstore-catalog .      # Dockerfile -> image
docker compose up --build                # start the whole system
docker compose up -d --scale catalog=5   # one image, five containers

kubectl apply -f k8s/bookstore.yaml
kubectl get pods
kubectl scale deployment catalog --replicas=5
kubectl delete pod <name>                        # watch it come back
kubectl set image deployment/catalog catalog=bookstore-catalog:v2
kubectl rollout status deployment/catalog
kubectl rollout undo deployment/catalog
kubectl port-forward service/gateway 8080:8080
minikube image load <image>                      # local image into the cluster
```

> **`EXPOSE` vs publishing a port:** `EXPOSE` is a note in the Dockerfile. `ports:` / `-p`
> actually connects it. Only the **gateway** has `ports:` — that's why the rest are private.

## The bill

Microservices **move** complexity, they don't remove it. You now need centralised **logging** ·
distributed **tracing** · per-service **monitoring** · automated **deployment** ·
API **contract discipline**.

> **If you can't afford these, you can't afford microservices.**

## Six answers worth memorising

1. **What is a microservice?** Independently deployable, owns one business capability and its own data. Small in responsibility, not lines.
2. **When not to?** Small team, unclear domain, no automated deployment or monitoring. Start with a modular monolith.
3. **How do you find boundaries?** By business capability and team ownership — never by code layer. Things that change together stay together.
4. **What's a distributed monolith?** Services that must deploy together and share a database. All the cost, none of the benefit.
5. **Why timeouts?** Without one, a slow dependency exhausts your connections and causes a cascading failure. Slow is worse than down.
6. **What does Kubernetes add?** Compose runs containers on one machine and will not maintain a declared number of healthy copies. Kubernetes continuously repairs desired state across many — replacement, scaling, rolling updates.

> **The one sentence:**
> **Microservices buy you independence — to deploy, scale and fail separately — and you pay for
> it with network calls that can fail, data you can no longer join, and a system you can no
> longer see without tooling.**

---
---

# Reference

## Glossary

| Term | Meaning |
|---|---|
| Monolith | One codebase deployed as a single unit |
| Microservice | Independently deployable service owning one capability and its data |
| Modular monolith | One deployable with clean internal boundaries |
| Distributed monolith | Services that must be deployed together — the worst of both |
| Service boundary | The line around one business capability |
| Bounded context | The area in which one model of the business applies consistently |
| Conway's Law | System structure mirrors the organisation that built it |
| API Gateway | Single public entry point in front of private services |
| Service discovery | Finding a service by name rather than address |
| Load balancing | Spreading requests across several copies |
| Synchronous | Caller waits for a reply |
| Asynchronous / event-driven | Caller announces something happened and does not wait |
| Timeout | The longest you will wait before giving up |
| Retry | Attempting again after a transient failure |
| Fallback | A reduced answer when the real one is unavailable |
| Circuit breaker | Stop calling a failing service for a while |
| Graceful degradation | Losing a feature instead of the system |
| Cascading failure | One service's failure bringing down the rest |
| Image / Container | Sealed package / a running copy of it |
| Dockerfile | Instructions for building an image |
| Registry | Where images are stored and shared |
| Orchestration | Running containers across machines and keeping them healthy |
| Pod | Smallest unit Kubernetes runs; usually one container |
| Deployment | Keeps N pods running; handles updates |
| Service (K8s) | Stable address and load balancer for pods |
| Desired state | What you declared; the platform makes reality match |
| Self-healing | Automatic replacement of failed pods |
| Rolling update | Replacing instances gradually, with no downtime |
| Eventual consistency | Data agrees across services shortly, not instantly |
| Saga | A multi-service transaction with compensating undo steps |

## Interview preparation

The twelve written questions in **R5** are the interview set, and the model answers are in
Part 4. Practise saying them out loud — being able to argue *when not to use microservices* is
the single most common question on this topic.

## Further reading

- *Building Microservices* — Sam Newman (the standard text)
- *Monolith to Microservices* — Sam Newman (on migrating)
- Martin Fowler on microservices — `https://martinfowler.com/microservices/`
- "MonolithFirst" — `https://martinfowler.com/bliki/MonolithFirst.html`
- Microservices patterns — `https://microservices.io/patterns/`
- The Twelve-Factor App — `https://12factor.net/`
- Kubernetes basics — `https://kubernetes.io/docs/tutorials/kubernetes-basics/`

## After the workshop

Your assignment brief is in [Assignment.md](Assignment.md). Budget **4–5 hours** — Parts 1–3
repeat the workshop with one new service, and Part 4 is writing. It reuses everything in this
repository — no new tools.
