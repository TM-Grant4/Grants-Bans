/**
░██████╗░██████╗░░█████╗░███╗░░██╗████████╗░██████╗  ██████╗░░█████╗░███╗░░██╗░██████╗
██╔════╝░██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔════╝  ██╔══██╗██╔══██╗████╗░██║██╔════╝
██║░░██╗░██████╔╝███████║██╔██╗██║░░░██║░░░╚█████╗░  ██████╦╝███████║██╔██╗██║╚█████╗░
██║░░╚██╗██╔══██╗██╔══██║██║╚████║░░░██║░░░░╚═══██╗  ██╔══██╗██╔══██║██║╚████║░╚═══██╗
╚██████╔╝██║░░██║██║░░██║██║░╚███║░░░██║░░░██████╔╝  ██████╦╝██║░░██║██║░╚███║██████╔╝
░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝░░░╚═╝░░░╚═════╝░  ╚═════╝░╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░


    If anyone edits or uses this code on their own projects please contact: 
    "tm.grant" on discord or you will be publicly posted as a code stealer 
    and a genuine weird person I spent alot of time on this so I hope you 
    can respect that decision, Thank you and use this code for a pack as
    long as you dont edit my code(unless your making a function exported 
    in which case it's allowed so you can make this script and your script
    combined)
    
 */

