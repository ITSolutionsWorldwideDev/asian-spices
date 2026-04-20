// lib/shipping/providerFactory.ts

import { getProviderCredentials } from "./providerService";
import { CheapCargoAdapter } from "./adapters/cheapcargo";
import { ShippingAdapter } from "./types";

export async function getShippingProvider(
  slug: string
): Promise<ShippingAdapter> {
  const provider = await getProviderCredentials(slug);

  switch (provider.slug) {
    case "cheapcargo":
      return new CheapCargoAdapter(provider.credentials as any);

    // future:
    // case "dhl":
    //   return new DHLAdapter(provider.credentials);

    default:
      throw new Error(`Unsupported provider: ${slug}`);
  }
}

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