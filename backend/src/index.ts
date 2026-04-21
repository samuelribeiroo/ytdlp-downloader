import express from "express";
import cors from "cors";
import convertRouter from "./routes/convert";


const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/api', convertRouter)

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})