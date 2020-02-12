class Brain {
    constructor(actionCallback) {
        this.init(actionCallback);
    }

    init(actionCallback) {
        this.actionCallback = actionCallback;

        this.senses = {
            sight: new Sense("sight", this.conceptualize.bind(this)),
            sound: new Sense("sound", this.conceptualize.bind(this)),
            touch: new Sense("touch", this.conceptualize.bind(this)),
            temperature: new Sense("temperature", this.conceptualize.bind(this)),

            //consciousness, sense of self
            //basic concepts like speech and visual use this sense to pass parsed data to abstract concepts like feelings and personality.
            self: new Sense("self", this.conceptualize.bind(this)),
        }

        //stores last N sensory events
        this.shortTermMemory = new ShortTermMemory();

        //instant decisons on events when needed
        this.reflexes = [];

        //scan memory, parse data, stimulate sense of self or act
        this.concepts = [
            //basic concepts, responsible for parsing basic sensory data, can stimulate sense of self
            new Visual(),
            new Speech(),

            //abstract concepts, only triggered by sense of self, can feed back new sense of self or act
            new Logic(),
            new Empathy(),
            new Judgement(),
        ]

        this.longTermMemory = {
            language: ["hey", "can" , "you", "boil", "some", "eggs"],
            good: ["eggs"],
            bad: ["{person}"],
        }
    }

    conceptualize(sense, event) {
        //add event to short term memory
        this.shortTermMemory.add([sense.name, event]);

        //reflexes here if implemented

        let selfEvents = [];

        //parse updated short term memory by all concepts that care about what current sense has to say
        for(let i in this.concepts) {
            let concept = this.concepts[i];
            if(concept.sensesToUse.includes(sense.name)) {
                let complexEvent = concept.parseMemory(this.shortTermMemory, this.longTermMemory);
                if (complexEvent) {
                    window.browserVisualiser.logConceptOutput(concept, complexEvent);
                    selfEvents.push(complexEvent);
                }
            }
        }

        //stimulate sense of self
        for (let i in selfEvents) {
            this.senses.self.stimulate(selfEvents[i]);
        }

    }
    
    //unfortunately no time to implement. environment event batch can have multiple acts, and this jumps to the next act, or even have branching story, this tells environment which branch to take
    act() {
        this.actionCallback();
    }
}

class Sense {
    constructor(name, conceptualizationCallback) {
        this.init(name, conceptualizationCallback);
    }

    init(name, conceptualizationCallback) {
        this.name = name;
        this.conceptualizationCallback = conceptualizationCallback;
    }

    stimulate(event) {
        this.conceptualizationCallback(this, event);
    }
}

class ShortTermMemory {
    constructor() {
        this.init();
    }

    init() {
        //in a perfect world this would be variable, when a person concentrates, short term memmory capacity increases
        this.memotyCapacity = 100;
        this.memory = [];
        this.subject = null;
    }

    add(thing) {
        this.memory.push(thing);
        if(this.memory.length > this.memotyCapacity) {
            this.memory.shift();
        }
        window.browserVisualiser.onShortTermMemoryUpdate(this.memory, this.subject);
    }

    setSubject(subject) {
        this.subject = subject;
    }
}

class Concept {
    constructor() {
        this.sensesToUse = [];
    }

    getRelevantEvents(shortTermMemory) {
        return shortTermMemory.memory.filter(mem => this.sensesToUse.includes(mem[0])).reverse();
    }

    parseSubject(shortTermMemory) {
        let memory = shortTermMemory.memory;
        let lastMemory = memory[memory.length-1];
        if(this.sensesToUse.includes(lastMemory[0]) && lastMemory[1].startsWith("{") && lastMemory[1].endsWith("}")) {
            shortTermMemory.setSubject(lastMemory[1]);
        }
    }
}

class Speech extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("sound");
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);
        if(relevantEvents.length > 1) {
            if(longTermMemory.language.includes(relevantEvents[0][1]) && !relevantEvents[1][1]) {
                return "i hear speaking";
            } else if(!relevantEvents[0][1] && longTermMemory.language.includes(relevantEvents[1][1])) {
                //ended speaking, return  senetence
                return "sentence: " + relevantEvents.map(event => event[1]).filter(event => longTermMemory.language.includes(event)).reverse().join(" ");
            }
        }
        return null;
    }
}

class Visual extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("sight");
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);
        let eventValues = relevantEvents.map(event => event[1]);
        if (eventValues.length > 1) {
            if (eventValues[0] && eventValues[0] != eventValues[1] 
                && eventValues.lastIndexOf(eventValues[0]) == 0) {
                return "i see " + eventValues[0];
            }
        }
        
        return null;
    }
}

class Logic extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("self");
        this.recognizableVerbs = ["i see ", "i hear "]
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);

        let subjectVerb = null;
        this.recognizableVerbs.forEach((verb) => {
            if(relevantEvents[0][1].includes(verb)) {
                let subject = relevantEvents[0][1].replace(verb, "");
                if (subject != shortTermMemory.subject) {
                    subjectVerb = shortTermMemory.subject + " is " + subject;
                }
            }
        });

        if (subjectVerb) {
            return subjectVerb;
        }

        if (relevantEvents[0][1].startsWith("sentence:") && relevantEvents[0][1].includes("boil") && relevantEvents[0][1].includes("eggs")) {
            return shortTermMemory.subject + " wants eggs";
        }

        
        return null;
    }
}

class Empathy extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("self");
        this.recognizable = [" is smiling"];
        this.responses = [" is happy or wants something"];
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);

        let subjectVerb = null;
        this.recognizable.forEach((verb) => {
            if(relevantEvents[0][1].includes(verb)) {
                let subject = relevantEvents[0][1].replace(verb, "");
                let verbIndex = this.recognizable.indexOf(verb);
                subjectVerb = subject + this.responses[verbIndex];
            }
        });

        if (subjectVerb) {
            return subjectVerb;
        }

        if (relevantEvents[0][1].includes("wants eggs") && relevantEvents[0][1].includes(shortTermMemory.subject)) {
            return shortTermMemory.subject + " is hungry";
        }
        
        return null;
    }
}

class Judgement extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("self");
        this.previousJudgements = [];
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);
        let lastEventWords = relevantEvents[0][1].split(" ");
        for (let i in lastEventWords) {
            let word = lastEventWords[i];
            if (!this.previousJudgements.includes(word)) {
                if (longTermMemory.good.includes(word)) {
                    !this.previousJudgements.push(word);
                    return "i like " + word;
                }
                if (longTermMemory.bad.includes(word)) {
                    !this.previousJudgements.push(word);
                    return "i don't like " + word;
                }
            }
        }

        if (lastEventWords.includes("hungry") && longTermMemory.good.includes(shortTermMemory.subject)) {
            return "lets " + longTermMemory.language[3] + " " + longTermMemory.language[4] + " " + longTermMemory.language[5] + " ";
        } else if (lastEventWords.includes("hungry") && longTermMemory.bad.includes(shortTermMemory.subject)) {
            return "why would i " + longTermMemory.language[3] + " " + longTermMemory.language[5] + " ";
        }
        
        return null;
    }
}

//copy paste
class BASICTEMPLATE extends Concept {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.sensesToUse.push("...");
    }

    parseMemory(shortTermMemory, longTermMemory) {
        super.parseSubject(shortTermMemory);
        let relevantEvents = super.getRelevantEvents(shortTermMemory);
        
        return null;
    }
}