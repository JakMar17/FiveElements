# 5Element: Telegram bot

This project is part of technical interview for company 5Element.

## Description

Telegram bot named `@FiveElementsJakMarsBot` is simple bot that is listening for different commands.

Bot can answer to different commands, flip a coin and play flip game with user. Every user has its own balance (initialy balance is 100), while playing the flip game, he can increase or decrease his balance.

### Technical background

Bot is developed in `NodeJS` as a standalone script using one of the most popular NodeJS libraries for building Telegram bots `telegraf`. Currently bot simply respondes to messages inside the chat, so there is no need for web server implementation - that means that bot can be run anywhere (including personal laptop).

"Production" version of this bot is running inside Docker image on one of my selfhosting environments. Since is not a web server, it does not have public URL.

Bot uses session for every user, session data is stored in-memory, so it is cleaned on every script restart.

### List of available commands

Commands that are available at this moment

| Command | Description |
|---|---|
|`/start`|Command starts conversation with bot. _As a side effect of function, it also restarts users balance._|
|`/help`|Command lists all available commands inside bot and its descriptions.|
|`/flip`|Bot flips a coin and returns value of `head` or `tail`.|
|`/flipGame`| Bot starts game, firstly user's balance is reduced by 20 and he has to choose between `head` or `tail`. Bot chooses different value and flips a coin. If user wins, his balance is increased by 30.|
|`/balance`|Bot returns user's current balance.|

## Getting Started

### Dependencies

Before installing script, you need to have `node` and `npm` installed on your computer.

Project dependencies can later be installed using

```
npm install
```

### Environment variables

To use bot, you need to have your own __Telegram API KEY__ and __Telegram MiniApp URL__. Those varibles must be placed inside `.env` file.

```.env
BOT_API=<TELEGRAM_API_KEY>
MINI_APP_URL=https://fiveelementsjakmarsminiapp.netlify.app/
```

### Installing and executing

After you had prepared `.env`˙file and run `npm install` you can start bot script using

```
node --env-file=.env .\index.js
```

### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```

## Running inside Docker container

Bot can also be run inside Docker container (for this you need to have docker installed on your computer).

Firstly, you need to build the Docker image, using `Dockerfile` inside project (you also need to have `.env` file).

```
docker build -t <IMAGE_NAME> .
```

After building image, image can be started using:
```
docker run fiveelementsbot
```