/**
 * Resizes textareas on content changed. No scrolling needed
 * (I hate scrollbars inside a scrollable screen)
 */

interface ExtendedHTMLElement extends HTMLElement {
  additionalData: {
    timeout: ReturnType<typeof setTimeout> | null
  }
}

export const autoTextarea = {
  mounted: (el: ExtendedHTMLElement) => {
    //Resizes text areas on the beginning (the dawn of time...)
    resize(el)
    //Resizes textareas when input
    el.oninput = () => {
      resize(el)
    }
  }
}

const resize = (el: ExtendedHTMLElement) => {
  el.style.height = '18px'
  el.style.height = el.scrollHeight + 4 + 'px'
}
