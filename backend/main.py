"""
FastAPI Server for ExpaLens BI
Provides full REST API endpoints for all 5 BI pages
"""

from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.database import (
        get_filter_options,
        get_overview_data,
        get_trends_data,
        get_funnel_data,
        get_destinations_data,
        get_rejections_data
    )
except ImportError:
    from database import (
        get_filter_options,
        get_overview_data,
        get_trends_data,
        get_funnel_data,
        get_destinations_data,
        get_rejections_data
    )

app = FastAPI(
    title="ExpaLens BI API",
    description="Business Intelligence REST API for AIESEC in UNAND OGX",
    version="1.0.0"
)

# Enable CORS for React Frontend
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

# ==============================================================================
# 1. HALAMAN 1: OVERVIEW
# ==============================================================================
@app.post("/api/overview")
def post_overview(payload: FilterPayload):
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
    return get_overview_data(years, products, statuses, regions, countries, host_lcs)

# ==============================================================================
# 2. HALAMAN 2: APPLICATION TRENDS
# ==============================================================================
@app.post("/api/trends")
def post_trends(payload: FilterPayload):
    return get_trends_data(
        years=payload.years,
        products=payload.products,
        statuses=payload.statuses,
        regions=payload.regions,
        countries=payload.countries,
        host_lcs=payload.host_lcs,
    )

@app.get("/api/trends")
def get_trends(
    years: Optional[List[int]] = Query(None),
    products: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    regions: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    host_lcs: Optional[List[str]] = Query(None),
):
    return get_trends_data(years, products, statuses, regions, countries, host_lcs)

# ==============================================================================
# 3. HALAMAN 3: CONVERSION FUNNEL
# ==============================================================================
@app.post("/api/funnel")
def post_funnel(payload: FilterPayload):
    return get_funnel_data(
        years=payload.years,
        products=payload.products,
        statuses=payload.statuses,
        regions=payload.regions,
        countries=payload.countries,
        host_lcs=payload.host_lcs,
    )

@app.get("/api/funnel")
def get_funnel(
    years: Optional[List[int]] = Query(None),
    products: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    regions: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    host_lcs: Optional[List[str]] = Query(None),
):
    return get_funnel_data(years, products, statuses, regions, countries, host_lcs)

# ==============================================================================
# 4. HALAMAN 4: DESTINATIONS
# ==============================================================================
@app.post("/api/destinations")
def post_destinations(payload: FilterPayload):
    return get_destinations_data(
        years=payload.years,
        products=payload.products,
        statuses=payload.statuses,
        regions=payload.regions,
        countries=payload.countries,
        host_lcs=payload.host_lcs,
    )

@app.get("/api/destinations")
def get_destinations(
    years: Optional[List[int]] = Query(None),
    products: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    regions: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    host_lcs: Optional[List[str]] = Query(None),
):
    return get_destinations_data(years, products, statuses, regions, countries, host_lcs)

# ==============================================================================
# 5. HALAMAN 5: REJECTIONS
# ==============================================================================
@app.post("/api/rejections")
def post_rejections(payload: FilterPayload):
    return get_rejections_data(
        years=payload.years,
        products=payload.products,
        statuses=payload.statuses,
        regions=payload.regions,
        countries=payload.countries,
        host_lcs=payload.host_lcs,
    )

@app.get("/api/rejections")
def get_rejections(
    years: Optional[List[int]] = Query(None),
    products: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    regions: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    host_lcs: Optional[List[str]] = Query(None),
):
    return get_rejections_data(years, products, statuses, regions, countries, host_lcs)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
