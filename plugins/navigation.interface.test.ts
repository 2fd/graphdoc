import projectPackage from "../test/empty.package.json";
import NavigationInterfaces from "./navigation.interface";
import schema from "../test/github.json";

describe("pĺugins/navigation.interface#NavigationInterfaces", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationInterfaces(
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
    const plugin = new NavigationInterfaces(
      schema.data.__schema,
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Interfaces",
        items: [
          {
            href: "/author.doc.html",
            isActive: false,
            text: "Author",
          },
          {
            href: "/comment.doc.html",
            isActive: false,
            text: "Comment",
          },
          {
            href: "/gitobject.doc.html",
            isActive: false,
            text: "GitObject",
          },
          {
            href: "/gitsignature.doc.html",
            isActive: false,
            text: "GitSignature",
          },
          {
            href: "/issueevent.doc.html",
            isActive: false,
            text: "IssueEvent",
          },
          {
            href: "/issueish.doc.html",
            isActive: false,
            text: "Issueish",
          },
          {
            href: "/node.doc.html",
            isActive: false,
            text: "Node",
          },
          {
            href: "/projectowner.doc.html",
            isActive: false,
            text: "ProjectOwner",
          },
          {
            href: "/reactable.doc.html",
            isActive: false,
            text: "Reactable",
          },
          {
            href: "/repositoryinfo.doc.html",
            isActive: false,
            text: "RepositoryInfo",
          },
          {
            href: "/repositorynode.doc.html",
            isActive: false,
            text: "RepositoryNode",
          },
          {
            href: "/repositoryowner.doc.html",
            isActive: false,
            text: "RepositoryOwner",
          },
          {
            href: "/subscribable.doc.html",
            isActive: false,
            text: "Subscribable",
          },
          {
            href: "/timeline.doc.html",
            isActive: false,
            text: "Timeline",
          },
          {
            href: "/uniformresourcelocatable.doc.html",
            isActive: false,
            text: "UniformResourceLocatable",
          },
        ],
      },
    ]);
  });
});
