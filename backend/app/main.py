from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
from typing import Optional

from .models import AnalysisResult, HealthCheck, ErrorResponse
from .caption import generate_caption, validate_image
from .analysis import generate_psychological_analysis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="AI Sandbox Psychological Analysis System",
    description="AI-assisted system for emotion recognition and psychological sandbox interaction for children with autism",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.get("/", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        message="AI Sandbox Psychological Analysis System is running normally",
        timestamp=datetime.now()
    )


@app.post("/analyze_sandbox/", response_model=AnalysisResult)
async def analyze_sandbox(
    file: UploadFile = File(..., description="Uploaded sandbox photo"),
    user_id: Optional[str] = Form(None, description="User ID (optional)"),
    prompt: Optional[str] = Form(None, description="Custom prompt for the analysis (optional)")
):
    """
    Analyze sandbox scene
    
    - **file**: Uploaded sandbox photo (supports JPEG, PNG formats)
    - **user_id**: User ID (optional)
    - **prompt**: A custom prompt to guide the psychological analysis (optional)
    
    Returns JSON response containing scene description and psychological analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Only image file formats (JPEG, PNG) are supported"
            )
        
        # Read file content
        image_bytes = await file.read()
        
        # Validate image
        if not validate_image(image_bytes):
            raise HTTPException(
                status_code=400,
                detail="Invalid image format or file too large (max 10MB)"
            )
        
        # Generate image caption
        logger.info(f"Starting to process image for user {user_id}")
        caption = generate_caption(image_bytes)
        
        # Generate psychological analysis
        analysis = generate_psychological_analysis(caption, user_id, prompt)
        
        # Create analysis result
        result = AnalysisResult(
            caption=caption,
            analysis=analysis,
            timestamp=datetime.now(),
            user_id=user_id
        )
        
        logger.info(f"Successfully completed sandbox analysis for user {user_id}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error occurred while processing sandbox analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            message="Request processing failed",
            timestamp=datetime.now()
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            message="Server encountered an unexpected error",
            timestamp=datetime.now()
        ).dict()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
