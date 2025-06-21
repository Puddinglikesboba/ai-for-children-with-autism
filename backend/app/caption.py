import io
from PIL import Image
from typing import Optional


def generate_caption(image_bytes: bytes) -> str:
    """
    Generate image caption (currently using mock data)
    
    Args:
        image_bytes: Image byte data
        
    Returns:
        str: Image caption text
    """
    try:
        # Validate image format
        image = Image.open(io.BytesIO(image_bytes))
        
        # TODO: Replace with real image recognition model later
        # For example: BLIP2, Gemini Vision API, etc.
        
        # Mock return fixed sandbox scene descriptions
        mock_descriptions = [
            "A tree in the middle of the sandbox with small figures around it",
            "A house made of blocks with a path leading to it",
            "Several animals arranged in a circle formation",
            "A bridge connecting two areas of the sandbox",
            "A castle with towers and a moat",
            "A garden with flowers and a small pond",
            "A family of figures standing together",
            "A car and road leading to a building",
            "A forest scene with trees and animals",
            "A beach scene with sand, water, and shells"
        ]
        
        # Simple hash algorithm to select description (based on image size)
        image_hash = hash(image.size) % len(mock_descriptions)
        return mock_descriptions[image_hash]
        
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")


def validate_image(image_bytes: bytes) -> bool:
    """
    Validate image format and size
    
    Args:
        image_bytes: Image byte data
        
    Returns:
        bool: Whether the image is valid
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Check image format
        if image.format not in ['JPEG', 'PNG', 'JPG']:
            return False
            
        # Check image size (limit to 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            return False
            
        return True
        
    except Exception:
        return False
