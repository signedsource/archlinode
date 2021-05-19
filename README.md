# ArchLiNode
The Node.JS installer for Arch Linux

# Description
Maybe you are wondering the reason of making this, as there is already a installer for Arch Linux built into the archiso, well, one day I was so bored, so I decided to try to make an installer, and I came up with the idea of making a Arch Linux installer.

# Instalation
To use this installer type this command into the command line `curl -L is.gd/archsh >> archlinode ; sh archlinode`.
This will download the file, make it executable, clear the screen, and run the installer program.
When it has finished picking your options and creating the install script, you can run it using the `./install` command.

__IMPORTANT:__ <p>When you are installing, after Grub is installed, you will be asked to write your ethernet interface, then a file will be opened with nano, and in the option Interface you will need to put your ethernet interface</p>

# How does this work
This is based on this logic
1. The user selects what he wants
2. The install script gets created
3. The system is beeing installed with the user selected options / customizations / parameters

# Contributing
For contributing, follow this steps
1. Fork the proyect
2. Make changes
3. Build the packages (make build)
4. Make a new PR
5. Wait for it to be reviewed and accepted.

# Post-install
> I have installed Arch Linux with this install script, what can I do now to get my system fully customized?

<p>Well, in dependance of what did you select (WM / DM), you should check how to configure your WM or DM</p>
<p>but hey, im here to help you, so im giving you they keymap for QTile an DWM (so you dont stress out searching it)</p>

| QTILE   | DWM     |
|---------|---------|
| Win + R | Alt + P |

# Testing
> WM / DM

| QTILE      | DWM        | XFCE4      | KDE                                           | GNOME      | Completed |
|------------|------------|------------|-----------------------------------------------|------------|-----------|
| Works Fine | Works Fine | Works Fine | Tested (takes some time to load at first boot) | Works Fine | True      |

> Kernels

| Linux      | Linux Hardened | Linux LTS  | Linux Zen  | Completed |
|------------|----------------|------------|------------|-----------|
| Works Fine | Works Fine     | Works Fine | Works Fine | True      |

> Video Drivers

| AMD        | NVIDIA     | Intel      | VMWare / VirtualBox | Completed |
|------------|------------|------------|---------------------|-----------|
| Works Fine | Can't test | Can't test | Works Fine          | False     |

# External Links
[pycritty](https://github.com/antoniosarosi/pycritty)
[dwm](https://github.com/antoniosarosi/dwm)
[graceful-fs](https://github.com/isaacs/node-graceful-fs)
[pkg](https://github.com/vercel/pkg)
