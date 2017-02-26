import { Introspection } from '../../lib/interface';
import NavigationInterfaces from '../navigation.interface';

const schema: Introspection = require('./empty.schema.json');
const projectPackage: any = require('./projectPackage.json');

describe('pĺugins/navigation.interface#NavigationInterfaces', () => {

    const plugin = new NavigationInterfaces(schema.data.__schema, projectPackage, {});

    test('plugin return navigation', () => {
        const navigations = plugin.getNavigations('Query');
        expect(navigations).toBeInstanceOf(Array);
        expect(navigations).toEqual([]);
    });
});