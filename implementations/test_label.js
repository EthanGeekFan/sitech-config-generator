/**
 * Compute ${label_name} label
 * @param {object} available data sources, should contain required sources
 * @return {Promise<boolean>} computed label value, null if error
 */
async function computation({ user, mod }) {
    /* implementation */
}

module.exports = {
    sources: [
        /* data source module names */
        'user',
        'mod',
    ],
    computation: computation
}