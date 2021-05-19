#!/bin/bash
sudo pacman -S which feh ttf-dejavu ttf-liberation noto-fonts pulseaudio pavucontrol pamixer brightnessctl arandr udiskie ntfs-3g volumeicon cbatticon libnotify notification-daemon
fc-cache -f -v
echo "
[D-BUS Service]
Name=org.freedesktop.Notifications
Exec=/usr/lib/notification-daemon-1.0/notification-daemon
" >> /usr/share/dbus-1/services/org.freedesktop.Notifications.service

