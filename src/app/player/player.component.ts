import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
declare var AWS: any;

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
    textContent: string = "";
    textBefore: string = "";
    textCurrent: string = "";
    textAfter: string = "";
    textBroken: string[];
    audioUrl: string = "";
    sentPtr: number = 0;
    langMap = {Geraint: "English, Welsh", Gwyneth: "Welsh", Mads: "Danish", Naja: "Danish", Hans: "German", Marlene: "German", Nicole: "English, Australian", Russell: "English, Australian", Amy: "English, British", Brian: "English, British", Emma: "English, British", Raveena: "English, Indian", Ivy: "English, US", Joanna: "English, US", Joey: "English, US", Justin: "English, US", Kendra: "English, US", Kimberly: "English, US", Matthew: "English, US", Salli: "English, US", Conchita: "Spanish, Castilian", Enrique: "Spanish, Castilian", Miguel: "Spanish, US", Penelope: "Spanish, US", Chantal: "French, Canadian", Celine: "French", Lea: "French", Mathieu: "French", Dora: "Icelandic", Karl: "Icelandic", Carla: "Italian", Giorgio: "Italian", Mizuki: "Japanese", Liv: "Norwegian", Lotte: "Dutch", Ruben: "Dutch", Ewa: "Polish", Jacek: "Polish", Jan: "Polish", Maja: "Polish", Ricardo: "Portuguese, Brazilian", Vitoria: "Portuguese, Brazilian", Cristiano: "Portuguese", Ines: "Portuguese", Carmen: "Romanian", Maxim: "Russian", Tatyana: "Russian", Astrid: "Swedish", Filiz: "Turkish", Vicki: "German", Takumi: "Japanese", Seoyeon: "Korean", Aditi: "English, Indian (Hindi available but not implemented)"};
    selectedCast: number = 12;
    casts: string[] = [
        "Geraint",
        "Gwyneth",
        "Mads",
        "Naja",
        "Hans",
        "Marlene",
        "Nicole",
        "Russell",
        "Amy",
        "Brian",
        "Emma",
        "Raveena",
        "Ivy",
        "Joanna",
        "Joey",
        "Justin",
        "Kendra",
        "Kimberly",
        "Matthew",
        "Salli",
        "Conchita",
        "Enrique",
        "Miguel",
        "Penelope",
        "Chantal",
        "Celine",
        "Lea",
        "Mathieu",
        "Dora",
        "Karl",
        "Carla",
        "Giorgio",
        "Mizuki",
        "Liv",
        "Lotte",
        "Ruben",
        "Ewa",
        "Jacek",
        "Jan",
        "Maja",
        "Ricardo",
        "Vitoria",
        "Cristiano",
        "Ines",
        "Carmen",
        "Maxim",
        "Tatyana",
        "Astrid",
        "Filiz",
        "Vicki",
        "Takumi",
        "Seoyeon",
        "Aditi"
    ];
    @ViewChild("audioPlayer") audioPlayer: ElementRef;
    @ViewChild("playedText") playedText: ElementRef;

    playing: boolean = false;


    selectCast(val) {
        this.selectedCast = val;
    }
    playPrevious() {
        if (this.sentPtr > 1) {
            this.sentPtr -= 2;
            this.playNext();
        }
    }
    stop() {
        this.sentPtr = 0;
        this.playing = false;
        this.audioPlayer.nativeElement.pause();
        this.audioUrl = "";
        this.audioPlayer.nativeElement.load();
    }

    playPause() {
        if (this.playing) {
            this.audioPlayer.nativeElement.pause();
            this.playing = false;
        } else {
            if (this.audioUrl == "") {
                this.playNext();
            } else {
                this.audioPlayer.nativeElement.play();
                this.playing = true;
            }
        }
    }
    populateText(value) {
        this.textContent = value.trim();
        this.sentPtr = 0;
        let re = new RegExp(/[\s\S]+?([.?!]|$)/g);

        this.textBroken = [];
        let match = re.exec(this.textContent);
        while (match) {
            this.textBroken.push(match[0]);
            match = re.exec(this.textContent);
        }
        this.playing = true;
        this.playNext();
    }

    playNext() {
        if (this.sentPtr < this.textBroken.length) {
            this.playing = true;
            this.textCurrent = this.textBroken[this.sentPtr];
            this.textBefore = this.textBroken.slice(0, this.sentPtr).join("");
            this.textAfter = this.textBroken.slice(this.sentPtr + 1).join("");
            this.speakText(this.textCurrent);
            this.sentPtr++;
        } else {
            this.playing = false;
        }
    }
    speakText(text) {
        // Create synthesizeSpeech params JSON
        let speechParams = {
            OutputFormat: "mp3",
            SampleRate: "16000",
            Text: "",
            TextType: "ssml",
            VoiceId: this.casts[this.selectedCast]
        };
        speechParams.Text = `<speak>${text}</speak>`;

        // Create the Polly service object and presigner object
        let polly = new AWS.Polly({apiVersion: '2016-06-10'});
        let signer = new AWS.Polly.Presigner(speechParams, polly);

        // Create presigned URL of synthesized speech file
        signer.getSynthesizeSpeechUrl(speechParams, (error, url) => {
            if (error) {
                console.log("error");
            } else {
                this.audioUrl = url;
                this.audioPlayer.nativeElement.load();
                this.audioPlayer.nativeElement.play();
                this.playedText.nativeElement.scrollIntoView();
            }
        });
    }

    constructor() {
    }

    ngOnInit() {
        AWS.config.region = 'us-west-2'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-west-2:275b7285-fb71-46bf-80f8-2c901b9d4bb9'
        });
        this.audioPlayer.nativeElement.onended = () => {
            this.playNext();
        }
    }

}
