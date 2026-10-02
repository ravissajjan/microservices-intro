# Workshop Notes
### System Design for Modern Microservices — Principles, Patterns & Practices

Read alongside the labs, or afterwards. Everything covered on the day, in order.

---

# PART 1 — Principles

## 1. The monolith, fairly

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

## 2. What a microservice actually is

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

## 3. Service boundaries

This is the hardest part of the whole subject, and the part tools cannot help with.

**Service boundary** = the line around one business capability that one team can own, change and
deploy without asking anybody else.

### How to find them

- **Follow the business, not the code.** `orders`, `payments`, `shipping` are capabilities.
  `controllers`, `models`, `utils` are layers — splitting by those gives you a distributed mess.
- **Follow the teams.** Conway's Law: a system's structure ends up mirroring the organisation
  that built it. Plan for it rather than fighting it.
- **Follow the data.** If two things need the same table constantly, they are probably one service.
- **Follow the change.** Things that always change together belong together.

### The distributed monolith

The classic failure. You split into services, but they all call each other constantly, share one
database, and must be deployed together.

> You now have all the complexity of microservices and none of the independence.
> **This is worse than the monolith you started with.**

Warning signs: you cannot deploy one service alone · one schema change breaks three services ·
your local setup needs all nine services running · every feature touches four repositories.

## 4. When not to use microservices

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

# PART 2 — Patterns

## 5. API Gateway

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

## 6. Service discovery

Containers are created and destroyed constantly, and their IP addresses change every time.
Hard-coding addresses cannot work.

**Service discovery** = finding a service by **name** instead of by address.

```yaml
CATALOG_URL: http://catalog:3001    # "catalog" is a name, not an address
```

Docker Compose and Kubernetes both run an internal DNS server that resolves those names to
whatever IPs are currently alive. When you scaled `catalog` to 3, the same name started
load-balancing across all three, and the gateway never knew.

> 📌 The workshop's proof: the gateway's configuration was **byte-identical** on Compose and on
> Kubernetes. Two completely different platforms, one unchanged application.

## 7. Synchronous vs asynchronous

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

## 8. Designing for resilience

In a monolith, a function call cannot "be down". Across a network, every call can fail, hang, or
succeed slowly — and slow is often worse than down.

| Pattern | What it does |
|---|---|
| **Timeout** | Give up after N seconds instead of waiting forever |
| **Retry** | Try again — but only for *transient* failures, and with a limit |
| **Fallback** | Return a reduced answer instead of an error |
| **Circuit breaker** | After repeated failures, stop calling for a while and fail instantly |
| **Bulkhead** | Isolate resources so one struggling dependency cannot consume them all |

### Cascading failure

The thing all of these exist to prevent:

```
recommendations gets slow
   → gateway requests pile up waiting
      → gateway runs out of connections
         → catalog and orders requests cannot get through either
            → the ENTIRE SITE is down, because of an optional feature
```

One 1-second timeout and a fallback stop the whole chain at step one.

### Essential vs optional

The judgement call that makes it architecture rather than coding:

| Dependency | Essential? | Behaviour when it fails |
|---|---|---|
| `catalog` | **Yes** | Fail honestly — there is no shop without books |
| `orders` | **Yes** | Fail honestly — never pretend to take money |
| `recommendations` | **No** | Degrade quietly — hide the panel, keep selling |

**Graceful degradation** = losing a feature instead of losing the system.

---

# PART 3 — Containers and orchestration

## 9. Docker in one page

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
which is exactly what happened when you scaled `catalog` to 3.

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

## 10. Why orchestration

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

## 11. Kubernetes objects

| Object | Job | Everyday equivalent |
|---|---|---|
| **Pod** | One running container (usually) | One worker |
| **Deployment** | Keeps N pods alive, handles updates | A supervisor |
| **Service** | One stable address in front of pods | The shop's phone number |
| **Node** | A machine in the cluster | A branch office |

A **Service** finds pods by **label**, not by name or IP, which is why pods can be replaced
freely without anything else needing to know.

### Desired state

The central idea:

> You declare **what** you want. Kubernetes continuously compares that with reality and repairs
> the difference. You never write the **how**.

Delete a pod and a replacement appears in seconds. Nobody is paged. That is **self-healing**.

### Independent scaling

What the added complexity buys you:

```bash
kubectl scale deployment catalog --replicas=5   # browsing is popular
# orders stays at 1                             # ordering is rare
```

The monolith could not do this. You would have had to run five copies of everything.

### Rolling updates

```bash
kubectl set image deployment/catalog catalog=bookstore-catalog:v2
kubectl rollout status deployment/catalog
kubectl rollout undo deployment/catalog        # instant rollback
```

