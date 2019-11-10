export default function extend (consumer, ...providers) {
  let key
  let i
  let provider

  for (i = 0; i < providers.length; ++i) {
    provider = providers[i]

    for (key in provider) {
      if (provider.hasOwnProperty(key)) {
        consumer[key] = provider[key]
      }
    }
  }

  return consumer
}
