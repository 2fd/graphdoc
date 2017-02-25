import { Introspection } from '../../lib/interface';
import NavigationEnums from '../navigation.enum';

const schema: Introspection = require('./empty.schema.json');
const projectPackage: any = require('./projectPackage.json');

describe('pĺugins/navigation.directive#NavigationDirectives', () => {

    const plugin = new NavigationEnums(schema.data.__schema, projectPackage, {});

    test('plugin return navigation', () => {
        const navigations = plugin.getNavigations('Query');
        expect(navigations).toBeInstanceOf(Array);
        expect(navigations).toEqual([
            {
                title: 'Enums',
                items: [
                    { text: '__DirectiveLocation', href: '/directivelocation.spec.html', isActive: false },
                    { text: '__TypeKind', href: '/typekind.spec.html', isActive: false },
                ]
            }
        ]);
    });
});