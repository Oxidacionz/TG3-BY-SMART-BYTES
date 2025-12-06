# OCR Parameter Analysis

**Goal**: Find the optimal `adaptiveThreshold` parameters (Block Size, C) to maximize OCR accuracy for Banco de Venezuela receipts, specifically targeting the extraction of masked fields (Origin) and noisy text (Amount).

**Methodology**:
- **Script**: `analyze_ocr_params.py`
- **Scoring**:
    - Exact Match: +10 points (+15 for Origin)
    - Partial Match: +5 points
    - Mismatch: -5 points
    - Missing: -10 points
- **Sweep Range**:
    - Block Size: 11 to 51 (step 2)
    - C: 2 to 14 (step 2)

## Top Results

| BS | C | Score | Details |
|---|---|---|---|
| 49 | 2 | 55 | Perfect |
| 21 | 2 | 35 | Origin: 0102-7456 != 0102****7456 |
| 25 | 2 | 35 | Origin: 0102:**"7456 != 0102****7456 |
| 33 | 4 | 35 | Origin: 0102**"*7456 != 0102****7456 |
| 37 | 2 | 35 | Origin: 0102***"7456 != 0102****7456 |
| 39 | 2 | 35 | Origin: 0102***"7456 != 0102****7456 |
| 41 | 2 | 35 | Origin: 0102**"*7456 != 0102****7456 |
| 11 | 4 | 30 | Origin: Missing |

## Conclusion

The configuration **Block Size = 49, C = 2** achieved a **Perfect Score (55)**.
- **Origin**: Correctly extracted as `0102****7456` (preserving asterisks).
- **Amount**: Correctly extracted as `60,00` with type `BS`.
- **Bank**: Correctly extracted as `BANCO MERCANTIL`.

This configuration provides a cleaner binary image for Tesseract, eliminating the need for specific regex patches or "hacky" post-processing logic.

## Action Taken
- Updated `ImageService` with `adaptiveThreshold(..., 49, 2)`.
- Reverted specific regex fixes in `venezuela.py` and `base.py`.
