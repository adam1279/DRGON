
class Element {
    constructor(type, info, extendInfo) {
        this.info = (info) ? info : {};
        this.extendInfo = (extendInfo) ? extendInfo : {};
        this.parent = (this.info.parent) ? this.info.parent : (this.extendInfo.parent) ? this.extendInfo.parent : undefined;
        //console.log(this.parent);
        this.type = type;
        this.elem = this.create();
        this.init(this.info);
        if (extendInfo) this.init(extendInfo);
        if (this.info.search) {
            this.elem.addEventListener("click", () => searchInfo(this.info.search));
            this.elem.classList.add("info");
        }
    }
    create() {
        let element = document.createElement(this.type);

        if (this.parent) {
            //console.log(this.parent.element);
            if (this.parent.before) {
                this.parent.element.insertBefore(element, this.parent.before);
            } else {
                this.parent.element.appendChild(element);
            }
        }

        return element;
    }
    init(info) {
        const keys = (infoKey) => {return Object.keys(info[infoKey])};
        const forKey = (infoKey, func) => {
            if (info[infoKey]) {
                for (let i = 0; i < keys(infoKey).length; i++) {
                    func(keys(infoKey)[i], info[infoKey][keys(infoKey)[i]]);
                }
            }
        }
        
        if (info.classes) {
            for (let clss of info.classes) {
                this.elem.classList.add(clss);
            }
        }
        
        forKey("dirAttrs", (key, value) => {
            this.elem[key] = value;
        });

        forKey("attrs", (key, value) => {
            this.elem.setAttribute(key, value);
        });

        forKey("props", (key, value) => {
            this.elem.style[key] = value;
        });
        if (info.events) {
            for (let event of info.events) {
                this.elem.addEventListener(event.event, event.func);
            }
        }
        /*forKey("events", (key, value) => {
            this.elem.addEventListener(key, value);
        });*/
    }
}
class MainDiv extends Element {
    static current;
    constructor(info) {
        super("div", info, {
            classes: ["main-div"],
            parent: {
                element: document.body
            }
        });
        if (info.primary) {
            this.current(true);
        }
    }
    current(bool) {
        if (bool) {
            if (MainDiv.current) {
                MainDiv.current.current(false);
            }
            MainDiv.current = this;
            this.elem.classList.add("current");
        } else {
            this.elem.classList.remove("current");
        }
    }
}
class BoxDiv extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["box-div"],
            parent: {
                element: info.mainDiv.elem
            }
        });
        if (info.header) {
            new Element("div", {
                dirAttrs: {
                    innerHTML: info.header
                },
                parent: {
                    element: this.elem
                },
                classes: [
                    "h"
                ]
            });
        }
    }
}


class RollButton extends Element {
    constructor(info) {
        super("div", info, {
            classes: (info.proficient) ? ["roll-button", "proficient"] : ["roll-button"],
            events: [{
                event: "click",
                func: () => {
                    result = diceRoll(info.sides, info.bonus[0]);
                    if (info.save) {
                        let obj = {};
                        obj[info.save] = result;
                        data.set(obj);
                    }
                }
            }],
            dirAttrs: {
                innerHTML: info.bonus[1]
            }
        });
    }
}

class RollDiv extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["roll-div", "bordered"],
            attrs: {
                title: (info.title) ? info.title : ""
            }
        });
        this.header = new Element("span", {
            dirAttrs: {
                innerHTML: info.header
            },
            parent: {
                element: this.elem
            },
            classes: [
                "roll-header",
                (info.searchQuery) ? "info" : undefined
            ],
            events: [
                {
                    event: "click",
                    func: () => {
                        if (info.searchQuery) searchInfo(info.searchQuery)
                    }
                }
            ]
        });
        if (info.subheaderDiv) this.header.elem.appendChild(info.subheaderDiv);
        this.rollButton = new RollButton({
            sides: info.sides,
            bonus: info.bonus,
            parent: {
                element: this.elem
            },
            proficient: info.proficient
        });
    }
}
class DiceRollButton extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["dice-roll-button"],
            events: [
                {
                    event: "click",
                    func: () => {
                        diceRoll(info.sides);
                    }
                }
            ],
            dirAttrs: {
                innerHTML: "D" + info.sides
            },
            parent: {
                element: diceFlight.elem
            }
        });
    }
}
/*class AbilityCheckDiv extends RollDiv {
    constructor(info) {
        super({
            classes: ["ability-check-div"],
            sides: 20,
            bonus: info.,
            header: 
        });
    }
}*/
class Spell extends Element {
    constructor(info, spell) {
        super("div", info, {
            classes: ["spell-div", "bordered"]
        });
        this.spell = spell;
        new RollButton({
            sides: 6,
            bonus: [],
            parent: {
                element: this.elem
            }
        });
        new Element("div", {})
    }
}
class DiceDiv extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["dice-div"],
            dirAttrs: {
                innerHTML: (info.roll > 9) ? info.roll : "0" + info.roll
            },
            parent: {
                element: diceDivCont.elem
            }
        });
        
    }
}
class InfoList extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["info-list"]
        });
        this.itemDivs = [];
    }
    addItem(info) {
        let outerDivObj = {
            parent: {
                element: this.elem
            }
        };
        let pluralStr = "";
        let value = [info.value];
        if (Array.isArray(info.value)) {
            if (info.value.length > 1) {
                pluralStr = info.plural;
            }
            value = info.value;
        }
        outerDivObj.dirAttrs.innerHTML = info.key + pluralStr + ":";
        let outerDiv = new Element("div", outerDivObj);
        this.itemDivs.push(outerDiv);
        let innerDivObj = {
            parent: {
                element: outerDiv.elem
            }
        }
        innerDivObj.dirAttrs.innerHTML = value;
        let innerDiv = new Element("div", innerDivObj);

    }
}

class NavBar extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["navbar"]
        });
        
    }
}
class NavBarItem extends Element {
    constructor(info) {
        super("div", info, {
            classes: ["navbar-item"]
        });
    }
}