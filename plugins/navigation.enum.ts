import { ENUM, Plugin, NavigationSection, NavigationItem } from '../lib/utility';
import { PluginInterface, NavigationItemInterface } from '../lib/interface';

export default class NavigationEnums extends Plugin implements PluginInterface {

    getTypes(buildForType: string): NavigationItemInterface[] {
        return this.document.types
            .filter(type => type.kind === ENUM)
            .map(type => new NavigationItem(
                type.name,
                this.url(type),
                type.name === buildForType
            ));
    }

    getNavigations(buildForType: string) {

        const types: NavigationItemInterface[] = this.getTypes(buildForType);

        if (types.length === 0)
            return [];

        return [
            new NavigationSection('Enums', types)
        ];
    }
}