/**
 * @param {Map<RegExp, Function>} routes
 */
export default function (routes) {
    function load(url){
        document.body.replaceChildren()
        for (let [key, value] of routes.entries()) {
            if(url.match(key)) {
                value(url.match(key));
                return;
            }
        }
        console.error(`Could not match ${url}`);
    }
    addEventListener("popstate", e => {
        e.preventDefault()
        load(e.state)
    });
    document.body.addEventListener("click", e => {
        const target = e.target.closest("a")
        const url = target?.href;
        if(target && url && e.button === 0 && target.origin === document.location.origin ) {
            history.pushState(url.pathname, undefined, url);
            load(target.pathname);
            e.preventDefault();
        }
    })
    history.replaceState(location.pathname, undefined, location.href);
    load(location.pathname)
}