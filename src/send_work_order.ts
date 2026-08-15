export {};

const response = await fetch("http://localhost:3000/dispatch-decision", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    workOrderId: "WO-1042",
    photos: [
      { label: "pump housing", observation: "Active leak beneath the inlet coupling" }
    ],
    dispatchStatus: "unassigned",
    technicianFollowUp: "Bring isolation kit and confirm shutoff access.",
    urgency: "urgent"
  })
});

const result: unknown = await response.json();
console.log(JSON.stringify(result, null, 2));
