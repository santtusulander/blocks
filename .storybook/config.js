import { configure } from '@kadira/storybook';

import '../src/styles/style.scss'

function loadStories() {
  //TODO: Load these dynamically
  //fs not defined, cant walk directory?

  require('../src/components/__stories__/add-host');
  require('../src/components/__stories__/confirmation');
}

configure(loadStories, module);