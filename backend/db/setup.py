"""
Database setup module with schema creation and synthetic data generation.
Standalone version - no external app dependencies.

Usage:
    cd backend
    python db/setup.py
"""
import os
import random
import sqlite3
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Set, Tuple

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "insurance_support.db")


def generate_nric(birth_year: int, index: int) -> str:
    """Generate a valid Singapore NRIC number."""
    if birth_year < 2000:
        prefix = random.choice(["S", "S", "S", "F"])
    else:
        prefix = random.choice(["T", "T", "T", "G"])

    digits = f"{(index * 7 + random.randint(1000000, 9999999)) % 10000000:07d}"
    weights = [2, 7, 6, 5, 4, 3, 2]
    total = sum(int(d) * w for d, w in zip(digits, weights))

    if prefix in ["S", "T"]:
        checksum_letters = "JZIHGFEDCBA"
        if prefix == "T":
            total += 4
    else:
        checksum_letters = "XWUTRQPNMLK"
        if prefix == "G":
            total += 4

    checksum = checksum_letters[total % 11]
    return f"{prefix}{digits}{checksum}"


def generate_singapore_address(region: str) -> Tuple[str, str]:
    """Generate a realistic Singapore address based on region."""
    region_data = {
        "Central": {
            "areas": [("Toa Payoh", "31"), ("Bishan", "57"), ("Ang Mo Kio", "56"),
                      ("Queenstown", "03"), ("Bukit Merah", "15"), ("Novena", "32"), ("Marine Parade", "44")],
            "street_types": ["Lorong", "Avenue", "Street", "Road"],
        },
        "East": {
            "areas": [("Bedok", "46"), ("Tampines", "52"), ("Pasir Ris", "51"),
                      ("Changi", "50"), ("Simei", "52"), ("Kembangan", "46")],
            "street_types": ["Street", "Avenue", "Road", "Drive"],
        },
        "West": {
            "areas": [("Jurong East", "60"), ("Jurong West", "64"), ("Clementi", "12"),
                      ("Bukit Batok", "65"), ("Choa Chu Kang", "68"), ("Bukit Panjang", "67")],
            "street_types": ["Street", "Avenue", "Road", "Drive"],
        },
        "North": {
            "areas": [("Woodlands", "73"), ("Yishun", "76"), ("Sembawang", "75"), ("Admiralty", "75")],
            "street_types": ["Street", "Avenue", "Drive", "Road"],
        },
        "North-East": {
            "areas": [("Sengkang", "54"), ("Punggol", "82"), ("Hougang", "53"),
                      ("Serangoon", "55"), ("Ang Mo Kio", "56")],
            "street_types": ["Street", "Avenue", "Drive", "Way"],
        },
    }

    data = region_data.get(region, region_data["Central"])
    area, postal_prefix = random.choice(data["areas"])
    street_type = random.choice(data["street_types"])

    blk_number = random.randint(1, 999)
    street_number = random.randint(1, 50)
    unit_floor = random.randint(1, 25)
    unit_number = random.randint(1, 999)
    postal_suffix = f"{random.randint(0, 99):02d}{random.randint(0, 9)}"
    postal_code = f"{postal_prefix}{postal_suffix}"

    full_address = (
        f"Blk {blk_number} {area} {street_type} {street_number} "
        f"#{unit_floor:02d}-{unit_number:02d}, Singapore {postal_code}"
    )

    return full_address, postal_code


