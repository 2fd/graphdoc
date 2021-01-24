/**
 * Test case for the ["modularized schema"](http://dev.apollodata.com/tools/graphql-tools/generate-schema.html#modularizing) of graphql-tools.
 */
const Character = `
# A character in the Star Wars Trilogy
interface Character {
  # The id of the character.
  id: ID!

  # The name of the character.
  name: String

  # The friends of the character, or an empty list if they have none.
  friends: [Character]

  # Which movies they appear in.
  appearsIn: [Episode]

  # All secrets about their past.
  secretBackstory: String
}
`;

const Droid = `
# A mechanical creature in the Star Wars universe.
type Droid implements Character {
  # The id of the droid.
  id: ID!

  # The name of the droid.
  name: String

  # The friends of the droid, or an empty list if they have none.
  friends: [Character]

  # Which movies they appear in.
  appearsIn: [Episode]

  # Construction date and the name of the designer.
  secretBackstory: String

  # The primary function of the droid.
  primaryFunction: String
}
`;

const Episode = `
# One of the films in the Star Wars Trilogy
enum Episode {
  # Released in 1977.
  NEWHOPE

  # Released in 1980.
  EMPIRE

  # Released in 1983.
  JEDI
}
`;

const Human = `
# A humanoid creature in the Star Wars universe.
type Human implements Character {
  # The id of the human.
  id: ID!

  # The name of the human.
  name: String

  # The friends of the human, or an empty list if they have none.
  friends: [Character]

  # Which movies they appear in.
  appearsIn: [Episode]

  # The home planet of the human, or null if unknown.
  homePlanet: String

  # Where are they from and how they came to be who they are.
  secretBackstory: String
}
`;

const Mutation = `
# Root Mutation
type Mutation {
  # Save the favorite episode.
  favorite(
    # Favorite episode.
    episode: Episode!
  ): Episode
}
`;

const Query = `
# Root query
type Query {
  # Return the hero by episode.
  hero(
    # If omitted, returns the hero of the whole saga. If provided, returns the hero of that particular episode.
    episode: Episode
  ): Character

  # Return the Human by ID.
  human(
    # id of the human
    id: ID!
  ): Human

  # Return the Droid by ID.
  droid(
    # id of the droid
    id: ID!
  ): Droid
}
`;

const Schema = `
schema {
    query: Query
    mutation: Mutation
}
`;

export default () => [
  Character,
  Droid,
  Episode,
  Human,
  Mutation,
  Query,
  Schema,
];
