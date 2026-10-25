"""
backend/utils/image_utils.py
Image processing helpers for dermatological lesions and document OCR pre-processing.
"""

from PIL import Image, ImageOps, ImageFilter
import numpy as np

def prepare_square_rgb(image_path: str, size: int = 224) -> Image.Image:
    """Opens image, converts to RGB, and scales symmetrically to target resolution."""
    with Image.open(image_path) as img:
        rgb = img.convert("RGB")
        return rgb.resize((size, size), Image.Resampling.BILINEAR)

def enhance_document_contrast(gray_img: Image.Image) -> Image.Image:
    """Enhances faint typography and removes background paper texture."""
    return ImageOps.autocontrast(gray_img, cutoff=2).filter(ImageFilter.SHARPEN)
