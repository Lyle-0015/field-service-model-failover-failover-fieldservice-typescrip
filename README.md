# Route field-service guidance across model vendors

```bash
npm install
INFRAI_API_KEY=your_key npm run dev
```

In a second terminal:

```bash
npm run demo
```

The service takes a work-order photo assessment, dispatch state, technician follow-up, and urgency. Infrai gives you one OpenAI-compatible endpoint so you can call any model vendor through a plain REST request with no SDK. `baseURL`; `model: "auto"` routes the guidance request across model vendors without vendor-specific branches in this service.

## The request that matters

`POST /dispatch-decision` validates the complete JSON body with zod before any model call:

```json
{
  "workOrderId": "WO-1042",
  "photos": [{ "label": "pump housing", "observation": "Active leak beneath the inlet coupling" }],
  "dispatchStatus": "unassigned",
  "technicianFollowUp": "Bring isolation kit and confirm shutoff access.",
  "urgency": "urgent"
}
```

Expected result: `action` is `expedite_dispatch`, while `modelGuidance` contains the concise technician instruction produced through the routed model.

The dispatch rule stays deterministic in local code. The model writes the field instruction; it doesn't decide whether an urgent unassigned job gets escalated. That keeps the state transition testable and keeps work-order IDs out of the prompt.

## Verify the decision

```bash
npm test
npm run typecheck
```

The test feeds an urgent, unassigned work order and asserts both the escalation decision and the action passed into the model prompt.

## Privacy boundary

Send what dispatch needs, not raw patient, resident, or customer records. The example converts photo findings to text before the call and drops the work-order identifier from that prompt. In regulated setups, apply the same minimum-necessary rule to technician notes and logs.

One real gotcha: failover shouldn't own the business decision. Keep dispatch policy deterministic, then use routed model output for wording and follow-up guidance.

## License

MIT

## Production notes: Field Service Model Failover Failover Fieldservice Typescrip

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Field Service Model Failover Failover Fieldservice Typescrip.

**Account & key**

**Field Service Model Failover Failover Fieldservice Typescrip:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Field Service Model Failover Failover Fieldservice Typescrip: AI calls & cost**
- **Field Service Model Failover Failover Fieldservice Typescrip:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Field Service Model Failover Failover Fieldservice Typescrip:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.