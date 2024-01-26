import segments from '@/api/mock-data.json'

interface TextCollection {
  id: number
  texts: Array<Text>
}

export const api = {
  get: (url: string) => {
    console.log(
      `%cAPI %cGET%c: %c${url}`,
      'color: white; background: black; padding: 10px 0 10px 12px',
      'color: cyan; background: black; padding: 10px 0 10px 0',
      'color: white; background: black; padding: 10px 0 10px 0',
      'color: green; background: black; padding: 10px 12px 10px 0'
    )
    const [rubbish, method, source, target] = url.split('/')

    if (method == 'languages') {
      return { status: 200, data: segments.get_languages, message: '' }
    }

    if (method == 'translation-memories') {
      let result = JSON.parse(JSON.stringify(segments.get_segments.page))
      //Remove unnecesary languages (as should come from server)
      result.forEach(
        (page: { id: number; texts: Array<{ id: number; language: string; text: string }> }) =>
          (page.texts = page.texts.filter(
            (text) => source.startsWith(text.language) || target.startsWith(text.language)
          ))
      )

      //Remove those with less than 2 texts (source and target required)
      result = result.filter(
        (page: { id: number; texts: Array<{ id: number; language: string; text: string }> }) =>
          page.texts.length === 2
      )

      //Remove those with empty source text
      result = result.filter(
        (page: { id: number; texts: Array<{ id: number; language: string; text: string }> }) =>
          page.texts.find((text) => {
            return source.startsWith(text.language) && text.text
          })
      )
      if (result.length) {
        return { status: 200, data: result, message: '' }
      } else {
        return { status: 404, data: null, message: 'Language not found' }
      }
    }
  },
  put: (url: string, params: { texts: Array<{ id: number; updatedText: string }> }) => {
    console.log(
      `%cAPI %cPUT%c: %c${url}`,
      'color: white; background: black; padding: 10px 0 10px 12px',
      'color: yellow; background: black; padding: 10px 0 10px 0',
      'color: white; background: black; padding: 10px 0 10px 0',
      'color: green; background: black; padding: 10px 12px 10px 0'
    )
    const [rubbish, method] = url.split('/')

    if (method == 'translation-memories') {
      console.group()
      console.log('%cObject sent to the server:', 'color: gray; padding: 10px 12px 10px 12px')
      console.log(JSON.stringify(params, null, 2))
      console.groupEnd()
    }

    if (params.texts.some((text) => text.updatedText.length > 4000)) {
      return { status: 404, data: null, message: 'Character limit surpassed' }
    } else {
      return { status: 204, data: null, message: '' }
    }
  }
}
