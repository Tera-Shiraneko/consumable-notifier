### Tera toolbox module which notifies you if your consumables are about to expire.

---

### Console Command
| Command | Description | Status |
| :---: | :---: | :---: |
| `/8 consume private` | To notify you via private message if your consumables are about to expire. | Enabled by default. |
| `/8 consume dungeon` | To notify you via dungeon message if your consumables are about to expire. | Enabled by default. |
| `/8 consume add + abnormality id` | To add the desired abnormalities to the consumable list. |  |
| `/8 consume remove + abnormality id` | To remove the desired abnormalities from the consumable list. |  |
| `/8 consume clear` | To remove all added abnormalities from the consumable list. |  |
| `/8 consume show` | To show all added abnormalities with their names and id's in your toolbox chat. |  |
| `/8 consume debug` | To show all applied abnormalities with their names and id's in your toolbox chat. |  |

---

### Interface Command
| Command | Description |
| :---: | :---: |
| `/8 consume config` | To enable or disable the functions written above and edit your consumable list. |

---

### Configuration
- If you want to edit the config file you need to start tera toolbox and go to the server selection.
    - It will be generated afterwards in the modules folder.

---

- An list of things that can be edited can be found here. Only for experienced users.

| Name | Description |
| :---: | :---: |
| `consumable_list` | Here you can add or remove abnormality id's to the consumable list. |

---

### Abnormality Information
- Debug command listed above.
- [Tera Damage Meter Data => Abnormalities](https://github.com/neowutran/TeraDpsMeterData/tree/master/hotdot)

---

### Note
- An list of the abnormalities which are currently added in the config file can be found here [Consumable Overview](https://github.com/Tera-Shiraneko/consumable-notifier/tree/master/Additional-Data).
- The commands should be written without the plus just an space between it.