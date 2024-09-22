/**@type {boolean} */
let isPlaying = false;

const init = async()=>{
    const response = await fetch(
        'scripts/extensions/third-party/SillyTavern-Mistake/mistake.m4a',
        {
            headers: { responseType: 'arraybuffer' },
        },
    );
    if (!response.ok) {
        console.error('[MISTAKE]', `${response.status} - ${response.statusText}`);
    }
    const con = new AudioContext();
    const buffer = await con.decodeAudioData(await response.arrayBuffer());
    const volume = con.createGain();
    volume.gain.value = 0.5;
    volume.connect(con.destination);
    const originalError = toastr.error;
    toastr.error = function(...args) {
        if (!isPlaying && args[0] && ((typeof args[0] == 'string' && args[0].length > 0) || args[0] instanceof jQuery)) {
            isPlaying = true;
            const src = con.createBufferSource();
            src.buffer = buffer;
            src.connect(volume);
            src.addEventListener('ended', ()=>{
                src.stop();
                isPlaying = false;
            });
            src.start();
        }
        return originalError.bind(this)(...args);
    };
};
init();
