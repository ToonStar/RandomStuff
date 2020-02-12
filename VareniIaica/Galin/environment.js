class Environment {
    constructor() {
        this.init();
        this.eventItterator = 0;
        this.currentAct = 0;
    }

    actionCallback() {

    }

    nextBatch() {
        let batch = this.eventBatches[this.currentAct][this.eventItterator];
        for(let sense in batch) {
            this.brain.senses[sense].stimulate(batch[sense]);
        }

        if (this.eventBatches[this.currentAct].length -1 != this.eventItterator) {
            this.eventItterator += 1;
        }

    }

    init() {
        this.brain = new Brain(this.actionCallback.bind(this));

        this.eventBatches = [
            [
                //Act 0
                {
                    "sight": "",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "smiling",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "hey",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "can",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "you",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "boil",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "some",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "eggs",
                    "touch": "",
                    "temperature": "neutral",
                },
                {
                    "sight": "{person}",
                    "sound": "",
                    "touch": "",
                    "temperature": "neutral",
                },
            ],
            //Act 1
            [

            ],
        ];
    }
}