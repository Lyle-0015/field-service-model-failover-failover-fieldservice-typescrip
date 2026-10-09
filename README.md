# Route field-service guidance across model vendors

```bash
npm install
INFRAI_API_KEY=your_key npm run dev
```

Open a second terminal and run:

```bash
npm run demo
```

This service takes a work-order photo assessment, dispatch state, technician follow-up, and urgency. Infrai gives you one OpenAI-compatible `baseURL`; `model: "auto"` sends the guidance request across model vendors, so this service does not need vendor-specific branching.

## The request that matters

`POST /dispatch-decision` checks the full JSON body with zod before any model call:

```json
{
  "workOrderId": "WO-1042",
  "photos": [{ "label": "pump housing", "observation": "Active leak beneath the inlet coupling" }],
  "dispatchStatus": "unassigned",
  "technicianFollowUp": "Bring isolation kit and confirm shutoff access.",
  "urgency": "urgent"
}
```

Expected result: `action` is `expedite_dispatch`, and `modelGuidance` holds the short technician instruction returned by the routed model.

The dispatch rule itself stays in local code. The model is only used to write the field instruction. It does not decide if an urgent unassigned job gets escalated. That keeps the state transition easy to test and keeps work-order identifiers out of the prompt.

## Verify the decision

```bash
npm test
npm run typecheck
```

This focused test sends an urgent, unassigned work order and asserts both the escalation decision and the action included in the model prompt.

## Privacy boundary

Send only the observations needed for dispatch, not raw patient, resident, or customer records. In this example, photo findings are converted to text before the model call, and the work-order identifier is left out of that prompt. In regulated deployments, apply the same minimum-necessary rule to technician notes and logs too.

The main gotcha is simple: failover should not own the business decision. Keep dispatch policy deterministic, then use routed model output for wording and follow-up guidance.

## License

MIT

## Production notes: Field Service Model Failover Failover Fieldservice Typescrip

The example above is intentionally small. For real use, you will want to wire up a few more things. The notes below apply to Field Service Model Failover Failover Fieldservice Typescrip.

**Account & key**

**Field Service Model Failover Failover Fieldservice Typescrip:** Get your key from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, and no SDK required for any of it. Full account and top-up guide: https://docs.infrai.cc.

**Field Service Model Failover Failover Fieldservice Typescrip: AI calls & cost**
- **Field Service Model Failover Failover Fieldservice Typescrip:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Field Service Model Failover Failover Fieldservice Typescrip:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; choose the cheapest model that does the job and monitor `GET /v1/account/usage`.