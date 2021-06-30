String.prototype.clr = function(hex_color) { return `<font color='#${hex_color}'>${this}</font>`; };

const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function Consumable_Notifier(mod) {

    let command = mod.command;
    let config = mod.settings;
    let data = mod.game.data;
    let player = mod.game.me;

    mod.game.initialize('me.abnormalities');

    let current_consumables = [];

    let search_timer = null;
    let status_timer = null;

    command.add('consume', (arg_1, arg_2) => {
        if (arg_1 === 'private') {
            config.private_message = !config.private_message;
            command.message(`${config.private_message ? '[Settings] Whisper type notification is now enabled.'.clr('00ff04') : '[Settings] Whisper type notification is now disabled.'.clr('ff1d00')}`);
            search_status();
            message_status();
        }
        else if (arg_1 === 'dungeon') {
            config.dungeon_message = !config.dungeon_message;
            command.message(`${config.dungeon_message ? '[Settings] Dungeon type notification is now enabled.'.clr('00ff04') : '[Settings] Dungeon type notification is now disabled.'.clr('ff1d00')}`);
            search_status();
            message_status();
        }
        else if (arg_1 === 'add' && arg_2 > 0) {
            const abnormality_info = data.abnormalities.get(Number.parseInt(arg_2));
            const abnormality_index = config.consumable_list.indexOf(abnormality_info.id);
            if (abnormality_info && abnormality_index === -1) {
                config.consumable_list.push(abnormality_info.id);
                command.message(`[Settings] Abnormality ${abnormality_info.name} with the id ${abnormality_info.id} has been added to the consumable list.`.clr('009dff'));
                search_status();
            }
            else if (!abnormality_info) {
                command.message('[Warning] The module can not find any abnormality data which is needed for adding the id to the consumable list.'.clr('ff00ff'));
            }
            else if (abnormality_index != -1) {
                command.message(`[Warning] Abnormality ${abnormality_info.name} with the id ${abnormality_info.id} is already added to the consumable list.`.clr('ff00ff'));
            }
        }
        else if (arg_1 === 'remove' && arg_2 > 0) {
            const abnormality_info = data.abnormalities.get(Number.parseInt(arg_2));
            const abnormality_index = config.consumable_list.indexOf(abnormality_info.id);
            if (abnormality_info && abnormality_index != -1) {
                config.consumable_list.splice(abnormality_index, 1);
                command.message(`[Settings] Abnormality ${abnormality_info.name} with the id ${abnormality_info.id} has been removed from the consumable list.`.clr('009dff'));
                search_status();
            }
            else if (!abnormality_info) {
                command.message('[Warning] The module can not find any abnormality data which is needed for removing the id from the consumable list.'.clr('ff00ff'));
            }
            else if (abnormality_index === -1) {
                command.message(`[Warning] Abnormality ${abnormality_info.name} with the id ${abnormality_info.id} can not be found in the consumable list.`.clr('ff00ff'));
            }
        }
        else if (arg_1 === 'clear') {
            if (config.consumable_list.length) {
                config.consumable_list = [];
                command.message('[Settings] The consumable list is now cleared and can be reconfigured again to your liking.'.clr('009dff'));
                search_status();
            } else {
                command.message('[Warning] Add an abnormality to the consumable list before trying to clear an empty consumable list.'.clr('ff00ff'));
            }
        }
        else if (arg_1 === 'show') {
            if (config.consumable_list.length) {
                config.consumable_list.forEach(consumable => {
                    const abnormality_info = data.abnormalities.get(consumable);
                    if (abnormality_info) {
                        command.message(`[Info] Found ${abnormality_info.name} with the id ${abnormality_info.id} in the consumable list.`.clr('ffff00'));
                    } else {
                        command.message('[Warning] The module can not find any abnormality data which is needed for showing the name and id of the abnormality.'.clr('ff00ff'));
                    }
                });
            } else {
                command.message('[Warning] Add an abnormality to the consumable list before trying to show an empty consumable list.'.clr('ff00ff'));
            }
        }
        else if (arg_1 === 'debug') {
            Object.values(player.abnormalities).forEach(abnormality => {
                const abnormality_info = data.abnormalities.get(abnormality.id);
                command.message(`[Info] Found ${abnormality_info.name} with the id ${abnormality_info.id} applied on yourself.`.clr('ffff00'));
            });
        }
        else if (arg_1 === 'config') {
            if (ui) {
                ui.show();
            }
        }
    });

    mod.game.on('enter_game', () => {
        check_config_file();
        current_consumables = [];
        start_searching();
    });

    mod.game.me.on('die', () => {
        inactive_abnormalities();
    });

    mod.game.on('leave_game', () => {
        stop_searching();
    });

    function start_searching() {
        if ((config.private_message || config.dungeon_message) && config.consumable_list.length) {
            search_timer = mod.setInterval(active_abnormalities, 1000);
        }
    }

    function stop_searching() {
        if (search_timer) {
            mod.clearInterval(search_timer);
            search_timer = null;
        }
    }

    function search_status() {
        if ((config.private_message || config.dungeon_message) && config.consumable_list.length) {
            stop_searching();
            start_searching();
        } else {
            stop_searching();
        }
    }

    function message_status() {
        if (!config.private_message && !config.dungeon_message) {
            mod.clearAllTimeouts(status_timer);
            current_consumables = [];
        }
    }

    function active_abnormalities() {
        Object.values(player.abnormalities).forEach(abnormality => {
            compare_abnormalities(abnormality);
        });
    }

    function inactive_abnormalities() {
        current_consumables.forEach(consumable => {
            const still_active = player.abnormalities[consumable];
            if (!still_active) {
                send_message(`[Info] Consumable ${data.abnormalities.get(consumable).name} has expired.`.clr('ffff00'), consumable);
                const consumable_index = current_consumables.indexOf(consumable);
                current_consumables.splice(consumable_index, 1);
                search_status();
            }
        });
    }

    function compare_abnormalities(info) {
        const matching = config.consumable_list.some(consumable => consumable === info.id);
        if (matching && !current_consumables.includes(info.id)) {
            current_consumables.push(info.id);
            status_timer = mod.setTimeout(abnormality_status, Number(info.remaining - 500n), info);
        }
    }

    function abnormality_status(info) {
        const matching_id = current_consumables.find(consumable => consumable === info.id);
        if (!matching_id) return;
        Object.values(player.abnormalities).forEach(abnormality => {
            if (abnormality.id === matching_id && abnormality.remaining === info.remaining) {
                send_message(`[Info] Consumable ${info.data.name} has expired.`.clr('ffff00'), info.id);
                const consumable_index = current_consumables.indexOf(info.id);
                current_consumables.splice(consumable_index, 1);
                search_status();
            }
            else if (abnormality.id === matching_id && abnormality.remaining != info.remaining) {
                status_timer = mod.setTimeout(abnormality_status, Number(abnormality.remaining - 500n), abnormality);
            }
        });
    }

    function send_message(message, info_id) {
        if (config.consumable_list.includes(info_id)) {
            if (config.private_message) {
                command.message(message);
            }
            if (config.dungeon_message) {
                mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
                    type: 80,
                    chat: false,
                    channel: 27,
                    message: message
                });
            }
        } else {
            const consumable_index = current_consumables.indexOf(info_id);
            current_consumables.splice(consumable_index, 1);
        }
    }

    function check_config_file() {
        if (!Array.isArray(config.consumable_list)) {
            config.consumable_list = [];
            mod.error('Invalid consumable list settings detected default settings will be applied.');
        }
    }

    let ui = null;

    if (global.TeraProxy.GUIMode) {
        ui = new SettingsUI(mod, require('./settings_structure'), config, {
            alwaysOnTop: true,
            width: 1000,
            height: 165
        });
        ui.on('update', settings => {
            if (typeof config.consumable_list === 'string') {
                config.consumable_list = config.consumable_list.split(/\s*(?:,|$)\s*/).map(Number);
            }
            config = settings;
            search_status();
            message_status();
        });
        this.destructor = () => {
            if (ui) {
                ui.close();
                ui = null;
            }
        };
    }
};