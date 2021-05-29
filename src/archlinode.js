const prompt = require("prompts"),
	chalk = require("chalk"),
	{ exec } = require("child_process"),
	fs = require("graceful-fs");

(async function () {
	const questions = [
		{
			type: "select",
			name: "keymap",
			message: "Select your keymap",
			choices: [{ title: "English (US)" }, { title: "Spanish / Español (ES)" }],
		},
		{
			type: "number",
			name: "sda",
			message: "Select the number ID of your Linux partition",
		},
		{
			type: "number",
			name: "efi",
			message: "Select the number ID of your EFI partition"
		},
		{
			type: "select",
			name: "kernel",
			message: "Select a Kernel",
			choices: [
				{
					title: "Linux",
					description:
						"Vanilla Linux kernel and modules, with a few patches applied.",
					value: "linux"
				},
				{
					title: "Linux Hardened",
					description:
						"A security-focused Linux kernel applying a set of hardening patches to mitigate kernel and userspace exploits.",
					value: "linux-hardened"
				},
				{
					title: "Linux LTS",
					description: "Long-term support (LTS) Linux kernel and modules.",
					value: "linux-lts"
				},
				{
					title: "Linux Zen",
					description:
						"Result of a collaborative effort of kernel hackers to provide the best Linux kernel possible for everyday systems.",				
					value: "linux-zen"
				},
			],
		},
		{
			type: "select",
			name: "gpudriver",
			message: "Select the video driver needed for this instalation",
			choices: [
				{ title: "AMD" },
				{ title: "NVIDIA" },
				{ title: "Intel" },
				{ title: "VirtualBox / VMWare" }
			]
		},
		{
			type: 'multiselect',
			name: 'apps',
			message: 'Select the apps or packs of apps that you want',
			hint: "Doom doesn't install!",
			choices: [
				{ title: 'Code OSS', value: 'code' },
				{ title: 'Konsole', value: 'konsole' },
				{ title: 'Terminator', value: 'terminator' },
				{ title: 'HTop', value: 'htop' },
				{ title: 'Conky', value: 'conky'},
				{ title: 'Firefox', value: 'firefox' },
				{ title: 'ThunderBird', value: 'thunderbird' },
				{ title: 'VirtualBox', value: 'virtualbox-checking' },
				{ title: 'LMMS', value: 'lmms' },
				{ title: 'Flameshot', value: 'flameshot' },
				{ title: 'LibreOffice', value: 'libreoffice-fresh' },
				{ title: 'Discord', value: 'discord' },
				{ title: 'VLC', value: 'vlc' },
				{ title: 'Doom Emacs', value: 'doom-checking' },
				{ title: 'PyCritty', description: 'Credits to Antonio Sarosi', value: 'pycritty-checking' }
			]
		},
		{
			type: "multiselect",
			name: "desktop",
			hint: "Spectrwm isn't tested!",
			message: "Select your Desktop Manager / Window Manager",
			choices: [
				{ title: "QTile", value: "qtile" },
				{ title: "DWM", description: "Config credits to Antonio Sarosi", value: "dwm" },
				{ title: "KDE", value: "plasma" },
				{ title: "Xfce", value: "xfce" },
				{ title: "GNOME", value: "gnome" },
				{ title: "XMonad", value: "xmonad" },
				{ title: "Spectrwm", value: "spectrwm" }
			]
		},
		{
			type: "select",
			name: "lmanager",
			message: "Select you Login Manager",
			choices: [
				{ title: "LXDM" },
				{ title: "GDM" },
				{ title: "Ly" },
				{ title: "LightDM" }
			]
		},
		{
			type: "text",
			name: "username",
			message: "Select your username for the machine",
			validate: value => value.match(/^[a-zA-Z0-9_.-]*$/) ? true : "The username must be alphanumeric"
		},
		{
			type: "password",
			name: "upassword",
			message: "Set your main account password",
			validate: value => value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) ? true : `This password doesn't match the required standars for a secure password`
		},
		{
			type: "password",
			name: "rpassword",
			message: "Set the root account password",
			validate: value => value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) ? true : `This password doesn't match the required standars for a secure password`
		},
		{
			type: "text",
			name: "hostname",
			message: "Select the hostname for this machine",
			validate: value => value.match(/^[a-zA-Z0-9_.-]*$/) ? true : "The hostname must be alphanumeric"
		}
	]

	const onCancel = async () => {
		console.log(chalk.bgGreenBright("[~] Okay..., it seems we aren't installing today"))
		return process.exit(0);
	}

	const write = async _ => {
		await fs.appendFileSync("install", `${_}\n`);
	}

	const pacman = async _ => {
		await write(`arch-chroot /mnt pacman -S ${_} --noconfirm --needed`);
	}

	const pacstrap = async _ => {
		await write(`pacstrap /mnt ${_}`)
	}

	const pip = async _ => {
		await write(`arch-chroot /mnt pip install ${_}`);
	}

	const install = async (_) => {
		let packages = "";

		switch (_.keymap) {
			case 0:
				await write("loadkeys en");
				break;
			case 1:
				await write("loadkeys es");
				break;
			default:
				break;
		}

		await write("timedatectl set-ntp true");
		await write(`mkfs.ext4 /dev/sda${_.sda}`);
		await write(`mount /dev/sda${_.sda} /mnt`);
		await write(`mkdir /mnt/efi`);
		await write(`mount /dev/sda${_.efi} /mnt/efi`);
		await pacstrap(`base ${_.kernel} linux-firmware`);
		await write(`genfstab -U /mnt >> /mnt/etc/fstab`)
		await write(`echo ${_.hostname} >> /mnt/etc/hostname`);
		await write(`echo 127.0.0.1 localhost >> /mnt/etc/hosts`);
		await write(`echo ::1 localhost >> /mnt/etc/hosts`);
		await write(`arch-chroot /mnt mkdir /home/build`);
		await write(`arch-chroot /mnt sh -c 'chgrp nobody /home/build && chmod g+ws /home/build && setfacl -m u::rwx,g::rwx /home/build && setfacl -d --set u::rwx,g::rwx,o::- /home/build'`)
		await write(`arch-chroot /mnt hwclock --systohc`)
		await write(`arch-chroot /mnt locale-gen`);
		await write(`arch-chroot /mnt useradd --create-home ${_.username}`);
		await write(`arch-chroot /mnt usermod -aG wheel,video,audio,storage ${_.username}`);
		await write(`rm /mnt/etc/sudoers`);
		await write(`curl -L is.gd/archlnsd >> /mnt/etc/sudoers`);
		await write(`arch-chroot /mnt chmod -c 0440 /etc/sudoers`);
		await write(`arch-chroot /mnt chown -c root:root /etc/sudoers`);
		await write(`arch-chroot /mnt echo -e "${_.upassword}\n${_.upassword}" | passwd ${_.username}`)
		await write(`arch-chroot /mnt echo -e "${_.rpassword}\n${_.rpassword}" | passwd`);
		await write(`rm -rf /mnt/etc/pacman.conf`);
		await write(`curl -L is.gd/arlnpcf >> /mnt/etc/pacman.conf`);
		await write(`arch-chroot /mnt chmod -c 644 /etc/pacman.conf`);
		await write(`arch-chroot /mnt chown -c root:root /etc/pacman.conf`);
		await write(`arch-chroot /mnt pacman -Syu`);
		await pacman(`dhcpcd xterm networkmanager nano thunar python python-pip python3 base-devel grub os-prober efibootmgr gcc cmake make git curl libx11 libxft xorg xorg-server xorg-xinit terminus-font mesa`)
		
		switch (_.keymap) {
			case 0:
				await write("arch-chroot /mnt localectl set-x11-keymap en");
				break;
			case 1:
				await write("arch-chroot /mnt localectl set-x11-keymap es");
				break;
			default:
				break;
		}

		await write(`arch-chroot /mnt git clone https://aur.archlinux.org/yay-bin.git /home/build/yay`);
		await write(`arch-chroot /mnt sh -c 'cd /home/build/yay && sudo -u nobody makepkg -s && pacman -U *.tar.zst --noconfirm'`);
		
		if (_.apps.length >= 1) {
			await _.apps.forEach(async element => {
				if (element == "pycritty-checking") {
					await pip(`pycritty`);
				} else if (element == "doom-checking") {
					await write(`arch-chroot /mnt sh -c 'pacman -S emacs --noconfirm && git clone https://github.com/hlissner/doom-emacs /home/build/doom'`)
				} else if (element == "virtualbox-checking") {
					if (_.kernel == "linux") {
						await pacman(`virtualbox virtualbox-host-modules-arch virtualbox-guest-iso`)
					} else if (_.kernel != "linux") {
						await pacman(`virtualbox virtualbox-host-dkms virtualbox-guest-iso ${_.kernel}-headers`)
					}
				} else {
					packages += ` ${element}`
				}
			});
			
			await pacman(`${packages}`);
		}

		switch (_.gpudriver) {
			case 0:
				await pacman(`xf86-video-ati mesa-vdpau lib32-mesa vulkan-radeon lib32-vulkan-radeon vulkan-icd-loader lib32-vulkan-icd-loader`)
				break;
			case 1:
				await pacman(`nvidia-dkms nvidia-utils lib32-nvidia-utils nvidia-settings vulkan-icd-loader lib32-vulkan-icd-loader`);
				break;
			case 2:
				await pacman(`xf86-video-intel vulkan-intel lib32-mesa lib32-vulkan-intel vulkan-icd-loader lib32-vulkan-icd-loader`);
				break;
			case 3:
				await pacman(`virtualbox-guest-utils xf86-video-vmware ${_.kernel}-headers`)
			default:
				break;
		}

		if (_.desktop.length >= 1) {
			await _.desktop.forEach(async element => {
				switch (element) {
					case "qtile":
						await pacman(`qtile pacman-contrib`);
						await pip(`psutil`);
						break;
					case "dwm":
						await pacman(`dmenu`);
						await write(`arch-chroot /mnt mkdir /home/build/config`);
						await write(`arch-chroot /mnt git clone https://aur.archlinux.org/dwm-git.git /home/build/dwm-git`);
						await write(`arch-chroot /mnt git clone https://github.com/antoniosarosi/dwm.git /home/build/dwm`);
						await write(`arch-chroot /mnt git clone https://aur.archlinux.org/st.git /home/build/st`);
						await write(`curl -L https://raw.githubusercontent.com/skimbledevs/archlinode/main/scripts/dwm.sh >> /mnt/home/build/config/dwm.sh`)
						await write(`arch-chroot /mnt sh -c 'cd /home/build/st && sudo -u nobody makepkg -s && pacman -U *.tar.zst --noconfirm'`)
						await write(`arch-chroot /mnt sh -c 'cd /home/build/dwm-git && sudo -u nobody makepkg -s && pacman -U *.tar.zst --noconfirm'`);
						await write(`arch-chroot /mnt sh -c 'cd /home/build/config && sh dwm.sh'`)
						break;
					case "plasma":
						await pacman(`plasma kde-applications`)
						break;
					case "xfce":
						await pacman(`xfce4 xfce4-goodies xfce4-notifyd volumeicon`);
						break;
					case "gnome":
						await pacman(`gnome`);
						break;
					case "xmonad":
						await pacman(`xmonad xmonad-contrib xmobar trayer xdotool pacman-contrib brightnessctl pamixer upower`);
						break;
					case "spectrwm":
						await pacman(`spectrwm trayer upower pamixer brightnessctl pacman-contrib`);
						break;
					default:
						break;
				}
			});
		}

		await write(`arch-chroot /mnt sh -c 'git clone https://aur.archlinux.org/nerd-fonts-ubuntu-mono.git /home/build/nerdfonts && cd /home/build/nerdfonts && makepkg -s && pacman -U *.tar.zst'`)

		switch (_.lmanager) {
			case 0:
				await pacman(`lxdm`);
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 1:
				await pacman(`gdm`);
				await write(`arch-chroot /mnt systemctl enable gdm.service`);
				break;
			case 2:
				await write(`arch-chroot /mnt git clone https://aur.archlinux.org/ly.git /home/build/ly`);
				await write(`arch-chroot /mnt sh -c 'cd /home/build/ly && sudo -u nobody makepkg -s && pacman -U *.tar.zst'`)
				await write(`arch-chroot /mnt systemctl enable ly.service`)
				break;
			case 3:
				await pacman(`lightdm lightdm-gtk-greeter`);
				await write(`arch-chroot /mnt systemctl enable lightdm.service`);
				break;
			default:
				break;
		}
		
		await write(`curl -L is.gd/arlndpi >> postinstall`);
		await write(`curl -L is.gd/arlnrb >> reboot`);
		await write(`chmod +x reboot`);
		await pacman(`rofi thunar firefox alacritty redshift scrot which feh ttf-dejavu ttf-liberation noto-fonts pulseaudio pavucontrol pamixer brightnessctl arandr udiskie ntfs-3g volumeicon cbatticon libnotify notification-daemon`)
		await write(`arch-chroot /mnt fc-cache -f -v`)
		await write(`arch-chroot /mnt echo "[D-BUS Service]\nName=org.freedesktop.Notifications\nExec=/usr/lib/notification-daemon-1.0/notification-daemon" >> /usr/share/dbus-1/services/org.freedesktop.Notifications.service`)
		await write(`arch-chroot /mnt grub-install --target=x86_64-efi --efi-directory=/efi/ --bootloader-id=ArchLiNode`);
		await write(`arch-chroot /mnt os-prober`);
		await write(`arch-chroot /mnt grub-mkconfig -o /boot/grub/grub.cfg`);
		await write(`arch-chroot /mnt systemctl enable NetworkManager`);
		await write(`clear && chmod +x postinstall && chmod +x reboot && ./postinstall`);
		await write(`rm postinstall && rm archlinode`);
	}

	let _ = await prompt([{ type: "confirm", name: "net", message: "Are you connected to the internet using a ethernet / LAN cable?"}], { onCancel });

	switch (_.net) {
		case true:
			_ = await prompt(questions, { onCancel });
			install(_).then(() => {
				exec('chmod +x install', (error, stdout, stderr) => {
					if (error) throw new Error(error);
					if (stderr) throw new Error(stderr);
				});
			});
			break;
		case false:
			console.log(
				chalk.bgRedBright(
					"[!] Remember this! You won't have internet connection when you reboot"
				),
				chalk.bgRedBright(
					"\n[!] So, i recommend you to check github.com/antoniosarosi/dotfiles#arch-installation for getting internet connection"
				)
			);
			setTimeout(async () => {
				_ = await prompt(questions, { onCancel });
				install(_).then(() => {
					exec('chmod +x install', (error, stdout, stderr) => {
						if (error) throw new Error(error);
						if (stderr) throw new Error(stderr);
					});
				});
			}, 30000)
			break;
		default:
			break;
	}
})();
