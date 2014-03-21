const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;

const CpuPower = new Lang.Class({

    Name: "CpuPower",
    Extends: PanelMenu.Button,

    _init: function(){

        let self = this;

        this.parent(0.0, "cpupower");

        this._build_ui();

        this._cpupower = GLib.find_program_in_path('cpupower');
        event = this._cpupower?GLib.timeout_add_seconds(0, 5, function () {
            self._update_freq();
            self._update_popup();
            return true;
        }):(function(){
            self._status.set_text("cpupower not found");
            return false;
        })();
    },

    _get_governors: function(){

        let governors=[];
        let governorslist=[];
        let governoractual='';

        let cpupower_output1 = GLib.spawn_command_line_sync(this._cpupower+" frequency-info -g");
        if(cpupower_output1[1]) governorslist = cpupower_output1[1].toString().split("\n", 2)[1].split(" ");

        let cpupower_output2 = GLib.spawn_command_line_sync(this._cpupower+" frequency-info -p");
        if(cpupower_output2[1]) governoractual = cpupower_output2[1].toString().split("\n", 2)[1].split(" ")[2].toString();

        for each (let governor in governorslist){
            governors.push( [governor,governoractual == governor] );
        }

        return governors;
    },

    _update_freq: function() {
        let freqInfo=null;

        let cpupower_output = GLib.spawn_command_line_sync(this._cpupower+" frequency-info -fm");
        if (!cpupower_output[1]) cpupower_output = GLib.spawn_command_line_sync(this._cpupower+" frequency-info -wm"); // try with sticky bit
        if (cpupower_output[1]) freqInfo = cpupower_output[1].toString().split("\n")[1];

        this._status.set_text((freqInfo)?freqInfo:"no sticky bit cpupower");
    },

    _update_popup: function() {

        this.menu.removeAll();

        this.governors = this._get_governors();

        if (this.governors.length>0){
            let governorItem;
            for each (let governor in this.governors){
                governorItem = new PopupMenu.PopupMenuItem("");
                let governorLabel=new St.Label({
                    text:governor[0],
                    style_class: "sm-label"
                });
                governorItem.actor.add_child(governorLabel);
                governorItem.setOrnament(governor[1]);
                this.menu.addMenuItem(governorItem);

                governorItem.connect('activate', function() {
                    global.log('CpuPowerMenu: Governor change not implemented');
//                    GLib.spawn_command_line_async(this.cpuPowerPath+" -g "+governorLabel.text);
                });

            }
        }
    },

    _build_ui: function() {

        this._status = new St.Label({
            text: "updating...",
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        let arrow = new St.Label({
            text: "\u25BE",
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        let box = new St.BoxLayout({
        });

        box.add_child(this._status);
        box.add_child(arrow);

        this.actor.add_actor(box);
    }

});

function init() {
}

let indicator;
let event=null;

function enable() {
    indicator = new CpuPower();
    Main.panel.addToStatusArea('cpupower', indicator);
}

function disable() {
    indicator.destroy();
    Mainloop.source_remove(event);
    indicator = null;
}