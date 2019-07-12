# Restore Editors on Checkout

When you switch your git branch, this VSCode extension restores the editors you had open when you were last working on that branch.

![preview](https://github.com/mymikemiller/vscode-restore-editors-on-checkout/blob/master/demo.gif)

> NOTE: This extension uses [Eric Amodio](https://github.com/eamodio)'s hack (see [Restore Editors](https://github.com/eamodio/vscode-restore-editors)) to access the list of open editors, thus it is subject to the same limitations (namely, it only works for file-based text documents).

## Features

- When this extension detects a git branch change, it automatically closes all editors and opens the editors that were opened the last time the user switched away from that branch while running this extension.

## Known Issues

- Subject to the same limitations [Restore Editors](https://github.com/eamodio/vscode-restore-editors) is subject to.
- Currently employs polling to determine when the checked-out branch changes. This is obviously not ideal. Anyone know of a better way to do this?
