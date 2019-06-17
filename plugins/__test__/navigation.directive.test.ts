import NavigationDirectives from "../navigation.directive";
import schema from "./empty.schema.json";
import projectPackage from "./projectPackage.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  const plugin = new NavigationDirectives(
    schema.data.__schema,
    projectPackage,
    {}
  );

  test("plugin return navigation", () => {
    const nav = plugin.getNavigations("Query");
    expect(nav).toBeInstanceOf(Array);
    expect(nav).toEqual([
      {
        title: "Directives",
        items: [
          { text: "deprecated", href: "/deprecated.doc.html", isActive: false },
          { text: "include", href: "/include.doc.html", isActive: false },
          { text: "skip", href: "/skip.doc.html", isActive: false }
        ]
      }
    ]);
  });
});