import { system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((data) => {
    const item = data.itemStack;
    const player = data.source;
    if (item.typeId === 'minecraft:blaze_rod') {
        if (player.hasTag("AdminPrivileges")) {
            banMenuSelect(player)
        }
    }
})

function parseTime(text) {
    const units = {
        'y': 31536000000,
        'mo': 2592000000, // 30 days
        'w': 604800000, // 7 days
        'd': 86400000,
        'h': 3600000,
        'm': 60000,
        's': 1000
    };
    let ms = 0;
    const matches = text.match(/\d+\s*[mwdshoy]/gi);
    if (matches) {
        for (const match of matches) {
            const unit = match.match(/[mwdshoy]/gi)[0];
            const value = parseInt(match);
            ms += value * units[unit];
        }
    }
    return ms;
}

class db {
    addBan(player, ms, reason) {
        const scoreboard = world.scoreboard.getObjective('BannedPlayers');
        scoreboard.addScore(JSON.stringify(
            {
                "name": player,
                "time": ms + Date.now(),
                "reason": reason
            }
        ).replaceAll('"', "*"), 0);
    }
    removeBan(player) {
        const scoreboard = world.scoreboard.getObjective('BannedPlayers');
        scoreboard.removeParticipant(
            JSON.stringify(
                {
                    "name": player,
                    "time": this.getBanTime(player),
                    "reason": this.getBanReason(player)
                }).replaceAll('"', "*")
        )
    }
    getBanTime(player) {
        const scoreboard = world.scoreboard.getObjective('BannedPlayers');
        scoreboard.getParticipants().forEach((s) => {
            if (JSON.parse(s.displayName.replaceAll("*", '"')).name === player) {
                return JSON.parse(s.displayName.replaceAll("*", '"')).time;
            }
        })
    }
    getBanReason(player) {
        const scoreboard = world.scoreboard.getObjective('BannedPlayers');
        scoreboard.getParticipants().forEach((s) => {
            if (JSON.parse(s.displayName.replaceAll("*", '"')).name === player) {
                return JSON.parse(s.displayName.replaceAll("*", '"')).reason;
            }
        })
    }
    getBans() {
        const scoreboard = world.scoreboard.getObjective('BannedPlayers');
        const bans = [];
        scoreboard.getParticipants().forEach((b) => {
            b = JSON.parse(s.displayName.replaceAll("*", '"'));
            bans.push(
                {
                    "name": b.name,
                    "time": b.time,
                    "reason": b.reason
                }
            )
        })
        return bans;
    }
}

const database = new db();

function banMenuSelect(player) {
    const f = new ActionFormData();
    f.title("§4Ban Menu§r");
    f.body("§dMade by: §cTM Grant but banned§r");
    f.button("§3Ban§r");
    f.button("§6Unban§r");
    f.button("§gClose§r");
    f.show(player).then((r) => {
        if (r.selection === 0) {
            banMenuSelect2(player)
        }
        if (r.selection === 1) {
            unbanMenu(player, 0)
        }
    })
}

function banMenuSelect2(player) {
    const f = new ActionFormData();
    f.title("§4Ban Menu§r");
    f.body("§dMade by: §cTM Grant but banned§r");
    f.button("§9Online§r")
    f.button("§cOffline§r")
    f.button("§gClose§r")
    f.show(player).then((r) => {
        if (r.selection === 0) {
            banOnline(player)
        }
        if (r.selection === 1) {
            banOffline(player)
        }
    })
}

function banOnline(player) {
    const f = new ModalFormData();
    f.title("§4Ban Menu§r");
    f.dropdown("Select a player!", world.getAllPlayers().map((p) => p.name));
    f.textField("Example: 30m 2h 7d")
    f.textField("Why are you banning this player?", "Example: Hacking (Using fly hacks and nuker hacks)")
    f.show(player).then((r) => {
        let [player2, time, reason] = r.formValues
        time = parseTime(time);
        database.addBan(player2, time, reason)
        player.runCommand(`kick "${player2}" ${reason}`);
    })
}

function banOffline(player) {
    const f = new ModalFormData();
    f.title("§4Ban Menu§r");
    f.textField("Who do you want to ban?", "Example: TM Grant2");
    f.textField("How long do you want to ban this player for?", "Example: 30m 2h 7d")
    f.textField("Why are you banning this player?", "Example: Hacking (Using fly hacks and nuker hacks)")
    f.show(player).then((r) => {
        let [player2, time, reason] = r.formValues
        time = parseTime(time);
        database.addBan(player2, time, reason)
        if (world.getAllPlayers().map(p => p.name).includes(player)) {
            player.runCommand(`kick "${player2}" ${reason}`);
        }
    })
}

function unbanMenu(player, page) {
    const allBans = database.getBans();
    const f = new ActionFormData();
    f.title("§4Ban Menu§r");

    /**
     * Credit: 
     *  - Discord:
     *    - @minato4743
     *    - @mrpatches123
     */
    const startIndex = (page - 1) * 10;
    const endIndex = Math.min(startIndex + 10, allBans.length);
    for (let i = startIndex; i < endIndex; i++) {
        const ban = allBans[i];
        f.button(`${ban.name}\n${ban.time - Date.now() / 1000 / 60}M`);
    }
    if (startIndex > 0) {
        f.button("<- Back");
    }
    if (endIndex < allBans.length) {
        f.button("Next ->");
    }
    f.show(player).then((r) => {
        if (r.selection < 10) {
            const selected = allBans[startIndex + r.selection];
            unbanConfirmMenu(player, selected);
        } else if (r.selection === 10) {
            unbanMenu(player, page + 1);
        } else if (r.selection === 11) {
            unbanMenu(player, page - 1);
        }
    });
}

function unbanConfirmMenu(player, ban) {
    const f = new MessageFormData();
    f.title("§4Ban Menu§r");
    f.body(`§bAre you sure you would like to unban §d${ban.name}?\n\n§cName: §d${ban.name},\n§cTime: §d${ban.time - Date.now() / 1000 / 60}M,\n§cReason: §d${ban.reason}§r`);
    f.button1("§aConfirm§r");
    f.button2("§cDecline");
    f.show(player).then((r) => {
        if (r.selection == 0) {
            player.sendMessage("§aYou have unbanned " + ban.name + "!");
            database.removeBan(ban.name);
        }
        if (r.selection == 1) {
            player.sendMessage("§cYou have stopped the unban process!");
        }
    })
}

/** Removed for performance and by request of @gameza_src
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (database.getBans(names).map((b) => b.name).includes(player.name)) {
            const banTime = database.getBanTime(player.name);
            const reason = database.getBanReason(player.name);
            if (banTime < Date.now()) {
                player.runCommand(`kick "${player.name}" \n    Grant's Ban System:\nReason: ${reason},\nTime: ${(banTime - Date.now()) / 1000 / 60}M!`)
                world.sendMessage(`${player.name} has tried to join while banned!\nTime: ${(banTime - Date.now()) / 1000 / 60}M, \nReason: ${reason}.`)
            } else {
                database.removeBan(player.name)
            }
        }
    }
})
*/
world.afterEvents.playerSpawn.subscribe((data) => {
    const player = data.player;
    if (data.initialSpawn) {
        if (database.getBans(names).map((b) => b.name).includes(player.name)) {
            const banTime = database.getBanTime(player.name);
            const reason = database.getBanReason(player.name);
            if (banTime < Date.now()) {
                player.runCommand(`kick "${player.name}" \n    Grant's Ban System:\nReason: ${reason},\nTime: ${(banTime - Date.now()) / 1000 / 60}M!`)
                world.sendMessage(`${player.name} has tried to join while banned!\nTime: ${(banTime - Date.now()) / 1000 / 60}M, \nReason: ${reason}.`)
            } else {
                database.removeBan(player.name)
            }
        }
    }
})
