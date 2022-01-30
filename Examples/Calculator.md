# Example for Calculator

```js
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