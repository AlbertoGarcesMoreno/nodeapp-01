
'use strict';

const express = require('express');
const app = express();
const port = 8081;
const version = "v03";
const hostname = process.env.HOSTNAME;

const { Counter, register } = require('prom-client');


const counterGet = new Counter({
    name: 'test_counter',
    help: 'Example of a counter',
    labelNames: ['code'],
});


app.get('/test', function (req, res) {

let responseStatus = 200;
if(req.query.responseCode){
    if((req.query.responseCode >= 200) && (req.query.responseCode <= 599)){
    responseStatus = req.query.responseCode
    } 
}
counterGet.inc({ code: responseStatus });
console.log(`Request received in hostname: ${hostname} and port: ${port}. App version ${version}. Replying ${responseStatus} status code.`),
res.status(responseStatus).send(`Response (${responseStatus}) from container in hostname: ${hostname} and port: ${port}. App version ${version}. Status code is ${responseStatus}.`)

});

app.get('/liveOK', (req, res) => res.status(200).send(`Response live OK from container in port ${port}`))
app.get('/liveKO', (req, res) => res.status(500).send(`Response live KO from container in port ${port}`))
app.get('/readyOK', (req, res) => res.status(200).send(`Response ready OK from container in port ${port}`))
app.get('/readyKO', (req, res) => res.status(500).send(`Response ready KO from container in port ${port}`))


app.get('/metrics', async (req, res) => {
	try {
		res.set('Content-Type', register.contentType);
        let metricsBody = await register.getSingleMetricAsString('test_counter');
        metricsBody = metricsBody + "\n";
		res.end(metricsBody);
	} catch (ex) {
		res.status(500).end(ex);
	}
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

