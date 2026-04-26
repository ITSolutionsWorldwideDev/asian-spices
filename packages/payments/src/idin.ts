// packages/payments/idin.ts

export function mapIDINResponse(additionalData: any = {}) {
  return {
    first_name: additionalData["idin.firstName"] ?? null,
    last_name: additionalData["idin.lastName"] ?? null,
    iban: additionalData["idin.iban"] ?? null,
    country: additionalData["idin.country"] ?? "NL",
  };
}