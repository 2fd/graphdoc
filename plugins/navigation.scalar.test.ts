import projectPackage from "../test/empty.package.json";
import NavigationScalar from "./navigation.object";
import schema from "../test/empty.schema.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationScalar(
      {
        ...schema.data.__schema,
        types: [],
      },
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([]);
  });

  test("plugin return navigation", () => {
    const plugin = new NavigationScalar(
      schema.data.__schema,
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Objects",
        items: [
          {
            href: "/directive.spec.html",
            isActive: false,
            text: "__Directive",
          },
          {
            href: "/enumvalue.spec.html",
            isActive: false,
            text: "__EnumValue",
          },
          {
            href: "/field.spec.html",
            isActive: false,
            text: "__Field",
          },
          {
            href: "/inputvalue.spec.html",
            isActive: false,
            text: "__InputValue",
          },
          {
            href: "/schema.spec.html",
            isActive: false,
            text: "__Schema",
          },
          {
            href: "/type.spec.html",
            isActive: false,
            text: "__Type",
          },
        ],
      },
    ]);
  });
});
