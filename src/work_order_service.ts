import { createServer } from "node:http";
import { ZodError } from "zod";
import { createInfraiModel, decideDispatch } from "./dispatch_router.js";
import { WorkOrderSchema } from "./work_order.js";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) throw new Error("Set INFRAI_API_KEY before starting the service.");

const model = createInfraiModel(apiKey);
const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (request, response) => {
  response.setHeader("content-type", "application/json");
  if (request.method !== "POST" || request.url !== "/dispatch-decision") {
    response.writeHead(404).end(JSON.stringify({ error: "Route not found" }));
    return;
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const order = WorkOrderSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    const decision = await decideDispatch(order, model);
    response.writeHead(200).end(JSON.stringify(decision));
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      response.writeHead(400).end(JSON.stringify({ error: "Invalid work-order body" }));
      return;
    }
    console.error("Dispatch decision failed", error);
    response.writeHead(502).end(JSON.stringify({ error: "Model guidance could not be created" }));
  }
});

server.listen(port, () => console.log(`Work-order service listening on http://localhost:${port}`));
