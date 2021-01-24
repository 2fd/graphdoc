import projectPackage from "../test/empty.package.json";
import NavigationInputs from "./navigation.input";
import schema from "../test/empty.schema.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationInputs(
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
    const plugin = new NavigationInputs(
      schema.data.__schema,
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Input Objects",
        items: [
          {
            text: "AddCommentInput",
            href: "/addcommentinput.doc.html",
            isActive: false,
          },
        ],
      },
    ]);
  });
});
