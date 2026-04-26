// packages/idin/src/types.ts

export type IDINStartInput = {
  issuer: string;
  tenantId: string;
  returnUrl: string;
};

export type IDINStartResponse = {
  redirectUrl: string;
  transactionId: string;
};

export type IDINVerifyResponse = {
  status: "success" | "failed" | "pending";
  data?: {
    first_name?: string | null;
    last_name?: string | null;
    iban?: string | null;
    country?: string | null;
  };
};