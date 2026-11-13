const refreshRateMilliSecond = 50
const rateChangeStep = 0.1
let playbackRate = 1.3

// キーリスナーの重複登録を防ぐフラグ
let shortcutRegistered = false

// 速度表示オーバーレイ
let speedDisplay = null

const createSpeedDisplay = () => {
    const el = document.createElement('div')
    el.style.cssText = `
        position: fixed;
        top: 8px;
        left: 8px;
        z-index: 2147483647;
        padding: 2px 7px;
        background: black;
        color: white;
        font-size: 12px;
        font-family: monospace;
        border-radius: 5px;
        opacity: 0.6;
        pointer-events: none;
        line-height: 1.6;
    `
    document.body.appendChild(el)
    return el
}

// インターバルごとにDOMを参照し直す（video要素の差し替えに対応）
const applyVideoSpeed = () => {
    document.querySelectorAll('video').forEach((video) => {
        video.playbackRate = playbackRate
    })
    if (speedDisplay) {
        speedDisplay.textContent = `${playbackRate.toFixed(1)}x`
    }
}

const registerShortcutKeys = () => {
    if (shortcutRegistered) return
    shortcutRegistered = true

    let prevRate
    window.addEventListener('keydown', (e) => {
        if (e.key === 'w') {
            playbackRate = _round2(Math.max(0.1, playbackRate - rateChangeStep))
        } else if (e.key === 'e') {
            playbackRate = _round2(Math.min(16, playbackRate + rateChangeStep))
        } else if (e.key === 'r') {
            if (playbackRate !== 1) {
                prevRate = _round2(playbackRate)
                playbackRate = 1
            } else {
                playbackRate = _round2(prevRate)
            }
        }
    }, true)
}

const _round2 = (number) => {
    return Math.round(number * 10) / 10
}

// video要素が出現してから起動する。タイムアウト固定では間に合わないことがあるため。
const init = () => {
    const start = () => {
        speedDisplay = createSpeedDisplay()
        setInterval(applyVideoSpeed, refreshRateMilliSecond)
        registerShortcutKeys()
    }

    if (document.querySelectorAll('video').length > 0) {
        start()
        return
    }

    const observer = new MutationObserver(() => {
        if (document.querySelectorAll('video').length > 0) {
            observer.disconnect()
            start()
        }
    })

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
    })
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
