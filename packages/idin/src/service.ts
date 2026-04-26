// packages/idin/src/service.ts

import { startMollieIDIN, verifyMollieIDIN } from "./providers/mollie";
import { IDINStartInput, IDINStartResponse, IDINVerifyResponse } from "./types";

const PROVIDER = process.env.IDIN_PROVIDER || "mollie";

/**
 * Start IDIN flow
 */
export async function startIDIN(
  input: IDINStartInput,
): Promise<IDINStartResponse> {
  // console.log('startIDIN PROVIDER === ',PROVIDER);

  switch (PROVIDER) {
    case "mollie":
      return startMollieIDIN(input);

    default:
      throw new Error(`Unsupported IDIN provider: ${PROVIDER}`);
  }
}

/**
 * Verify IDIN result
 */
export async function verifyIDIN(
  transactionId: string,
): Promise<IDINVerifyResponse> {
  switch (PROVIDER) {
    case "mollie":
      return verifyMollieIDIN(transactionId);

    default:
      throw new Error(`Unsupported IDIN provider: ${PROVIDER}`);
  }
}
