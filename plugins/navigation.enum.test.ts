import { Retrospection, TypeRef } from '../lib/interface';
import NavigationEnums from './navigation.enum';

const schema: Retrospection = require('../test/empty.schema.json');

describe('pĺugins/navigation.directive#NavigationDirectives', () => {

    const plugin = new NavigationEnums(schema.data.__schema, (url: TypeRef) => url.name, {}, {});

    test('plugin return navigation', () => {
        const navigations = plugin.getNavigations('Query');
        expect(navigations).toBeInstanceOf(Array);
        expect(navigations).toEqual([
            {
                title: 'Enums',
                items: [
                    { text: '__DirectiveLocation', href: '__DirectiveLocation', isActive: false },
                    { text: '__TypeKind', href: '__TypeKind', isActive: false },
                ]
            }
        ]);
    });

    test('plugin dont return document', () => {
        const documents = plugin.getDocuments();
        expect(documents).toBeInstanceOf(Array);
        expect(documents).toHaveLength(0);
    });

    test('plugin dont return headers', () => {
        const headers = plugin.getHeaders();
        expect(headers).toBeInstanceOf(Array);
        expect(headers).toHaveLength(0);
    });

    test('plugin dont return assets', () => {
        const assets = plugin.getAssets();
        expect(assets).toBeInstanceOf(Array);
        expect(assets).toHaveLength(0);
    });
});