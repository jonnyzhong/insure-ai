# Common Workflows

## Workflow 1: Check Policy & Billing Status

**Goal:** Find out what policies you have and if any bills are overdue.

```
Step 1:  "What policies do I have?"
         → Policy Agent returns list with policy types, status, premiums

Step 2:  "Do I owe anything?"
         → Billing Agent returns unpaid invoices with due dates and amounts

Step 3:  "Tell me more about POL-001"
         → Policy Agent returns detailed policy info including start date, coverage
```

## Workflow 2: Check Vehicle Details (Motor Policy)

**Goal:** Find out which car is covered and its details.

```
Step 1:  "What car is on my policy?"
         → Policy Agent calls get_vehicle_details
         → Returns: VIN, make, model, year, license plate, coverage type, deductible

Step 2:  "What is my deductible?"
         → Policy Agent returns deductible amount and liability limit
```

## Workflow 3: File a New Claim

**Goal:** Submit an insurance claim after an incident.

```
Step 1:  "I want to file a claim"
         → Claims Agent asks which policy to file against

Step 2:  "POL-001"
         → Claims Agent asks for incident date

Step 3:  "2024-06-15"
         → Claims Agent asks for description

Step 4:  "Rear-end collision at traffic light"
         → Claims Agent asks for estimated amount

Step 5:  "2500"
         → Claims Agent calls file_new_claim
         → Returns: Claim ID (e.g., CLM3847), Status: Pending
```

## Workflow 4: Check Existing Claims

**Goal:** Review all claims and check a specific claim's status.

```
Step 1:  "What claims do I have?"
         → Claims Agent calls get_customer_claims
         → Returns list: claim ID, date, policy, amount, status, description

Step 2:  "Check status of CLM001"
         → Claims Agent calls check_claim_status
         → Returns detailed status with all fields
```

## Workflow 5: Learn About Insurance (FAQ)

**Goal:** Understand Singapore insurance concepts.

```
Step 1:  "What is NCD?"
         → FAQ Agent searches ChromaDB
         → Returns: "No Claim Discount (NCD) is an entitlement given to you
                     if you have not made any claims for a year or more.
                     In Singapore, it can go up to 50% for private cars..."

Step 2:  "How does GIRO work?"
         → FAQ Agent searches ChromaDB
         → Returns: "GIRO is an automated electronic payment arrangement in
                     Singapore used for recurring premium deductions..."
```

## Workflow 6: Generate Executive Report

**Goal:** Get a comprehensive overview of your insurance portfolio.

```
Step 1:  Type "generate report" in chat
         — OR —
         Click "Executive Report" button in sidebar

Step 2:  Report dialog opens with loading skeleton

Step 3:  Report loads with:
         - Executive Summary (AI narrative + key findings)
         - Customer Profile (personal details)
         - Policy Portfolio (charts + billing tables)
         - Claims History (chart + table)

Step 4:  Click "Export PDF" to download
```

## Workflow 7: Start Fresh

**Goal:** Clear conversation and start over (same user).

```
Step 1:  Click "New Conversation" in sidebar
         → Chat history clears
         → Report cache clears
         → Session preserved (same user, no re-login needed)

Step 2:  Continue chatting with a clean slate
```

## Workflow 8: Switch Users

**Goal:** Log in as a different customer.

```
Step 1:  Click "Sign Out" in sidebar
         → Session destroyed
         → Redirect to /login

Step 2:  Select a different user from the combobox
Step 3:  Click "Login"
         → New session created with new customer context
```
