import { z } from "zod";

export const WorkOrderSchema = z.object({
  workOrderId: z.string().min(1).max(80),
  photos: z.array(z.object({
    label: z.string().min(1).max(80),
    observation: z.string().min(1).max(500)
  })).min(1).max(6),
  dispatchStatus: z.enum(["unassigned", "assigned", "en_route", "on_site", "completed"]),
  technicianFollowUp: z.string().min(1).max(1000),
  urgency: z.enum(["routine", "urgent"])
}).strict();

export type WorkOrder = z.infer<typeof WorkOrderSchema>;

export type DispatchDecision = {
  workOrderId: string;
  action: "keep_schedule" | "expedite_dispatch";
  summary: string;
  modelGuidance: string;
};
