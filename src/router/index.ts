/**
 * Here's the place where the magic happens.
 * A web app with only one page doesn't seem to need a router, but I wanted to include it.
 * First, because it was one of the topics during the interview.
 * Second, because it will be useful as languages selector, so if we want someone to have same options,
 * we just need to send the link, and voila, same languages will be selected.
 * It could be used with other options as a select for the translations to download if we had pagination
 * or other texts selection.
 *
 * So, changing the page will call changeLanguages in translationStore, and this will load everything for us.
 * Voilà! AUTOMAGIC
 */

import { useTranslationStore } from './../stores/translation'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/:source/:target',
    name: 'homeWithLangs',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const translationStore = useTranslationStore()
  if (to.params.source && to.params.target) {
    if (
      to.params.source != translationStore.source ||
      to.params.target != translationStore.target
    ) {
      //If source or target are changed
      translationStore.changeLanguages(to.params.source as string, to.params.target as string)
    }
  } else if (!translationStore.source) {
    //If there are no languages selected yet
    translationStore.changeLanguages()
  }
})

export { routes }
export default router
