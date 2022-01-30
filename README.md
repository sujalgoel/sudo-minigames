<p align="center"><img width="100px"
   style="margin-bottom:-6px;" src="https://cdn.discordapp.com/attachments/856226496229670912/934309714886533120/Sudo_DevelopmentTransparent.png" /></p>
<h1 align="center">Sudo Minigames</h1>
<p align="center">
   <a href="https://www.npmjs.com/package/sudo-minigames"><img src="https://img.shields.io/npm/v/sudo-minigames.svg?style=flat-square" /></a>
   <!-- <a href="https://weky-docs.js.org/"><img src="https://img.shields.io/badge/Documentation-Yes-amiajokegreen.svg?style=flat-square" /></a> -->
   <a href="https://github.com/SudoDevelopment/sudo-minigames/blob/main/LICENSE"><img src="https://nuggies.js.org/assets/img/license.ade17f5e.svg" /></a>
</p>

## What is sudo-minigames?
- A fun npm package to play games within Discord with buttons!
- looking for examples? click here: [Examples](https://github.com/SudoDevelopment/sudo-minigames/tree/main/Examples)

## Features
- ✨ Simple
- 🎉 Easy to use
- 🧑 Beginner friendly
- 🤖 Supports Discord.js V13 with Interactions
- and much more!

## Install the package 📥
```sh
npm install sudo-minigames
```

## Usage 📚
```js
const { Calculator } = require("sudo-minigames");
await Calculator({
    message: message,
    embed: {
        title: 'Calculator | Sudo Development',
        color: '#5865F2',
        footer: '©️ Sudo Development',
        timestamp: true
    },
    disabledQuery: 'Calculator is disabled!',
    invalidQuery: 'The provided equation is invalid!',
    othersMessage: 'Only <@{{author}}> can use the buttons!'
});
```

## Contributing 🤝
- Contributions, issues and feature requests are welcome!
- Feel free to check **[issues page](https://github.com/SudoDevelopment/sudo-minigames/issues)**.

## Developers 👨‍💻
- **[Sujal Goel#7602](https://github.com/sujalgoel)**

## Support ❔
<a href="https://discord.gg/ANzBrkcXZy"><img src="https://invidget.switchblade.xyz/ANzBrkcXZy" /></a>