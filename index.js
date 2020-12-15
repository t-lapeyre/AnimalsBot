require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');

const prefix = '!';

client.once('ready', () => {
    console.log('Je suis connecté');
});

client.login(process.env.TOKEN);

const animals = [
    'dog',
    'cat',
    'panda',
    'red_panda',
    'fox',
    'birb',
    'koala',
    'kangaroo',
    'racoon',
    'whale',
];

function requestApi(url, fct) {
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const jsonData = JSON.parse(data);
            fct(jsonData);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help' && message.mentions.has(client.user)) {
        response = "Command: !animal to get a random animal picture. You can request a specific animal:";
        for (animal of animals) {
            response += '\n' + animal;
        }
        message.channel.send(response);
    }
    else if (command === 'animal') {
        let animal = args[0];
        if (args.length === 0 || !animals.includes(animal)) {
            animal = animals[Math.floor(Math.random() * animals.length)];
        }

        const url = 'https://some-random-api.ml/img/' + animal;
        requestApi(url, data => {
            message.channel.send("", { files: [ data.link ] })
        });
    }
});