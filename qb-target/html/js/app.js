const Targeting = Vue.createApp({
    data() {
        return {
            Show: false,
            ChangeTextIconColor: false, // This is if you want to change the color of the icon next to the option text with the text color
            StandardEyeIcon: 'https://media.discordapp.net/attachments/1180729025665171530/1201578897947508776/Frame_82_6.png', // Instead of icon it's using a image source found in HTML 
            CurrentIcon: 'https://media.discordapp.net/attachments/1180729025665171530/1201578897947508776/Frame_82_6.png', // Instead of icon it's using a image source found in HTML
            SuccessIcon: 'https://media.discordapp.net/attachments/1180729025665171530/1201578897460953198/Frame_83_1.png', // Instead of icon it's using a image source found in HTML
            SuccessColor: "#00F8BC",
            StandardColor: "white",
            TargetHTML: "",
            TargetEyeStyleObject: {
                color: "white", // This is the standardcolor, change this to the same as the StandardColor if you have changed it
            },
        }
    },
    destroyed() {
        window.removeEventListener("message", this.messageListener);
        window.removeEventListener("mousedown", this.mouseListener);
        window.removeEventListener("keydown", this.keyListener);
        window.removeEventListener("mouseover", this.mouseOverListener);
        window.removeEventListener("mouseout", this.mouseOutListener);
    },
    mounted() {
        this.targetLabel = document.getElementById("target-label");

        this.messageListener = window.addEventListener("message", (event) => {
            switch (event.data.response) {
                case "openTarget":
                    this.OpenTarget();
                    break;
                case "closeTarget":
                    this.CloseTarget();
                    break;
                case "foundTarget":
                    this.FoundTarget(event.data);
                    break;
                case "validTarget":
                    this.ValidTarget(event.data);
                    break;
                case "leftTarget":
                    this.LeftTarget();
                    break;
            }
        });

        this.mouseListener = window.addEventListener("mousedown", (event) => {
            let element = event.target;
            if (element.id) {
                const split = element.id.split("-");
                if (split[0] === "target" && split[1] !== "eye" && event.button == 0) {
                    fetch(`https://${GetParentResourceName()}/selectTarget`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json; charset=UTF-8" },
                        body: JSON.stringify(split[2])
                    }).then(resp => resp.json()).then(_ => {});
                    this.targetLabel.innerHTML = "";
                    this.Show = false;
                }
            }

            if (event.button == 2) {
                this.LeftTarget();
                fetch(`https://${GetParentResourceName()}/leftTarget`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: ""
                }).then(resp => resp.json()).then(_ => {});
            }
        });

        this.keyListener = window.addEventListener("keydown", (event) => {
            if (event.key == "Escape" || event.key == "Backspace") {
                this.CloseTarget();
                fetch(`https://${GetParentResourceName()}/closeTarget`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: ""
                }).then(resp => resp.json()).then(_ => {});
            }
        });

        this.mouseOverListener = window.addEventListener("mouseover", (event) => {
            const element = event.target;
            if (element.id) {
                const split = element.id.split("-");
                if (split[0] === "target" && split[1] === "option") {
                    event.target.style.background = "linear-gradient(#009A75ca, #00D3A0ca)";
                    element.style.border = "solid .1vh #00FFC1";
                    element.style.cursor = "pointer";
                    if (this.ChangeTextIconColor) document.getElementById(`target-option-${index}`).style.background = "linear-gradient(#009A75ca, #00D3A0ca)";
                }
            }
        });

        this.mouseOutListener = window.addEventListener("mouseout", (event) => {
            const element = event.target;
            if (element.id) {
                const split = element.id.split("-");
                if (split[0] === "target" && split[1] === "option") {
                    element.style.background = "linear-gradient(#00896960, #00bf8f60)";
                    element.style.border = "solid .1vh #00bf8f20";
                    if (this.ChangeTextIconColor) document.getElementById(`target-option-${index}`).style.background = "linear-gradient(#00896960, #00bf8f60)";
                }
            }
        });
    },
    methods: {
        OpenTarget() {
            this.targetLabel.innerHTML = "";
            this.Show = true;
            this.TargetEyeStyleObject.color = this.StandardColor;
        },

        CloseTarget() {
            this.targetLabel.innerHTML = "";
            this.TargetEyeStyleObject.color = this.StandardColor;
            this.Show = false;
            this.CurrentIcon = this.StandardEyeIcon;
        },

        FoundTarget(item) {
            if (item.data) {
                this.CurrentIcon = item.data;
            } else {
                this.CurrentIcon = this.SuccessIcon;
            }
            this.TargetEyeStyleObject.color = this.SuccessColor;
        },

        ValidTarget(item) {
            this.targetLabel.innerHTML = "";
            for (let [index, itemData] of Object.entries(item.data)) {
                if (itemData !== null) {
                    index = Number(index) + 1;

                    if (this.ChangeTextIconColor) {
                        this.targetLabel.innerHTML +=
                        `<div id="target-option-${index}" style=" color: white; background: linear-gradient(#00896960, #00bf8f60); width:17vh border:solid .1vh #00bf8f20; border-radius: .3vh ;padding: .5vh .9vh; margin-bottom: .5vh;">
                            <span id="target-icon-${index}" style="color: ${this.StandardColor};">
                                <i class="${itemData.icon}"></i>
                            </span>
                            ${itemData.label}
                        </div>`;
                    } else {
                        this.targetLabel.innerHTML +=
                        `<div id="target-option-${index}" style=" color: white; background: linear-gradient(#00896960, #00bf8f60); width:17vh; border:solid .1vh #00bf8f20; border-radius: .3vh ;padding: .5vh .9vh; margin-bottom: .5vh;">
                            <span id="target-icon-${index}" style="color: ${this.SuccessColor};">
                                <i class="${itemData.icon}"></i>
                            </span>
                            ${itemData.label}
                        </div>`;
                    }
                }
            }
        },

        LeftTarget() {
            this.targetLabel.innerHTML = "";
            this.CurrentIcon = this.StandardEyeIcon;
            this.TargetEyeStyleObject.color = this.StandardColor;
        }
    }
});

Targeting.use(Quasar, { config: {} });
Targeting.mount("#target-wrapper");