const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const songName = $('header h2')
const singerName = $('#singer')
const image = $('.cd-thumb')
const music = $('#audio')
const playList = $('.playlist')
const iconPause = $('.icon-pause')
const iconPlay = $('.icon-play')
const slider = $('.progress')

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
                .catch((err) => err && alert('Load trang bị lỗi!'))
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
                    <div class="like">
                        <i class="fa-regular fa-heart"></i>
                        <i class="fa-solid fa-heart btn-mute-active"></i>
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

        /* const likeSongs = $$('.like')
        const likeSongElements = $$('.like i')

        likeSongs.forEach((likeSong) => {
            likeSong.addEventListener('click', () => {
                console.log(likeSongElements)
            })
        }) */
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
            music.loop == true 
            ?(music.loop = false, changeRepeatBtn.classList.remove('btn-active')) 
            :(music.loop = true, changeRepeatBtn.classList.add('btn-active'))
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

    timeOfSong: function() {
        let timeCurrent = $('.time-current')
        let timeEnd = $('.time-end')
        
        //get length of current song with value is seconds
        //duration là trả về đồ dài của audio bằng giây
        music.addEventListener('loadedmetadata', () => {
            slider.max = Math.floor(music.duration)
            timeEnd.innerHTML = Math.floor(music.duration / 60) + ':' + 
            ('0' + Math.floor(music.duration % 60)).slice(-2)
        })
        
        //update the slider with current time of the song in real-time
        //currentTime là trả về số giây hiện tại mà audio đang phát
        music.addEventListener('timeupdate', () => {
            slider.value = Math.floor(music.currentTime)
            timeCurrent.innerHTML = Math.floor(music.currentTime / 60) + ':' + 
            ('0' + Math.floor(music.currentTime % 60)).slice(-2)
        })
    },

    eventMuteVolume: function() {
        const muteBtn = $('.mute-volumn')
        const notVolumn = $('.fa-volume-xmark')
        const hightVolumn = $('.fa-volume-high')
        const lowVolumn = $('.fa-volume-low')

        muteBtn.addEventListener('click', () => {
            if (music.muted == false) {
                if(music.volume === 1) {                    
                    music.volume = 0.4 
                    lowVolumn.classList.remove('btn-mute-active') 
                    hightVolumn.classList.add('btn-mute-active')
                }
                else
                {
                    music.muted = true
                    lowVolumn.classList.add('btn-mute-active'),
                    notVolumn.classList.remove('btn-mute-active')
                }
            }
            else {
                music.muted = false
                music.volume = 1
                hightVolumn.classList.remove('btn-mute-active')
                notVolumn.classList.add('btn-mute-active')
                lowVolumn.classList.add('btn-mute-active')
            }
        })

    },

    handleSlider: function() {
        const interval = null

        music.addEventListener('play', () => {
            this.interval = setInterval(() => {                    
                const value = (slider.value - slider.min) / (slider.max - slider.min) * 100
                slider .style.background = `\linear-gradient(to right, #ff7e5f ${value}%, #ccc ${value}%)`
            }, 500)
        })

        music.addEventListener('pause', () => {
            clearInterval(this.interval)
        })

        //change value of time line
        slider.addEventListener('input', () => {music.currentTime = slider.value})

        //xử lí sự kiện tua nhạc không bị nhiễu tiếng 
        slider.addEventListener('mousedown', () => {music.pause()})
        slider.addEventListener('mouseup', () => {music.play()})
    },

    //create random value for the current index
    randomIndexSong: function() {
        let random = Math.floor(Math.random() * this.songs.length)
        random === this.currentIndex ? this.randomIndexSong() : this.currentIndex = random
    },

    eventRandomBtn: function() {
        const randomBtn = $('.btn-random')        
    
        randomBtn.addEventListener('click', () => {
            isActive === false 
            ? (isActive = true, randomBtn.style.color = 'var(--primary-color)')
            : (isActive = false, randomBtn.style.color = '#666')
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
            songName.textContent = song?.name
            singerName.textContent = song?.singer
            image.style.backgroundImage = `url('${song?.image}')`
            music.src = song?.music 
        }
    },

    start: function() {
        this.getAPI(this.render.bind(this))
    },
    
    restart: function() {
        this.render(0)
        this.renderCurrentSong()
        this.eventRepeatBtn()  
        this.eventPlayPauseBtn()
        this.eventNextBackBtn()
        this.timeOfSong()
        this.autoNextSongAndRandomSong()
        this.handleEvent()
        this.eventMuteVolume()
        this.handleSlider()
        // this.handleListSong()
        // this.eventSelectCurrentSong()
    },
    
}

app.start()
