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

const marked = require('marked');
const fs = require('fs');

const header = '<!DOCTYPE html> <html><head><meta charset="UTF-8"><title>Un/Flattener for JSON</title>'+
    '<link rel="stylesheet" href="node_modules/github-markdown-css/github-markdown.css"></head><body style="padding: 1em;" class="markdown-body">\n';
const footer = '</body>\n';

const ifn = 'README.md';
const ofn = 'README.html';

fs.readFile(ifn, 'utf-8', (err, data) => {
  if(err) throw err;
  marked(data.toString(), {}, function (err, content) {
    if(err) throw err;
    fs.writeFile(ofn,
      header + content + footer, function(err) {
        if(err) throw err;
        console.log('Wrote ' + ofn);
      });
  });
});

