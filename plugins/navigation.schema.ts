import { PluginInterface, NavigationSectionInterface } from '../lib/interface';
import { Plugin, NavigationSection, NavigationItem } from '../lib/utility';

export default class NavigationSchema extends Plugin implements PluginInterface {

    getNavigations(buildFrom?: string): NavigationSectionInterface[] {

        const section = new NavigationSection('Schema', []);

        // Query
        if (this.document.queryType)
            section.items.push(new NavigationItem(
                this.document.queryType.name,
                this.url(this.document.queryType),
                buildFrom === this.document.queryType.name
            ));

        // Mutation
        if (this.document.mutationType)
            section.items.push(new NavigationItem(
                this.document.mutationType.name,
                this.url(this.document.mutationType),
                buildFrom === this.document.mutationType.name
            ));

        // Suscription
        if (this.document.subscriptionType)
            section.items.push(new NavigationItem(
                this.document.subscriptionType.name,
                this.url(this.document.subscriptionType),
                buildFrom === this.document.subscriptionType.name
            ));

        return [section];
    }

}