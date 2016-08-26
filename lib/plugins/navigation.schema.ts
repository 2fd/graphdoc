import { Schema, NavigationPluginInterface, NavigationSectionInterface, NavigationItemInterface, nameToUrl } from '../interface';
import { NavigationPlugin, NavigationSection, NavigationItem } from '../utility';

export default class NavigationSchema extends NavigationPlugin implements NavigationPluginInterface {

    getSections(buildFrom?: string): NavigationSectionInterface[] {

        const section = new NavigationSection('Schema', []);

        // Query
        if (this.schema.queryType)
            section.items.push(new NavigationItem(
                this.schema.queryType.name,
                this.url(this.schema.queryType.name),
                buildFrom === this.schema.queryType.name
            ));

        // Mutation
        if (this.schema.mutationType)
            section.items.push(new NavigationItem(
                this.schema.mutationType.name,
                this.url(this.schema.mutationType.name),
                buildFrom === this.schema.mutationType.name
            ));

        // Suscription
        if (this.schema.subscriptionType)
            section.items.push(new NavigationItem(
                this.schema.subscriptionType.name,
                this.url(this.schema.subscriptionType.name),
                buildFrom === this.schema.subscriptionType.name
            ));

        return [section];
    }

}