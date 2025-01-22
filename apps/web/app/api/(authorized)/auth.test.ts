/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';

import { Scope } from '@bn2me/client';

import { verifyScopes } from './auth';

describe('API authorization', () => {
  describe('verifyScopes', () => {
    it('array', () => {
      expect(verifyScopes([Scope.Identify], [])).toBe(true);
      expect(verifyScopes([Scope.Identify], [Scope.Identify])).toBe(true);
      expect(verifyScopes([Scope.Identify], [Scope.Email])).toBe(false);
    });

    it('every', () => {
      expect(verifyScopes([Scope.Identify], { every: [] })).toBe(true);
      expect(verifyScopes([Scope.Identify], { every: [Scope.Identify] })).toBe(true);
      expect(verifyScopes([Scope.Identify], { every: [Scope.Email] })).toBe(false);
    });

    it('oneOf', () => {
      expect(verifyScopes([Scope.Identify], { oneOf: [] })).toBe(true);
      expect(verifyScopes([Scope.Identify], { oneOf: [Scope.Identify] })).toBe(true);
      expect(verifyScopes([Scope.Identify], { oneOf: [Scope.Email] })).toBe(false);
      expect(verifyScopes([Scope.Identify], { oneOf: [Scope.Email, Scope.Identify] })).toBe(true);
    });

    it('combination', () => {
      expect(verifyScopes([Scope.Identify, Scope.Email], { every: [Scope.Identify], oneOf: [Scope.Email, Scope.BN2_Account] })).toBe(true);
      // expect(verifyScopes([Scope.Identify, Scope.Email], { every: [Scope.Identify], oneOf: [Scope.BN2_Account, Scope.BN2_Collections] })).toBe(false);
      expect(verifyScopes([Scope.Identify, Scope.Email], { every: [Scope.Identify, Scope.BN2_Account], oneOf: [Scope.Email] })).toBe(false);
      expect(verifyScopes([Scope.Identify, Scope.Email], { every: [Scope.Identify], oneOf: [Scope.Identify] })).toBe(true);
    });
  });
});
