/**
 * 各種設定値
 */
const refreshRateMilliSecond = 50
const rateChangeStep = 0.1
let playbackRate = 1.3 // デフォルト値としても作用する

/**
 * 再生速度コントローラーのHTML
 * @type {string}
 */
const controllerHtml = `
    <div class="nvsc-controller" style="top:0px; left:0px; position:relative; opacity:0.6; font-size:10px; z-index:10; color:white;">
        <span class="nvsc-current-rate">${playbackRate}</span>
    </div>
`

/**
 * コントローラーを表示
 */
const displayControl = (videos) => {
    videos.forEach((video) => {
        // これやると画面が真っ暗になる
        // video.insertAdjacentHTML('beforebegin', controllerHtml);
        // これやるとマウスコントロール効かなくなる
        // video.insertAdjacentHTML('afterend', controllerHtml);
    })

    const speedMeters = document.querySelectorAll('.nvsc-current-rate')
    setInterval(() => {
        speedMeters.forEach((meter) => {
            meter.innerText = _numberFormat(playbackRate)
        })
    }, 50)
}

/**
 * 全てのVideoに速度変更を適用
 */
const applyVideoSpeed = (videos) => {
    setInterval(() => {
        videos.forEach((video) => {
            video.playbackRate = playbackRate
        })
    }, refreshRateMilliSecond)
}

/**
 * ショートカットキーのイベント登録
 */
const registerShortcutKeys = () => {
    let prevRate
    window.addEventListener('keydown', (e) => {
        if (e.key === 's') {
            playbackRate = _round2(Math.max(0.1, playbackRate - rateChangeStep))
            // e.preventDefault()
        } else if (e.key === 'd') {
            playbackRate = _round2(Math.min(16, playbackRate + rateChangeStep))
            // e.preventDefault()
        } else if (e.key === 'r') {
            if (playbackRate !== 1) {
                prevRate = _round2(playbackRate)
                playbackRate = 1
            } else {
                playbackRate = _round2(prevRate)
            }

            // ctrl+r のリロードのみ貫通させる
            // if (!e.ctrlKey) {
            //     e.preventDefault()
            // }
        }
    }, true)
}

/**
 * 0.1単位で丸める
 * @param number
 * @returns {number}
 * @private
 */
const _round2 = (number) => {
    return Math.round(number * 10) / 10
}

/**
 * 0.1刻みの数値フォーマット
 * @param number
 * @returns {`${string}.0`|string}
 * @private
 */
const _numberFormat = (number) => {
    if (number % 1 === 0) {
        return `${number}.0`
    } else {
        return `${number}`
    }
}

/**
 * なんとなくロード後に発火させる
 */
const fireWhenLoad = () => {
    const videos = document.querySelectorAll('video')
    displayControl(videos)
    applyVideoSpeed(videos)
}
setTimeout(fireWhenLoad, 2000)
registerShortcutKeys()
