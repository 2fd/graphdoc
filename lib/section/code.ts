
export const serializeFunction = (type) => type.serialize ? {
    title: 'Serialize function',
    description: '<pre>  ' + type.serialize.toString() + '</pre>'
} : null;

export const parseValueFunction = (type) => type.parseValue ? {
    title: 'ParseValue function',
    description: '<pre>  ' + type.parseValue.toString() + '</pre>'
} : null;

export const parseLiteralFunction = (type) => type.parseLiteral ? {
    title: 'ParseValue function',
    description: '<pre>  ' + type.parseLiteral.toString() + '</pre>'
} : null;
