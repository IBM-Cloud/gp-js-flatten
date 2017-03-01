

0. `npm install`
1. create credentials in `../local-sample-credentials.json`
2. create bundle `myapp` in the dashboard
3. from the top level, run `node ./sample/gp-upload.js'

        $ node ./sample/gp-upload.js 
        Uploading myapp source code
        { status: 'SUCCESS' }

This uploads `sample/en.json`

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

4. You can see the contents in the dashboard, for example:


        Key: $.errors.password
        Source: Your password is wrong.
        Translation: Su contraseña está equivocada.

5. Download the translated bundle for a language.

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

You will see the file `./sample/es.json`

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