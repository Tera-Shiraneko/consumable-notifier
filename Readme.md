### Tera toolbox module which is notifying you if your consumables are about to expire.

---

### Console Command
| Command | Description | Status |
| :---: | :---: | :---: |
| `/8 consume private` | To receive a private notification if your consumables are about to expire. | Enabled by default. |
| `/8 consume dungeon` | To receive a dungeon notification if your consumables are about to expire. | Enabled by default. |
| `/8 consume add + id` | To add the desired abnormality id's to the consumable list. |  |
| `/8 consume remove + id` | To remove the desired abnormality id's from the consumable list. |  |
| `/8 consume clear` | To remove all added abnormality id's from the consumable list. |  |
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
- In case of multiple abnormality id's in the config file or settings interface you need to seperate them with a comma.
- The commands should be written without the plus just an space between it.