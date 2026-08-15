import assert from "node:assert/strict";
import test from "node:test";
import { decideDispatch, type GuidanceModel } from "../src/dispatch_router.js";

test("expedites an urgent unassigned work order", async () => {
  const prompts: string[] = [];
  const model: GuidanceModel = {
    async createGuidance(prompt) {
      prompts.push(prompt);
      return "Assign the nearest qualified technician and confirm isolation access.";
    }
  };

  const decision = await decideDispatch({
    workOrderId: "WO-1042",
    photos: [{ label: "pump housing", observation: "Active leak beneath the inlet coupling" }],
    dispatchStatus: "unassigned",
    technicianFollowUp: "Bring isolation kit.",
    urgency: "urgent"
  }, model);

  assert.equal(decision.action, "expedite_dispatch");
  assert.equal(decision.workOrderId, "WO-1042");
  assert.match(decision.modelGuidance, /nearest qualified technician/);
  assert.match(prompts[0] ?? "", /Required action: expedite_dispatch/);
});
