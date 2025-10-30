/* eslint-disable import/no-default-export, sort-keys */
import { afterAll, afterEach, beforeAll, beforeEach, expect, test as vtest } from 'vitest';

type TestFn = (t: any) => any | Promise<any>;

// Minimal Ava-compatible assertion object backed by Vitest's expect
function createT() {
  return {
    is: (actual: any, expected: any) => expect(actual).toBe(expected),
    notDeepEqual: (actual: any, expected: any) => expect(actual).not.toEqual(expected),
    deepEqual: (actual: any, expected: any) => expect(actual).toEqual(expected),
    truthy: (value: any) => expect(value).toBeTruthy(),
    falsy: (value: any) => expect(value).toBeFalsy(),
    regex: (value: string, re: RegExp) => expect(value).toMatch(re),
    snapshot: (value: any) => expect(value).toMatchSnapshot(),
    pass: () => expect(true).toBe(true),
    end: () => void 0
  };
}

function run(name: string, fn: TestFn) {
  vtest(name, () => fn(createT()));
}

run.only = (name: string, fn: TestFn) => {
  vtest.only(name, () => fn(createT()));
};

run.skip = (name: string, fn?: TestFn) => {
  // @ts-expect-error Vitest allows optional fn when skipping
  vtest.skip(name, fn ? () => fn(createT()) : void 0);
};

run.serial = (name: string, fn: TestFn) => {
  vtest.sequential(name, () => fn(createT()));
};

run.before = (fn: () => any | Promise<any>) => {
  beforeAll(() => fn());
};

run.after = (fn: (t: any) => any | Promise<any>) => {
  afterAll(() => fn(createT()));
};

run.beforeEach = (fn: () => any | Promise<any>) => {
  beforeEach(() => fn());
};

run.afterEach = (fn: () => any | Promise<any>) => {
  afterEach(() => fn());
};

export default run;
