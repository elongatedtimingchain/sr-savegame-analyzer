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

All game info was scraped from savegames by myself.
Regarding objectives, savegames only contain their back-end representation.
The pretty names that you're used to as shown in-game have to be put in by myself in a labor-intensive manual process. Therefore, they are not available
for most objectives in the game yet.

Additionally, contracts may be misclassified as Tasks and will therefore be found under a certain map (contracts **are** assigned a map in the back-end,
but this is not reflected in-game), as there is no definitive way to tell
apart contracts from tasks / contests from the savegames alone, and additionally it's not straightforward to determine a contract's employer.

Below is a table showing the progress for each region:

| | Objective Keys | Objective Names | Contracts | Trucks, Upgrades, Watchpoints |
|-|-|-|-|-|
|Michigan|Complete|Partial|Partial|Complete|
|Alaska|Complete|Partial|Partial|Complete|
|Taymyr|Complete|Partial|Partial|Complete|
|Kola|Complete|Partial|Missing|Complete|
|Yukon|Complete|Missing|Missing|Complete|
|Wisconsin|Complete|Missing|Missing|Complete|
|Amur|Complete|Missing|Missing|Complete|
|Don|Complete|Missing|Missing|Complete|
|Maine|Complete|Missing|Missing|Complete|
|Tennessee|Missing|Missing|Missing|Complete|
|Glades|Missing|Missing|Missing|Complete|
|Ontario|Missing|Missing|Missing|Complete|
|Br. Columbia|Missing|Missing|Missing|Complete|
|Scandinavia|Partial|Missing|Missing|Partial|

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