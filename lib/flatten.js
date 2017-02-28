/*	
 * Copyright IBM Corp. 2015,2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const jsonpath = require('jsonpath');

/**
 * Flatten a deeply nested object into its jsonpath equivalent
 * @param {Object} obj - The input object
 * @param {Object} [opts] - Optional input parameters
 */
module.exports.flatten = function flatten(obj, opts) {
    opts = opts || {}; // optional
    if (!obj) return {};

    return jsonpath
    .nodes(obj, '$..*')
    .reduce((p,v) => {
        if ( typeof v.value !== 'object') {
            const k = jsonpath.stringify(v.path);
            p[k] = (v.value || '').toString();
        }
        return p;
    },{});
};

/**
 * Expand a flattened object into its deep equivalent
 * @param {Object.<string, string>} flattened - The flattened object
 * @param {Object} [opts] - Optional input parameters
 */
module.exports.expand = function expand(flattened, opts) {
    opts = opts || {}; // optional
    if (!flattened) return {};

    return Object.keys(flattened)
        .reduce((p,k) => module.exports._apply(p,k,flattened[k])
        ,{});
};

const _DEBUG = false;

/**
 * @param {Object} root root object to modify
 * @param {String} k jsonpath keys
 * @param {String} v string value to apply
 * @ignored
 */
module.exports._apply = 
function _apply(root, k, v) {
    // parse the path
    const path = jsonpath.parse(k);
    path[path.length-1].last = true; // mark last
    _DEBUG && console.dir(path);
    /* const leaf = */path.reduce((cur, pe) => {
        if(_DEBUG) {
            console.log('root=');
            console.dir(root);
            console.log('cur=');
            console.dir(cur);
        }
        if(pe.expression.type === 'root' && pe.expression.value === '$') {
            _DEBUG && console.log('$');
            return root; // root
        } else if(
                // ….baz
                (pe.expression.type === 'string_literal'
                && pe.scope === 'child'
                && pe.operation === 'subscript') 
                
                // …["π"]
                || (pe.expression.type === 'identifier' 
                && pe.scope === 'child'
                && pe.operation === 'member')) {
            if(!pe.last) {
                _DEBUG && console.log('Traversing',pe.expression.value);
                return (cur[pe.expression.value] = (cur[pe.expression.value] || {}));
            } else {
                _DEBUG && console.log('Setting',pe.expression.value,v);
                cur[pe.expression.value] = v; // set string value
                return cur;
            }
        } else {
            throw Error('Could not parse expression: ' + JSON.stringify(pe) + ' in ' + k);
        }
    },root);
    return root;
};

/*
> jsonpath.parse('$["π"].quux')
[ { expression: { type: 'root', value: '$' } },
  { expression: { type: 'string_literal', value: 'π' },
    scope: 'child',
    operation: 'subscript' },
  { expression: { type: 'identifier', value: 'quux' },
    scope: 'child',
    operation: 'member' } ]
> jsonpath.parse('$.baz.quux')
[ { expression: { type: 'root', value: '$' } },
  { expression: { type: 'identifier', value: 'baz' },
    scope: 'child',
    operation: 'member' },
  { expression: { type: 'identifier', value: 'quux' },
    scope: 'child',
    operation: 'member' } ]
*/