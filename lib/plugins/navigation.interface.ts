import { INTERFACE } from '../introspection';
import { NavigationPlugin, NavigationSection, NavigationItem } from '../utility';
import { NavigationPluginInterface, NavigationSectionInterface, NavigationItemInterface } from '../interface';

export default class NavigationScalars extends NavigationPlugin implements NavigationPluginInterface {

    getSections(buildForType: string) {

        const types: NavigationItemInterface[] = this.schema.types
            .filter(type => type.kind === INTERFACE)
            .map(type => new NavigationItem(type.name, this.url(type.name), type.name === buildForType));

        if (types.length)
            return [];

        return [
            new NavigationSection('Interfaces', types);
        ];
    }
}