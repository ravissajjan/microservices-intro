# BookStore — the workshop application

The same shop, written twice: once as a monolith, once as four microservices.
Plain Node, **zero libraries to install**, so you can read every line.

```
lab-starter/
├── monolith/
│   └── server.js            the WHOLE shop in one file - Session 1
│
├── gateway/                 the only public service
│   ├── server.js            routing + service discovery + timeout + fallback
│   ├── public/index.html    the page you see
│   └── Dockerfile
├── catalog/                 owns the books
│   ├── server.js
│   └── Dockerfile
├── orders/                  owns purchases, publishes an event
│   ├── server.js
│   └── Dockerfile
├── recommendations/         optional service - breaks on purpose
│   ├── server.js            /slow  /fail  /ok
│   └── Dockerfile
│
├── docker-compose.yml       all four, one machine       - Sessions 2 & 3
└── k8s/
    └── bookstore.yaml       all four, on Kubernetes     - Session 4
```

## Three things to notice

1. **Only `gateway` publishes a port.** Look at `docker-compose.yml` — the other three have no
   `ports:` entry, so your browser cannot reach them at all. That is the API Gateway pattern.

2. **Services are found by name.** The gateway calls `http://catalog:3001`, never an IP address.
   Docker Compose resolves that name, and so does Kubernetes — which is why the same
   configuration works unchanged on both.

3. **`recommendations` is designed to fail.** The gateway wraps it in a 1-second timeout and a
   fallback, so losing it costs one panel rather than the whole site.

## Quick commands

```bash
# Session 1 - the monolith
node monolith/server.js                     # then open port 8080

# Session 2 - four services on one machine
docker compose up --build -d                # then open port 8080
docker compose logs                         # what each service printed at startup
docker compose ps                           # note: only gateway has a port
docker compose down

# Session 3 - Docker directly
docker images
docker build -t bookstore-catalog:v1 ./catalog
docker run -d --name catalog-solo -p 3001:3001 bookstore-catalog:v1
curl -s localhost:3001/books                # catalog serves /books and /health only
docker rm -f catalog-solo

# simulate failures in the recommendations service
docker compose exec recommendations wget -qO- http://localhost:3003/slow
docker compose exec recommendations wget -qO- http://localhost:3003/fail
docker compose exec recommendations wget -qO- http://localhost:3003/ok
docker compose stop catalog                 # the catalog panel then fails on refresh

# Session 4 - Kubernetes
minikube start
minikube image load bookstore-gateway:v1
minikube image load bookstore-catalog:v1
minikube image load bookstore-orders:v1
minikube image load bookstore-recommendations:v1
kubectl apply -f k8s/bookstore.yaml
kubectl get pods
kubectl port-forward service/gateway 8080:8080
kubectl scale deployment catalog --replicas=5
```

> **Why `minikube image load`?** The images you build live in your Codespace's Docker, which the
> cluster cannot see. That command hands them over. It is also why the manifests say
> `imagePullPolicy: Never` — "don't go to the internet, it's already here."
