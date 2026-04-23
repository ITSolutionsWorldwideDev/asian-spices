// lib/shipping/providerFactory.ts

import { getProviderCredentials } from "./providerService";
import { resolveProviderCredentials } from "./resolveCredentials";
import { CheapCargoAdapter } from "./adapters/cheapcargo";
import { ShippingAdapter } from "./types";

export async function getShippingProvider(
  slug: string,
  storeId?: string
): Promise<ShippingAdapter> {
  const provider = await getProviderCredentials(slug);

  const credentials = await resolveProviderCredentials(
    provider.id,
    storeId
  );

  switch (provider.slug) {
    case "cheapcargo":
      return new CheapCargoAdapter({
        apiKey: credentials.apiKey,
        email: credentials.email,
        password: credentials.password,
      });

    default:
      throw new Error(`Unsupported provider: ${slug}`);
  }
}

// export async function getShippingProvider2(slug: string) {
//   const provider = await getProviderCredentials(slug);

//   switch (provider.slug) {
//     case "cheapcargo":
//       return {
//         createShipment: async () => {
//           throw new Error("Use new rateRequest flow only");
//         },
//         getRates: async () => {
//           throw new Error("Use new rateRequest flow only");
//         },
//         generateLabel: async () => {
//           throw new Error("Not supported in current API");
//         },
//       };

//     default:
//       throw new Error(`Unsupported provider: ${slug}`);
//   }
// }

// export async function getShippingProvider(
//   slug: string
// ): Promise<ShippingAdapter> {
//   const provider = await getProviderCredentials(slug);

//   switch (provider.slug) {
//     case "cheapcargo":
//       return new CheapCargoAdapter(provider.credentials as any);

//     // future:
//     // case "dhl":
//     //   return new DHLAdapter(provider.credentials);

//     default:
//       throw new Error(`Unsupported provider: ${slug}`);
//   }
// }

/* import { CheapCargoAdapter } from "./adapters/CheapCargoAdapter";

export function getShippingProvider(
  slug: string,
  config: any
) {
  switch (slug) {
    case "cheapcargo":
      return new CheapCargoAdapter(config);

    default:
      throw new Error(`Unsupported provider: ${slug}`);
  }
} */