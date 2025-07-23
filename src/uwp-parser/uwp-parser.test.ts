import { expect, test } from 'vitest';
import { parseUWPString } from './uwp-parser';

test('parses standard UWP string', () => {
  const uwp1 = 'A865AB7-C';
  const parsed = parseUWPString(uwp1);
  expect(parsed).toBeTruthy();
  expect(parsed?.starport.code).toBe('A');
  expect(parsed?.techLevel.code).toBe('C');
});

test('parses UWP with bases and travel zone', () => {
  const uwp2 = 'B777777-7 N A';
  const parsed = parseUWPString(uwp2);
  expect(parsed).toBeTruthy();
  expect(parsed?.starport.code).toBe('B');
  expect(parsed?.bases?.some((b) => b.code === 'N')).toBe(true);
  expect(parsed?.travelZone?.code).toBe('A');
});

test('parses UWP with multiple bases', () => {
  const uwp3 = 'C56876A-A SN R';
  const parsed = parseUWPString(uwp3);
  expect(parsed).toBeTruthy();
  expect(parsed?.starport.code).toBe('C');
  expect(parsed?.bases?.some((b) => b.code === 'S')).toBe(true);
  expect(parsed?.bases?.some((b) => b.code === 'N')).toBe(true);
  expect(parsed?.travelZone?.code).toBe('R');
});

test('parses UWP with only bases', () => {
  const uwp4 = 'E410321-4 S';
  const parsed = parseUWPString(uwp4);
  expect(parsed).toBeTruthy();
  expect(parsed?.starport.code).toBe('E');
  expect(parsed?.bases?.some((b) => b.code === 'S')).toBe(true);
});

test('parses UWP with only travel zone', () => {
  const uwp5 = 'F000000-0 R';
  const parsed = parseUWPString(uwp5);
  expect(parsed).toBeTruthy();
  expect(parsed?.starport.code).toBe('F');
  expect(parsed?.travelZone?.code).toBe('R');
});

test('parses UWP with trade codes and remarks', () => {
  const uwp6 = 'C467345-7 Ag In Po (Major Trade Hub)';
  const parsed = parseUWPString(uwp6);
  expect(parsed).toBeTruthy();
  expect(parsed?.tradeCodes?.map((tc) => tc.code)).toEqual(
    expect.arrayContaining(['Ag', 'In', 'Po'])
  );
  expect(parsed?.remarks).toContain('Major Trade Hub');
});

test('parses UWP with bases, travel zone, trade codes, and remarks', () => {
  const uwp7 = 'B777777-7 N A Ag In (A bustling world)';
  const parsed = parseUWPString(uwp7);
  expect(parsed).toBeTruthy();
  expect(parsed?.bases?.some((b) => b.code === 'N')).toBe(true);
  expect(parsed?.travelZone?.code).toBe('A');
  expect(parsed?.tradeCodes?.map((tc) => tc.code)).toEqual(expect.arrayContaining(['Ag', 'In']));
  expect(parsed?.remarks).toContain('A bustling world');
});

test('parses UWP with multiple trade codes and no bases/remarks', () => {
  const uwp8 = 'A888888-A Hi He Ri';
  const parsed = parseUWPString(uwp8);
  expect(parsed).toBeTruthy();
  expect(parsed?.tradeCodes?.map((tc) => tc.code)).toEqual(
    expect.arrayContaining(['Hi', 'He', 'Ri'])
  );
  expect(parsed?.bases).toBeUndefined();
  expect(parsed?.remarks).toBeUndefined();
});
