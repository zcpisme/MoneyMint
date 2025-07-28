from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/financial-data")
def get_financial_data(
    ticker: str = Query(..., description="Stock ticker symbol (e.g. AAPL)"),
    period: str = Query("1mo", description="Data period (e.g. 1d, 5d, 1mo, etc.)"),
    interval: str = Query("1d", description="Data interval (e.g. 1m, 5m, 1d, etc.)")
):
    try:
        data = yf.download(ticker, period=period, interval=interval)

        if data.empty:
            raise HTTPException(status_code=404, detail="No data found for the given parameters.")

        # Flatten MultiIndex columns if necessary
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = ['_'.join(map(str, col)).strip() for col in data.columns]

        # Reset index to move date to column
        data.reset_index(inplace=True)

        # Convert all datetime columns to string
        for col in data.columns:
            if pd.api.types.is_datetime64_any_dtype(data[col]):
                data[col] = data[col].astype(str)

        # Ensure all column names are strings
        data.columns = [str(col) for col in data.columns]

        records = data.to_dict(orient="records")
        return JSONResponse(content=records)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
