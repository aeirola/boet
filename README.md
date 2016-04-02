# boet
Beat droppin' poem bot

Test it out at:

  * Web: https://boet.herokuapp.com/
  * Telegram: https://telegram.me/boet_bot


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

### About

This bot uses http://rhymebrain.com/api.html for wicked rhyme dropping.
