
module.exports = function clone(obj, deep = false) {
    const returnObj = {};

    Object.keys(obj).forEach((key) => {
        returnObj[key] = deep && typeof key === 'object'
            ? clone(obj[key])
            : obj[key];
    });

    return returnObj;
};
