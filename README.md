# botsong
Bot who sings, for you!

Test it out at:

  * Web: https://botsong.herokuapp.com/
  * Telegram: https://telegram.me/botsong_bot


## Development

### Autoreloading dev server

```bash
nodemon app.js
```

### Autorunning tests

```bash
npm test -- --watch
```


## Generating data

### Space missions


```bash
# Get data
git clone https://github.com/Spacelog/Spacelog.git

# Clean data
cat ~/Downloads/Spacelog/missions/a11/transcripts/TEC ~/Downloads/Spacelog/missions/a11/transcripts/CM | sed -e '/^\[[0-9:]*\]$/d' -e '/^_.*:/d' -e '/^\s*$/d' -e 's/^[^:]*: //' > input/apollo_11.txt


```
