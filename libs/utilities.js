const getArrayDepth = (value) => (Array.isArray(value) ? 1 + Math.max(0, ...value.map(getArrayDepth)) : 0);

module.exports = { getArrayDepth };
