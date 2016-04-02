# boet
Beat droppin' poem bot

Test it out at:

  * Web: https://boet.herokuapp.com/
  * Telegram: https://telegram.me/boet_bot


## What is it?

 * A chat bot connected to [Microsoft Bot Framework](https://dev.botframework.com/)
 * A [custom UI](https://boet.herokuapp.com/) with speech input and output
 * A Markov chain trained with [Apollo 11 mission transcripts](https://github.com/Spacelog/Spacelog)

## What does it do?

 * Listens for messages through the Bot Framework [BotConnector](http://docs.botframework.com/connector/getstarted/)
 * Finds a rhyming end word from [RhymeBrain API](http://rhymebrain.com/api.html)
 * Generates a text from the Markov chain, based on matched rhymes
 * Finds a suitable image from [Bing Image Search API](https://datamarket.azure.com/dataset/bing/search)
 * Makes you laugh

## Who made it?

 * [Axel Eirola](http://aeirola.iki.fi/)
 * [Janne Kiirikki](http://futurice.com/people/janne-kiirikki)
 * @ Futurice CodeCamp 2016


## Development

### Autoreloading dev server

```bash
nodemon app.js
```

### Autorunning tests

```bash
npm test -- --watch
```

### Running bot in CLI

```bash
node bin/cli.js --data data/apollo.json
```


## Generating data

### Gathering input

#### Space missions
```bash
# Get data
git clone https://github.com/Spacelog/Spacelog.git

# Clean data
cat ~/Downloads/Spacelog/missions/a11/transcripts/TEC ~/Downloads/Spacelog/missions/a11/transcripts/CM | sed -e '/^\[[0-9:]*\]$/d' -e '/^_.*:/d' -e '/^\s*$/d' -e 's/^[^:]*: //' > input/apollo_11.txt
```

### Training modeled

```bash
node bin/train.js -f input/apollo_11.txt -o data/apollo.json
```

### Disclaimers

This bot uses http://rhymebrain.com/api.html for wicked rhyme dropping.
