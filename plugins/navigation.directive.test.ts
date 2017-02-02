import { Retrospection, TypeRef } from '../lib/interface';
import NavigationDirectives from './navigation.directive';

const schema: Retrospection = require('../test/empty.schema.json');

describe('pĺugins/navigation.directive#NavigationDirectives', () => {

    const plugin = new NavigationDirectives(schema.data.__schema, (url: TypeRef) => url.name, {}, {});

    test('plugin return navigation', () => {
        const navigations = plugin.getNavigations('Query');
        expect(navigations).toBeInstanceOf(Array);
        expect(navigations).toEqual([
            {
                title: 'Directives',
                items: [
                    { text: 'deprecated', href: 'deprecated', isActive: false },
                    { text: 'include', href: 'include', isActive: false },
                    { text: 'skip', href: 'skip', isActive: false },
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