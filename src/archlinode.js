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
				},
				{
					title: "Linux Hardened",
					description:
						"A security-focused Linux kernel applying a set of hardening patches to mitigate kernel and userspace exploits.",
				},
				{
					title: "Linux LTS",
					description: "Long-term support (LTS) Linux kernel and modules.",
				},
				{
					title: "Linux Zen",
					description:
						"Result of a collaborative effort of kernel hackers to provide the best Linux kernel possible for everyday systems.",
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
			hint: true,
			choices: [
				{ title: 'Code OSS', value: 'code' },
				{ title: 'Alacritty', value: 'alacritty' },
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
				{ title: 'PyCritty (Credits: Antonio Sarosi)', value: 'pycritty-checking' }
			]
		},
		{
			type: "select",
			name: "desktop",
			message: "Select your Desktop Manager / Window Manager",
			choices: [
				{ title: "QTile" },
				{ title: "DWM (Config credits: Antonio Sarosi)" },
				{ title: "KDE" },
				{ title: "Xfce" },
				{ title: "GNOME" },
				{ title: "XMonad" },
				{ title: "Spectrwm" }
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

	const install = async (_) => {
		let packages = "arch-chroot /mnt pacman -S";

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

		switch (_.kernel) {
			case 0:
				_.kernel = "linux"
				break;
			case 1:
				_.kernel = "linux-hardened"
				break;
			case 2:
				_.kernel = "linux-lts"
				break;
			case 3:
				_.kernel = "linux-zen"
				break;
			default:
				break;
		}

		await write("timedatectl set-ntp true");
		await write(`mkfs.ext4 /dev/sda${_.sda}`);
		await write(`mount /dev/sda${_.sda} /mnt`);
		await write(`mkdir /mnt/efi`);
		await write(`mount /dev/sda${_.efi} /mnt/efi`);
		await write(`pacstrap /mnt base ${_.kernel} linux-firmware`)
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
		await write(`arch-chroot /mnt echo -e "${_.rpassword}\n${_.rpassword}" | passwd`)
		await write(`arch-chroot /mnt pacman -S dhcpcd xterm networkmanager nano thunar python python-pip python3 base-devel grub os-prober efibootmgr gcc cmake make git curl libx11 libxft xorg xorg-server xorg-xinit terminus-font mesa --noconfirm`);
		
		switch (_.keymap) {
			case 0:
				await write("arch-chroot /mnt pacman -S localectl set-x11-keymap en");
				break;
			case 1:
				await write("arch-chroot /mnt localectl set-x11-keymap en");
				break;
			default:
				break;
		}

		await write(`arch-chroot /mnt git clone https://aur.archlinux.org/yay-bin.git /home/build/yay`);
		await write(`arch-chroot /mnt sh -c 'cd /home/build/yay && sudo -u nobody makepkg -s && pacman -U *.tar.zst --noconfirm'`);
		
		if (_.apps.size > 0) {
			await _.apps.forEach(async element => {
				if (element == "pycritty-checking") {
					await write(`arch-chroot /mnt pip install pycritty`);
				} else if (element == "doom-checking") {
					await write(`arch-chroot /mnt sh -c 'pacman -S emacs --noconfirm && git clone https://github.com/hlissner/doom-emacs /home/build/doom`)
				} else if (element == "virtualbox-checking") {
					if (_.kernel == "linux") {
						await write(`arch-chroot /mnt pacman -S virtualbox virtualbox-host-modules-arch virtualbox-guest-iso --noconfirm`)
					} else if (_.kernel != "linux") {
						await write(`arch-chroot /mnt pacman -S virtualbox virtualbox-host-dkms virtualbox-guest-iso ${_.kernel}-headers --noconfirm`)
					}
					await write(`arch-chroot /mnt pacman -S virtualbox`)
				} else {
					packages += ` ${element}`
				}
			});

			packages += " --noconfirm";
			await write(`${packages}`);
		}

		switch (_.gpudriver) {
			case 0:
				const __ = await prompt([{ type: "confirm", title: "issupported", message: "Is your AMD Card supported by AMDGPU (with this I mean, that it isnt legacy)" }]);
				if (__.issuported) {
					await write(`arch-chroot /mnt pacman -S vulkan-radeon xf86-video-amdgpu lib32-vulkan-radeon --noconfirm`);
				} else if (!__.issuported) {
					await write(`arch-chroot /mnt pacman -S xf86-video-ati mesa-vdpau lib32-mesa-vdpau --noconfirm`);
				}
				break;
			case 1:
				await write(`arch-chroot /mnt pacman -S nvidia lib32-nvidia-utils --noconfirm`)
				break;
			case 2:
				await write(`arch-chroot /mnt pacman -S lib32-mesa xf86-video-intel vulkan-intel lib32-mesa --noconfirm`)
				break;
			case 3:
				await write(`arch-chroot /mnt pacman -S virtualbox-guest-utils xf86-video-vmware ${_.kernel}-headers --noconfirm`)
			default:
				break;
		}

		switch (_.desktop) {
			case 0:
				await write(`arch-chroot /mnt pacman -S lxdm qtile pacman-contrib --noconfirm`);
				await write(`arch-chroot /mnt yay -S nerd-fonts-ubuntu-mono`);
				await write(`arch-chroot /mnt pip install psutil`);
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 1:
				await write(`arch-chroot /mnt pacman -S lxdm dmenu --noconfirm`);
				await write(`arch-chroot /mnt mkdir /home/build/config`);
				await write(`arch-chroot /mnt git clone https://github.com/antoniosarosi/dwm.git /home/build/dwm`);
				await write(`arch-chroot /mnt git clone https://aur.archlinux.org/st.git /home/build/st`);
				await write(`curl -L https://raw.githubusercontent.com/skimbledevs/archlinode/main/scripts/compile.sh >> /home/build/config/compile.sh`)
				await write(`curl -L https://raw.githubusercontent.com/skimbledevs/archlinode/main/scripts/config.sh >> /home/build/config/config.sh`)
				await write(`arch-chroot /mnt sh -c 'cd /home/build/st && sudo -u nobody makepkg -s && pacman -U *.tar.zst --noconfirm'`)
				await write(`arch-chroot /mnt sh -c 'cd /home/build/config && sh compile.sh && sh config.sh'`)
				await write(`arch-chroot /mnt cp /home/build/dwm/dwm.desktop /usr/share/xsessions`)
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 2:
				await write(`arch-chroot /mnt pacman -S lxdm plasma kde-applications --noconfirm`);
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 3:
				await write(`arch-chroot /mnt pacman -S lxdm xfce4 xfce4-goodies xfce4-notifyd volumeicon --noconfirm`)
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 4:
				await write(`arch-chroot /mnt pacman -S gnome gdm --noconfirm`);
				await write(`arch-chroot /mnt systemctl enable gdm.service`);
				break;
			case 5:
				await write(`arch-chroot /mnt pacman -S lxdm xmonad xmonad-contrib xmobar trayer xdotool pacman-contrib brightnessctl pamixer upower --noconfirm`);
				await write(`arch-chroot /mnt yay -S nerd-fonts-ubuntu-mono`)
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			case 6:
				await write(`arch-chroot /mnt pacman -S lxdm spectrwm trayer upower pamixer brightnessctl pacman-contrib --noconfirm`);
				await write(`arch-chroot /mnt yay -S nerd-fonts-ubuntu-mono`)
				await write(`arch-chroot /mnt systemctl enable lxdm.service`);
				break;
			default:
				break;
		}
		
		await write(`curl -L is.gd/arlndpi >> postinstall`);
		await write(`curl -L is.gd/arlnrb >> reboot`);
		await write(`chmod +x reboot`);
		await write(`arch-chroot /mnt pacman -S rofi thunar firefox alacritty redshift scrot which feh ttf-dejavu ttf-liberation noto-fonts pulseaudio pavucontrol pamixer brightnessctl arandr udiskie ntfs-3g volumeicon cbatticon libnotify notification-daemon --noconfirm`);
		await write(`arch-chrot /mnt fc-cache -f -v`)
		await write(`arch-chroot /mnt echo "[D-BUS Service]\nName=org.freedesktop.Notifications\nExec=/usr/lib/notification-daemon-1.0/notification-daemon" >> /usr/share/dbus-1/services/org.freedesktop.Notifications.service`)
		await write(`arch-chroot /mnt grub-install --target=x86_64-efi --efi-directory=/efi/ --bootloader-id=ArchLiNode`);
		await write(`arch-chroot /mnt os-prober`);
		await write(`arch-chroot /mnt grub-mkconfig -o /boot/grub/grub.cfg`);
		await write(`arch-chroot /mnt systemctl enable networkmanager`);
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
