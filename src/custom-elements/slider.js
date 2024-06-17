class Slider extends HTMLElement {
  controller = new AbortController()
  slide = this
  edge = 'start'
  timer


  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    const styles = getComputedStyle(this)

    const gap = styles?.getPropertyValue('--gap') ?? '0px'
    const column = styles?.getPropertyValue('--column') ?? '100%'
    const inline = styles?.getPropertyValue('--inline')
    const block = styles?.getPropertyValue('--block')

    template.innerHTML = `
      <style>
        @layer component {
          :host {
            display: grid;
            > * {
              grid-area: 1 / -1;
            }
            .slider {
              display: grid;
              grid-auto-flow: column;
              grid-auto-columns: ${column};
              gap: ${gap};
              scroll-behavior: smooth;
              overflow-x: scroll;
              scroll-snap-type: x mandatory;
              -ms-overflow-style: none;
              scrollbar-width: none;
              &::-webkit-scrollbar {
                display: none;
              }
            }
            .slider > ::slotted([slot="slide"]) {
              aspect-ratio: ${inline} / ${block};
              scroll-snap-align: start;
            }
            > .button {
              background: transparent;
              border: none;
              margin: 0;
              padding: 0;
              block-size: 24px;
              aspect-ratio: 1 / 1;
              place-self: center;
              cursor: pointer;
              touch-action: manipulation;
              mix-blend-mode: difference;
              &.prev {
                justify-self: start;
                transform: rotate(.25turn);
                translate: 6px 0;
              }
              &.next {
                justify-self: end;
                transform: rotate(-.25turn);
                translate: -6px 0;
              }
              > svg {
                color: white;
              }
            }
          }
        }
      </style>
      <div class="slider">
        <slot name="slide"></slot>
      </div>
      <button class="button prev">
        <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M831.872 340.864L512 652.672L192.128 340.864a30.592 30.592 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.592 30.592 0 0 0-42.752 0z" /></svg>
      </button>
      <button class="button next">
        <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M831.872 340.864L512 652.672L192.128 340.864a30.592 30.592 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.592 30.592 0 0 0-42.752 0z" /></svg>
      </button>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    const { signal } = this.controller
    const slider = this.shadowRoot.querySelector('.slider')
    const button = this.shadowRoot.querySelectorAll('.button')

    this.detectScroll()
    slider.addEventListener('scroll', () => { this.debounce(this.detectScroll, 50) }, { signal })
    window.addEventListener('resize', () => { this.debounce(this.detectScroll, 50) }, { signal })

    button.forEach((element) => element.addEventListener('click', () => {
      slider.scrollLeft = this.calcScrollLeft(element)
    }, { signal }))

  }

  // disconnectedCallback() {
  //   this.controller.abort()
  // }

  detectScroll = () => {
    const slider = this.shadowRoot.querySelector('.slider')
    const scrollL = slider.scrollLeft
    const scrollR = slider.scrollWidth - (scrollL + slider.clientWidth)
    slider.edge = scrollL <= 0 ? 'start' : scrollR <= 1 ? 'end' : 'false'
    if (slider.getAttribute('edge') !== slider.edge) {
      slider.setAttribute('edge', slider.edge)
    }
    console.log(slider.edge)
  }
  // calcScrollLeft = (button) => {
  //   const dir = (button.getAttribute('data-nav-btn') === 'prev') ? -1 : 1;
  //   const imageSize = this.image?.clientWidth ?? 300;
  //   const totalItemsSize = imageSize * this.move;
  //   const totalGap = this.gap * this.move;
  //   return this.slider.scrollLeft + dir * (totalItemsSize + totalGap);
  // }
  debounce = (f, interval = 50) => {
    clearTimeout(this.timer)
    this.timer = setTimeout (() => f(), interval)
  }


}

customElements.define('custom-slider', Slider)
