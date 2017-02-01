import { Retrospection, TypeRef } from '../lib/interface';
import NavigationInterfaces from './navigation.interface';

const schema: Retrospection = require('../test/empty.schema.json');

describe('pĺugins/navigation.interface#NavigationInterfaces', () => {

    const plugin = new NavigationInterfaces(schema.data.__schema, (url: TypeRef) => url.name, {}, {});
    test('plugin dont return assets', () => {
        const assets = plugin.getAssets();
        expect(assets).toBeInstanceOf(Array);
        expect(assets).toHaveLength(0);
    });
});