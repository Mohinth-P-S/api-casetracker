from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import FrequentProblem
from app.demo_store import FREQUENT_PROBLEMS

router = APIRouter(prefix="/api/problems", tags=["Frequent Problems"])

@router.get("", response_model=List[FrequentProblem])
def list_frequent_problems(category: Optional[str] = Query(None, description="Filter by category")):
    """
    List frequent recurring integration issues ranked by occurrence count.
    Supports filtering by category.
    """
    if category and category.lower() != "all":
        filtered = [p for p in FREQUENT_PROBLEMS if category.lower() in p.category.lower()]
        return filtered
    return sorted(FREQUENT_PROBLEMS, key=lambda x: x.occurrences, reverse=True)

@router.get("/{problem_id}", response_model=FrequentProblem)
def get_frequent_problem(problem_id: str):
    """
    Get detailed breakdown of a frequent problem.
    """
    for prob in FREQUENT_PROBLEMS:
        if prob.id == problem_id:
            return prob
    raise HTTPException(status_code=404, detail=f"Problem '{problem_id}' not found.")
