from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnalysisResult(BaseModel):
    """Psychological analysis result model"""
    caption: str
    analysis: str
    timestamp: datetime
    user_id: Optional[str] = None


class SandboxAnalysis(BaseModel):
    """Sandbox analysis request model"""
    user_id: Optional[str] = None


class HealthCheck(BaseModel):
    """Health check response model"""
    status: str
    message: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str
    timestamp: datetime
