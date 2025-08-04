const NodeCache = require("node-cache");

// TTL padrão 1 hora (3600 segundos)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Tenta pegar o valor do cache pelo key.
 * Se não tiver, executa a função getter, guarda o resultado e retorna.
 * @param {string} key - chave do cache
 * @param {Function} getter - função async para obter o valor se cache vazio
 * @param {number} [ttl] - TTL em segundos para este valor (opcional)
 * @returns valor do cache ou resultado da função getter
 */
async function cacheGetOrSet(key, getter, ttl) {
  let value = cache.get(key);
  if (value === undefined) {
    value = await getter();
    cache.set(key, value, ttl);
  }
  return value;
}

module.exports = {
  cache,
  cacheGetOrSet,
};

