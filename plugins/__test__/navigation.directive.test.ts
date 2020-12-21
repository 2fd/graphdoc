import NavigationDirectives from "../navigation.directive";
import schema from "./empty.schema.json";
import projectPackage from "./projectPackage.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {

  test("plugin return empty", () => {
    const plugin = new NavigationDirectives(
      {
        ...schema.data.__schema,
        directives: []
      },
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([])
  })

  test("plugin return navigation", () => {

    const plugin = new NavigationDirectives(
      schema.data.__schema,
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([
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
