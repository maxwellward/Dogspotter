<h1 align="center">
	🐶 Dogspotter 🐾
</h1>
<h3 align="center">Finding cute dogs, now a competitive sport</h3>
<hr>

## What is Dogspotter?
Dogspotter is a leaderboard-based game where players take photos of dogs in the real world and submit them for points.  

[Join the Dogspotter Discord!](https://discord.gg/JFGsuaR3pG) 💬

The project is written in JavaScript. It utilizes Firebase for data storage and the Google Vision API for automatic dog-detection.

The Dogspotter bot is not available to invite to your own Discord server, but you're free to self-host it with your own Firebase and Google Vision API credentials to play with your friends! See the [setup section](#setup) for a getting started guide.

## Issues

Please report any issues with the bot to either our [Discord server](https://discord.gg/JFGsuaR3pG) (`/report`) or on the [issues page](https://github.com/maxwellward/Dogspotter/issues)!

## Contributing

Good-faith contributions are always welcome! This project is pretty simple, so if you're a new JavaScript developer or want to work on something simple, this is a good project for you. We also don't bite, so even if you're new we're happy to give constructive feedback on your contributions.

## Setup

1. Clone the project onto your local machine.
2. Copy the `.env.example` and `config.json.example` files and remove their `.example` extensions.
3. Fill in the placeholder ID's with your real ID's from Discord.
4. Replace `firebase.json.example` with your Firebase configuration file (this holds your API key and other information).
5. In the root project directory, install the required packages with `npm i`.
6. Enable the [Google Vision AI API](https://cloud.google.com/vision) in your Google Cloud Developer Console.
7. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install) and set up your ADC (Application Default Credentials) by following [this guide](https://cloud.google.com/docs/authentication/provide-credentials-adc). 
8. Navigate to `src/` and run `node deployCommands.js` to set up commands on your test server.
9. Navigate to `src/` and run `node index.js` to start the bot.