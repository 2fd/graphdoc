import NavigationInterfaces from "../navigation.interface";
import schema from "./empty.schema.json";
import projectPackage from "./projectPackage.json";

describe("pĺugins/navigation.interface#NavigationInterfaces", () => {
  const plugin = new NavigationInterfaces(
    schema.data.__schema,
    projectPackage,
    {}
  );

  test("plugin return navigation", () => {
    const nav = plugin.getNavigations("Query");
    expect(nav).toBeInstanceOf(Array);
    expect(nav).toEqual([]);
  });
});
