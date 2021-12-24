import { NavigationItemInterface, PluginInterface } from "../lib/interface";
import {
  NavigationItem,
  NavigationSection,
  OBJECT,
  Plugin,
} from "../lib/utility";

export default class NavigationObjects
  extends Plugin
  implements PluginInterface {
  getTypes(buildForType: string): NavigationItemInterface[] {
    const obj = this.document.types.filter((type) => {
      return (
        type.kind === OBJECT &&
        (!this.queryType || this.queryType.name !== type.name) &&
        (!this.mutationType || this.mutationType.name !== type.name) &&
        (!this.subscriptionType || this.subscriptionType.name !== type.name)
      );
    });

    return obj.map(
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

    return [new NavigationSection("Objects", types)];
  }
}
