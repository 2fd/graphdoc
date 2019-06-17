import NavigationInputs from "../navigation.input";
import schema from "./empty.schema.json";
import projectPackage from "./projectPackage.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  const plugin = new NavigationInputs(schema.data.__schema, projectPackage, {});

  test("plugin return navigation", () => {
    const nav = plugin.getNavigations("Query");
    expect(nav).toBeInstanceOf(Array);
    expect(nav).toEqual([
      {
        title: "Input Objects",
        items: [
          {
            text: "AddCommentInput",
            href: "/addcommentinput.doc.html",
            isActive: false
          }
        ]
      }
    ]);
  });
});
