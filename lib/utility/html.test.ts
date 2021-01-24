import { Description, Field, InputValue, SchemaType } from "../interface";
import { split, HTML } from "./html";
import { data } from "../../test/empty.schema.json";

test("utility/html.split", () => {
  const LOREM_IPSU = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;
  expect(split("", 0)).toEqual([""]);
  expect(split(LOREM_IPSU, 1)).toEqual(LOREM_IPSU.split(" "));
  expect(split(LOREM_IPSU, 10)).toEqual([
    "Lorem Ipsum",
    "is simply dummy",
    "text of the",
    "printing and",
    "typesetting",
    "industry. Lorem",
    "Ipsum has been",
    "the industry's",
    "standard dummy",
    "text ever since",
    "the 1500s,",
    "when an unknown",
    "printer took",
    "a galley of",
    "type and scrambled",
    "it to make",
    "a type specimen",
    "book.",
  ]);
  expect(split(LOREM_IPSU, 100)).toEqual([
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
    "standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
    "it to make a type specimen book.",
  ]);
});

describe("lib/utility/html#HTML", () => {
  test(".code", () => {
    const html = new HTML();
    expect(html.code("CODE")).toBe(
      '<code class="highlight"><table class="code"><tbody>CODE</tbody></table></code>'
    );
  });

  test(".highlight", () => {
    const html = new HTML();
    expect(html.highlight("CODE")).toBe("<strong>CODE</strong>");
  });

  test(".sup", () => {
    const html = new HTML();
    expect(html.sup("CODE")).toBe(" <sup>CODE</sup>");
  });

  test(".line", () => {
    const html = new HTML();
    expect(html.index).toBe(1);
    expect(html.line("CODE")).toBe(
      '<tr class="row"><td id="L1" class="td-index">1</td><td id="LC1" class="td-code">CODE</td></tr>'
    );
    expect(html.index).toBe(2);
  });

  test(".tab", () => {
    const html = new HTML();
    expect(html.tab("CODE")).toBe('<span class="tab">CODE</span>');
  });

  test(".keyword", () => {
    const html = new HTML();
    expect(html.keyword("CODE")).toBe(
      '<span class="keyword operator ts">CODE</span>'
    );
  });

  test(".comment", () => {
    const html = new HTML();
    expect(html.comment("CODE")).toBe(
      '<span class="comment line"># CODE</span>'
    );
  });

  test(".identifier", () => {
    const html = new HTML();
    const type = data.__schema.types.find((t) => t.name === "Query");
    expect(html.identifier(type as Description)).toBe(
      '<span class="identifier">Query</span>'
    );
  });

  test(".parameter", () => {
    const html = new HTML();
    const input: InputValue = data.__schema.types.find(
      (t) => t.name === "AddCommentInput"
    ) as any;
    expect(html.parameter(input)).toBe(
      '<span class="variable parameter">AddCommentInput</span>'
    );
  });

  test(".property", () => {
    const html = new HTML();
    expect(html.property("PROPERTY")).toBe(
      '<span class="meta">PROPERTY</span>'
    );
  });

  test(".useIdentifier", () => {
    const html = new HTML();
    const schema: SchemaType = data.__schema.types.find(
      (t) => t.name === "__Schema"
    ) as any;
    const field: Field = (schema.fields || []).find(
      (f) => f.name === "types"
    ) as any;

    expect(html.useIdentifier(field.type, "HREF")).toBe(
      '[<a class="support type" href="HREF">__Type</a>!]!'
    );
  });

  test(".useIdentifierLength", () => {
    const html = new HTML();
    const schema: SchemaType = data.__schema.types.find(
      (t) => t.name === "__Schema"
    ) as any;
    const field: Field = (schema.fields || []).find(
      (f) => f.name === "types"
    ) as any;

    expect(html.useIdentifierLength(field.type)).toBe(10);
  });

  test(".value", () => {
    const html = new HTML();
    expect(html.value('"STRING"')).toBe('<span class="string">"STRING"</span>');
    expect(html.value("NUMBER")).toBe(
      '<span class="constant numeric">NUMBER</span>'
    );
  });
});
