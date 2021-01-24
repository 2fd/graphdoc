import { slugTemplate, createData } from "./template";

test("lib/utility/template#slugTemplate", () => {
  const slug = slugTemplate();
  expect(typeof slug).toBe("function");
  expect(slug("{{RAW TEXT}}", (value: string) => value)).toBe("raw-text");
});

describe("lib/utility/template#createData", () => {
  // test(`default data`, async () => {
  //   const data = await createData({}, {}, [])
  //   expect(data).toHaveProperty('description', '')
  //   expect(data).toHaveProperty('documents', [])
  //   expect(data).toHaveProperty('graphdocPackage', {})
  //   expect(data).toHaveProperty('headers', '')
  //   expect(data).toHaveProperty('navigations', [])
  //   expect(data).toHaveProperty('projectPackage', {})
  //   expect(data).toHaveProperty('slug')
  //   expect(data).toHaveProperty('title', "Graphql schema documentation")
  //   expect(data).toHaveProperty('type', undefined)
  // })

  test(`prop "title"`, async () => {
    const defaultTitle = await createData({}, {}, []);

    const configTitle = await createData(
      {
        graphdoc: {
          title: "Package title",
        },
      },
      {},
      []
    );

    const typeTitle = await createData(
      {
        graphdoc: {
          title: "Package title",
        },
      },
      {},
      [],
      {
        name: "Type title",
        description: "Type description",
        kind: "SCALAR",
        ofType: null,
      }
    );

    expect(defaultTitle).toHaveProperty(
      "title",
      "Graphql schema documentation"
    );
    expect(configTitle).toHaveProperty("title", "Package title");
    expect(typeTitle).toHaveProperty("title", "Type title");
  });

  test(`prop "description"`, async () => {
    const defaultDescription = await createData({}, {}, []);

    const configDescription = await createData(
      {
        description: "Package description",
        graphdoc: {
          title: "Package title",
        },
      },
      {},
      []
    );

    const typeDescription = await createData(
      {
        description: "Package description",
        graphdoc: {
          title: "Package title",
        },
      },
      {},
      [],
      {
        name: "Type title",
        description: "Type description",
        kind: "SCALAR",
        ofType: null,
      }
    );

    expect(defaultDescription).toHaveProperty("description", "");
    expect(configDescription).toHaveProperty(
      "description",
      "<p>Package description</p>\n"
    );
    expect(typeDescription).toHaveProperty(
      "description",
      "<p>Type description</p>\n"
    );
  });
});
