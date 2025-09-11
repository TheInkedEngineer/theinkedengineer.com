---
title: 'Organize your dock using spacers'
date: '2021-06-05'
description: 'A cool trick to organize your macOS dock.'
---

# Organize your dock using spacers

A simple way to organize the dock in groups of apps is using a whitespace as shown in the example below.

![article banner](/images/articles/organize-your-dock-using-spacers/example.png "banner")

Open your `Terminal` app then paste and run the following command:

```bash
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
```

This will create a spacer at the end of your dock. This space can be dragged around like any other app icon in the dock.

Run the command once for every new desired spacer.
