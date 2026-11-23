"""
FastAPI Server for ExpaLens BI
Provides REST API endpoints to serve data to React Frontend
"""

from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
try:
    from backend.database import get_filter_options, get_overview_data
except ImportError:
    from database import get_filter_options, get_overview_data

app = FastAPI(
    title="ExpaLens BI API",
    description="Business Intelligence REST API for AIESEC in UNAND OGX",
    version="1.0.0"
)

# Enable CORS for React Frontend (typically running on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilterPayload(BaseModel):
    years: Optional[List[int]] = None
    products: Optional[List[str]] = None
    statuses: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    countries: Optional[List[str]] = None
    host_lcs: Optional[List[str]] = None

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ExpaLens BI Backend"}

@app.get("/api/filters")
def get_filters():
    """Mengembalikan opsi filter berjenjang (kawasan, negara, host LC, produk, tahun)"""
    return get_filter_options()

@app.post("/api/overview")
def post_overview(payload: FilterPayload):
    """Mengembalikan data metrik KPI, Hero Card, Customer Funnel, dan Capaian Halaman 1 Overview via POST"""
    return get_overview_data(
        years=payload.years,
        products=payload.products,
        statuses=payload.statuses,
        regions=payload.regions,
        countries=payload.countries,
        host_lcs=payload.host_lcs,
    )

@app.get("/api/overview")
def get_overview(
    years: Optional[List[int]] = Query(None),
    products: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    regions: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    host_lcs: Optional[List[str]] = Query(None),
):
    """Mengembalikan data metrik KPI, Hero Card, Customer Funnel, dan Capaian Halaman 1 Overview via GET"""
    return get_overview_data(
        years=years,
        products=products,
        statuses=statuses,
        regions=regions,
        countries=countries,
        host_lcs=host_lcs,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
