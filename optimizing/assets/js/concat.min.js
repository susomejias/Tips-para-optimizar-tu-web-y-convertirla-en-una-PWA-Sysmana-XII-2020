{

    let init = function() {
        serviceWorkerRegister() // registramos serviceWorker
        AOS.init(); // inicializamos AOS
        progressively.init(); // inicializamos progressively
        quicklink.listen({ priority: true }); // inicializamos quicklink
    }

    let serviceWorkerRegister = function() {
        // Nos aseguramos que el navegador soporta la api 'serviceWorker'
        if ('serviceWorker' in navigator) {
            // Registramos el service worker
            navigator.serviceWorker.register('serviceWorker.js');
        }
    }

    // ejecutamos función init al terminar la carga del DOM
    window.addEventListener('load', init)
}