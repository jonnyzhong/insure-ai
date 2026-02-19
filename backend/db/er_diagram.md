# Insurance Database ER Diagram

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    CUSTOMERS ||--o{ POLICIES : "has"
    POLICIES ||--o| AUTO_POLICY_DETAILS : "has (Motor only)"
    POLICIES ||--o{ BILLING : "generates"
    POLICIES ||--o{ CLAIMS : "has"
    BILLING ||--o{ PAYMENTS : "receives"

    CUSTOMERS {
        VARCHAR(20) customer_id PK "Primary Key"
        VARCHAR(9) nric "NOT NULL"
        VARCHAR(50) first_name "NOT NULL"
        VARCHAR(50) last_name "NOT NULL"
        VARCHAR(100) email "NOT NULL"
        VARCHAR(20) phone "NOT NULL"
        DATE date_of_birth
        VARCHAR(200) address
        VARCHAR(6) postal_code
        VARCHAR(20) region
    }

    POLICIES {
        VARCHAR(20) policy_number PK "Primary Key"
        VARCHAR(20) customer_id FK "NOT NULL -> customers"
        VARCHAR(50) policy_type "NOT NULL"
        DATE start_date "NOT NULL"
        DECIMAL premium_amount "NOT NULL"
        VARCHAR(20) billing_frequency "NOT NULL"
        VARCHAR(20) status "NOT NULL"
    }

    AUTO_POLICY_DETAILS {
        VARCHAR(20) policy_number PK_FK "PK & FK -> policies"
        VARCHAR(50) vehicle_vin "NOT NULL"
        VARCHAR(50) vehicle_make "NOT NULL"
        VARCHAR(50) vehicle_model "NOT NULL"
        INTEGER vehicle_year "NOT NULL"
        VARCHAR(20) license_plate
        VARCHAR(50) coverage_type
        DECIMAL deductible
        DECIMAL liability_limit
    }

    BILLING {
        VARCHAR(20) bill_id PK "Primary Key"
        VARCHAR(20) policy_number FK "NOT NULL -> policies"
        DATE billing_date "NOT NULL"
        DATE due_date "NOT NULL"
        DECIMAL amount "NOT NULL"
        VARCHAR(20) status "NOT NULL"
    }

    PAYMENTS {
        VARCHAR(20) payment_id PK "Primary Key"
        VARCHAR(20) bill_id FK "NOT NULL -> billing"
        DATE payment_date "NOT NULL"
        DECIMAL amount "NOT NULL"
        VARCHAR(20) status "NOT NULL"
        VARCHAR(50) payment_method "NOT NULL"
    }

    CLAIMS {
        VARCHAR(20) claim_id PK "Primary Key"
        VARCHAR(20) policy_number FK "NOT NULL -> policies"
        DATE claim_date "NOT NULL"
        DECIMAL claim_amount "NOT NULL"
        VARCHAR(20) status "NOT NULL"
        TEXT description
    }
```

## Relationship Summary

| Parent Table | Child Table | Foreign Key | Cardinality | ON DELETE | ON UPDATE |
|--------------|-------------|-------------|-------------|-----------|-----------|
| customers | policies | customer_id | 1:N | RESTRICT | CASCADE |
| policies | auto_policy_details | policy_number | 1:1 | CASCADE | CASCADE |
| policies | billing | policy_number | 1:N | RESTRICT | CASCADE |
| policies | claims | policy_number | 1:N | RESTRICT | CASCADE |
| billing | payments | bill_id | 1:N | CASCADE | CASCADE |

## ASCII Diagram

```
+------------------+
|    CUSTOMERS     |  (Parent - Root Table)
+------------------+
| PK customer_id   |
|    nric          |
|    first_name    |
|    last_name     |
|    email         |
|    phone         |
|    date_of_birth |
|    address       |
|    postal_code   |
|    region        |
+--------+---------+
         |
         | 1:N (ON DELETE RESTRICT)
         |
+--------v---------+
|     POLICIES     |
+------------------+
| PK policy_number |
| FK customer_id   |-------> customers.customer_id
|    policy_type   |
|    start_date    |
|    premium_amount|
|    billing_freq  |
|    status        |
+--+------+-----+--+
   |      |     |
   |      |     +---------------------------+
   |      |                                 |
   |      | 1:1 (Motor only)               | 1:N
   |      | ON DELETE CASCADE              | ON DELETE RESTRICT
   |      |                                 |
+--v------v-----------+          +----------v---------+
| AUTO_POLICY_DETAILS |          |       CLAIMS       |
+---------------------+          +--------------------+
| PK/FK policy_number |          | PK claim_id        |
|     vehicle_vin     |          | FK policy_number   |-----> policies.policy_number
|     vehicle_make    |          |    claim_date      |
|     vehicle_model   |          |    claim_amount    |
|     vehicle_year    |          |    status          |
|     license_plate   |          |    description     |
|     coverage_type   |          +--------------------+
|     deductible      |
|     liability_limit |
+---------------------+
   |
   | 1:N (ON DELETE RESTRICT)
   |
+--v---------------+
|     BILLING      |
+------------------+
| PK bill_id       |
| FK policy_number |-------> policies.policy_number
|    billing_date  |
|    due_date      |
|    amount        |
|    status        |
+--------+---------+
         |
         | 1:N (ON DELETE CASCADE)
         |
+--------v---------+
|     PAYMENTS     |
+------------------+
| PK payment_id    |
| FK bill_id       |-------> billing.bill_id
|    payment_date  |
|    amount        |
|    status        |
|    payment_method|
+------------------+
```

## Business Rules Enforced

1. **Referential Integrity**
   - Every policy must belong to an existing customer
   - Every auto_policy_detail must reference a valid Motor policy
   - Every billing record must reference a valid policy
   - Every payment must reference a valid bill
   - Every claim must reference a valid policy

2. **Data Completeness**
   - All foreign key columns are NOT NULL
   - All critical business fields are NOT NULL

3. **Data Consistency**
   - Auto policy details only exist for Motor policies
   - Payments only exist for paid bills
   - Payment amounts match bill amounts

4. **Cascade Rules**
   - **RESTRICT**: Cannot delete a customer if they have policies
   - **RESTRICT**: Cannot delete a policy if it has billing records or claims
   - **CASCADE**: Deleting a policy removes its auto_policy_details
   - **CASCADE**: Deleting a bill removes associated payments
