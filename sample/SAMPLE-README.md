Tutorial: Un/Flattener with Globalization Pipeline
==================================================

This will show you how to make use of the flattener in your own code using the Globalization Pipeline.

Prerequisite
------------

- You should already have a Globalization Pipeline instance. See the [Quickstart Guide](https://github.com/IBM-Bluemix/gp-common#quick-start-guide) for those steps.  You can create the bundle `myapp` (as below), but don’t upload any JSON content to the bundle.


Tutorial
--------

0. Get the source

```
$ git clone https://github.com/srl295/gp-js-flatten.git
$ cd gp-js-flatten
$ npm install
```

1. From the [Quickstart Guide](https://github.com/IBM-Bluemix/gp-common#quick-start-guide), create credentials in `local-sample-credentials.json`

2. create bundle `myapp` in the dashboard. Give it the target languages you wish. At least include Spanish (`es`) for this demo.

3. from the top level, run [`node ./sample/gp-upload.js`](./sample/gp-upload.js)

        $ node ./sample/gp-upload.js 
        Uploading myapp source code
        { status: 'SUCCESS' }

This uploads [`sample/en.json`](./en.json) to the dashboard.

```json
{
    "greetings": {
        "hello": "Hello there.",
        "goodbye": "Good bye."
    },
    "errors": {
        "printer": "The printer is on fire.",
        "password": "Your password is wrong."
    }
}
```

4. You can see the contents in the Bluemix dashboard, for example:

- **Key** `$.errors.password`
- **Source** `Your password is wrong.`
- **Translation** `Su contraseña está equivocada.`

5. Download the translated bundle for a language by running [`node ./sample/gp-download.js`](./sample/gp-download.js)

        $ node ./sample/gp-download.js
        Downloading ./sample/es.json
        { '$.errors.password': 'Su contraseña está equivocada.',
        '$.errors.printer': 'La impresora está en llamas.',
        '$.greetings.goodbye': 'Adiós.',
        '$.greetings.hello': 'Hola allí.' }
        Expanded:
        { errors: 
        { password: 'Su contraseña está equivocada.',
            printer: 'La impresora está en llamas.' },
        greetings: { goodbye: 'Adiós.', hello: 'Hola allí.' } }
        Wrote: ./sample/es.json

Note the translated file in Spanish, `./sample/es.json`

```json
{
    "errors": {
        "password": "Su contraseña está equivocada.",
        "printer": "La impresora está en llamas."
    },
    "greetings": {
        "goodbye": "Adiós.",
        "hello": "Hola allí."
    }
}
```