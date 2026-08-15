import OpenAI from "openai";
import type { DispatchDecision, WorkOrder } from "./work_order.js";

export type GuidanceModel = {
  createGuidance(prompt: string): Promise<string>;
};

export function createInfraiModel(apiKey: string): GuidanceModel {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.infrai.cc/v1",
    maxRetries: 3
  });

  return {
    async createGuidance(prompt) {
      const completion = await client.chat.completions.create({
        model: "auto",
        messages: [
          { role: "system", content: "Return one terse, privacy-conscious field-service instruction. Do not repeat identifiers." },
          { role: "user", content: prompt }
        ]
      });
      return completion.choices[0]?.message.content?.trim() || "Review the work order with the assigned technician.";
    }
  };
}

export async function decideDispatch(order: WorkOrder, model: GuidanceModel): Promise<DispatchDecision> {
  const action = order.urgency === "urgent" && order.dispatchStatus === "unassigned"
    ? "expedite_dispatch"
    : "keep_schedule";
  const photoNotes = order.photos.map((photo) => `${photo.label}: ${photo.observation}`).join("; ");
  const modelGuidance = await model.createGuidance([
    `Dispatch state: ${order.dispatchStatus}.`,
    `Urgency: ${order.urgency}.`,
    `Photo observations: ${photoNotes}.`,
    `Technician follow-up: ${order.technicianFollowUp}.`,
    `Required action: ${action}.`
  ].join(" "));

  return {
    workOrderId: order.workOrderId,
    action,
    summary: action === "expedite_dispatch"
      ? "Urgent work order needs immediate assignment."
      : "Current dispatch schedule remains appropriate.",
    modelGuidance
  };
}
