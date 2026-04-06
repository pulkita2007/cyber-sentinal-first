# 🛡️ CyberSentinel

Real-time attack path simulator built on TigerGraph. You pick a compromised node in your IT network, hit simulate, and it shows you exactly how far an attacker can go — and which critical assets they can reach.

**Live:** [cyber-sentinal-first.vercel.app](https://cyber-sentinal-first.vercel.app)

Built by **Skill Seekers** for **Devcation**.

---

## What it does

Most companies don't know that an intern's laptop is 3 hops away from their payment database. CyberSentinel maps your entire infrastructure as a graph — users, devices, servers, databases — and simulates lateral movement in real time.

Click any node → Simulate Attack → see every reachable asset highlighted in red, with a risk report showing which critical databases are exposed and in how many hops.

The reason we used TigerGraph and not a regular database: a 5-hop traversal across thousands of nodes would take minutes in SQL. TigerGraph does it in under 100ms because it's built from the ground up for exactly this kind of connected data query.

---

## Tech stack

- **TigerGraph Savanna** — graph database, hosted on cloud
- **GSQL** — TigerGraph's query language for multi-hop traversal
- **Node.js + Express** — backend REST API, deployed on Railway
- **React + Vite** — frontend, deployed on Vercel
- **SVG + Vanilla DOM** — graph visualization (no heavy libraries)

---

## TigerGraph setup

We created a graph called `CyberGraph` with 4 vertex types and 4 edge types:

**Vertices:** `user`, `Device`, `Server`, `Database`

**Edges:**
```
user       --HAS_ACCESS-->         Device
Device     --CAN_CONNECT-->        Server
Server     --CAN_CONNECT_SERVER--> Server
Server     --STORES_DATA-->        Database
```

The core query that powers the simulation:

```sql
USE GRAPH CyberGraph

CREATE QUERY find_attack_paths(VERTEX entry_point, INT max_hops)
FOR GRAPH CyberGraph {
  OrAccum @visited = false;
  SetAccum<VERTEX> @@all_reached;
  SetAccum<EDGE>   @@all_edges;

  seed = {entry_point};

  WHILE seed.size() > 0 LIMIT max_hops DO
    seed = SELECT t
           FROM seed:s -(:e)-> :t
           WHERE t.@visited == false
           ACCUM  t.@visited += true,
                  @@all_reached += t,
                  @@all_edges += e;
  END;

  critical = SELECT v FROM @@all_reached:v
             WHERE v.sensitivity == "critical";

  PRINT @@all_reached, @@all_edges, critical;
}

INSTALL QUERY find_attack_paths
```

To load sample data, run this in the TigerGraph Query Editor:

```sql
USE GRAPH CyberGraph

UPSERT user VALUES ("john", "John Intern", "intern", "high")
UPSERT user VALUES ("alice", "Alice Dev", "developer", "medium")
UPSERT user VALUES ("admin1", "Admin User", "admin", "low")

UPSERT Device VALUES ("laptop_john", "Johns Laptop", "high")
UPSERT Device VALUES ("laptop_alice", "Alices Laptop", "medium")
UPSERT Device VALUES ("laptop_adm", "Admin Laptop", "low")

UPSERT Server VALUES ("dev_server", "Dev Server", "medium")
UPSERT Server VALUES ("prod_server", "Prod Server", "high")
UPSERT Server VALUES ("vpn_server", "VPN Server", "medium")

UPSERT Database VALUES ("payment_db", "Payment DB", "critical", "critical")
UPSERT Database VALUES ("hr_db", "HR Database", "critical", "critical")
UPSERT Database VALUES ("logs_db", "Logs DB", "low", "low")

UPSERT HAS_ACCESS VALUES ("john", "laptop_john")
UPSERT HAS_ACCESS VALUES ("alice", "laptop_alice")
UPSERT HAS_ACCESS VALUES ("admin1", "laptop_adm")

UPSERT CAN_CONNECT VALUES ("laptop_john", "dev_server")
UPSERT CAN_CONNECT VALUES ("laptop_alice", "dev_server")
UPSERT CAN_CONNECT VALUES ("laptop_adm", "prod_server")
UPSERT CAN_CONNECT VALUES ("laptop_adm", "vpn_server")

UPSERT CAN_CONNECT_SERVER VALUES ("dev_server", "prod_server")
UPSERT CAN_CONNECT_SERVER VALUES ("vpn_server", "prod_server")

UPSERT STORES_DATA VALUES ("prod_server", "payment_db")
UPSERT STORES_DATA VALUES ("prod_server", "hr_db")
UPSERT STORES_DATA VALUES ("dev_server", "logs_db")
```

---

## Running locally

**Backend:**
```bash
cd backend
npm install
```
```bash
node server.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open `localhost:5173`.

> If TigerGraph isn't connected, the app falls back to mock data automatically so the demo still works.

---

## Project structure

```
cyber-sentinal-first/
├── backend/
│   ├── server.js
│   ├── tigergraph.js
│   ├── mockData.js
│   └── routes/
│       └── graph.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── App.css
        └── components/
            ├── GraphView.jsx
            └── RiskReport.jsx
```

---

## API endpoints

```
GET  /api/graph       — returns full graph (vertices + edges)
POST /api/simulate    — body: { nodeId } — returns attack paths from that node
```
