import { describe, it, expect } from 'vitest';
import { capitalize, add } from './helpers';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });

  it('should not change already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });
});

describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(10, 20)).toBe(30);
  });

  it('should add negative numbers', () => {
    expect(add(-5, -3)).toBe(-8);
    expect(add(-10, 5)).toBe(-5);
  });

  it('should handle zero', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(5, 0)).toBe(5);
  });
});
