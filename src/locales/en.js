/**
 * English locale strings for Linear Calendar.
 *
 * To add a new language:
 *   1. Copy this file to e.g. `fr.js`
 *   2. Translate every string value (leave keys and function signatures unchanged)
 *   3. In `index.js`, change the import to `'./fr.js'`
 *
 * Parameterised strings are plain JS functions — call them with the required
 * arguments and interpolate the return value directly into JSX.
 */

const en = {
  appName: 'Linear Calendar',

  /** Browser tab title. */
  pageTitle: (year) => `${year} — Linear Calendar`,

  header: {
    switchToLight:  'Switch to light mode',
    switchToDark:   'Switch to dark mode',
    lightMode:      'Light mode',
    darkMode:       'Dark mode',
    help:           'Help',
    install:        'Install',
    installTitle:   'Install app',
    export:         'Export',
    exportTitle:    'Export events as .ics',
    import:         'Import',
    importTitle:    'Import events from .ics',
    clear:          'Clear',
    clearTitle:     'Clear all events and tags',
    print:          'Print',
    printTitle:     'Print calendar',
  },

  footer: {
    /** @param {number} year */
    copyright: (year) => `© ${year} Arun K Viswanathan`,
    builtWith:  'Built with',
  },

  toast: {
    updateAvailable: 'A new version is available.',
    reload:          'Reload',
  },

  yearSwitcher: {
    prevYear:     'Previous year',
    nextYear:     'Next year',
    enterYear:    'Enter year',
    cancelYear:   'Cancel custom year',
    cancelTitle:  'Cancel',
    selectYear:   'Select year',
    customOption: 'Enter year\u2026',   // "Enter year…"
  },

  yearPicker: {
    subtitle:    'Choose a year to get started',
    prevYear:    'Previous year',
    yearLabel:   'Year',
    nextYear:    'Next year',
    viewCalendar: 'View Calendar \u2192',  // "View Calendar →"
  },

  eventModal: {
    newEvent:           'New event',
    editEvent:          'Edit event',
    close:              'Close',
    titleLabel:         'Title',
    titlePlaceholder:   'Event title',
    startLabel:         'Start',
    endLabel:           'End',
    tagLabel:           'Tag',
    tagNone:            'None',
    newTagTrigger:      '+ New tag',
    tagNamePlaceholder: 'Tag name',
    createTag:          'Create',
    cancel:             'Cancel',
    save:               'Save',
    deleteEvent:        'Delete',
  },

  tagFilterBar: {
    label:              'Tags:',
    tagNamePlaceholder: 'Tag name',
    save:               'Save',
    cancel:             'Cancel',
    /** @param {string} name */
    editTag:   (name) => `Edit tag ${name}`,
    /** @param {string} name */
    deleteTag: (name) => `Delete tag ${name}`,
  },

  clearDialog: {
    ariaLabel:   'Clear calendar confirmation',
    title:       'Clear calendar?',
    bodyPrefix:  'This will permanently delete',
    /** @param {number} n */
    eventCount:  (n) => `${n} event${n !== 1 ? 's' : ''}`,
    bodyAnd:     'and',
    /** @param {number} n */
    tagCount:    (n) => `${n} tag${n !== 1 ? 's' : ''}`,
    bodySuffix:  'This cannot be undone.',
    exportHint:  '\uD83D\uDCA1 We recommend exporting your data before clearing.',
    exportFirst: 'Export first',
    cancel:      'Cancel',
    confirm:     'Clear everything',
  },

  deleteTagDialog: {
    ariaLabel:    'Delete tag confirmation',
    /** @param {string|undefined} name */
    title:        (name) => name ? `Delete tag \u201C${name}\u201D?` : 'Delete tag?',
    /** @param {number} n */
    eventCount:   (n) => `${n} event${n !== 1 ? 's' : ''}`,
    usesTag:      'use this tag. The tag will be removed from',
    singularRef:  'that event',
    pluralRef:    'those events',
    bodySuffix:   'and deleted.',
    cancel:       'Cancel',
    confirm:      'Delete tag',
  },

  importError: {
    invalidType: 'Invalid file type \u2014 please select a .ics file.',
    noEvents:    'No valid events found in the file.',
    tooLarge:    'File too large (max 5\u00A0MB).',
    parseFailed: 'Failed to parse .ics file.',
  },

  helpModal: {
    ariaLabel: 'Help',
    title:     'Welcome to Linear Calendar',
    close:     'Close',
    intro:     'A year-at-a-glance calendar where every month is a single horizontal row.',
    gotIt:     'Got it',

    gettingStarted: {
      heading:         'Getting started',
      addEvent:        'Add an event',
      addEventText:    '\u2014 click any day cell on the calendar.',
      editEvent:       'Edit or delete an event',
      editEventText:   '\u2014 click the coloured event bar.',
      changeYear:      'Change year',
      changeYearText:  '\u2014 use the year switcher in the header, or bookmark',
      changeYearCode:  '?year=2025',
      changeYearSuffix: '.',
    },

    tags: {
      heading:          'Tags',
      assignPrefix:     'Assign a',
      assignTag:        'tag',
      assignSuffix:     '(with a colour) to any event for easy grouping.',
      createInline:     'Create tags inline while adding or editing an event.',
      toggleVisibility: 'Toggle tag visibility from the filter bar below the header.',
    },

    importExport: {
      heading:      'Import & Export',
      exportLabel:  'Export',
      exportText:   '\u2014 downloads all events as a standard',
      exportCode:   '.ics',
      exportSuffix: 'file.',
      importLabel:  'Import',
      importText:   '\u2014 loads events from any',
      importCode:   '.ics',
      importSuffix: 'file (replaces current data).',
    },

    shortcuts: {
      heading:      'Keyboard shortcuts',
      helpKbd:      '?',
      helpText:     '\u2014 open help.',
      newEventKbd:  'N',
      newEventText: '\u2014 create a new event.',
      exportKbd:    'X',
      exportText:   '\u2014 export events as',
      exportCode:   '.ics',
      exportSuffix: '.',
      importKbd:    'I',
      importText:   '\u2014 import from a',
      importCode:   '.ics',
      importSuffix: 'file.',
      escKbd:       'Esc',
      escText:      '\u2014 close the current dialog.',
    },

    other: {
      heading:       'Other',
      togglePrefix:  'Toggle',
      toggleLabel:   'dark / light mode',
      toggleSuffix:  'with the moon/sun icon.',
      printLabel:    'Print',
      printText:     'renders a clean, landscape-optimised view.',
      localStorage:  'All data is stored locally in your browser \u2014 nothing is sent to a server.',
    },
  },

  calendar: {
    months:              ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayAbbrs:            ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dateRangeSeparator:  '\u2013',   // en-dash "–"
  },
}

export default en
