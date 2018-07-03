// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});

function componentDidMount() {
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));
  }

function componentWillUnmount() {
    window.removeEventListener('online');
    window.removeEventListener('offline');
  }

var setOnlineStatus = isOnline => this.setState({ online: isOnline })