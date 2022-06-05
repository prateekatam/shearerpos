const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

let date_time = new Date();

app.get('/shearerpos', (req, res) => {
	console.log("Get request received");

	let labels = []
	let fullData = []
	let missingData = new Array(100).fill(null);
	let offlineData = new Array(100).fill(null);

	// To make sure the program doesn't crash when it tries to parse a JSON that's still being written
	let success = false
	while(!success)	{
		let lastOnlinePosition = 1
		try{
			const f = fs.readFileSync('../shearerMonitor/sample.json');
			const data = JSON.parse(f);
			const dataLatest = data.positions.slice(-100,)

			for (let i = 0; i <= 99; i++)	{
				labels.push(dataLatest[i].time)
				fullData.push(dataLatest[i].position)

				if (dataLatest[i].status === "OK")	{
					lastOnlinePosition = dataLatest[i].position
				}

				// When offline
				if (dataLatest[i].status === "OFFLINE")	{
					offlineData[i] = lastOnlinePosition
					if(i > 0)	{
						offlineData[i-1] = lastOnlinePosition
					}
					if(i < 99)	{
						offlineData[i+1] = lastOnlinePosition
					}
				}

				// When Error
				if (dataLatest[i].status === "ERROR")	{
					missingData[i] = lastOnlinePosition
					if(i > 0)	{
						missingData[i-1] = lastOnlinePosition
					}
					if(i < 99)	{
						missingData[i+1] = lastOnlinePosition
					}
				}
			}

			success = true
		}
		catch	(err)	{
			console.log("JSON still writing");
		}
	}
	res.status(201).send({"data": fullData, "missingData": missingData, "offlineData": offlineData, "labels": labels})
})

// app.post('/shearerpos', (req, res) => {
// 	console.log("Post request received");
// 	const {time, position} = req.body;

// 	const newData = [...pos];
// 	newData.shift();
// 	newData.push(position);
// 	pos = newData;

// 	const newLabels = [...labels];
// 	newLabels.shift();
// 	newLabels.push(time);
// 	labels = newLabels;

// 	res.status(201).send("position added")
// })

app.listen(4000, () =>	{
	console.log('Shearer position: Listening on port 4000. Time: ', date_time.getHours()+':'+date_time.getMinutes())
})