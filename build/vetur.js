// generate tags.json and attributes.json from components that are defined in lib/main.ts
// import { getComponents } from './getComponents';
import fs from 'fs';
import * as components from '../dist/main.js';
import { parse } from 'vue-docgen-api';


console.log('components', components);

const tags = Object.keys(components).map((component, v) => {
    console.log('component', component, components[component]);
    return {
        name: component,
        description: components[component].description,
        attributes: Object.keys(components[component].props).map((prop) => {
            return {
                name: prop,
                type: components[component].props[prop].type,
                description: components[component].props[prop].description,
                default: components[component].props[prop].default,
                required: components[component].props[prop].required,
            };
        }),
    };
});

// console.log('tags', tags);

// const attributes = components.reduce((acc, component) => {
//     component.props.forEach((prop) => {
//         acc[prop.name] = {
//         type: prop.type,
//         description: prop.description,
//         default: prop.default,
//         required: prop.required,
//         };
//     });
//     return acc;
// });

// fs.writeFileSync(path.resolve(__dirname, 'dist/tags.json'), JSON.stringify(tags, null, 2));
// fs.writeFileSync(path.resolve(__dirname, 'dist/attributes.json'), JSON.stringify(attributes, null, 2));