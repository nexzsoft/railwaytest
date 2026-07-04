require("dotenv").config();

const http = require("http");
const { Client } = require("pg");

const PORT = 3000;

// PostgreSQL Connection
const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect to Railway PostgreSQL
db.connect()
    .then(() => {
        console.log("✅ Connected to Railway PostgreSQL");
    })
    .catch((err) => {
        console.error("Database Connection Error:", err);
    });

const server = http.createServer((req, res) => {

    // Allow React to access the backend
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle browser preflight request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    // Home route
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        return res.end(
            JSON.stringify({
                message: "Backend is running successfully!"
            })
        );
    }

    // Signup Route
    if (req.url === "/signup" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {

            try {

                const user = JSON.parse(body);

                console.log("Received User:");
                console.log(user);

                await db.query(
                    `INSERT INTO users (name, email, password)
                     VALUES ($1, $2, $3)`,
                    [user.name, user.email, user.password]
                );

                console.log("✅ User saved to PostgreSQL");

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "User saved successfully!"
                }));

            }
            catch (err) {

                console.error("Database Error:", err);
            
                res.writeHead(500, {
                    "Content-Type": "application/json"
                });
            
                res.end(JSON.stringify({
                    success: false,
                    message: err.message,
                    detail: err.detail || ""
                }));

            }

        });

        return;
    }

    res.writeHead(404);
    res.end();

});

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
