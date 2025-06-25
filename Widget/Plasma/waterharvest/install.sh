#!/bin/bash

rm -r ~/.local/share/plasma/plasmoids/waterharvest/
cp -r ../waterharvest/ ~/.local/share/plasma/plasmoids/
killall plasmashell; kstart5 plasmashell