import { Plugin } from '../lib/utility';
import { Schema, refToUrl, PluginInterface, NavigationSectionInterface, DocumentSectionInterface } from '../lib/interface';
import NavigationSchema from './navigation.schema';
import NavigationScalar from './navigation.scalar';
import NavigationEnum from './navigation.enum';
import NavigationInterfaces from './navigation.interface';
import NavigationUnion from './navigation.union';
import NavigationObject from './navigation.object';
import NavigationIput from './navigation.input';
import NavigationDirective from './navigation.directive';
import DocumentSchema from './document.schema';

export default class NavigationDirectives extends Plugin implements PluginInterface {

    plugins: PluginInterface[];

    constructor(document: Schema, urlResolver: refToUrl, graphdocPackage: any, projectPackage: any) {
        super(document, urlResolver, graphdocPackage, projectPackage);
        this.plugins = [
            new NavigationSchema(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationScalar(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationEnum(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationInterfaces(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationUnion(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationObject(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationIput(document, urlResolver, graphdocPackage, projectPackage),
            new NavigationDirective(document, urlResolver, graphdocPackage, projectPackage),
            new DocumentSchema(document, urlResolver, graphdocPackage, projectPackage),
        ];
    }


    getNavigations(buildForType?: string): NavigationSectionInterface[] {
        return Array.prototype.concat.apply(
            [],
            this.plugins.map(plugin => plugin.getNavigations(buildForType))
        );
    };

    getDocuments(buildForType?: string): DocumentSectionInterface[] {
        return Array.prototype.concat.apply(
            [],
            this.plugins.map(plugin => plugin.getDocuments(buildForType))
        );
    };

    getHeaders(buildForType?: string): string[] {
        return Array.prototype.concat.apply(
            [],
            this.plugins.map(plugin => plugin.getHeaders(buildForType))
        );
    }

    getAssets(): string[] {
        return Array.prototype.concat.apply(
            [],
            this.plugins.map(plugin => plugin.getAssets())
        );
    }
}