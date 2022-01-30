# Example for Would You Rather

```js
await WouldYouRather({
	message: message,
	embed: {
		title: 'Would you rather... | Sudo Development',
		color: '#5865F2',
        footer: '©️ Sudo Development',
		timestamp: true
	},
	thinkMessage: 'I am thinking',
	othersMessage: 'Only <@{{author}}> can use the buttons!',
	buttons: { optionA: 'Option A', optionB: 'Option B' }
});
```