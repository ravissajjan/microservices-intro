# Assignment
### System Design for Modern Microservices

Add a `reviews` service to the bookstore, handle its failure gracefully, and deploy the updated
application to Kubernetes.

**Time:** budget **4–5 hours**.

---

## How to submit

Put `DESIGN.md` and a `screenshots/` folder inside `lab-starter`, alongside your code.

Submit a **private GitHub repository** and share it with your instructor, or submit a zip file.

To create the repository, run these commands from the workshop repository root:

```bash
cp -r lab-starter ~/microservices-assignment
cd ~/microservices-assignment
git init -b main
git add .
git commit -m "microservices assignment"
gh repo create microservices-assignment --private --source=. --push
```

To submit a zip, right-click `lab-starter` in the VS Code Explorer, select **Download**, and
submit the downloaded archive.

Include these files:

| | |
|---|---|
| Your code | the new `reviews` service and your edits to `gateway`, `docker-compose.yml`, `k8s/` |
| `DESIGN.md` | all the written answers, in one file |
| `screenshots/` | named after the task, e.g. `1.6-compose-ps.png`, `3.3-scaled.png` |

---

## Before you start

Open the workshop Codespace. In the terminal, go to the workshop repository root and start the
application:

```bash
cd lab-starter
docker compose up --build -d
docker compose ps
```

The command cheat sheet at the end of `Workshop-Lab-Handout.md` has everything you need.

---

## Part 1 — Build a fifth service

Create a `reviews` service that returns star ratings and comments for books.

| Task | Instructions |
|---|---|
| 1.1 | Create `reviews/server.js` on port `3004`, with `/health` and `/reviews?bookId=N` returning JSON. In-memory data is fine — copy `catalog/server.js` and adapt it. |
| 1.2 | Create `reviews/Dockerfile` using the existing service Dockerfiles as a template. |
| 1.3 | Add a `reviews` service to `docker-compose.yml` with `build: ./reviews` and `image: bookstore-reviews:v1`. Do not publish its port. |
| 1.4 | Add `REVIEWS_URL: http://reviews:3004` to the gateway environment in `docker-compose.yml`. Add a `REVIEWS` setting in `gateway/server.js`, following the existing service URL pattern. |
| 1.5 | Add `GET /api/reviews?bookId=N` to the gateway. Call the reviews service using `REVIEWS` and return the reviews as JSON. |
| 1.6 | Run `docker compose up --build -d` and `docker compose ps`. Verify all five services are running. Request `http://localhost:8080/api/reviews?bookId=1`. Save screenshots as `1.6-compose-ps.png` and `1.6-reviews-response.png`. |

The image tag must be `bookstore-reviews:v1` so it matches the Kubernetes manifest and the
`minikube image load` command in Part 3.

The existing gateway routes compare `req.url` exactly, for example `req.url === '/api/books'`.
Your reviews route carries a query string, so an exact comparison will never match. Parse the
URL first, for example with `new URL(req.url, 'http://localhost')`, then read `bookId` from its
`searchParams`.

---

## Part 2 — Make it resilient

Reviews are optional. If they are unavailable, the rest of the bookstore should remain usable.

| Task | Instructions |
|---|---|
| 2.1 | Add a 1-second timeout to the gateway's reviews request. If it fails or times out, return HTTP 200 with an empty `reviews` array and `degraded: true`. For a successful request, return the reviews and `degraded: false`. |
| 2.2 | Run `docker compose stop reviews`. Request `http://localhost:8080/api/reviews?bookId=1`, verify the degraded response, and save a screenshot as `2.2-reviews-degraded.png`. |
| 2.3 | In `DESIGN.md`, explain in 3–4 sentences how an unbounded wait on this optional service could affect the rest of the site. Include the term **cascading failure**. |

---

## Part 3 — Run it on Kubernetes

