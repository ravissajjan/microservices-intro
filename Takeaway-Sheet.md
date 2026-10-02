# Takeaway Sheet
### Microservices, condensed. Print it. Revise from it.

---

## 1. Every idea as a picture

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

---

## 2. The trade ⭐

> **Microservices trade SIMPLICITY for INDEPENDENCE.**
> Only make the trade when you need the independence.

| | Monolith | Microservices |
|---|---|---|
| Deploy | All together | One at a time |
| Scale | All together | One at a time |
| Fail | All together | One at a time |
| Debugging | One stack trace | Four services' logs |
| A call to another part | Function call | **Network call that can fail** |
| Best for | Small team, new domain | Many teams, proven boundaries |

---

## 3. What a microservice actually is

Four words, all load-bearing:

1. **Independently deployable** — ship it without shipping anything else
2. **Owns one capability** — name it in one sentence with no "and"
3. **Owns its data** — nobody else reads its tables
4. **Small in responsibility** — not in lines of code

> ⚠️ **Distributed monolith** = services that must deploy together, sharing one database.
> All the complexity, none of the independence. **Worse than the monolith you started with.**

---

## 4. Finding boundaries

✅ Split by **business capability** — orders, payments, shipping
❌ Never split by **code layer** — controllers, models, utils

Three tests:
- Do they always **change** together? → same service
- Do they always **deploy** together? → same service
- Do they constantly need the **same data**? → same service

**Conway's Law:** your system will end up shaped like your org chart. Plan for it.

---

## 5. Don't, if…

| Don't, if | Because |
|---|---|
| Small team | More services than developers |
| New domain | You don't know the boundaries yet |
| No automated deploys | You just multiplied manual releases by ten |
| Weak monitoring | Failures become invisible |
| Small system | Network calls cost more than they save |

> **Best practical path:** start as a **modular monolith**, extract a service when one genuinely
> needs to scale or ship separately.

---

## 6. The patterns

**API Gateway** — one public door; auth, routing, rate limits in one place.
*Risk: single point of failure; keep it thin.*

**Service discovery** — call `http://catalog:3001`, never an IP. Containers move; names don't.

| | Synchronous (HTTP) | Asynchronous (events) |
|---|---|---|
| Caller | Waits | Fires and forgets |
| Use for | "Give me the book list" | "An order was placed" |
| Risk | Slow callee makes you slow | Harder to trace |

---

## 7. Resilience ⭐

| Pattern | What it does |
|---|---|
| **Timeout** | Give up after N seconds |
| **Retry** | Try again — transient failures only, with a limit |
| **Fallback** | Reduced answer instead of an error |
| **Circuit breaker** | After repeated failures, stop calling and fail fast |
| **Bulkhead** | Isolate resources so one dependency can't eat them all |

**Cascading failure:**
```
slow service → requests pile up → connections exhausted → WHOLE SITE DOWN
```
One timeout stops this at step one.

**Decide per dependency:**

| Dependency | Essential? | On failure |
|---|---|---|
| catalog | Yes | Fail honestly |
| orders | Yes | Never pretend to take money |
| recommendations | No | Degrade quietly, keep selling |

> **That decision is architecture, not coding.**

---

## 8. Containers

```
Dockerfile  --build-->  Image  --run-->  Container
```
Image = **immutable**. Container = **disposable**. One image → many containers.

```dockerfile
FROM node:22-alpine        # base image
WORKDIR /app               # folder inside the image
COPY server.js ./          # copy code in
EXPOSE 3001                # documentation only!
CMD ["node", "server.js"]  # runs at container start
```

> **`EXPOSE` vs publishing a port:** `EXPOSE` is a note. `ports:` / `-p` actually connects it.
> In the workshop only the **gateway** has `ports:` — that's why the rest are private.

---

## 9. Kubernetes

| Object | Job |
|---|---|
| **Pod** | One running container |
| **Deployment** | Keeps N pods alive; rolling updates |
| **Service** | Stable address; load-balances; finds pods by **label** |
| **Node** | A machine in the cluster |

**Desired state:** you declare *what*; Kubernetes repairs reality to match. Delete a pod → a new
one appears. That's **self-healing**.

| | Compose | Kubernetes |
|---|---|---|
| Machines | One | Many |
| Container dies | Stays dead (no restart policy set here) | Replacement Pod created |
| Rolling updates | No | Yes |

```bash
kubectl apply -f k8s/bookstore.yaml
kubectl get pods
kubectl scale deployment catalog --replicas=5
kubectl delete pod <name>
kubectl set image deployment/catalog catalog=bookstore-catalog:v2
kubectl rollout status deployment/catalog
kubectl rollout undo deployment/catalog
kubectl port-forward service/gateway 8080:8080
minikube image load <image>       # local image into the cluster
```

---

## 10. The bill

Microservices **move** complexity, they don't remove it. You now need:

centralised **logging** · distributed **tracing** · per-service **monitoring** ·
automated **deployment** · API **contract discipline**

> **If you can't afford these, you can't afford microservices.**

---

## 11. Data — the hard part

- **No shared database.** Sharing tables = distributed monolith.
- **Duplicate a little.** `orders` keeping a book title is fine and normal.
- **Eventual consistency.** Across services you can no longer rely on one ACID transaction.
- **Saga:** a multi-service transaction as local steps, each with a compensating undo.

---

## 12. Six answers worth memorising

1. **What is a microservice?** Independently deployable, owns one business capability and its own data. Small in responsibility, not lines.
2. **When not to?** Small team, unclear domain, no automated deployment or monitoring. Start with a modular monolith.
3. **How do you find boundaries?** By business capability and team ownership — never by code layer. Things that change together stay together.
4. **What's a distributed monolith?** Services that must deploy together and share a database. All the cost, none of the benefit.
5. **Why timeouts?** Without one, a slow dependency exhausts your connections and causes a cascading failure. Slow is worse than down.
6. **What does Kubernetes add?** Compose runs containers on one machine and will not maintain a declared number of healthy copies. Kubernetes continuously repairs desired state across many — replacement, scaling, rolling updates.

---

> **The one sentence:**
> **Microservices buy you independence — to deploy, scale and fail separately — and you pay for
> it with network calls that can fail, data you can no longer join, and a system you can no
> longer see without tooling.**
