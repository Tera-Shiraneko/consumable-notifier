const fs = require("fs");

const Default_Settings = {
  "private_message": true,
  "dungeon_message": true,
  "consumable_list": [
      920,
      921,
      922,
      1251,
      1301,
      4830,
      4833,
      4953,
      4955,
      70205,
      70206,
      70214,
      70215,
      70216,
      70226,
      70227,
      70228,
      70231,
      70232,
      70233,
      70234,
      70242,
      70243,
      70244,
      70245,
      70261,
      70262,
      70263,
      70264,
      5020013
  ]
};

module.exports = function Migrate_Settings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        return Object.assign(Object.assign({}, Default_Settings), settings);
    }
    else if (from_ver === null) {
        return Default_Settings;
    }
    else if (from_ver + 0.1 < to_ver) {
        settings = Migrate_Settings(from_ver, from_ver + 0.1, settings);
        return Migrate_Settings(from_ver + 0.1, to_ver, settings);
    }
    switch (to_ver) {
        case 1.5:
            fs.unlinkSync(__dirname + "/config.json");
            break;
    }
    return Default_Settings;
};