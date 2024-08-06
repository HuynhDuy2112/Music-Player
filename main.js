const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const image = $('.cd-thumb')
const music = $('#audio')
const playList = $('.playlist')
const iconPause = $('.icon-pause')
const iconPlay = $('.icon-play')

let isActive = false


const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Đà Lạt Của Chúng Ta',
            singer: 'Vicky Nhung',
            music: './assets/music/dalatcuachungta.mp3',
            image: './assets/img/dalatcuachungta.jpg',
        },
        {
            name: 'Lấy Chồng Sớm Làm Gì',
            singer: 'HuyR, Tuấn Cry',
            music: './assets/music/laychongsomlamgi.mp3',
            image: './assets/img/laychongsomlamgi.jpg',
        },
        {
            name: 'Bạn Ơi',
            singer: 'Myra Trần',
            music: './assets/music/banoi.mp3',
            image: './assets/img/banoi.jpg',
        },
        {
            name: 'Bồng Bềnh Bồng Bềnh',
            singer: 'Nam Em',
            music: './assets/music/bongbenhbongbenh.mp3',
            image: './assets/img/bongbenhbongbenh.jpg',
        },
        {
            name: 'Có Lẽ Bên Nhau Là Sai',
            singer: 'Hana Cẩm Tiên',
            music: './assets/music/colebennhaulasai.mp3',
            image: './assets/img/colebennhaulasai.jpg',
        },
        {
            name: 'Ghé Qua',
            singer: 'Tufu',
            music: './assets/music/ghequa.mp3',
            image: './assets/img/ghequa.jpg',
        },
        {
            name: 'Lớn Rồi Còn Khóc Nhè',
            singer: 'Diệu Nhi, Lynk Lee, Hương Ly, Thái Trinh, Huyền Baby',
            music: './assets/music/lonroiconkhocnhe.mp3',
            image: './assets/img/lonroiconkhocnhe.jpg',
        },
        {
            name: 'Sau Này Của Chúng Ta',
            singer: 'Lê Hiếu',
            music: './assets/music/saunaycuachungta.mp3',
            image: './assets/img/saunaycuachungta.jpg',
        },
        {
            name: 'Vẽ Lại Bức Tranh',
            singer: 'Bùi Anh Tuấn',
            music: './assets/music/velaibuctranh.mp3',
            image: './assets/img/velaibuctranh.jpg',
        },
        {
            name: 'Xinh Tươi Việt Nam',
            singer: 'V-Music',
            music: './assets/music/xinhtuoivietnam.mp3',
            image: './assets/img/xinhtuoivietnam.jpg',
        },
        {
            name: 'Tình Yêu Cao Thượng',
            singer: 'Phạm Quỳnh Anh',
            music: './assets/music/tinhyeucaothuong.mp3',
            image: './assets/img/tinhyeucaothuong.jpg',
        },
        /* {
            name: 'Bạn Ơi',
            singer: 'Myra Trần',
            music: './assets/music/testaudio.mp3',
            image: './assets/img/banoi.jpg',
        }, */
    ],

    //render list song and select music in the list
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song" data-index="${index}">
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
        playList.innerHTML = htmls.join('') 

        //click song in playlist
        const songElements = $$('.song') 
        songElements.forEach((songElement) => {            
            songElement.addEventListener('click', () => {
                const index = songElement.dataset.index     
                this.currentIndex = index
                this.renderCurrentSong()
                music.play()                
            })
        });
    },

    //change width cd
    handleEvent: function() {   
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        document.onscroll = (() => {
            const scrollTop = window.scrollY            
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth + 'px'
            newCdWidth < 0 ? cd.style.display = 'none' : cd.style.display = 'block'
            cd.style.opacity = newCdWidth / cdWidth //làm cho hình mờ dần trong quá trình thu nhỏ lại

        })  
    },

    eventRepeatBtn: function() {
        const repeatBtn = $('.btn-repeat')
        const changeRepeatBtn = $('.btn-repeat i')

        repeatBtn.addEventListener('click', () => {
            music.loop == true ? 
            (music.loop = false, changeRepeatBtn.classList.remove('btn-active')) : 
            (music.loop = true, changeRepeatBtn.classList.add('btn-active')) //if else music.
        })
    },

    eventPlayPauseBtn: function() {
        const playBtn = $('.btn-toggle-play')
        var currentValuePlayBtn = 0

        music.addEventListener('play', () => {
            image.classList.add('cd-turn') 
            iconPause.style.display = 'block'
            iconPlay.style.display = 'none'
            currentValuePlayBtn = 1
        })

        playBtn.addEventListener('click', () => {
            if (currentValuePlayBtn == 0) {
                currentValuePlayBtn = 1
                music.play()
                iconPause.style.display = 'block'
                iconPlay.style.display = 'none'
                image.classList.add('cd-turn')
            }
            else {
                currentValuePlayBtn = 0
                music.pause()
                iconPause.style.display = 'none'
                iconPlay.style.display = 'block'
                image.classList.remove('cd-turn')
            }
        })
    },

    eventNextBackBtn: function() {
        const nextBtn = $('.btn-next')
        const backBtn = $('.btn-prev')

        nextBtn.addEventListener('click', () => {
            this.currentIndex++
            this.currentIndex >= this.songs.length && (this.currentIndex = 0)
            this.renderCurrentSong()
            music.play()
        })

        backBtn.addEventListener('click', () => {
            this.currentIndex--
            this.currentIndex < 0 && (this.currentIndex = this.songs.length - 1)
            this.renderCurrentSong()
            music.play()
        })
    },

    timeLineOfSong: function() {
        const timeLine = $('.progress')
        let timeCurrent = $('.time-current')
        let timeEnd = $('.time-end')
        
        //get length of current song with value is seconds
        //duration là trả về đồ dài của audio bằng giây
        music.addEventListener('loadedmetadata', () => {
            timeLine.max = Math.floor(music.duration)
            timeEnd.innerHTML = Math.floor(music.duration / 60) + ':' + 
            ('0' + Math.floor(music.duration % 60)).slice(-2)
        })
        
        //update the timeLine with current time of the song in real-time
        //currentTime là trả về số giây hiện tại mà audio đang phát
        music.addEventListener('timeupdate', () => {
            timeLine.value = Math.floor(music.currentTime)
            timeCurrent.innerHTML = Math.floor(music.currentTime / 60) + ':' + 
            ('0' + Math.floor(music.currentTime % 60)).slice(-2)
        })
        
        //change value of time line
        timeLine.addEventListener('input', () => {music.currentTime = timeLine.value})

        //xử lí sự kiện tua nhạc không bị nhiễu tiếng 
        timeLine.addEventListener('mousedown', () => {music.pause()})
        timeLine.addEventListener('mouseup', () => {music.play()})
    },

    eventMuteVolume: function() {
        const muteBtn = $('.mute-volumn')
        const mute = $('.fa-volume-xmark')
        const notMute = $('.fa-volume-high')
        let isMute = false

        muteBtn.addEventListener('click', () => {
            if (isMute === true) {
                music.volume = 0
                mute.classList.add('mute-active')
                notMute.classList.remove('mute-active')
            }
            else {
                music.mute = false
                mute.classList.remove('mute-active')
                notMute.classList.add('mute-active')
            }
        })
    },

    //create random value for the current index
    randomIndexSong: function() {
        let random = Math.floor(Math.random() * this.songs.length)
        random === this.currentIndex ? this.randomIndexSong() : this.currentIndex = random
    },

    eventRandomBtn: function() {
        const randomBtn = $('.btn-random')        
    
        randomBtn.addEventListener('click', () => {
            if (isActive === false) {
                isActive = true
                randomBtn.style.color = '#ec1f55'
            }
            else {
                isActive = false
                randomBtn.style.color = '#666'
            }
        })
    },

    autoNextSongAndRandomSong: function() {
        this.eventRandomBtn()
        music.addEventListener('ended', () => {
            if (isActive === false) {
                this.currentIndex++
                this.currentIndex == this.songs.length && (this.currentIndex = 0 )
                this.renderCurrentSong()
                music.play()
            }
            else {
                this.randomIndexSong()
                this.renderCurrentSong()
                music.play()
            }
        })
    }, 

    getCurrentSong: function() {
        return this.songs[this.currentIndex]
    },

    eventSelectCurrentSong: function() {
        this.render()
        const songElements = $$('.song') 
        music.addEventListener('play', () => {
            songElements[this.currentIndex].style.backgroundColor = ' red'
        })
    },

    renderCurrentSong: function() {
        const song = this.getCurrentSong()
        heading.textContent = song.name
        image.style.backgroundImage = `url('${song.image}')`
        music.src = song.music 
    },

    start: function() {
        this.renderCurrentSong()
        this.eventRepeatBtn()  
        this.eventPlayPauseBtn()
        this.eventNextBackBtn()
        this.timeLineOfSong()
        this.autoNextSongAndRandomSong()
        this.handleEvent()
        this.eventMuteVolume()
        this.eventSelectCurrentSong()
        this.render()
    }
}

app.start()