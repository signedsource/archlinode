#!/bin/bash

cd /home/build/dwm
sudo make clean install
cd /home/build/dwm/dwmblocks
sudo make clean install
mkdir -p ~/.local/share/dwm
ln -s /home/build/dwm/autostart.sh ~/.local/share/dwm
mkdir -p ~/.local/bin
cd ~/.local/bin
curl -sL "https://raw.githubusercontent.com/antoniosarosi/dotfiles/master/.local/bin/battery" -o battery
curl -sL "https://raw.githubusercontent.com/antoniosarosi/dotfiles/master/.local/bin/volume" -o volume
curl -sL "https://raw.githubusercontent.com/antoniosarosi/dotfiles/master/.local/bin/percentage" -o percentage
curl -sL "https://raw.githubusercontent.com/antoniosarosi/dotfiles/master/.local/bin/brightness" -o brightness
chmod 755 battery volume percentage brightness
sudo pacman -S pacman-contrib brightnessctl pamixer upower --noconfirm
cp /home/build/dwm/dwm.desktop /etc/lxdm/xsessions
cp /home/build/dwm/dwm.desktop /usr/share/xsessions