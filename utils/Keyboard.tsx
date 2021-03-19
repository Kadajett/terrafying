interface IKeyboard {
    LEFT: string,
    RIGHT: string,
    UP: string,
    DOWN: string,
    _keys: {},
    listenForEvents: (keys: string[]) => void,
    _onKeyDown: (event: KeyboardEvent) => void,
    _onKeyUp: (event: KeyboardEvent) => void,
    isDown: (keyCode: string) => boolean,
}

// I don't know what this looks like. I am gonna have to test it to make sure.

let Keyboard: IKeyboard = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    _keys: {},
    listenForEvents: (keys) => {
        window.addEventListener('keydown', Keyboard._onKeyDown);
        window.addEventListener('keyup', Keyboard._onKeyUp);

        keys.forEach(function (key: string) {
            Keyboard._keys[key] = false;
        });
    },
    _onKeyDown: (event) => {
        let keyCode = event.code;
        if (keyCode in Keyboard._keys) {
            event.preventDefault();
            Keyboard._keys[keyCode] = true;
        }
    },
    _onKeyUp: (event) => {
        var keyCode = event.code;
        if (keyCode in Keyboard._keys) {
            event.preventDefault();
            Keyboard._keys[keyCode] = false;
        }
    },
    isDown: (keyCode: string) => {
        if (!(keyCode in Keyboard._keys)) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return Keyboard._keys[keyCode];
    }
};

export default Keyboard;