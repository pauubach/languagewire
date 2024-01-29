# Languagewire test app

### Run the project with

```sh
npm install
```

```sh
npm run dev
```

Then, in your browser:

```sh
http://localhost:5173/
```

or if you wish a fast navigation including languages combination:

```sh
http://localhost:5173/en-GB/es-ES
```

### Run Unit Tests with

```sh
npm run test:unit
```

## Tech

- I decided to use **Vue**, as it is what you use (and me too). Opted for v.3 with composition API.
- Used **Vue Router** as language changer, so http://localhost:5173/es-ES/en-GB will have `es-ES` as source and `en-GB` as target. http://localhost:5173/ will take the first two languages available in the languages list.
- **Pinia** as state manager. With composition API here too.
- Made a custom directive to control textarea size.
- Although I'm more used to Vuetify, Bootstrap, etc. You mentioned **Tailwind** so I picked this one.
- Normally I would split the code with composables, but due the size of the project I found it unnecessary.
- Testing isn't one of my strengths but I wrote some unit tests with **Vitest**. I didn't pretend to be exhaustive.
- Used **git** too, although in a late state and only used a branch breaking all gitflow recommendations.

## Design

- Instead of having a source and target language selects visible, I decided to have them in a box and not call the server as selects are changed to avoid unneeded server requests. Call is done when _Apply_ button is clicked.
- There's also a button to swap languages. Again, there are no API calls until _Apply_ is clicked.
- Selects have the language flag, language name and tag (using different formats for name and tag).
- Included search by language name and tag (Well, it doesn't make sense as there are only 3 languages, but I wanted to play with the idea).
- Implemented key navigation in language selects with _up_, _down_ and _enter_ keys. This works together with search, so if filtering only shows 2 languages, up and down willchange between these 2 languages. The third won't be selected.
- If search returns only 1 result, on clicking enter, this language will be selected.
- The app is responsive (mobile first) and dark mode has been taken into consideration.

## Comments

- Languages tags have `en-GB` format, while translations have `en`, so I'm using _startsWith_. In case it changes this could be replaced by _equal_.
- Althought it is stated "We only have results for the `es-ES` (source)-> `en-GB` (target) combination.", I assume we have `en-GB` to `es-ES` and my "_server side_" just removes those with empty source text.
- If you want to force an error, you can choose `pt-PT`.
- I control having same source and target too. This will return "_Language not found_" too. You can not select this option (button is disabled) but you can browse directly to this option: [http://localhost:5173/en-GB/en-GB](http://localhost:5173/en-GB/en-GB)
- Of course, there's no real text editing, but I print in console in a readable format what should be sent to the server, as there aren't real calls to the API.
