/**
 * Floo / フロー
 */
//% weight=1 color=#967851 icon="\uf033"
namespace inosyan_floo {

    const TARGET_RADIUS = 3;
    const warpPointList: Position[] = [];

    let lastCommandExecuted = 0;

    //% block="addFlooPositoin %worldPosition1=minecraftCreateWorldPosition %worldPosition2=minecraftCreateWorldPosition"
    export function addFlooPosition(worldPosition1: Position, worldPosition2: Position): void {
        warpPointList.push(worldPosition1);
        warpPointList.push(worldPosition2);
    }

    const checkWithinRange = (targetPos: Position) => {
        const playerPos = player.position().toString();
        for (let i = -TARGET_RADIUS + 1; i < TARGET_RADIUS; i++) {
            for (let j = -TARGET_RADIUS + 1; j < TARGET_RADIUS; j++) {
                if (targetPos.add(positions.create(i, 0, j)).toString() === playerPos) {
                    return true;
                }
            }
        }
        return false;
    }

    const doWarp = (arg1: number, arg2: number, arg3: number) => {
        let pos: Position = null;
        let oppositePos: Position = null;
        for (let i = 0, l = warpPointList.length; i < l; i++) {
            const p = warpPointList[i];
            if (checkWithinRange(p)) {
                player.say('within!!');
                pos = p;
                if (i % 2 == 0) {
                    oppositePos = warpPointList[i + 1];
                } else {
                    oppositePos = warpPointList[i - 1];
                }
                break;
            }
        }
        if (pos !== null && oppositePos !== null) {
            [mobs.target(TargetSelectorKind.AllPlayers), mobs.target(TargetSelectorKind.AllEntities)].forEach(
                (target) => {
                    mobs.teleportToPosition(mobs.near(target, pos, TARGET_RADIUS), oppositePos);
                }
            );
        }
    }

    const sayPosition = (arg1: number, arg2: number, arg3: number) => {
        player.say('Position: ' + player.position().toString().split(' ').join(', '));
    }

    const registerCommand = (commandName: string, command: (arg1: number, arg2: number, arg3: number) => void) => {
        player.onChat(commandName, (arg1: number, arg2: number, arg3: number) => {
            const now = gameplay.timeQuery(TimeQuery.GameTime);
            if (now - lastCommandExecuted < 100) return;
            lastCommandExecuted = now;
            command(arg1, arg2, arg3);
        });
    }

    const init = () => {
        registerCommand('floo', doWarp);
        registerCommand('warp', doWarp);
        registerCommand('showPlayerPosition', sayPosition);
    }

    init();
}
