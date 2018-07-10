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

const expect = require('chai').expect;
const flatten = require('../');
const dataInput = require('./gp-res-filter.d/input.json');
const dataOutput = require('./gp-res-filter.d/output.json');
const expectOutput = dataOutput.reduce((p, v) => {
  const {key,value} = v;
  p[key] = value;
  return p;
}, {});

describe('test vs. gp-res-filter files', function() {
  it('should be able to flatten gp-res-filter/input.json', function() {
    const input  = dataInput;
    const output = flatten.flatten(input);
    expect(output).to.deep.equal(expectOutput);
  });
  it('should be able to expand gp-res-filter/input.json', function() {
    const input  = expectOutput;
    const output = flatten.expand(input);
    expect(output).to.deep.equal(dataInput);
  });
});

