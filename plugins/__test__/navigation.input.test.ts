import { Introspection } from '../../lib/interface';
import NavigationInputs from '../navigation.input';

const schema: Introspection = require('./empty.schema.json');
const projectPackage: any = require('./projectPackage.json');

describe('pĺugins/navigation.directive#NavigationDirectives', () => {

    const plugin = new NavigationInputs(schema.data.__schema, projectPackage, {});

    test('plugin return navigation', () => {
        const navigations = plugin.getNavigations('Query');
        expect(navigations).toBeInstanceOf(Array);
        expect(navigations).toEqual([
            {
                title: 'Input Objects',
                items: [
                    { text: 'AddCommentInput', href: '/addcommentinput.doc.html', isActive: false },
                ]
            }
        ]);
    });
});