import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req: Request, res: Response) => {
  res.json({ success: true });
});
