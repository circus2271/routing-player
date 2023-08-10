import { defaultTimeout, getData, urlChange } from '../_helpers';

class ParallaxImage extends HTMLElement {
  placeholder: any;
  image: any;
  gap: number;

  constructor() {
    super();

    this.gap = 50;
  }

  connectedCallback() {
    this.placeholder = this.querySelector('.loader')
    this.image = this.querySelector('img')
    //    this.image.style.position = 'relative'
    this.updateImage()

    window.addEventListener('scroll', this.onScroll, {passive: true})
    window.addEventListener(urlChange, this.onUrlChange, {passive: true})
  }

  onScroll = (e) => {
    //        console.log('i', this.image)
    //        console.log(this.image.getBoundingClientRect().top)
    //        console.log(this.image.getBoundingClientRect().top)
    //        const topY = this.image.getBoundingClientRect().top
    const bottomY = this.image.getBoundingClientRect().bottom

    if (bottomY > 0) {
      //          if (bottomY + this.gap > 0) {
      //            console.log(topY)
      //            this.image.style.top = -bottomY / 10 + 'px'
      //        this.image.style.top = bottomY / 5 + 'px'
      //        this.image.style.top = 10 + 'px'
    }
  }

  onUrlChange = (event) => {
    this.updateImage()
  }

  updateImage = async () => {
    this.image.classList.remove('visible')
    this.image.src = ''


//    this.image.onload = () => {
//      this.image.classList.add('visible')
//    }

    this.image.onerror = () => {
      // set default
      this.image.src = new URL('~/src/assets/media/images/about_page_image.png', import.meta.url);
    }

    switch (location.pathname) {
      case '/':
        this.image.src = new URL('~/src/assets/media/images/tramvai_bandcamp_header_image.png', import.meta.url);
        break;
      case '/about':
        this.image.src = new URL('~/src/assets/media/images/about_page_image.png', import.meta.url);
        break;
      default:
        const urlParts = location.pathname.split('/').filter(part => part !== '')

        if (urlParts.length === 1) {
          const possibleGroupName = urlParts[0]

          const data = await getData()

          const currentGroup = data.groups?.filter(group => {
            return group.groupName === possibleGroupName
          })[0]

          if (currentGroup.coverImage) {
            this.image.src = currentGroup.coverImage
          }

          if (!currentGroup.coverImage) {
            this.image.src = new URL('~/src/assets/media/images/about_page_image.png', import.meta.url);
          }
        }

        if (urlParts.length > 1) {
          // set placeholder
          this.image.src = new URL('~/src/assets/media/images/about_page_image.png', import.meta.url);
        }
    }


    setTimeout(() => {
      this.image.classList.add('visible')
    }, defaultTimeout)
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener(urlChange, this.onUrlChange)
  }
}

customElements.define('parallax-image', ParallaxImage)