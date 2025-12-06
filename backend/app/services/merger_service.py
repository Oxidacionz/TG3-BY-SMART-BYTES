from app.schemas.ocr_result import OCRResult

class ResultMerger:
    def merge(self, primary: OCRResult, secondary: OCRResult) -> OCRResult:
        """
        Merges secondary result into primary result using 'Smart Merge' logic.
        Updates primary in-place and returns it.
        """
        # Smart Merge: Update missing fields in 'primary' with values from 'secondary'
        if primary.amount_value is None and secondary.amount_value is not None:
            primary.amount = secondary.amount
            primary.amount_value = secondary.amount_value
            primary.amount_type = secondary.amount_type

        if not primary.date and secondary.date:
            primary.date = secondary.date

        # Merge other fields if missing
        for field in ["operation", "identification", "origin", "destination", "bankCode", "bankName", "concept"]:
            val_sec = getattr(secondary, field)
            val_pri = getattr(primary, field)
            if not val_pri and val_sec:
                setattr(primary, field, val_sec)
        
        return primary
