import { deepEqual } from 'node:assert';
import { parseArgs } from "./parse-args.js";

function runTest(testName, actual, expected) {
  try {
    deepEqual(actual, expected);
    console.log(`✅ ${testName}`)
  } catch (e) {
    console.log(`❌ ${testName}`)
    console.log("expected", expected);
    console.log("actual", actual);
  }
}

runTest(
  'no args',
  parseArgs([]),
  {},
)

runTest(
  'no keys',
  parseArgs(['banana']),
  {},
)

runTest(
  'boolean --arg',
  parseArgs(['--test']),
  { test: true },
)

runTest(
  '--arg with value following',
  parseArgs(['--test', '1234']),
  { test: '1234' }
)

runTest(
  '--arg with two values following',
  parseArgs(['--test', '1234', '5678']),
  { test: ['1234', '5678'] }
)

runTest(
  '--arg that appears twice, each time with one value following',
  parseArgs(['--test', '1234', '--test', '5678']),
  { test: ['1234', '5678'] }
)

runTest(
  'two boolean --args',
  parseArgs(['--test', '--other-test']),
  {
    test: true,
    'other-test': true
  }
)

runTest(
  'two key=val args',
  parseArgs(['test=1234', 'other-test=5678']),
  {
    test: '1234',
    'other-test': '5678'
  }
)

runTest(
  'one key=val arg that appears twice with different values',
  parseArgs(['test=1234', 'test=5678']),
  {
    test: ['1234', '5678']
  }
)

runTest(
  'combination of different --arg and key=value args',
  parseArgs(['--test=1234', 'other-test=5678']),
  {
    test: '1234',
    'other-test': '5678'
  }
)

runTest(
  'string value arg overwritten with boolean',
  parseArgs(['test=1234', '--test']),
  {
    test: true
  }
)