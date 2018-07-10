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
const flatten = require('../');
const gp = require('g11n-pipeline');
const gpCreds = require('../local-sample-credentials.json');
const fs = require('fs');

// create the gpClient
const gpClient = gp.getClient({credentials: gpCreds});

const bundleName = 'myapp';
const targetLang = 'es';
const targetFile = './sample/'+targetLang+'.json';

console.log('Downloading ' + targetFile);

function processStrings(resultExpanded) {
  // for now, we just write the output to a JSON file
  fs.writeFileSync(targetFile, JSON.stringify(resultExpanded, null, 4) + '\n' );
  console.log('Wrote:', targetFile);
}

gpClient
  .bundle(bundleName)
  .getStrings({
    languageId: targetLang
  }, (err, result) => {
    if(err) return console.error(err);

    // Expand the result
    const resultExpanded = flatten.expand(result.resourceStrings);

    // here is where we use the strings.
    processStrings(resultExpanded);
  });
