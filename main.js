//const charSheetsElems = document.getElementsByClassName("char-sheets");
let charSheet;
const getCharSheet = (name, callback) => {
    $.getJSON("char_sheets/" + name + ".json", (data) => {
        callback(data)
    })
};
const roll = (sides) => {
    return Math.ceil(Math.random() * sides);
};
const mainDiv = new Element("div", {
    classes: ["main-div"],
    parent: {
        element: document.body
    }
});
const charSheetPaths = ["rederick_morgan", "avon_repus", "homunculus_servant"];
const hash = location.hash.split("#").pop();
if (location.hash == "") {
    let charSheets = [];
    for (let i = 0; i < charSheetPaths.length; i++) {
        getCharSheet(charSheetPaths[i], (data) => {
            charSheets.push(data)
        });
    }
} else if (charSheetPaths.includes(hash)) {
    getCharSheet(hash, (sheet) => {
        charSheet = sheet;
        //console.log(sheet);
        //console.log(hash);
        /*new Element("h1", {
            parent: {
                element: document.body,
                before: mainDiv.elem
            },
            dirAttrs: {
                innerHTML: sheet.name
            },
            classes: [
                "h"
            ]
        });
        new Element("br", {
            parent: {
                element: document.body,
                before: mainDiv.elem
            }
        });*/
        new CharSheet(sheet, {
            primary: true
        });
        /*new RollButton({
            sides: 20,
            bonus: 5,
            parent: {
                element: document.body
            },
            dirAttrs: {
                innerHTML: "+5"
            }
        });*/
        
        /*new Element("div", {
            dirAttrs: {
                innerHTML: "Skill Checks"
            },
            parent: {
                element: skillChecks.elem
            },
            classes: [
                "h"
            ]
        });*/

        /*apiGet(["skills"], (data) => {
            console.log(data);
            skills = [];
            for (skill of data[0].results) {
                skills.push("skills/" + skill.index);
            }
            apiGet(skills, (data) => {
                console.log(data);
            });
            /*for (skill of data) {
                new RollDiv({
                    sides: 20,
                    bonus: 
                })
            }
        });*/
        
    });
}

const rollerDivCont = new Element("div", {
    classes: ["roller-div-container"],
    parent: {
        element: document.body
    }
});

const diceFlight = new Element("div", {
    classes: ["dice-flight"],
    parent: {
        element: rollerDivCont.elem
    }
});
const rollerDiv = new Element("div", {
    classes: ["roller-div"],
    parent: {
        element: rollerDivCont.elem
    }
});

const diceDivCont = new Element("div", {
    classes: ["dice-div-container"],
    parent: {
        element: rollerDivCont.elem
    }
});
diceArray = [4, 6, 8, 10, 12, 20, 100];
for (i of diceArray) {
    new DiceRollButton({
        sides: i
    });
}
function diceRoll(sides, bonus, amount) {
    diceDivCont.elem.innerHTML = "";
    bonusNum = (bonus == undefined) ? 0 : bonus;
    amount = (amount) ? amount : 1;
    //diceDiv.elem.innerHTML = (result > 9) ? result : "0" + result;
    results = [];
    for (i = 0; i < amount; i++) {
        results.push(roll(sides));
        new DiceDiv({
            roll: results[i]
        });
    }
    result = results.reduce((a, b) => a + b, 0);
    finalResult = result + bonusNum;
    new Element("div", {
        parent: {
            element: rollerDiv.elem,
            before: rollerDiv.elem.children[0]
        },
        dirAttrs: {
            innerHTML: amount + "D" + sides + ((bonus !==undefined) ? ((bonus < 0) ? "" : "+") + bonus : "") + "=<span style='font-weight: bold'>" + (finalResult) + "</span>"
        }
    });
    return finalResult;
}
function initSpells() {

    boxDiv = new BoxDiv({
        classes: ["spells-div"],
        header: "Spells"
    });
    spellIndexes = [];
    charSheet.spells.forEach((spell) => {
        spellIndexes.push("spells/" + spell.index);
    });
    spellIndexes.sort();
    apiGetMulti(spellIndexes, (data) => {
        console.log(data);
        for (spell of data) {
            new Spell({
                spell: spell,
                parent: {
                    element: boxDiv.elem
                }
            });
        }
    });

}
function initAbilityChecks() {
    
}
function initSkillChecks() {
}
function initProficiencyBonus() {
    
    
}
function initHitPoints() {

}