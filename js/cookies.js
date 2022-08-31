// https://stackoverflow.com/a/64472572
export default new Map(document.cookie.split('; ').map(v=>v.split(/=(.*)/s).map(decodeURIComponent)));