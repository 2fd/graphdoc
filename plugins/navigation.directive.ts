import { Plugin, NavigationSection, NavigationItem } from '../lib/utility';
import { PluginInterface, NavigationItemInterface } from '../lib/interface';

export default class NavigationDirectives extends Plugin implements PluginInterface {

    getTypes(buildForType: string): NavigationItemInterface[] {
        return this.document.directives
            .map(directive => new NavigationItem(
                directive.name,
                this.url(directive),
                directive.name === buildForType
            ));
    }

    getNavigations(buildForType: string) {

        const types: NavigationItemInterface[] = this.getTypes(buildForType);

        if (types.length === 0)
            return [];

        return [
            new NavigationSection('Directives', types)
        ];
    }
}