def generate_synthetic_data(num_customers: int = 1000) -> Dict[str, List[Dict[str, Any]]]:
    """Generate synthetic insurance data for Singapore context."""
    random.seed(42)

    first_names = [
        "Wei", "Ming", "Hui", "Jia", "Xin", "Yu", "Chen", "Li", "Yan", "Mei",
        "Ahmad", "Muhammad", "Siti", "Nurul", "Aisha", "Kumar", "Raj", "Priya",
        "David", "Sarah", "Michael", "John", "Mary", "James", "Emma", "Daniel",
    ]
    last_names = [
        "Tan", "Lim", "Lee", "Ng", "Wong", "Goh", "Chua", "Chan", "Koh", "Teo",
        "Ibrahim", "Abdullah", "Hassan", "Singh", "Kumar", "Sharma", "Nair",
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Davis", "Miller",
    ]
    regions = ["Central", "East", "West", "North", "North-East"]
    policy_types = ["Motor", "Life", "Health", "Home", "Travel"]
    billing_frequencies = ["Monthly", "Quarterly", "Annually"]
    claim_statuses = ["Pending", "Approved", "Rejected", "Under Review", "Paid"]
    payment_methods = ["Credit Card", "PayNow", "GIRO", "Bank Transfer", "Cash"]

    customers, policies, billing, payments, claims, auto_policy_details = [], [], [], [], [], []
    customer_id_list, policy_number_list = [], []
    bill_id_to_record = {}

    for i in range(num_customers):
        birth_year = random.randint(1950, 2005)
        dob = datetime(birth_year, random.randint(1, 12), random.randint(1, 28))
        region = random.choice(regions)
        address, postal_code = generate_singapore_address(region)

        customer_id = f"CUST{i+1:05d}"
        customers.append({
            "customer_id": customer_id,
            "nric": generate_nric(birth_year, i),
            "first_name": random.choice(first_names),
            "last_name": random.choice(last_names),
            "email": f"customer{i+1}@email.com",
            "phone": f"{random.choice(['8', '9'])}{random.randint(1000000, 9999999):07d}",
            "date_of_birth": dob.strftime("%Y-%m-%d"),
            "address": address,
            "postal_code": postal_code,
            "region": region,
        })
        customer_id_list.append(customer_id)

    policy_count = int(num_customers * 1.5)
    for i in range(policy_count):
        customer_id = random.choice(customer_id_list)
        policy_type = random.choice(policy_types)
        start_date = datetime.now() - timedelta(days=random.randint(30, 1095))

        policy_number = f"POL{i+1:06d}"
        policies.append({
            "policy_number": policy_number,
            "customer_id": customer_id,
            "policy_type": policy_type,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "premium_amount": round(random.uniform(50, 500), 2),
            "billing_frequency": random.choice(billing_frequencies),
            "status": random.choice(["Active", "Active", "Active", "Lapsed", "Cancelled"]),
        })
        policy_number_list.append(policy_number)

        if policy_type == "Motor":
            makes = ["Toyota", "Honda", "Hyundai", "BMW", "Mercedes", "Mazda", "Kia", "Nissan"]
            models = ["Corolla", "Civic", "Elantra", "3 Series", "C-Class", "3", "Cerato", "Altima"]
            auto_policy_details.append({
                "policy_number": policy_number,
                "vehicle_vin": f"VIN{random.randint(100000, 999999)}SG",
                "vehicle_make": random.choice(makes),
                "vehicle_model": random.choice(models),
                "vehicle_year": random.randint(2015, 2024),
                "license_plate": f"S{random.choice('ABCDEFGHJK')}{random.choice('ABCDEFGHJK')}{random.randint(1, 9999):04d}{random.choice('ABCDEFGHJKLMNPRSTUXYZ')}",
                "coverage_type": random.choice(["Comprehensive", "Third Party", "Third Party Fire & Theft"]),
                "deductible": random.choice([500, 750, 1000, 1500]),
                "liability_limit": random.choice([50000, 100000, 150000, 200000]),
            })

    bill_count = 0
    for policy in policies:
        num_bills = random.randint(1, 6)
        for j in range(num_bills):
            bill_date = datetime.now() - timedelta(days=random.randint(0, 365))
            due_date = bill_date + timedelta(days=30)

            bill_id = f"BILL{bill_count+1:06d}"
            bill = {
                "bill_id": bill_id,
                "policy_number": policy["policy_number"],
                "billing_date": bill_date.strftime("%Y-%m-%d"),
                "due_date": due_date.strftime("%Y-%m-%d"),
                "amount": policy["premium_amount"],
                "status": random.choice(["paid", "paid", "paid", "pending", "overdue"]),
            }
            billing.append(bill)
            bill_id_to_record[bill_id] = bill
            bill_count += 1

            if bill["status"] == "paid":
                payments.append({
                    "payment_id": f"PAY{len(payments)+1:06d}",
                    "bill_id": bill_id,
                    "payment_date": (bill_date + timedelta(days=random.randint(1, 25))).strftime("%Y-%m-%d"),
                    "amount": bill["amount"],
                    "status": "completed",
                    "payment_method": random.choice(payment_methods),
                })

    claim_count = int(num_customers * 0.3)
    for i in range(claim_count):
        policy_number = random.choice(policy_number_list)
        claim_date = datetime.now() - timedelta(days=random.randint(0, 365))
        claims.append({
            "claim_id": f"CLM{i+1:06d}",
            "policy_number": policy_number,
            "claim_date": claim_date.strftime("%Y-%m-%d"),
            "claim_amount": round(random.uniform(500, 50000), 2),
            "status": random.choice(claim_statuses),
            "description": random.choice([
                "Vehicle accident damage", "Medical expenses claim", "Property damage",
                "Theft claim", "Water damage", "Fire damage", "Personal injury",
            ]),
        })

    return {
        "customers": customers, "policies": policies, "billing": billing,
        "payments": payments, "claims": claims, "auto_policy_details": auto_policy_details,
    }


