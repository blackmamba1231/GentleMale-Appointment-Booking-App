import express from 'express';
import type { Request, Response } from 'express';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { corsOptions } from "./config/security";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", routes);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("Backend is running");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


