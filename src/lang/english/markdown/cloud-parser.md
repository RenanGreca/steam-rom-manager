# Cloud Parser

Create shortcuts to Xbox Cloud Gaming using a JSON file as input.

Inside the JSON file, you should add display names, codes and IDs.
The codes and IDs **must** match the game's URL from the Microsoft Store or on Xbox Cloud Gaming.
The display name can be customized to your liking.

Take two Cloud Gaming URLs as examples:
```
Halo Infinite: https://www.xbox.com/en-GB/play/games/halo-infinite-campaign/9NP1P1WFS0LB
Forza Horizon 5: https://www.xbox.com/en-GB/play/games/forza-horizon-5-standard-edition/9NKX70BBCDRN
```

Thus, a JSON file should be in this format:

```
{
    games: [
        {
            DisplayName: "Halo Infinite",
            AppCode: "halo-infinite-campaign",
            ID: "9NP1P1WFS0LB"
        },
        {
            DisplayName: "Forza Horizon 5",
            AppCode: "forza-horizon-5-standard-edition",
            ID: "9NKX70BBCDRN"
        }
    ]
}
```