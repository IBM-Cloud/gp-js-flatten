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

 gpClient
    .bundle(bundleName)
    .getStrings({
        languageId: targetLang,
    }, (err, result) => {
        if(err) return console.error(err);
        const resultStrings = result.resourceStrings;
        console.dir(resultStrings);
        const resultExpanded = flatten.expand(resultStrings);
        console.log('Expanded:');
        console.dir(resultExpanded);
        fs.writeFileSync(targetFile, JSON.stringify(resultExpanded));
        console.log('Wrote:', targetFile);
    });
