const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE = 'HOANG_TRUNG'

const playlist = $('.playlist')
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdImg = $('.cd-thumb')
const audio = $('audio')
const btnPlay = $('.btn-toggle-play')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const currentTime = $('.currentTime')
const durationTime = $('.durationTime')
const muteBtn = $('.muteBtn')
const btnVolume = $('.volume')
const volumeValue = $('.volumesider p')
var change

const app = {
    currentIndex: 0,
    currentVolume: 50,
    isMute: false,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Suýt nữa thì",
            singer: "Andienz",
            path: "./assets/Audio/SuytNuaThiChuyenDiCuaThanhXuanOST-Andiez-5524811.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2018/07/19/6/0/9/e/1532010326915.jpg"
        },
        {
            name: "Bước qua mùa cô đơn",
            singer: "Vũ.",
            path: "./assets/Audio/BuocQuaMuaCoDon-Vu-6879419.mp3",
            image: "./assets/img/Buoc-qua-mua-co-don.jpg"
        },
        {
            name: "Dark side",
            singer: "Alan Walker",
            path: './assets/Audio/1.alan_walker_darkside.mp3',
            image: './assets/img/1.DarkSide.jpg'
        },
        {
            name: "LiLy",
            singer: "Alan Walker",
            path: './assets/Audio/2.alan_walker_lily.mp3',
            image: './assets/img/2.lily.jpg'
        },
        {
            name: "Kings and Queens",
            singer: "Ava Max",
            path: './assets/Audio/3.ava_max_kings_queens.mp3',
            image: './assets/img/3.kingQueen.jpg'
        },
        {
            name: "Baby",
            singer: "Clean Bandit",
            path: './assets/Audio/4.clean_bandit_baby.mp3',
            image: './assets/img/4.baby.jpg'
        },
        {
            name: "Rockabye",
            singer: "Clean Bandit",
            path: './assets/Audio/5.clean_bandit_rockabyemp3.mp3',
            image: './assets/img/5.rockabye.jpg'
        },
        {
            name: "Solo",
            singer: "Clean Bandit",
            path: './assets/Audio/6.clean_bandit_solo.mp3',
            image: './assets/img/6.solo.jpg'
        },
        {
            name: "Symphony",
            singer: "Clean Bandit",
            path: './assets/Audio/7.clean_bandit_symphony.mp3',
            image: './assets/img/7.symphony.jpg'
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: './assets/Audio/8.maroon_5_sugar.mp3',
            image: './assets/img/8.sugar.jpg'
        },
        {
            name: "All My Worst",
            singer: "Pink Sweat",
            path: './assets/Audio/9.pink_sweat_at_my_worst.mp3',
            image: './assets/img/9.allMyWorst.jpg'
        },
        {
            name: "Littlest Things",
            singer: "Lily Allen",
            path: './assets/Audio/10.Littlest_Things-Lily_Allen\ \(mp3cut.net\).mp3',
            image: './assets/img/10.Lily_Allen-Littlest_Things.jpg'
        },
    ],
    render: function () {
        html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
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
        })
        playlist.innerHTML = html.join('\n')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {

                return this.songs[this.currentIndex]
            }
        })
    },
    // currentSong: function () {
    //   return this.songs[this.currentIndex]
    // },
    handleEvents: function () {

        const cdWidth = cd.offsetWidth

        // Xử lý phóng to thu nhỏ CD 
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0 + 'px'
            cd.style.opacity = newWidth / cdWidth
        }

        // Xử lý quay CD 
        const cdAnimation = cdImg.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()

        // Xử lý khi click play
        btnPlay.onclick = function () {
            if (!app.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }

        // Xử lý khi ấn nút mute
        muteBtn.onclick = function () {
            if (!app.isMute) {
                audio.muted = true
                app.isMute = true
                muteBtn.classList.toggle('active', !app.isMute)
            }
            else {
                audio.muted = false
                app.isMute = false
                muteBtn.classList.toggle('active', !app.isMute)
            }
            app.setConfig('isMute', app.isMute)
        }

        // Xử lý khi đc playing
        audio.onplay = () => {
            app.isPlaying = true
            player.classList.add('playing')
            cdAnimation.play()
        }

        // Xử lý khi play và time chạy
        audio.ontimeupdate = () => {
            if (audio.duration) {
                if (!change) {
                    progress.value = Math.floor(audio.currentTime / audio.duration * 100)
                    currentTime.textContent = app.seekTime(audio.currentTime)
                }
                durationTime.textContent = app.seekTime(audio.duration)
            }
        }

        // Xử lý khi bị pause
        audio.onpause = () => {
            app.isPlaying = false
            player.classList.remove('playing')
            cdAnimation.pause()
        }

        // Xử lý khi ấn nút next bài hát
        btnNext.onclick = function () {
            if (app.isRepeat) {
                audio.load()
            }
            else if (!app.isRandom) {
                app.nextSong()
            }
            else { app.RandomSong() }
            audio.play()
            app.scrollToActiveSong()
        }

        // Xử lý khi ấn nút prev bài hát
        btnPrev.onclick = function () {
            app.prevSong()
            audio.play()
            app.scrollToActiveSong()
        }

        // Xử lý khi ấn nút random bài hát
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            btnRandom.classList.toggle('active', app.isRandom)
        }

        // Xử lý khi ấn nút repeat bài hát
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            btnRepeat.classList.toggle('active', app.isRepeat)
        }

        //Xử lý tua bài hát 
        progress.onchange = function (e) {
            change = false
            const seek = Math.floor(e.target.value * audio.duration / 100)
            audio.currentTime = seek
        }
        progress.oninput = function (e) {
            change = true
            const seek = Math.floor(e.target.value * audio.duration / 100)
            currentTime.textContent = app.seekTime(seek)
        }

        // Xử lý khi thay đổi âm lượng
        btnVolume.oninput = function (e) {
            const volume = e.target.value / 100
            audio.volume = volume
            volumeValue.textContent = e.target.value
        }
        audio.onvolumechange = function() {
            app.setConfig('currentVolume',Math.floor(audio.volume*100))
        }

        // Xử lý next khi hết bài
        audio.onended = () => {
            if (app.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        // Lắng nghe khi ấn click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')

            // Xử lý khi click vào song hoặc option
            if (songNode || optionNode) {
                // KHi click vào song
                if (songNode) {
                    app.currentIndex = Number(songNode.getAttribute('data-index'))
                    app.loadCurrentSong()
                    audio.play()
                }

                // Khi click vào option
                else if (optionNode) {

                }
            }
        }
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    loadConfig: function () {
        if (this.config.isRandom === undefined) {
            this.config.isRandom = app.isRandom
        }
        if (this.config.isRepeat === undefined) {
            this.config.isRepeat = app.isRepeat
        }
        if (this.config.isMute === undefined) {
            this.config.isMute = app.isMute
        }
        if (this.config.currentVolume === undefined) {
            this.config.currentVolume = app.currentVolume
        }
        this.currentVolume = this.config.currentVolume
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.isMute = this.config.isMute

        // Hiển thị cài đặt nút
        btnRandom.classList.toggle('active', app.isRandom)
        btnRepeat.classList.toggle('active', app.isRepeat)
        muteBtn.classList.toggle('active', !app.isMute)
    },
    scrollToActiveSong: function () {
        let style = ''
        switch (app.currentIndex) {
            case 0:
            case 1:
                style = 'end'
                break
            default:
                style = 'center'
                break
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: style,
            })
        }, 500)
    },
    // Hàm chuyển đổi time
    seekTime: function (time) {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time) - min * 60;
        const mins = min < 10 ? `0${min}` : min;
        const secs = sec < 10 ? `0${sec}` : sec;
        return [`${mins}:${secs}`];
    },
    RandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdImg.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
        if (this.isMute) {
            audio.muted = true
        }

        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        const list = $$('.song:not(.active)');
        list.forEach((song) => {
            if (song.getAttribute('data-index') == this.currentIndex) {
                song.classList.add('active')
            }
        })
        this.scrollToActiveSong()
    },
    start: function () {
        // Định nghĩa thuộc tính cho object
        this.defineProperties()

        // Load cài đặt cấu hình
        this.loadConfig()

        // Lắng nghe / Xử lý các sự kiện DOM event
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên khi chạy
        this.loadCurrentSong()

        // Render cho playlist
        this.render()

        btnVolume.value = app.currentVolume
        audio.volume = btnVolume.value / 100
        volumeValue.textContent = btnVolume.value
    }
}

app.start()