Pods are replaced a few at a time, so the old and new versions overlap rather than the service
stopping completely. Staying available *through* the rollout also needs readiness probes and
spare capacity — the workshop manifest has neither, which is why you may see a brief gap.

---

# PART 4 — Practice

## 12. Security, briefly

| Practice | Why |
|---|---|
| Only the gateway is public | Everything else has no route from the internet |
| Authenticate at the gateway | One place to get it right |
| Do not trust internal traffic blindly | A compromised service is inside your network |
| Never hardcode secrets | Use environment variables and a secret store |
| Use supported, minimal base images | Old base images carry known vulnerabilities |
| Do not run containers as root | Limits the damage if one is compromised |
| Scan images in your pipeline | Vulnerabilities arrive in dependencies you never chose |

## 13. What you now need that you did not before

Microservices move complexity; they do not remove it. The bill arrives here:

| You now need | Because |
|---|---|
| **Centralised logging** | A single request touches four services' logs |
| **Distributed tracing** | "Which service made this slow?" is otherwise unanswerable |
| **Monitoring per service** | Averages across the system hide a single sick service |
| **Automated deployment** | Ten services cannot be released by hand |
| **Contract discipline** | Changing an API can break a service you have never met |

> If you cannot afford these, you cannot afford microservices. That is the honest test.

## 14. Data across services

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

## 15. Case studies

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

## 📌 Summary

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

# Glossary

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

---

# Interview questions

1. What is a microservice? Give a definition that is not "a small service".
2. When would you advise a team **against** microservices?
3. How do you decide where one service ends and the next begins?
4. What is a distributed monolith, and why is it worse than a monolith?
5. What does an API Gateway do, and what is its main risk?
6. Why can you not hard-code the address of another service?
7. Synchronous or asynchronous — how do you choose?
8. Explain a cascading failure, and two patterns that prevent one.
9. What is graceful degradation? Give an example from a system you have used.
10. What is the difference between an image and a container?
11. What does Kubernetes give you that Docker Compose does not?
12. Explain "desired state".
13. Why is independent scaling impossible in a monolith?
14. Two services need the same data. What are your options, and what does each cost?
15. What operational capabilities must exist before microservices are a good idea?

---

# Further reading

- *Building Microservices* — Sam Newman (the standard text)
- *Monolith to Microservices* — Sam Newman (on migrating)
- Martin Fowler on microservices — `https://martinfowler.com/microservices/`
- "MonolithFirst" — `https://martinfowler.com/bliki/MonolithFirst.html`
- Microservices patterns — `https://microservices.io/patterns/`
- The Twelve-Factor App — `https://12factor.net/`
- Kubernetes basics — `https://kubernetes.io/docs/tutorials/kubernetes-basics/`


# Reference — answers


## Answers to the "Predict first" questions

| Where | Question | Answer |
|---|---|---|
| Lab 2B step 4 | Stop `catalog`? | The page goes **red** — but only after a refresh, because the book list is fetched once on page load. There is no fallback because there is no shop without books |
| Lab 3A | Is the gateway sharing traffic with `catalog-solo`? | **No.** Different network, different name. Containers need a shared network *and* a name — which is the whole point of service discovery |
| Lab 3B | What brings a killed container back? | **Nothing here.** No restart policy is set, and Compose will not maintain a healthy replica count. This is the gap Kubernetes fills |
| Lab 4B | Delete a pod? | A replacement appears within seconds. The **Deployment** did it |

These four exist **only here**. Do not paste them into a student file — the lab is worthless if
they read the answer before they guess.

## Quiz answer key


**Quiz 1 — Introduction**
1. **a** — one codebase deployed as a single unit
2. **c** — a monolith; they don't know the boundaries yet
3. **b** — same service
4. **d** — scale and deploy one part independently
5. **b** — each service owns its data, nobody reaches in

**Quiz 2 — Patterns**
1. **b** — single entry point in front of private services
2. **c** — a service name, resolved by DNS
3. **a** — graceful degradation
4. **c** — so one slow service can't take the site down
5. **b** — catalog is essential; no useful fallback exists

**Quiz 3 — Containers & Orchestration**
1. **c** — a container is a running copy of an image
2. **b** — start from an image that already has Node
3. **d** — no restart policy is set, and Compose will not maintain a replica count
4. **a** — Pod = running container, Deployment = keeps N alive, Service = stable address
5. **b** — both platforms resolve names, so the code is portable

**Quiz 4 — Practices & Production**
1. **c** — the Deployment
2. **b** — declare what you want, the platform repairs reality
3. **c** — give capacity to the busy part only
4. **a** — replaces instances gradually
5. **c** — small team, unclear boundaries, cost exceeds benefit