def setup_insurance_database(db_path: Optional[str] = None) -> bool:
    """Set up the insurance database with schema and synthetic data."""
    if db_path is None:
        db_path = DB_PATH

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.executescript("""
        DROP TABLE IF EXISTS claims;
        DROP TABLE IF EXISTS payments;
        DROP TABLE IF EXISTS billing;
        DROP TABLE IF EXISTS auto_policy_details;
        DROP TABLE IF EXISTS policies;
        DROP TABLE IF EXISTS customers;

        CREATE TABLE customers (
            customer_id VARCHAR(20) PRIMARY KEY,
            nric VARCHAR(9) NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            date_of_birth DATE,
            address VARCHAR(200),
            postal_code VARCHAR(6),
            region VARCHAR(20)
        );

        CREATE TABLE policies (
            policy_number VARCHAR(20) PRIMARY KEY,
            customer_id VARCHAR(20) NOT NULL,
            policy_type VARCHAR(50) NOT NULL,
            start_date DATE NOT NULL,
            premium_amount DECIMAL(10,2) NOT NULL,
            billing_frequency VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        );

        CREATE TABLE auto_policy_details (
            policy_number VARCHAR(20) PRIMARY KEY,
            vehicle_vin VARCHAR(50) NOT NULL,
            vehicle_make VARCHAR(50) NOT NULL,
            vehicle_model VARCHAR(50) NOT NULL,
            vehicle_year INTEGER NOT NULL,
            license_plate VARCHAR(20),
            coverage_type VARCHAR(50),
            deductible DECIMAL(10,2),
            liability_limit DECIMAL(10,2),
            FOREIGN KEY (policy_number) REFERENCES policies(policy_number)
        );

        CREATE TABLE billing (
            bill_id VARCHAR(20) PRIMARY KEY,
            policy_number VARCHAR(20) NOT NULL,
            billing_date DATE NOT NULL,
            due_date DATE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (policy_number) REFERENCES policies(policy_number)
        );

        CREATE TABLE payments (
            payment_id VARCHAR(20) PRIMARY KEY,
            bill_id VARCHAR(20) NOT NULL,
            payment_date DATE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            FOREIGN KEY (bill_id) REFERENCES billing(bill_id)
        );

        CREATE TABLE claims (
            claim_id VARCHAR(20) PRIMARY KEY,
            policy_number VARCHAR(20) NOT NULL,
            claim_date DATE NOT NULL,
            claim_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) NOT NULL,
            description TEXT,
            FOREIGN KEY (policy_number) REFERENCES policies(policy_number)
        );

        CREATE INDEX idx_policies_customer ON policies(customer_id);
        CREATE INDEX idx_policies_type ON policies(policy_type);
        CREATE INDEX idx_billing_policy ON billing(policy_number);
        CREATE INDEX idx_payments_bill ON payments(bill_id);
        CREATE INDEX idx_claims_policy ON claims(policy_number);
        CREATE INDEX idx_customers_nric ON customers(nric);
    """)

    data = generate_synthetic_data()

    for c in data["customers"]:
        cursor.execute("INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?,?)",
            (c["customer_id"], c["nric"], c["first_name"], c["last_name"], c["email"],
             c["phone"], c["date_of_birth"], c["address"], c["postal_code"], c["region"]))

    for p in data["policies"]:
        cursor.execute("INSERT INTO policies VALUES (?,?,?,?,?,?,?)",
            (p["policy_number"], p["customer_id"], p["policy_type"], p["start_date"],
             p["premium_amount"], p["billing_frequency"], p["status"]))

    for d in data["auto_policy_details"]:
        cursor.execute("INSERT INTO auto_policy_details VALUES (?,?,?,?,?,?,?,?,?)",
            (d["policy_number"], d["vehicle_vin"], d["vehicle_make"], d["vehicle_model"],
             d["vehicle_year"], d["license_plate"], d["coverage_type"], d["deductible"], d["liability_limit"]))

    for b in data["billing"]:
        cursor.execute("INSERT INTO billing VALUES (?,?,?,?,?,?)",
            (b["bill_id"], b["policy_number"], b["billing_date"], b["due_date"], b["amount"], b["status"]))

    for p in data["payments"]:
        cursor.execute("INSERT INTO payments VALUES (?,?,?,?,?,?)",
            (p["payment_id"], p["bill_id"], p["payment_date"], p["amount"], p["status"], p["payment_method"]))

    for cl in data["claims"]:
        cursor.execute("INSERT INTO claims VALUES (?,?,?,?,?,?)",
            (cl["claim_id"], cl["policy_number"], cl["claim_date"], cl["claim_amount"], cl["status"], cl["description"]))

    conn.commit()
    conn.close()

    print(f"Database setup complete at {db_path}")
    print(f"  - {len(data['customers'])} customers")
    print(f"  - {len(data['policies'])} policies")
    print(f"  - {len(data['auto_policy_details'])} auto policy details")
    print(f"  - {len(data['billing'])} billing records")
    print(f"  - {len(data['payments'])} payments")
    print(f"  - {len(data['claims'])} claims")
    return True


if __name__ == "__main__":
    setup_insurance_database()
