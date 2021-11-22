const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0
    ,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        { 
            name: 'Đi về nhà',
            singer: 'JustaTee x Đen',
            path: './asset/music/Divenha.mp3',
            image: './asset/image/2.jpg'
        },
        { 
            name: 'Làm gì phải hốt',
            singer: 'JustaTee x Hoàng Thùy Linh x Đen',
            path: './asset/music/Lamgiphaihot.mp3',
            image: './asset/image/1.jpg'
        },
        { 
            name: ' Xuân Xuân - Hạ Hạ - Thu Thu - Đông Đông - Rồi Sẽ Lại Xuân',
            singer: 'Hà Anh Tuấn',
            path: './asset/music/Masup.mp3',
            image: './asset/image/3.jpg'
        },
        { 
            name: 'Đi để trờ về',
            singer: 'Sobin Hoàng Sơn',
            path: './asset/music/Didetrove1.mp3',
            image: './asset/image/4.jpg'
        },
        { 
            name: ' Đi để trờ về 2',
            singer: 'Sobin Hoàng Sơn',
            path: './asset/music/Didetrove2.mp3',
            image: './asset/image/5.jpg'
        },
        { 
            name: ' Tết là gia đình',
            singer: 'Đinh Mạnh Ninh',
            path: './asset/music/Tetlagiadinh.mp3',
            image: './asset/image/6.jpg'
        },
        { 
            name: ' Happy New Year 2022',
            singer: 'ABBA',
            path: './asset/music/HappyNewYear.mp3.webm',
            image: './asset/image/7.jpg'
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth  = cd.offsetWidth;
        
        // Xử lý CD quay/ dừng

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        // Xử lý phóng to và thu nhỏ
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý nút Play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Bấm Play khi đang dừng
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        // Bấm pause khi đang chạy
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // Xử lý khi bấm next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
                audio.play()
            } else {
                _this.nextSong()
                audio.play()
            }
            _this.activeSong()
            _this.scrollToActiveSong()
        }
        // Xử lý khi bấm prev
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
                audio.play()
            } else {
                _this.prevSong()
                audio.play()
            }
            _this.activeSong()
            _this.scrollToActiveSong()
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lý lặp lại song
        repeatBtn.onclick =function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
                audio.play()
            } else if(_this.isRepeat) {
                audio.play()
            } else {
                _this.nextSong()
                audio.play()
            }
            _this.activeSong()
            _this.scrollToActiveSong()
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const songOptions = e.target.closest('.option')
            if(songNode || songOptions) {
                if(songNode) {
                    _this.currentIndex = songNode.dataset.index
                    _this.loadCurrentSong()
                    audio.play()
                    _this.activeSong()
                }
            }
        }
    },
    scrollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        })
    },
    activeSong: function(){
        var loopSongs = $$('.song');
        for (song of loopSongs){
                song.classList.remove('active')
        }
        const activeSong = loopSongs[this.currentIndex]
        activeSong.classList.add('active')
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
    
}
app.start()