| Task | Instructions |
|---|---|
| 3.1 | Add a `Deployment` and a `Service` for `reviews` to `k8s/bookstore.yaml`. Use image `bookstore-reviews:v1`, set `imagePullPolicy: Never`, and expose port `3004` inside the cluster. Add `REVIEWS_URL: http://reviews:3004` to the gateway Deployment. |
| 3.2 | Rebuild the updated gateway image and build the reviews image. Load both into minikube, apply the manifest, and wait for all five Deployments to become available. Verify the reviews endpoint through the gateway. |
| 3.3 | Scale the reviews Deployment to three replicas. Save the output of `kubectl get deployments` as `3.3-scaled.png`. |
| 3.4 | Delete one reviews Pod and watch for its replacement. Save the Pod list as `3.4-replaced-pod.png`. In `DESIGN.md`, explain how the Deployment and its ReplicaSet restore the desired replica count. |

Run these commands from the `lab-starter` directory. Stopping Compose first frees memory for the
cluster.

```bash
docker compose down
minikube start
docker build -t bookstore-gateway:v1 ./gateway
docker build -t bookstore-reviews:v1 ./reviews
minikube image load bookstore-gateway:v1
minikube image load bookstore-reviews:v1
kubectl apply -f k8s/bookstore.yaml
kubectl rollout status deployment/catalog
kubectl rollout status deployment/orders
kubectl rollout status deployment/recommendations
kubectl rollout status deployment/gateway
kubectl rollout status deployment/reviews
kubectl get pods
kubectl port-forward service/gateway 8080:8080
```

Save the Pod list as `3.2-kubernetes-pods.png`. In a second terminal, verify the route with
`curl -i 'http://localhost:8080/api/reviews?bookId=1'`.
If a Pod reports `ErrImageNeverPull`, check that its manifest image name matches the image you
loaded into minikube.
For task 3.4, run `kubectl get pods -l app=reviews -w`. Stop watching with Ctrl+C after the
replacement appears.

---

## Part 4 — Design writing

Write your answers in `DESIGN.md`. Aim for about 600 words total. Support each recommendation
with a reason or trade-off.

**4.1 Boundaries — about 150 words.**
Should reviews belong inside catalog, or be a separate service? Explain one benefit and one cost
of each option. Choose an option and justify it for this bookstore.

**4.2 Displaying book titles — about 150 words.**
Reviews need a book title, but catalog owns book data. Describe two ways to provide the title to
the reviews view. State one disadvantage of each.

**4.3 When not to use microservices — about 150 words.**
Recommend an architecture to a solo developer building a college event-booking site for about
200 users. They want microservices "to learn it properly." Explain your recommendation and the
engineering and operational costs they should expect.

**4.4 Industry example — 100–150 words.**
Choose one company with a published account of its microservices architecture. Describe the
problem it was addressing, a new challenge the architecture introduced, and how the company
responded. Cite the source with a link.

---

## Going further — break something interesting

Optional: complete one experiment. Run the command, capture the result, and explain what
happened in 3–4 sentences.

| Try this | What to look for |
|---|---|
| Point the gateway at a service name that does not exist, e.g. `http://catlog:3001` | What error appears, and **in which service's logs**? |
| Set the gateway's recommendations timeout to `1` millisecond | Is the result the same as the service being down? Is that good or bad? |
| `kubectl scale deployment catalog --replicas=0` | Which pattern saves you here, and which one cannot? |
| `docker compose stop orders`, then try to buy a book | Does the failure behave like `catalog` or like `recommendations`? Why? |

Include the command, screenshot, and explanation in `DESIGN.md` under **Optional experiment**.

---

## Submission checklist

- [ ] `docker compose ps` shows **five** services, and only `gateway` has a published port
- [ ] The gateway calls reviews **by name** (`http://reviews:3004`), never by IP address
- [ ] With `reviews` stopped, `curl 'localhost:8080/api/reviews?bookId=1'` still returns **200** with an
      empty list — not a 500, and not a hang
- [ ] All five pods reach **Running** in Kubernetes
- [ ] Every screenshot is named after the task it proves
- [ ] `DESIGN.md` contains Part 2.3, Part 3.4 and all of Part 4
- [ ] In 4.1 and 4.3, I chose an option and explained why

Submit the completed code, `DESIGN.md`, and screenshots using one of the methods in **How to
submit**.
