import projectPackage from "../test/empty.package.json";
import NavigationEnums from "./navigation.enum";
import schema from "../test/empty.schema.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationEnums(
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
    const plugin = new NavigationEnums(
      schema.data.__schema,
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Enums",
        items: [
          {
            text: "__DirectiveLocation",
            href: "/directivelocation.spec.html",
            isActive: false,
          },
          { text: "__TypeKind", href: "/typekind.spec.html", isActive: false },
        ],
      },
    ]);
  });
});
