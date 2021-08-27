var isDefaultName = false;
var HTML;
var base = { switch: false, data: '' };

/***

SPEAK
speaker:
actor: "Y0AF1TTJc62818xw"
alias: "BBBC"
scene: "h4pMkoiYTRL1AVto"
token: "WR37HUvxw2akCWIE"

修改行為
1)必需選定一個名字
i)可選自己的身份或自己擁有的TOKEN
2)如場上有同樣的TOKEN，使用那個TOKEN發言
3)沒有的話，則把發言名稱改成那個名字


  <label class="chat-control-icon"><i class="fas fa-dice-d20"></i></label>
        <select class="roll-type-select" name="rollMode">
            <optgroup label="Default Roll Mode">
            <option value="roll">Public Roll</option>
            <option value="gmroll">Private GM Roll</option>
            <option value="blindroll" selected="">Blind GM Roll</option>
            <option value="selfroll">Self Roll</option>
            </optgroup>
        </select>

        <div class="control-buttons">
            <a class="button export-log" title="Export Chat Log"><i class="fas fa-save"></i></a>
            <a class="delete button chat-flush" title="Clear Chat Log"><i class="fas fa-trash"></i></a>
        </div>

*/



Hooks.on("renderSidebarTab", (dialog, $element, targets) => {
    /**
     * 自己的登入名字
     * 自己擁有的角色
    */
    ($element.find(`div#chat-controls.flexrow`)[0]) ? HTML = $element.find(`div#chat-controls.flexrow`)[0] : null;
    if (HTML) {
        if (!base.switch) {
            base.data = HTML.innerHTML;
            base.switch = true;
        }
        HTML.innerHTML = updateSpeakerList() + base.data;
    }
});


function updateSpeakerList() {
    let myUser = game.users.find(user => user.id == game.userId);
    let myactors = game.actors.filter(actor => actor.permission >= 2);

    let addText = `<select name="namelist" id="namelist"  class="roll-type-select">
    <optgroup label="Speak As....">
    <option value="userName" name="XX">${myUser.name}</option>`;
    for (let index = 0; index < myactors.length; index++) {
        addText += `\n<option value="${myactors[index].id}">${myactors[index].name}</option>`
    };
    addText += `\n</select>`;
    return addText;
}

Hooks.on("chatMessage", (dialog, $element, targets) => {

    let namelist = document.getElementById('namelist');

    if (!namelist) return;
    switch (namelist.value) {
        case 'userName':
            targets.speaker.token = null;
            targets.speaker.alias = null;
            break;
        default:
            let map = game.scenes.find(scene => scene.isView);
            let target = map.tokens.find(token => {
                return token.name == namelist.options[namelist.selectedIndex].text
            })
            if (!target) {
                targets.speaker.token = 'Speak As zzzz';
                targets.speaker.alias = namelist.options[namelist.selectedIndex].text;
            }
            break;
    }

    //targets.speaker.token = "XXX"
    //2)如場上有同樣的TOKEN，使用那個TOKEN發言
    //targets.speaker.actor = '';
    //  targets.speaker.alias = 'XXX';
});


Hooks.on("renderActorDirectory", (dialog, $element, targets) => {
    HTML.innerHTML = updateSpeakerList() + base.data;
});