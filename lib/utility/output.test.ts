import { Output } from "./output";

test(`lib/utility/output#Output`, () => {
  const m = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const exit = jest.fn();
  Object.assign(process, { exit });

  const output = new Output(m, { verbose: false });
  output.ok("ref", "value");
  output.info("ref", "value");
  output.error("string message" as any);
  output.error({ message: "error message", stack: "error stack" } as any);

  expect(m.log.mock.calls).toEqual([
    ["%c ✓ %s: %c%s", "color:green", "ref", "color:grey", "value"],
  ]);
  expect(m.error.mock.calls).toEqual([
    ["%c ✗ %s", "color:red", "string message"],
    [""],
    ["%c ✗ %s", "color:red", "error message"],
    [""],
  ]);
  expect(exit.mock.calls).toEqual([[1], [1]]);
});

test(`lib/utility/output#Output (verbose)`, () => {
  const m = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const exit = jest.fn();
  Object.assign(process, { exit });

  const output = new Output(m, { verbose: true });
  output.ok("ref", "value");
  output.info("ref", "value");
  output.error("string message" as any);
  output.error({ message: "error message", stack: "error stack" } as any);

  expect(m.log.mock.calls).toEqual([
    ["%c ✓ %s: %c%s", "color:green", "ref", "color:grey", "value"],
    ["%c ❭ %s: %c%s", "color:yellow", "ref", "color:grey", "value"],
  ]);
  expect(m.error.mock.calls).toEqual([
    ["%c ✗ %s", "color:red", "string message"],
    ["%c%s", "color:grey", "    NO STACK"],
    [""],
    ["%c ✗ %s", "color:red", "error message"],
    ["%c%s", "color:grey", "error stack"],
    [""],
  ]);

  expect(exit.mock.calls).toEqual([[1], [1]]);
});
