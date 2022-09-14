const CACHE_NAME = "static_cache"
const STATIC_ASSETS = [
    '/index.html',
    '/assets/index.js',
    'assets/scss/main.css'
]

async function preCached(){
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(STATIC_ASSETS)
}

self.addEventListener("install" , event => {
    console.log("[sw] istalled")
    event.waitUntil(preCached())
})

self.addEventListener("activate" , event => {
    console.log("[sw] activated")
})

async function fetchAssets(event){
    try{
        const response = await fetch(event.request)
        return response
    }
    catch(error){
        const cache = await caches.open(CACHE_NAME)
        return cache.match(event.request)
    }
}

self.addEventListener("fetch" , event => {  
    console.log("[sw] fetched")
    event.respondWith(fetchAssets)
})