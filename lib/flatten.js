/*
 * Copyright IBM Corp. 2015,2018
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

const jsonpath = require('@livereach/jsonpath');

/**
 * Flatten a deeply nested object into its jsonpath equivalent
 * @param {Object} obj - The input object
 * @param {Object} [opts] - Optional input parameters
 * @param {Boolean} [opts.flattenAll=false] - If true, flatten all values, even simple top level keys.
 */
module.exports.flatten = function flatten(obj, opts) {
  opts = opts || {}; // optional
  if (!obj) return {};

  return jsonpath
    .nodes(obj, '$..*')
    .reduce((p,v) => {
      if ( !opts.flattenAll &&
        typeof v.value === 'string' &&
        v.path.length === 2 &&
        v.path[1].substring(0,2) !== '$.') {
        // It is a simple {key: "value"} … do not modify it
        p[v.path[1]] = v.value;
      } else if ( typeof v.value !== 'object') {
        const k = jsonpath.stringify(v.path);
        p[k] = v.value
      }
      return p;
    },{});
};

/**
 * Expand a flattened object into its deep equivalent
 * @param {Object.<string, string>} flattened - The flattened object
 * @param {Object} [opts] - Optional input parameters
 */
module.exports.expand = function expand(flattened/*, opts*/) {
  // opts = opts || {}; // optional
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
 * @ignore
 */
module.exports._apply =
function _apply(root, k, v) {
  // parse the path
  let path;
  if(k[0] !== '$') {
    // no JSONpath prefix—ignore
    root[k] = v;
    return root;
  }
  try {
    path = jsonpath.parse(k);
  } catch (e) {
    /*istanbul ignore next*/ _DEBUG && console.error(e);
    // Just map k=v
    root[k]=v;
    return root;
  }
  let cur = root;
  for(let n=0; n<path.length; n++) {
    const pe = path[n];
    if(pe.expression.type === 'root' && pe.expression.value === '$') {
      cur = root; // root
    } else if(
    // ….baz
      (pe.expression.type === 'string_literal'
                && pe.scope === 'child'
                && pe.operation === 'subscript')

                // …["π"]
                || (pe.expression.type === 'identifier'
                && pe.scope === 'child'
                && pe.operation === 'member')

                // $.key[0] — for now, we expand this like a map
                || (pe.expression.type === 'numeric_literal'
                && pe.scope === 'child'
                && pe.operation === 'subscript')) {
      const pxv = pe.expression.value;
      if(path[n+1]) { // not last
        cur = cur[pxv] = ( cur[pxv] || emptyFor(path[n+1].expression.type));
      } else { // last
        /*istanbul ignore next*/ _DEBUG && console.log('Setting',pe.expression.value,v);
        cur[pe.expression.value] = v; // set string value
        //cur = cur;
      }
    } else {
      /*istanbul ignore next*/ throw Error('Could not apply expression: ' + JSON.stringify(pe) + ' in ' + k);
    }
  }
  return root;
};

function emptyFor(t) {
  if(t === 'numeric_literal') {
    return [];
  } else {
    return {};
  }
}
