import { KeysUtility, VerificationMethod } from '@swiss-digital-assets-institute/core';
import { resolveDID } from '@swiss-digital-assets-institute/resolver';

/**
 * Find a verification method by public key.
 * This function resolves the DID and searches for a verification method that matches the provided public key.
 */
export const findVerificationMethodByPublicKey = async (
  did: string,
  publicKey: string,
): Promise<VerificationMethod> => {
  const { verificationMethod, capabilityDelegation } = await resolveDID(did);
  const publicKeyMultibase = KeysUtility.fromDerString(publicKey).toMultibase();
  const publicKeyBase58 = KeysUtility.fromDerString(publicKey).toBase58();
  const allVerificationMethods = [...verificationMethod, ...(capabilityDelegation || [])].filter(
    (method): method is VerificationMethod => typeof method === 'object',
  );
  const matchingVerificationMethod = allVerificationMethods.find(
    (method) =>
      ('publicKeyMultibase' in method && method.publicKeyMultibase === publicKeyMultibase) ||
      ('publicKeyBase58' in method && method.publicKeyBase58 === publicKeyBase58),
  );

  if (!matchingVerificationMethod) {
    throw new Error(`No verification method found for public key: ${publicKey}`);
  }

  return matchingVerificationMethod;
};