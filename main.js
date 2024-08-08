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
    songs: [],
    currentIndex: 0,

    //call API function
    getAPI: function(renderSong) {
        var getAPI = 'http://localhost:3000/songsAPI'

            fetch(getAPI)
                .then((response) => response.json())
                .then((data) => {
                        renderSong.call(this, data)
                        this.songs = data
                        this.restart()
                }) 
                .catch((err) => err && console.log(err))
    },

    //render list song and select music in the list
    render: function(songs) {

        if (!songs || songs.length === 0) {return}   

        const htmls = songs?.map((song, index) => {
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
        playList.innerHTML = htmls?.join('') 

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

    /* eventSelectCurrentSong: function() {
        this.render()
        const songElements = $$('.song') 
        music.addEventListener('play', () => {
            const currentSongElement = songElements[this.currentIndex]
            if (currentSongElement) {
                songElements.style.backgroundColor = 'red'
            }
        })
    }, */

    renderCurrentSong: function() {
        const song = this.getCurrentSong()
        if (song) {
            heading.textContent = song?.name
            image.style.backgroundImage = `url('${song?.image}')`
            music.src = song?.music 
        }
    },

    start: function() {
        this.getAPI(this.render.bind(this))
    },
    
    restart: function() {
        this.renderCurrentSong()
        this.eventRepeatBtn()  
        this.eventPlayPauseBtn()
        this.eventNextBackBtn()
        this.timeLineOfSong()
        this.autoNextSongAndRandomSong()
        this.handleEvent()
        this.eventMuteVolume()
        // this.eventSelectCurrentSong()
    },
    
}

app.start()
