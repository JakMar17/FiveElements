const botApiKey = "7168692522:AAF4ipSeFm_GwfT-bZ1hjA0JLwFIddQR6Ug"

const { TailLib } = require('./lib/tailLib');
const { Telegraf, Scenes, session, Format, Markup } = require("telegraf");

// Handler factories
const { enter, leave } = Scenes.Stage;
const { link } = Format;

const bot = new Telegraf(botApiKey);

bot.use(session());


const sendMessage = (ctx, message) => bot.telegram.sendMessage(ctx.chat.id, message)

const commands = [
    ['start', "start with bot interaction"],
    ['help', "list of all available commands"],
    ['flip', "flip a coin"],
    ['flipGame', "play a gem of coin flipping with me!"],
    ['balance', 'check your game balance']
]

bot.command('start', async (ctx) => {
    const { from } = ctx;
    ctx.session ??= { balance: 100 }
    await sendMessage(ctx, `Hello ${from.first_name} ${from.last_name}`);
    await sendMessage(ctx, `How can I help you today? You can use /help to get list of all my commands`)
})

bot.command('balance', async (ctx) => await sendMessage(ctx, `Your balance is ${ctx.session?.balance}`))

bot.command('help', ctx => {
    [
        "Here is list of all my available commands, that you can try:",
        commands
            .map(([command, description]) => `/${command} - ${description}\n`)
            .reduce((previous, current) => `${previous}${current}`)
    ].forEach(async (mes) => await sendMessage(ctx, mes));
});

bot.command('flip', async (ctx) => {
    await bot.telegram.sendVideo(ctx.chat.id, 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExamM4NWt1eWkzemw3ZmtvcGh6ZDQxbGFlbjQyaDJhMjlpeDRsMHptcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FfrlRYkqKY1lC/giphy.gif')
    setTimeout(() => {
        sendMessage(ctx, `I flipped - ${TailLib.numberToString(TailLib.coinFlip())}`)
    }, 1000);
});

/*
 * FLIP COIN GAME
 */

const flipCoinGame = async (userPick, ctx) => {
    userPick = TailLib.stringToNumber(userPick);
    const botPick = TailLib.pickReverse(userPick);
    const coinFlip = TailLib.coinFlip();

    await sendMessage(ctx, `Your pick is ${TailLib.numberToString(userPick)}, my pick is ${TailLib.numberToString(botPick)}.`)

    await bot.telegram.sendVideo(ctx.chat.id, 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExamM4NWt1eWkzemw3ZmtvcGh6ZDQxbGFlbjQyaDJhMjlpeDRsMHptcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FfrlRYkqKY1lC/giphy.gif')

    setTimeout(async () => {
        await sendMessage(ctx, `I flipped the coin and got ${TailLib.numberToString(coinFlip)}`)

        if (coinFlip === userPick) {
            if (ctx.session?.balance) {
                ctx.session.balance += 30;
            }
            await sendMessage(ctx, `You won and got 30, you current balance is ${ctx.session?.balance}`)
        } else {
            await sendMessage(ctx, `You lost, you current balance is ${ctx.session?.balance}`)
        }
        ctx.scene.leave()
    }, 1000);

}

const flipGameScene = new Scenes.BaseScene("flipGameScene");
flipGameScene.enter(async (ctx) => {
    try {
        ctx.session ??= {balance : 100};
        ctx.session.balance = (ctx.session.balance ?? 100) - 20;

        await sendMessage(ctx, `You are doomed, it is time for THE FLIP GAME. Your balance will be reduced by 20, if you win you get 30. Your current balance is ${ctx.session?.balance ?? 0}.`);
        
        if (ctx.session.balance < 0) {
            await sendMessage(ctx, `Your balance is too low, exiting game (tip: try /start command to refresh your balance)`);
            ctx.scene.leave('flipGameScene');
            throw new Error("Balance too low");
        }

    } catch (e) {
        console.error(e);
        return;
    }

    await sendMessage(ctx, `What do you choose?\n\t/head\n\t/tail`)
});
flipGameScene.command("exit", leave());
flipGameScene.command("head", ctx => flipCoinGame("head", ctx));
flipGameScene.command("tail", ctx => flipCoinGame("tail", ctx));
flipGameScene.leave((ctx) => ctx.reply("Thank you for playing - play again? /flipGame"))


const stage = new Scenes.Stage([flipGameScene]);
bot.use(stage.middleware());

bot.command('flipGame', ctx => {
    ctx.scene.enter('flipGameScene')
});


bot.command("inlinekb", ctx =>
	ctx.reply(
		"Launch mini app from inline keyboard!",
		Markup.inlineKeyboard([Markup.button.webApp("Launch", "http://t.me/FiveElementsJakMarsBot/FiveElementsJakMarsMiniApp")]),
	),
);

bot.on("inline_query", ctx =>
	ctx.answerInlineQuery([], {
		button: { text: "Launch", web_app: { url: "http://t.me/FiveElementsJakMarsBot/FiveElementsJakMarsMiniApp" } },
	}),
);

bot.command("setmenu", ctx =>
	// sets Web App as the menu button for current chat
	ctx.setChatMenuButton({
		text: "Launch",
		type: "web_app",
		web_app: { url: 'https://fiveelementsjakmarsminiapp.netlify.app/' },
	}),
);

bot.command("link", ctx =>
	/*
		Go to @Botfather and create a new app for your bot first, using /newapp
		Then modify this link appropriately.
	
		startapp is optional.
		If provided, it will be passed as start_param in initData
		and as ?tgWebAppStartParam=$command in the Web App URL
	*/
	ctx.reply(link("Launch", "https://t.me/FiveElementsJakMarsBot/FiveElementsJakMarsMiniApp")),
);

bot.launch();