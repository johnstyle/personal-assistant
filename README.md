# Personal assistant

Not stable, in development

### Requirements

    apt-get install espeak 

### Usage

    node server.js --debug

### Trainning

    node trainning.js

### Example

    Bonjour Jonathan !
    > Quelle sera la météo à Lyon demain ?
    [Debug] tokens : [ 'quelle', 'sera', 'la', 'meteo', 'lyon', 'demain' ]
    [Debug] services : { weather: [ { name: 'Météo', action: null, value: null } ] }
    [Debug] documents : { location: [ { name: 'Lyon', action: null, value: null } ], time: [ { name: 'Demain', action: 'dayterm', value: 1 } ] }
    [Debug] words : [ 'quelle', 'sera' ]
    Il fera 15.87° avec légères pluies
    > 

### Example with required more informations

    Bonjour Jonathan !
    > Quelle est la météo ?
    [Debug] tokens : [ 'quelle', 'est', 'la', 'meteo' ]
    [Debug] services : { weather: [ { name: 'Météo', action: null, value: null } ] }
    [Debug] documents : {}
    [Debug] words : [ 'quelle' ]
    De quelle localité ?
    > Lyon
    [Debug] tokens : [ 'lyon' ]
    [Debug] services : { weather: [ { name: 'Météo', action: null, value: null } ] }
    [Debug] documents : { location: [ { name: 'Lyon', action: null, value: null } ] }
    [Debug] words : [ 'quelle' ]
    Il fera 17.73° avec légères pluies
    > 
