const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const obscureHeader = require("./server/middleware/obscureHeader");
const {
  ALLOWED_DOMAIN,
  SCRIPT_SOURCES,
} = require("config");
require('dotenv').config();
const apiRoutes = require("./server/routes")

// Start & init express app
const app = express();
app.enable("trust proxy");
app.use(
  helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    scriptSrc: SCRIPT_SOURCES,
  }),
);
app.use(
  helmet({
    //contentSecurityPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from the same origin and inline scripts
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from the same origin and inline styles
        imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URIs
        fontSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ], // Example for Google Fonts
        objectSrc: ["'none'"], // Disallow embedding of objects
        frameSrc: ["'self'"], // Allow iframes from the same origin
        //upgradeInsecureRequests: true, // Upgrade HTTP to HTTPS automatically
        //reportUri: "/csp-violation" // Endpoint to report CSP violations (optional)
      },
    },
    hidePoweredBy: true,
  }),
);
app.use(obscureHeader);
app.use(
  express.json({
    limit: "2mb",
  }),
);
app.use(
  express.urlencoded({
    limit: "5mb",
    extended: true,
  }),
);
app.use(
  cors({
    origin: ALLOWED_DOMAIN,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/example", (req, res) => {
  console.log(req.ip); // Logs client's IP address
  res.send(`Client IP: ${req.ip}`);
});

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  next();
});

// Load APIs
app.use("/api", apiRoutes);

// Serve static build files
app.get("/*", (_, res) =>
  res.json({ msg: "memomeet APIs" })
  // res.send(WELCOME_PAGE)
);

require("./server/models");

const { Server } = require("socket.io");

const server = app.listen(process.env.SRV_PORT, () =>
  console.log(`🚀 Server running at ${process.env.SRV_PORT}`),
);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_DOMAIN,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  }
});

// Store participants by meeting code
const meetings = {};

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a meeting
  socket.on("join-meet", (meetCode) => {
    if (!meetings[meetCode]) {
      meetings[meetCode] = [];
    }

    // Add the participant to the meeting
    meetings[meetCode].push(socket.id);
    socket.join(meetCode);
    console.log(`${socket.id} joined meet ${meetCode}`);

    // Notify other participants in the room about the new participant
    socket.to(meetCode).emit("new-participant", { participantId: socket.id });
  });

  // Handle offer
  socket.on("offer", ({ meetCode, offer, recipient }) => {
    io.to(recipient).emit("offer", { offer, sender: socket.id });
    console.log(`Offer sent from ${socket.id} to ${recipient}`);
  });

  // Handle answer
  socket.on("answer", ({ meetCode, answer, recipient }) => {
    io.to(recipient).emit("answer", { answer, sender: socket.id });
    console.log(`Answer sent from ${socket.id} to ${recipient}`);
  });

  // Handle ICE candidate
  socket.on("candidate", ({ meetCode, candidate, recipient }) => {
    io.to(recipient).emit("candidate", { candidate, sender: socket.id });
    console.log(`Candidate sent from ${socket.id} to ${recipient}`);
  });

  // Handle participant leaving
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove participant from all meetings
    for (const [meetCode, participants] of Object.entries(meetings)) {
      const index = participants.indexOf(socket.id);
      if (index !== -1) {
        participants.splice(index, 1);
        socket.to(meetCode).emit("participant-left", { participantId: socket.id });
        console.log(`${socket.id} left meet ${meetCode}`);
      }

      // Clean up empty meetings
      if (meetings[meetCode].length === 0) {
        delete meetings[meetCode];
      }
    }
  });
});