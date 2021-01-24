import { NavigationItemInterface, PluginInterface } from "../lib/interface";
import {
  INPUT_OBJECT,
  NavigationItem,
  NavigationSection,
  Plugin,
} from "../lib/utility";

export default class NavigationInputs
  extends Plugin
  implements PluginInterface {
  getTypes(buildForType: string): NavigationItemInterface[] {
    return this.document.types
      .filter((type) => type.kind === INPUT_OBJECT)
      .map(
        (type) =>
          new NavigationItem(
            type.name,
            this.url(type),
            type.name === buildForType
          )
      );
  }

  getNavigations(buildForType: string) {
    const types: NavigationItemInterface[] = this.getTypes(buildForType);

    if (types.length === 0) {
      return [];
    }

    return [new NavigationSection("Input Objects", types)];
  }
}
