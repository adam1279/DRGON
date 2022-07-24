const abilityTable = [
    {
        "score": [1],
        "mod": -5
    },
    {
        "score": [2, 3],
        "mod": -4
    },
    {
        "score": [4, 5],
        "mod": -3
    },
    {
        "score": [6, 7],
        "mod": -2
    },
    {
        "score": [8, 9],
        "mod": -1
    },
    {
        "score": [10, 11],
        "mod": 0
    },
    {
        "score": [12, 13],
        "mod": 1
    },
    {
        "score": [14, 15],
        "mod": 2
    },
    {
        "score": [16, 17],
        "mod": 3
    },
    {
        "score": [18, 19],
        "mod": 4
    },
    {
        "score": [20, 21],
        "mod": 5
    },
    {
        "score": [22, 23],
        "mod": 6
    },
    {
        "score": [24, 25],
        "mod": 7
    },
    {
        "score": [26, 27],
        "mod": 8
    },
    {
        "score": [28, 29],
        "mod": 9
    },
    {
        "score": [30],
        "mod": 10
    }
];
const skillTable = {
    "acrobatics": {
        ability: "dexterity",
        name: "Acrobatics"
    },
    "animal-handling": {
        ability: "wisdom",
        name: "Animal Handling"
    },
    "arcana": {
        ability: "intelligence",
        name: "Arcana"
    },
    "athletics": {
        ability: "strength",
        name: "Athletics"
    },
    "deception": {
        ability: "charisma",
        name: "Deception"
    },
    "history": {
        ability: "intelligence",
        name: "History"
    },
    "insight": {
        ability: "wisdom",
        name: "Insight"
    },
    "intimidation": {
        ability: "charisma",
        name: "Intimidation"
    },
    "investigation": {
        ability: "intelligence",
        name: "Investigation"
    },
    "medicine": {
        ability: "wisdom",
        name: "Medicine"
    },
    "nature": {
        ability: "intelligence",
        name: "Nature"
    },
    "perception": {
        ability: "wisdom",
        name: "Perception"
    },
    "performance": {
        ability: "charisma",
        name: "Performance"
    },
    "persuasion": {
        ability: "charisma",
        name: "Persuasion"
    },
    "religion": {
        ability: "intelligence",
        name: "Religion"
    },
    "sleight-of-hand": {
        ability: "dexterity",
        name: "Sleight of Hand"
    },
    "stealth": {
        ability: "dexterity",
        name: "Stealth"
    },
    "survival": {
        ability: "wisdom",
        name: "Survival"
    },
};
const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma"
];
const abilityShortener = (ability) => {
    return ability.slice(0, 3).toUpperCase();
};
const abilityScoreToMod = (score, add) => {
    add = (add == undefined) ? 0 : add;
    for (i of abilityTable) {
        if (i.score.includes(score)) {
            return [i.mod + add, (i.mod + add >= 0) ? "+" + (i.mod + add) : String(i.mod + add)];
        }
    }
    return undefined;
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const apiUrl = "https://www.dnd5eapi.co/api/";

/*function apiGet(query, callback, data2) {
    data2 = (data2 == undefined) ? [] : data2;
    $.getJSON(apiUrl + query[0], (data) => {
        data2.push(data);
        if (query[1]) {
            query.shift();
            apiGet(query, callback, data2);
        } else {
            callback(data2);
        }
    });
}*/
function apiGet(query, callback) {
    $.getJSON(apiUrl + query, (data) => {
        callback(data);
    });
}
function apiGetMulti(array, callback) {
    let results = [];
    let promises = [];
    for (let i = 0; i < array.length; i++) {
        promises.unshift(
            $.getJSON(apiUrl + array[i], (result) => {
                results.push(result);
            })
        );
        if (promises[1]) {
            promises[1].then(() => {
                promises[0];
            });
        }
    }
    if (callback) {
        promises[0].then(() => callback(results));
    }
}
const data = {
    
};
const u = (a, b) => {
    return (a !== undefined) ? a : b; 
};
class DataItem {
    constructor(obj, type) {
        this.obj = obj;
        this.index = obj.index;
        this.ext = (obj.ext) ? obj.ext : false;
        this.path = obj.path;
        this.type = (type) ? type : (obj.type) ? obj.type : "equipment";
    }
    get(callback) {
        if (this.ext && this.path == undefined) {
            let obj = this.obj;
            if (callback) {
                callback(obj);
            } else {
                return new Promise(() => {
                    resolve(obj)
                });
            }
        } else {
            let path = (this.ext) ? this.path + this.index + ".json" : apiUrl + this.type + "/" + this.index;
            return $.getJSON(path, (data) => {
                if (callback) callback(data);
            });
        }
    }
}
class Proficiency extends DataItem {
    constructor(obj) {
        super(obj, "proficiencies");
    }
}
class CharSheet {
    constructor(sheet, info) {
        this.sheet = sheet;
        this.info = u(info, {});
        this.primary = u(this.info.primary, false);
        this.divs = {};
        this.storage = {
            set: (data) => {
                savedData = (window.localStorage.getItem("data#" + this.sheet.index)) ? JSON.parse(localStorage.getItem("data#" + this.sheet.index)) : {};
                for (i of Object.keys(data)) {
                    savedData[i] = data[i];
                    e = new CustomEvent("data-update-" + i, {detail: data[i]});
                    for (elem of document.body.getElementsByTagName("*")) {
                        elem.dispatchEvent(e);
                    }
                }
                window.localStorage.setItem("data#" + this.sheet.index, JSON.stringify(savedData));
            },
            get: (keys) => {
                
            }
        };
        this.proficiencies = this.sheet.proficiencies;
        this.proficiencies.skills = u(this.sheet.proficiencies.skills, []);
        this.proficiency_bonus = u(this.sheet.proficiency_bonus, 0);
        this.initMainDiv();
        if (this.sheet.pc) {
            
        }
        this.initCharacterInfo();
        this.initHitPoints();
        this.initAbilityChecks();
        this.initSkillChecks();
    }
    initProficiencies() {
        
    }
    initMainDiv() {
        this.mainDiv = new MainDiv({
            primary: this.primary
        });
    }
    initHitPoints() {
        this.divs.hitPoints = new BoxDiv({
            classes: ["hit-points-div"],
            header: "Hit Points",
            mainDiv: this.mainDiv
        });
    }
    initAbilityChecks() {
        this.divs.abilityChecks = new BoxDiv({
            classes: ["ability-checks-div"],
            header: "Ability Checks",
            mainDiv: this.mainDiv
        });
        /*new Element("div", {
            dirAttrs: {
                innerHTML: "Ability Checks"
            },
            parent: {
                element: abilityChecks.elem
            },
            classes: [
                "h"
            ]
        });*/
        for (let ability of abilities) {
            console.log(abilityScoreToMod(this.sheet[ability]));
            let rollDiv = new RollDiv({
                sides: 20,
                bonus: abilityScoreToMod(this.sheet[ability]),
                parent: {
                    element: this.divs.abilityChecks.elem
                },
                header: abilityShortener(ability),
                title: capitalize(ability)
            });
            new Element("span", {
                dirAttrs: {
                    innerHTML: this.sheet[ability]
                },
                parent: {
                    element: rollDiv.elem
                },
                classes: ["score-span"]
            });
        }

    }
    initSkillChecks() {
        this.divs.skillChecks = new BoxDiv({
            classes: ["skill-checks-div"],
            header: "Skill Checks",
            mainDiv: this.mainDiv
        });
        for (let skill of Object.keys(skillTable)) {
            let subheader = new Element("div", {
                classes: ["subheader-div"]
            });
            new Element("div", {
                dirAttrs: {
                    innerHTML: abilityShortener(skillTable[skill].ability),
                    title: capitalize(skillTable[skill].ability)
                },
                parent: {
                    element: subheader.elem
                },
                classes: []
            });
            if (this.proficiencies.skills.includes(skill)) new Element("div", {
                dirAttrs: {
                    innerHTML: "PRO",
                    title: "Proficient +" + this.proficiency_bonus
                },
                parent: {
                    element: subheader.elem
                },
                classes: ["prof-indicator"],
            });
            let rollDiv = new RollDiv({
                parent: {
                    element: this.divs.skillChecks.elem
                },
                sides: 20,
                bonus: abilityScoreToMod(this.sheet[skillTable[skill].ability], (this.proficiencies.skills.includes(skill)) ? this.proficiency_bonus : 0),
                header: skillTable[skill].name,
                subheaderDiv: subheader.elem,
                proficient: this.proficiencies.skills.includes(skill),
                searchQuery: {index: skill, type: "skills"}
            });
            
            //console.log(sheet.proficiency_bonus);
        }
    }
    initProficiencyBonus() {
        this.divs.proficiencyBonusDiv = new BoxDiv({
            classes: ["proficiency-bonus-div"],
            header: "PRO Bonus",
            dirAttrs: {
                title: "Proficiency Bonus"
            }
        });
        new Element("div", {
            dirAttrs: {
                innerHTML: "+" + charSheet.proficiency_bonus
            },
            parent: {
                element: proficiencyBonusDiv.elem
            },
            classes: ["prof-indicator", "bordered"]
        });
    }
    initInitiative() {
        this.divs.initiativeDiv = new BoxDiv({
            header: "Initiative",
            classes: ["initiative-div"],
            mainDiv: this.mainDiv
        });
        let initiativeSave = new Element("div", {
            classes: ["initiative-save", "bordered"],
            parent: {
                element: initiativeDiv.elem
            },
            dirAttrs: {
                innerHTML: "00"
            }
        });
        initiativeSave.elem.addEventListener("data-update-initiative", (e) => {
            console.log(this);
            initiativeSave.elem.innerHTML = e.detail;
        });

        new RollButton({
            parent: {
                element: initiativeDiv.elem
            },
            sides: 20,
            bonus: abilityScoreToMod(charSheet.ability_scores.dexterity, charSheet.initiative_bonus),
            save: "initiative"
        });
    }
    initActions() {

    }
    initCharacterInfo() {
        this.divs.characterInfo = new BoxDiv({
            classes: ["character-info-div"],
            header: "Character",
            mainDiv: this.mainDiv
        });
        let arr = [
            {
                value: this.sheet.name,
                key: "Name"
            },
            {
                value: this.sheet.race,
                key: "Race"
            },
            {
                value: this.sheet.classes,
                key: "Class" + ((this.sheet.classes.length > 1) ? "es" : "")
            }
        ];
        arr = arr.concat(this.sheet.character_info);
        for (let i of arr) {
            console.log(i);
            console.log(Array.isArray(i.value));
            new Element("div", {
                dirAttrs: {
                    innerHTML: i.key + ": " + ((!Array.isArray(i.value)) ? i.value : i.value.join(", "))
                },
                parent: {
                    element: this.divs.characterInfo.elem
                }
            })
        }
    }
}
function searchInfo(query) {
    new DataItem(query).get((data) => {
        console.log(data.name);
        for (i of data.desc) {
            console.log(i);
        }
    });
}