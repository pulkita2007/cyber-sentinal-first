const mockData = {
  vertices: [
    { id: "john",        type: "User",     attrs: { name: "John (Intern)",    role: "intern",    risk_level: "high" }},
    { id: "alice",       type: "User",     attrs: { name: "Alice (Dev)",      role: "developer", risk_level: "medium" }},
    { id: "admin1",      type: "User",     attrs: { name: "Admin User",       role: "admin",     risk_level: "low" }},
    { id: "laptop_john", type: "Device",   attrs: { name: "John's Laptop",    risk_level: "high" }},
    { id: "laptop_alice",type: "Device",   attrs: { name: "Alice's Laptop",   risk_level: "medium" }},
    { id: "laptop_adm",  type: "Device",   attrs: { name: "Admin Laptop",     risk_level: "low" }},
    { id: "dev_server",  type: "Server",   attrs: { name: "Dev Server",       risk_level: "medium" }},
    { id: "prod_server", type: "Server",   attrs: { name: "Prod Server",      risk_level: "high" }},
    { id: "vpn_server",  type: "Server",   attrs: { name: "VPN Server",       risk_level: "medium" }},
    { id: "payment_db",  type: "Database", attrs: { name: "Payment DB",       sensitivity: "critical", risk_level: "critical" }},
    { id: "hr_db",       type: "Database", attrs: { name: "HR Database",      sensitivity: "critical", risk_level: "critical" }},
    { id: "logs_db",     type: "Database", attrs: { name: "Logs DB",          sensitivity: "low",      risk_level: "low" }},
  ],
  edges: [
    { type: "HAS_ACCESS",  from: "john",         to: "laptop_john"  },
    { type: "HAS_ACCESS",  from: "alice",        to: "laptop_alice" },
    { type: "HAS_ACCESS",  from: "admin1",       to: "laptop_adm"   },
    { type: "CAN_CONNECT", from: "laptop_john",  to: "dev_server"   },
    { type: "CAN_CONNECT", from: "laptop_alice", to: "dev_server"   },
    { type: "CAN_CONNECT", from: "laptop_adm",   to: "prod_server"  },
    { type: "CAN_CONNECT", from: "laptop_adm",   to: "vpn_server"   },
    { type: "CAN_CONNECT", from: "dev_server",   to: "prod_server"  },
    { type: "CAN_CONNECT", from: "vpn_server",   to: "prod_server"  },
    { type: "STORES_DATA", from: "prod_server",  to: "payment_db"   },
    { type: "STORES_DATA", from: "prod_server",  to: "hr_db"        },
    { type: "STORES_DATA", from: "dev_server",   to: "logs_db"      },
  ]
};

module.exports = mockData;