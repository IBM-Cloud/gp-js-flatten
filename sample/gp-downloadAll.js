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

const flatten = require('../'); // this would be require('g11n-pipeline-flatten') via npm
const gp = require('g11n-pipeline');
const fs = require('fs');

// credentials from the Bluemix dashboard
const gpCreds = require('../local-sample-credentials.json');

// create the gpClient
const gpClient = gp.getClient({credentials: gpCreds});

// change this to your bundle name
const bundleName = 'myapp';

// prefix for JSON output
const targetDir = './sample/';

// this kicks off the fetch process
gpClient
  .bundle(bundleName) // create a Bundle object
  .getInfo((err, bundle) => { // fetch detailed info (targ lang list)
    if(err) return console.error(err);
    processLanguages(bundle);
  });

/**
 * Given a bundle with info (getInfo), process it by downloading all lanugages
 * @param {Object} bundle
 */
function processLanguages(bundle) {
  const languages = bundle.targetLanguages; // only include target languages

  // Comment out the above line and use the following to re-download English also
  //const languages = bundle.languages(); // all - includes source (en)

  console.log('Downloading all of:', languages, 'for bundle:', bundle.id);

  // Do the Downloading
  processNext(languages, bundle);
}

/**
 * Recursive function that processes the entire list
 * @param {String[]} list
 * @param {Object} bundle
 */
function processNext(list, bundle) {
  const lang = list.pop();
  console.log('Downloading:', lang);
  bundle.getStrings({languageId: lang}, (err, result) => {
    if(err) return console.error(err); // stops on the first error.

    // Process expanded strings
    processStrings(lang, flatten.expand(result.resourceStrings));

    // Kick off the next
    if(list.length > 0) {
      // recurse
      processNext(list, bundle);
    } else {
      console.log('Done.');
    }
  });
}


/**
 * Process the strings from a single language
 * @param {String} lang - language id
 * @param {Object} resultExpanded - the reconstituted original object
 */
function processStrings(lang, resultExpanded) {
  const targetFile = targetDir + lang + '.json';
  // for now, we just write the output to a JSON file
  fs.writeFileSync(targetFile,
    JSON.stringify(resultExpanded, null, 4) + '\n' );
  console.log('Wrote:      ', targetFile);
}
