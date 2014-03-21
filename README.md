gnome-shell-extension-cpupower
==============================

View the actual frequency and governor from gnome shell.

Require:
--------

- Gnome Shell > 3.10
- cpupower
- cpupower compatible processor

How to:
-------

- $ git clone https://bitbucket.org/mainnika/gnome-shell-extension-cpupower.git
- $ cd gnome-shell-extension-cpupower
- $ mkdir ~/.local/share/gnome-shell/extensions/cpupower@extensions.mainnika.ru -p
- $ cp extension.js metadata.json stylesheet.css ~/.local/share/gnome-shell/extensions/cpupower@extensions.mainnika.ru
- Alt+F2, type 'r' (without quotes), Enter

no sticky bit cpupower:
-----------------------

- $ sudo chmod 4755 `which cpupower`





