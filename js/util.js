// the good ole "util" module, a trashcan for everything!

module.exports.lerp = function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
