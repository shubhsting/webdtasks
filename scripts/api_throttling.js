function set_load_screen() {
    $('#module1-panel').loadingModal({
        position: 'auto',
        text: 'Loading...',
        color: '#fff',
        opacity: '1.0',
        backgroundColor: 'rgb(255,0,0)',
        animation: 'wave'
    });
}

function destroy_load_screen() {
    $('#module1-panel').loadingModal('destroy');
}
