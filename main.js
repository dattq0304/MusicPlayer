const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')  
const prevBtn = $('.btn-prev') 
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const currentSongName = $('.header__song-name')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            "name": "Nevada",
            "singer": "Monstercat",
            "path": "./assets/music/Nevada.mp3",
            "image": "./assets/img/Nevada.jpg"
        },
        {
            "name": "Unstoppable",
            "singer": "Sia",
            "path": "./assets/music/Unstoppable.mp3",
            "image": "./assets/img/Unstoppable.jpg"
        },
        {
            "name": "Waiting For Love",   
            "singer": "Avicii",
            "path": "./assets/music/WaitingForLove.mp3",
            "image": "./assets/img/WaitingForLove.jpg"
        },
        {
            "name": "So Far Away",   
            "singer": "Martin Garrix",
            "path": "./assets/music/SoFarAway.mp3",
            "image": "./assets/img/SoFarAway.jpg"
        },
        {
            "name": "Hero",   
            "singer": "Cash Cash",
            "path": "./assets/music/Hero.mp3",
            "image": "./assets/img/Hero.jpg"
        },
        {
            "name": "Hall Of Fame",   
            "singer": "The Script",
            "path": "./assets/music/HallOfFame.mp3",
            "image": "./assets/img/HallOfFame.jpg"
        },
        {
            "name": "Bad Liar",   
            "singer": "Imagine Dragons",
            "path": "./assets/music/BadLiar.mp3",
            "image": "./assets/img/BadLiar.jpg"
        },
        {
            "name": "Demons",   
            "singer": "Imagine Dragons",
            "path": "./assets/music/Demons.mp3",
            "image": "./assets/img/Demons.jpg"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index == this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        });
        playlist.innerHTML = htmls.join("")
    },
    hadlerEvents: function() {
        const cdWidth = cd.offsetWidth
        const _this = this

        //Xu ly CD quay/ dung
        const cdThumbAnimate = cdThumb.animate(
            [{  transform: "rotate(360deg)"}],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause()

        //Xu ly phong to/ thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop  
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        //Xu ly khi click play/ pause
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        //Xu ly khi bai hat duoc chay
        audio.onplay = function() { 
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()  
        }  

        //Xu ly khi bai hat bi dung
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }  
        
        //Khi tua bai hat
        audio.ontimeupdate = function() {
            if(audio.duration) {
                audio.ontimeupdate = function() {
                    const progressPercent = Math.floor(
                        (audio.currentTime / audio.duration) * 100
                    )
                    progress.value = progressPercent
                }
            }
        } 

        //Tua bai hat
        progress.onchange = function(e) {
            const seekTime = (e.target.value/100) * audio.duration
            audio.currentTime = seekTime  
        }

        //Next bai hat
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else if(_this.isRepeat) {
                _this.replayThisSong()
            }
            else {
                _this.playNextSong()
            }
            audio.play()
        }

        //Prev bai hat
        prevBtn.onclick = function() { 
            if(_this.isRandom) {
                _this.playRandomSong() 
            }
            else if(_this.isRepeat) {
                _this.replayThisSong()
            }
            else {
                _this.playPreviousSong()
            }
            audio.play()
        }

        //Bat/ tat random bai hat 
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            if(_this.isRandom && _this.isRepeat) {
                _this.isRepeat = false
                repeatBtn.classList.remove("active")
                randomBtn.classList.add("active")
            }
            else {
                randomBtn.classList.toggle("active")    
            }
        }

        //Bat/ tat repeat bai hat 
        repeatBtn.onclick = function() {
            _this.isRepeat =!_this.isRepeat
            if(_this.isRandom && _this.isRepeat) {
                _this.isRandom = false
                randomBtn.classList.remove("active")
                repeatBtn.classList.add("active")
            }
            else {
                repeatBtn.classList.toggle("active")    
            }
        }

        //Xu ly khi bai hat ket thuc
        audio.onended = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else if(_this.isRepeat) {
                _this.replayThisSong()
            }
            else {
                _this.playNextSong()
            }
            audio.play()
        }

        //Xu ly khi click vao bai hat trong playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }

    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function()  {
        currentSongName.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.scrollToActiveSong()
        this.render()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    replayThisSong: function() {
        progress.value = 0
        audio.currentTime = 0
    },
    playNextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playPreviousSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) { 
            this.currentIndex = this.songs.length - 1 
        } 
        this.loadCurrentSong()
    },    
    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }, 300)
    },
    start: function() {
        this.defineProperties()

        this.hadlerEvents()

        this.loadCurrentSong()

        this.render()
    }
}
app.start()






