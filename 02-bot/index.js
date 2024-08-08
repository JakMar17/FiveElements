const botApiKey = "7168692522:AAF4ipSeFm_GwfT-bZ1hjA0JLwFIddQR6Ug"

const { Telegraf, Scenes, session } = require("telegraf");
// Handler factories
const { enter, leave } = Scenes.Stage;

const bot = new Telegraf(botApiKey);

bot.launch();

const sendMessage = (ctx, message) => bot.telegram.sendMessage(ctx.chat.id, message)

const commands = [
    ['start', "start with bot interaction"],
    ['help', "list of all available commands"],
    ['flip', "flip a coin"],
    ['flipGame', "play a gem of coin flipping with me!"],
    ['balance', 'check your game balance']
]

bot.command('start', ctx => {
    const { from } = ctx;
    ctx.session ??= {balance : 100}
    sendMessage(ctx, `Hello ${from.first_name} ${from.last_name}`);
    sendMessage(ctx,
        `How can I help you today?\n
You can try some of my built in commands like:
/help that lists all of my commands
/flip to flip a coin`)
})

bot.command('help', ctx => {
    [
        "Here is list of all my available commands, that you can try:",
        commands
            .map(([command, description]) => `/${command} - ${description}\n`)
            .reduce((previous, current) => `${previous}${current}`)
    ].forEach(mes => sendMessage(ctx, mes));
});

bot.command('flip', async (ctx) => {
    const coinFlip = Math.round(Math.random());
    await bot.telegram.sendVideo(ctx.chat.id, 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExamM4NWt1eWkzemw3ZmtvcGh6ZDQxbGFlbjQyaDJhMjlpeDRsMHptcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FfrlRYkqKY1lC/giphy.gif')
    setTimeout(() => {
        sendMessage(ctx, `I flipped - ${coinFlip === 0 ? 'head': 'tail'}`)
    }, 1000);
});

//scene
const flipCoinGame = async (userPick, ctx) => {
    userPick = userPick === 'heads' ? 0 : 1;
    const botPick = userPick === 0 ? 1 : 0;
    await sendMessage(ctx, `Your pick is ${userPick}, my pick is ${botPick}.`)
    await sendMessage(ctx, `I am flipping the coin!`)
    await sendMessage(ctx, `I flipped x, I win`)
    await sendMessage(ctx, `Goodbye`)
    ctx.scene.leave()
}

const flipGameScene = new Scenes.BaseScene("flipGameScene");
flipGameScene.enter((ctx) => ctx.reply(`You are doomed, it is time for THE FLIP GAME. Do you chose /heads or /tail?`));
flipGameScene.command("exit", leave());
flipGameScene.command("heads", ctx => flipCoinGame("heads", ctx));
flipGameScene.command("tail", ctx => flipCoinGame("tail", ctx));
flipGameScene.leave((ctx) => ctx.reply("Thank you for playing"))



const stage = new Scenes.Stage([flipGameScene]);
bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());

bot.command('flipGame', ctx => {
    ctx.scene.enter('flipGameScene')
})
