# Quizzes
### System Design for Modern Microservices

**Part 1 — on the day.** Four quizzes, one at the end of each session. **Five questions each.**
Circle one answer per question. Mark your own — your instructor reads out the answers.

**Part 2 — afterwards.** A revision bank of twenty more multiple-choice questions and twelve
written ones, for revision and viva preparation.

**All answers are at the back of this file, with explanations** — Part 2's first, then Part 1's.
Don't look during the session; do use them afterwards, because the explanations say *why* the
tempting wrong answers are wrong.

**Score yourself:** 5/5 excellent · 4/5 solid · 3/5 review the notes · below 3 ask a question now.

Name: `________________________`  Part 1 total: `____ / 20`

---

# PART 1 — On the day

---

# QUIZ 1 — Introduction to Microservices
*After Session 1. Score: ____ / 5*

**1. What most accurately defines a monolith?**
- **a)** One codebase deployed as a single unit
- **b)** Badly written or poorly structured code
- **c)** An application that does not use a database
- **d)** Any application older than five years

**2. A team of four is building their first product and has no users yet. What is usually the right choice?**
- **a)** Microservices, so they never have to migrate later
- **b)** Microservices, because it is modern practice
- **c)** A monolith, because it is simpler and they do not yet know the boundaries
- **d)** One service per developer

**3. Two features always change together and always ship together. They should most likely be:**
- **a)** In two services, to keep them independent
- **b)** In the same service
- **c)** In two services sharing one database
- **d)** In the API gateway

**4. Which is a genuine advantage of microservices?**
- **a)** Less total code to write
- **b)** Fewer things that can fail
- **c)** Easier debugging across the system
- **d)** You can scale and deploy one part without touching the rest

**5. "Database per service" means:**
- **a)** Every service must use a different database product
- **b)** Each service owns its own data and other services cannot reach into it directly
- **c)** Each service needs its own physical server
- **d)** Databases must be duplicated for backup

---

# QUIZ 2 — Architectural Patterns
*After Session 2. Score: ____ / 5*

**1. What is the main job of an API Gateway?**
- **a)** To store the application's data
- **b)** To give clients a single entry point in front of many private services
- **c)** To replace the need for a database
- **d)** To compile the application

**2. In `CATALOG_URL: http://catalog:3001`, what is `catalog`?**
- **a)** A fixed IP address
- **b)** A folder on disk
- **c)** A service name, resolved by the platform's DNS
- **d)** A username

**3. You stopped the recommendations service and the shop kept selling books. This is called:**
- **a)** Graceful degradation
- **b)** Load balancing
- **c)** Horizontal scaling
- **d)** Service discovery

**4. Why does the gateway put a 1-second timeout on the recommendations call?**
- **a)** To save money on network traffic
- **b)** To make the code shorter
- **c)** So one slow service cannot make every page slow and eventually take the site down
- **d)** Because HTTP requires a timeout

**5. Stopping `catalog` broke the whole page, but stopping `recommendations` did not. The reason is:**
- **a)** Catalog was written in a different language from the other three services
- **b)** Catalog is essential, and the team decided no useful fallback exists for it
- **c)** Recommendations has fewer lines of code, so it matters less to the system
- **d)** Catalog was started first, so it holds the network connection open

---

# QUIZ 3 — Containerization & Orchestration
*After Session 3. Score: ____ / 5*

**1. What is the relationship between an image and a container?**
- **a)** They are two words for the same thing
- **b)** An image is a running copy of a container
- **c)** A container is a running copy of an image
- **d)** An image runs inside a container

**2. In a Dockerfile, what does `FROM node:22-alpine` do?**
- **a)** Downloads your source code
- **b)** Starts from an existing image that already has Node installed
- **c)** Sets the port the app listens on
- **d)** Runs the application

**3. You killed a container in this workshop's Compose setup and it stayed dead. Why?**
- **a)** The image had become corrupted when the container stopped
- **b)** You needed to be root for Compose to restart it
- **c)** Compose only restarts containers on a scheduled interval
- **d)** No restart policy is set, and Compose will not maintain a number of healthy copies

**4. Which correctly matches the Kubernetes objects?**
- **a)** Pod = a running container · Deployment = keeps N pods alive · Service = a stable address
- **b)** Pod = a machine · Deployment = a container · Service = a database
- **c)** Pod = a stable address · Deployment = a machine · Service = a running container
- **d)** They are three names for the same underlying object

**5. The gateway's `CATALOG_URL` was unchanged when you moved from Compose to Kubernetes. Why does that matter?**
- **a)** It does not matter; it was a coincidence
- **b)** Because both platforms resolve service names, so the application code is portable
- **c)** Because Kubernetes reads docker-compose.yml
- **d)** Because the IP address happened to be the same

---

# QUIZ 4 — Practices & Production
*After Session 4. Score: ____ / 5*

**1. You deleted a pod and a new one appeared by itself. Which object made that happen?**
- **a)** The Pod
- **b)** The Service
- **c)** The Deployment
- **d)** The container image

**2. "Desired state" means:**
- **a)** The state the system was in when it last worked
- **b)** You declare what you want, and the platform continuously repairs reality to match
- **c)** A backup taken before deployment
- **d)** The final step of a rolling update

**3. You scaled `catalog` to 5 and left `orders` at 1. What is the point?**
- **a)** Catalog is a more important service than orders, so it deserves more resources
- **b)** Kubernetes performs better when a Deployment has an odd number of pods
- **c)** You can give capacity to the busy part without paying for the rest — impossible in a monolith
- **d)** Having more pods of any service makes deployments complete faster

**4. What does a rolling update do?**
- **a)** Replaces instances gradually so the service stays available throughout
- **b)** Stops everything, then starts the new version
- **c)** Rolls the database back to the previous day's state
- **d)** Applies updates only during a scheduled weekend window

**5. Which is the strongest reason NOT to adopt microservices?**
- **a)** Writing the code itself takes noticeably longer than in a monolith
- **b)** They use more disk space and memory than an equivalent monolith
- **c)** Your team is small, the boundaries are unclear, and the operational cost exceeds the benefit
- **d)** They cannot be run without Kubernetes or a cloud provider

---

# PART 2 — Revision bank

**Not used during the workshop.** These are for revision, viva preparation and interviews.
**Answers are at the very bottom** — cover them and do the questions first.

Twenty more multiple-choice questions, then twelve you have to answer in your own words.

---

## R1 — Principles (after Session 1)

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

---

## R2 — Patterns (after Session 2)

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

---

## R3 — Containers & orchestration (after Session 3)

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

---

## R4 — Practice & production (after Session 4)

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

---

## R5 — Answer in your own words

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

# Answers — Part 2 revision bank

> Cover this section until you have attempted the questions.

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

---

# Answers — Part 1

> ⚠️ **Do not read this during the workshop.** Your instructor reads these out after each quiz,
> and the only person a peek cheats is you. They are printed here so you can revise afterwards.

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
   exactly what you saw when you scaled `catalog` to 3.
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

---

## After the workshop

Your assignment brief is in `Assignment.md`. Budget **4–5 hours** — Parts 1–3 repeat the workshop
with one new service, and Part 4 is writing. It reuses everything in this repository — no new
tools.
