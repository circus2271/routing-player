import {
  AlbumRelatedInfo,
  getAlbumRelatedInfo,
  getGroup,
  GroupInfo,
  scrollUp,
  updateUi
} from './helpers';
import { AlbumNotFoundError, GroupNotFoundError } from './custom-errors';


export const urlChange = 'urlChange';

const emitUrlChangeEvent = () => {
  const event = new CustomEvent(urlChange, {
    //    detail: {
    //      newLocation: location.pathname
    //    }
  })

  window.dispatchEvent(event)
}


export const navigate = async (url, state = {}) => {
  history.pushState(state, '', url)

  emitUrlChangeEvent()
}


export type RouteName = 'about' | 'home' | '404' | 'album-page' | 'group-page';

export type RouteInfo = {
  routeName: RouteName;
  // data?: GroupInfo | AlbumRelatedInfo;
  data?: GroupInfo | AlbumRelatedInfo;
}


export const getCurrentPageInfo = async (): Promise<RouteInfo> => {
  // let routeName;

  const urlParts = location.pathname.split('/').filter(part => part !== '')
  if (urlParts.length === 0) {
    // routeName = ''
    return {routeName: 'home'}
  }
  if (urlParts.length === 1) {
    // routeName = ''

    if (urlParts[0] === 'about') {
      return {routeName: 'about'}
    }

    // group page or 404
    try {
      const possibleGroupName = urlParts[0]
      const group = await getGroup(possibleGroupName)

      return {
        routeName: 'group-page',
        data: group,
      }
    } catch (error) {
      if (
        error instanceof GroupNotFoundError ||
        error instanceof AlbumNotFoundError
      ) {
        return {
          routeName: '404'
        }
      }
    }
  }

  if (urlParts.length === 2) {
    // album page or 404
    const possibleGroupName = urlParts[0]
    const possibleAlbumName = urlParts[1]
    const normalizedAlbumName = possibleAlbumName.split('_').join(' ')

    try {
      const albumRelatedInfo = await getAlbumRelatedInfo(possibleGroupName, normalizedAlbumName)

      return {
        routeName: 'album-page',
        data: albumRelatedInfo
      }
    } catch (error) {
      if (
        error instanceof GroupNotFoundError ||
        error instanceof AlbumNotFoundError
      ) {
        return {
          routeName: '404'
        }
      }
    }
  }

  return {routeName: '404'}
}

const setup = () => {
  // prevent default scroll restoration
  // https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

  // https://flaviocopes.com/history-api/
  window.addEventListener("popstate", (event) => {
    //  document.querySelector('#current-url').innerHTML = location.pathname

    //  console.log('popstate', event)
    //  updateUi()
    emitUrlChangeEvent()
  });

  document.body.addEventListener('click', event => {
    if (event.target instanceof HTMLAnchorElement) {
      const anchor = event.target;
      if (anchor.target === '_blank') return;
      // https://stackoverflow.com/a/6806291/9675926
      if (event.ctrlKey) return;

      event.preventDefault()

      const href = anchor.href
      navigate(href)
    }
  })

  window.addEventListener(urlChange, (e: CustomEvent) => {
    scrollUp()
    updateUi()
  })

  updateUi()
}

setup()
