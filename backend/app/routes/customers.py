from typing import List
from fastapi import APIRouter, HTTPException
from app.models import CustomerProfile
from app.demo_store import DEMO_CUSTOMERS

router = APIRouter(prefix="/api/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerProfile])
def list_customers():
    """
    List all customer API integration profiles.
    Returns customer metadata, API versions, and authentication configuration.
    """
    return list(DEMO_CUSTOMERS.values())

@router.get("/{customer_id}", response_model=CustomerProfile)
def get_customer(customer_id: str):
    """
    Retrieve single customer profile and incident history.
    """
    if customer_id not in DEMO_CUSTOMERS:
        raise HTTPException(status_code=404, detail=f"Customer '{customer_id}' not found.")
    return DEMO_CUSTOMERS[customer_id]
