# sr-savegame-analyzer

Savegame analyzer for the game SnowRunner.

## How to use

Just find your savegame (`CompleteSave.dat` or `CompleteSave.cfg`) as described
[here](https://www.maprunner.info/resources/save-editor)
and upload it to the web app.

If you can't find it, here's a (non-exhaustive) list of the possible savegame location:

### Windows:

- `C:\Users\<your_username>\Documents\My Games\SnowRunner\base\storage\<player_id>/`
- `C:\Users\Public\Documents\Steam\CODEX\1465360\remote\`
- `C:\Program Files (x86)\Steam\userdata\<your_steam_id>\1465360\remote\`

### Linux

- `~/.local/share/Steam/userdata/<your_steam_id>/1465360/remote/`

## Problems and Limitations

---

## Advanced usage

**The instructions below are for Linux only.** It's probably possible on Windows as well, but I don't have a system to test it `¯\_(ツ)_/¯`.

The web app supports automatically loading a savegame via a URL parameter.
This comes in handy if you want to host it locally by firing up a small webserver.

On Linux, you can symlink your savegame and auto-load it like so:

```bash
$ git clone https://github.com/elongatedtimingchain/sr-savegame-analyzer.git
$ cd sr-savegame-analyzer/docs/
$ ln -s \
    ~/.local/share/Steam/userdata/<your_steam_id>/1465360/remote/CompleteSave.cfg \
    ./savegame.json
$ python -m http.server 8080
```

Then just open up `http://localhost:8080/?savegame=savegame.json` in a webbrowser and refresh the page whenever the game was saved.