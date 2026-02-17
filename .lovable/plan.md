

## Add Credential Workflow Tracking Data

### What we're adding

Each credential (license, certification, etc.) will gain a new optional `workflow` property that tracks the step-by-step approval process, the external organization involved, key contacts, and important dates.

### New types (added to `src/types/recruiting.ts`)

1. **`CredentialWorkflowStep`** -- represents one step in the approval pipeline:
   - `id`: unique identifier
   - `label`: human-readable name (e.g. "Provider completes documents")
   - `status`: `"pending"` | `"in_progress"` | `"completed"` | `"blocked"`
   - `completedDate?`: when actually finished
   - `estimatedDate?`: when expected to finish
   - `assignedTo?`: who owns this step (name or role)
   - `notes?`: free-text

2. **`CredentialContact`** -- a point of contact at a board/facility:
   - `name`: person's name
   - `role?`: their title or function
   - `organization`: the board or facility they represent
   - `email?` / `phone?`

3. **`CredentialWorkflow`** -- the container attached to a credential:
   - `issuingOrganization`: name of the board/facility (e.g. "MA Board of Medicine")
   - `organizationType`: `"hospital_board"` | `"state_license_board"` | `"certification_board"` | `"other"`
   - `contacts`: array of `CredentialContact`
   - `steps`: array of `CredentialWorkflowStep`
   - `estimatedApprovalDate?`: overall expected approval
   - `actualApprovalDate?`: when it was actually approved
   - `expirationDate?`: when the credential expires (mirrors the existing field but lives within the workflow context too)

4. **Update `Credential` interface** -- add one optional field:
   - `workflow?: CredentialWorkflow`

### Mock data additions (in `src/data/mockData.ts`)

We'll add `workflow` data to a meaningful subset of credentials (roughly 6-8 across different providers and statuses) to demonstrate:
- A fully completed workflow (all steps done, actual approval date set)
- An in-progress workflow with some steps completed and estimated dates ahead
- A blocked/red-flag workflow where a step is stuck
- A workflow that's just getting started (most steps pending)

The seven-step rhythm you described will be the default template:

```text
1. Provider requests documents from recruiter
2. Recruiter sends documents to provider
3. Provider completes documents
4. Recruiter reviews/approves documents
5. Recruiter forwards documents to board/facility
6. Board/facility confirms receipt
7. Board/facility approves credential
```

Not every credential needs all seven steps -- some may have fewer depending on the nature of the requirement -- but this gives us a realistic baseline.

### Technical implications for you to be aware of

**No risk to existing functionality.** Since we're only adding an *optional* property (`workflow?`) to the `Credential` interface, every existing credential that doesn't have workflow data will continue to work exactly as before. No UI code needs to change. The TypeScript compiler won't complain because `?` means the field can be absent.

**Data size.** We're going from ~635 lines in the mock data file to roughly ~850-900 lines. This is still well within what a browser handles effortlessly -- React apps routinely work with far larger datasets. There's no performance concern.

**Future UI integration.** When you're ready to show this data in the UI, it'll be accessible via `credential.workflow?.steps`, `credential.workflow?.contacts`, etc. We can add that later without touching any of today's changes.

### Files changed

| File | Change |
|---|---|
| `src/types/recruiting.ts` | Add `CredentialWorkflowStep`, `CredentialContact`, `CredentialWorkflow` interfaces and the `workflow?` field on `Credential` |
| `src/data/mockData.ts` | Add `workflow` objects to 6-8 credentials across providers p1-p4 (the most detailed providers) covering completed, in-progress, blocked, and early-stage scenarios |

