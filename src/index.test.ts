import { resolveDID } from '@swiss-digital-assets-institute/resolver';
import { KeysUtility } from '@swiss-digital-assets-institute/core';
import { findVerificationMethodByPublicKey } from './index';

jest.mock('@swiss-digital-assets-institute/resolver');
jest.mock('@swiss-digital-assets-institute/core');

const mockDid = 'did:example:123';
const mockPublicKey = 'mockPublicKey';
const mockPublicKeyMultibase = 'public-key-multibase';
const mockPublicKeyBase58 = 'public-key-base58';
const mockVerificationMethod = [
  {
    id: 'did:example:123#key-1',
    type: 'Ed25519VerificationKey2020',
    controller: 'did:example:123',
    publicKeyMultibase: mockPublicKeyMultibase,
  },
  {
    id: 'did:example:123#key-2',
    type: 'Ed25519VerificationKey2018',
    controller: 'did:example:123',
    publicKeyBase58: mockPublicKeyBase58,
  },
];

beforeEach(() => {
  (resolveDID as jest.Mock).mockResolvedValue({
    verificationMethod: mockVerificationMethod,
  });

  (KeysUtility.fromDerString as jest.Mock).mockReturnValue({
    toMultibase: jest.fn().mockReturnValue(mockPublicKeyMultibase),
    toBase58: jest.fn().mockReturnValue(mockPublicKeyBase58),
  });
  (KeysUtility.fromMultibase as jest.Mock).mockReturnValue(mockPublicKeyMultibase);
  (KeysUtility.fromBase58 as jest.Mock).mockReturnValue(mockPublicKeyBase58);
});

describe('findVerificationMethodByPublicKey', () => {
  it('should find the verification method by public key', async () => {
    const result = await findVerificationMethodByPublicKey(mockDid, mockPublicKey);
    expect(result).toEqual(mockVerificationMethod[0]);
  });

  it('should thrown an error if no matching verification method is found', async () => {
    (KeysUtility.fromDerString as jest.Mock).mockReturnValue({
      toMultibase: jest.fn().mockReturnValue('nonMatchingMultibase'),
      toBase58: jest.fn().mockReturnValue('nonMatchingBase58'),
    });

    const expectedError = new Error(`No verification method found for public key: ${mockPublicKey}`);

    try {
      await findVerificationMethodByPublicKey(mockDid, mockPublicKey);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(expectedError);
    }
  });
});
