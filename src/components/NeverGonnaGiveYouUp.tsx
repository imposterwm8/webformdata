import { onMount } from 'solid-js'

export default function NeverGonnaGiveYouUp() {
  onMount(() => {
    // Set the full retro theme
    document.body.classList.remove('dark-mode', 'light-mode', 'custom-mode', 'midnight-mode', 'sage-mode', 'retro-mode')
    document.body.classList.add('retro-mode')
  })

  return (
    <div class="rickroll-container">
      <div class="glitch-overlay"></div>
      <div class="scanlines"></div>

      <div class="crt-screen">
        <div class="retro-header">
          <h1 class="retro-title glitch" data-text="NEVER GONNA GIVE YOU UP">
            NEVER GONNA GIVE YOU UP
          </h1>
          <p class="retro-subtitle">You just got Rick Rolled! 🎤</p>
        </div>

        <div class="video-container">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&rel=0"
            title="Rick Astley - Never Gonna Give You Up"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="rickroll-video"
          ></iframe>
        </div>

        <div class="retro-controls">
          <button
            class="retro-button"
            onClick={() => window.history.back()}
          >
            📼 EJECT
          </button>
          <button
            class="retro-button"
            onClick={() => window.location.href = '/'}
          >
            🏠 HOME
          </button>
        </div>

        <div class="retro-message">
          <p></p>
          <p class="retro-small"></p>
        </div>
      </div>

      {/* 80s Background Elements */}
      <div class="retro-bg-elements">
        <div class="neon-grid"></div>
        <div class="floating-cassette cassette-1">📼</div>
        <div class="floating-cassette cassette-2">📼</div>
        <div class="floating-cassette cassette-3">📼</div>
        <div class="retro-shape triangle-1"></div>
        <div class="retro-shape triangle-2"></div>
        <div class="retro-shape circle-1"></div>
      </div>
    </div>
  )
}