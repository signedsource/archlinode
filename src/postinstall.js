const chalk = require('chalk')
console.log(
    chalk.bgGreenBright("[~] Instalation complete!"),
    chalk.bgGreenBright("\n[~] Dont forget to check the post-instalation guide on the README of the Proyect!"),
    chalk.bgRedBright("\n[!] If you reboot now, all the mounted partitions will unmount"),
    chalk.bgRedBright("\n[!] In case you have already finished with the instalation, proceed to reboot the system"),
    "\n",
    chalk.bgGreenBright("[~] Don't forget to set a password for the root account and your normal account!"),
    "\n",
    chalk.bgBlueBright("\n[~] For rebooting the system in the proper way, type ./reboot")
);