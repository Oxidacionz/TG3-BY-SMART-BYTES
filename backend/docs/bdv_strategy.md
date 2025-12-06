# BDV Strategy: Detection and Parsing Guidance

This document describes the decision logic and regex patterns used to detect
Banco de Venezuela (BDV) Pago Móvil receipts and to extract the key fields.

Detection

- If OCR text contains variants of the header `PagomóvilBDV` (example forms: `PagomóvilBDV`,
  `PagomovilBDV`, `Pago móvil BDV`, `PagomóvilBDV Personas`, `PagomovilBDV Web`), then
  force `BancoVenezuelaStrategy`.
- Detection is accent-insensitive and punctuation-tolerant (accents removed, punctuation
  normalized, spaces collapsed) before matching.

Fields to extract

- amount: examples `60,00 Bs`, `Monto: 60,00 Bs`, `Monto de la Operación: 60,00 Bs`
- date: `30/11/2025`, `Fecha: 30/11/2025`
- operation: `004395968524`, `Operación: 004395968524`
- identification: `31548720`, `Identificación: 31548720`, `Cédula Receptor: 31548720`
- origin: masked `0102****7456` or `0102-****-7456` (allow flexible masking)
- destination / receptor phone: `04121300582`, `Teléfono Receptor: 04121300582`
- bank: `0105 - BANCO MERCANTIL`, `Banco: 0105 - BANCO MERCANTIL`
- concept: `pago`, `Concepto: pago`

Regex strategy

- Use multiple regex variants per field, accepting optional labels and flexible separators.
- Example (pseudo):
  - `re_amount = (?:Monto[\s:,-]*)?(\d{1,3}(?:[.,]\d{3})*(?:,[0-9]{1,2})?)\s*(Bs|VES|USD|EUR)?`
  - `re_date = (?:Fecha[\s:,-]*)?(\d{2}[/-]\d{2}[/-]\d{4})`
- If a first-pass search fails, split OCR output into lines and search for labeled lines
  (e.g., line starts with `Identificación`, `Cédula Receptor`, `Teléfono Receptor`),
  then extract values from that line.

Heuristics

- Run multiple OCR passes (raw, light preprocessed, aggressive preprocessed) with
  different `psm`/`oem` settings, merge unique lines, and parse combined text.
- Normalize amounts: remove thousands separators, replace comma with dot, store
  `amount_value` as a `Decimal` for financial accuracy, and keep original `amount` text.
- If bank code is missing, search for a 4-digit code near the word `BANCO`.

Notes

- Keep `BaseStrategy` as fallback. Add bank-specific strategies as needed (Mercantil,
  Banesco) and register them in the strategies registry.
