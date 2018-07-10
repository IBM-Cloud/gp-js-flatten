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

// test integration with gp
const optional = require('optional');
const expect = require('chai').expect;
const flatten = require('../');
const gp = require('g11n-pipeline');

const gpCreds = optional('./local-credentials.json');

let gpClient;

if ( !gpCreds ) { describe = describe.skip; }

describe('test of g11n-pipeline integration', function() {
  it('should setup the gp client',
    () => { gpClient = gp.getClient(gpCreds)})
  it('should ping the gp server (sanity)',
    () => gpClient.ping());
  it('should be able to create a bundle',
    () => gpClient
      .bundle('mytest')
      .create({
        sourceLanguage: 'en',
        targetLanguages: ['qru']
      }));
  it('should be able to upload flattened data',
    () => gpClient
      .bundle('mytest')
      .uploadStrings({
        languageId: 'en',
        strings: flatten.flatten(require('./input1.json'))
      }));
  it('should be able to fetch flattened data',
    () => gpClient
      .bundle('mytest')
      .getStrings({
        languageId: 'en'
      })
      .then((result) => {
        expect(result.resourceStrings).to.deep.equal(require('./flatten1.json'));
        expect(flatten.expand(result.resourceStrings)).to.deep.equal(require('./expand1.json'));
      }));
  it('should wait a sec for translation',
    (done) => setTimeout(done, 3000, null));
  it('should be able to fetch translated data',
    () => gpClient
      .bundle('mytest')
      .getStrings({
        languageId: 'qru'
      })
      .then((result) => {
        expect(result.resourceStrings).to.deep.equal(require('./flatten1r.json'));
        expect(flatten.expand(result.resourceStrings)).to.deep.equal(require('./expand1r.json'));
      }));
});