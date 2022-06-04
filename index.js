const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let date_time = new Date();

var pos = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
var labels = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]

app.get('/shearerpos', (req, res) => {
	console.log("Get request received");
	res.status(201).send({"data": pos, "labels": labels})
})

app.post('/shearerpos', (req, res) => {
	console.log("Post request received");
	const {time, position} = req.body;

	const newData = [...pos];
	newData.shift();
	newData.push(position);
	pos = newData;

	const newLabels = [...labels];
	newLabels.shift();
	newLabels.push(time);
	labels = newLabels;

	// console.log("positions: ", pos)
	// console.log("labels: ", labels) 

	res.status(201).send("position added")
})

app.listen(4000, () =>	{
	console.log('Shearer position: Listening on port 4000. Time: ', date_time.getHours()+':'+date_time.getMinutes())
})