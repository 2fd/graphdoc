import projectPackage from "../test/empty.package.json";
import NavigationUnion from "./navigation.union";
import schema from "../test/github.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationUnion(
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
    const plugin = new NavigationUnion(
      schema.data.__schema,
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Unions",
        items: [
          {
            href: "/issuetimelineitem.doc.html",
            isActive: false,
            text: "IssueTimelineItem",
          },
          {
            href: "/projectcarditem.doc.html",
            isActive: false,
            text: "ProjectCardItem",
          },
          {
            href: "/reviewdismissalallowanceactor.doc.html",
            isActive: false,
            text: "ReviewDismissalAllowanceActor",
          },
          {
            href: "/searchresultitem.doc.html",
            isActive: false,
            text: "SearchResultItem",
          },
        ],
      },
    ]);
  });
});
