/**
 * Compute ${tag_name} tag
 * @param phone {string} user phone
 * @param {object} available data sources, should contain required sources
 * @return {Promise<boolean>} computed tag value, null if error
 */
async function computation(phone, {}) {
    /* implementation */
}

module.exports = {
    name: "${tag_name}",
    sources: [
        /* data source module names */
    ],
    computation: computation
}