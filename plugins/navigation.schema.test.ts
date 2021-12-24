import projectPackage from "../test/empty.package.json";
import NavigationSchema from "./navigation.schema";
import schema from "../test/github.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationSchema(
      {
        ...schema.data.__schema,
        mutationType: null,
        queryType: null,
        subscriptionType: null,
      },
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([]);
  });

  test("plugin return navigation", () => {
    const plugin = new NavigationSchema(
      {
        ...schema.data.__schema,
        subscriptionType: {
          name: "Subscription",
          description: "The subscription root of GitHub's GraphQL interface.",
          kind: "OBJECT",
        },
      },
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Schema",
        items: [
          {
            href: "/query.doc.html",
            isActive: true,
            text: "Query",
          },
          {
            href: "/mutation.doc.html",
            isActive: false,
            text: "Mutation",
          },
          {
            href: "/subscription.doc.html",
            isActive: false,
            text: "Subscription",
          },
        ],
      },
    ]);
  });
});
