import { getTypeOf, getFilenameOf } from "./introspection";
import { data } from "../../test/empty.schema.json";
import { DeepTypeRef, SchemaType, Field } from "../interface";

test(`lib/utility/introspection#getTypeOf`, () => {
  const schema: SchemaType = data.__schema.types.find(
    (t) => t.name === "__Schema"
  ) as any;
  const field: Field = (schema.fields || []).find(
    (f) => f.name === "types"
  ) as any;

  expect(getTypeOf(field.type)).toBe(field.type.ofType?.ofType?.ofType);
});

test(`lib/utility/introspection#getTypeOf`, () => {
  const schema: SchemaType = data.__schema.types.find(
    (t) => t.name === "__Schema"
  ) as any;
  const field: DeepTypeRef = (schema.fields || []).find(
    (f) => f.name === "types"
  ) as any;

  expect(getFilenameOf(field)).toBe("types.doc.html");
});
