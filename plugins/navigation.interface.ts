import { INTERFACE, Plugin, NavigationSection, NavigationItem } from '../lib/utility';
import { PluginInterface, NavigationSectionInterface, NavigationItemInterface } from '../lib/interface';

export default class NavigationInterfacess extends Plugin implements PluginInterface {

    getTypes(buildForType: string): NavigationItemInterface[] {
        return this.document.types
            .filter(type => type.kind === INTERFACE)
            .map(type => new NavigationItem(
                type.name,
                this.url(type),
                type.name === buildForType
            ));
    }

    getNavigations(buildForType: string) {

        const types: NavigationItemInterface[] = this.getTypes(buildForType);

        if (types.length)
            return [];

        return [
            new NavigationSection('Interfaces', types)
        ];
    }
}