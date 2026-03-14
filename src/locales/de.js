/**
 * German (Deutsch) locale strings for Linear Calendar.
 */

const de = {
  appName: 'Linearer Kalender',

  /** Browser tab title. */
  pageTitle: year => `${year} — Linearer Kalender`,

  header: {
    switchToLight: 'Zum hellen Modus wechseln',
    switchToDark: 'Zum dunklen Modus wechseln',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',
    help: 'Hilfe',
    install: 'Installieren',
    installTitle: 'App installieren',
    export: 'Exportieren',
    exportTitle: 'Ereignisse als .ics exportieren',
    import: 'Importieren',
    importTitle: 'Ereignisse aus .ics importieren',
    clear: 'Löschen',
    clearTitle: 'Alle Ereignisse und Etiketten löschen',
    print: 'Drucken',
    printTitle: 'Kalender drucken',
  },

  footer: {
    /** @param {number} year */
    copyright: year => `© ${year} Arun K Viswanathan`,
    builtWith: 'Erstellt mit',
  },

  toast: {
    updateAvailable: 'Eine neue Version ist verfügbar.',
    reload: 'Neu laden',
  },

  yearSwitcher: {
    prevYear: 'Vorheriges Jahr',
    nextYear: 'Nächstes Jahr',
    enterYear: 'Jahr eingeben',
    cancelYear: 'Benutzerdefiniertes Jahr abbrechen',
    cancelTitle: 'Abbrechen',
    selectYear: 'Jahr auswählen',
    customOption: 'Jahr eingeben…',
  },

  yearPicker: {
    subtitle: 'Wähle ein Jahr zum Starten',
    prevYear: 'Vorheriges Jahr',
    yearLabel: 'Jahr',
    nextYear: 'Nächstes Jahr',
    viewCalendar: 'Kalender anzeigen →',
  },

  eventModal: {
    newEvent: 'Neues Ereignis',
    editEvent: 'Ereignis bearbeiten',
    close: 'Schließen',
    titleLabel: 'Titel',
    titlePlaceholder: 'Ereignistitel',
    startLabel: 'Beginn',
    endLabel: 'Ende',
    tagLabel: 'Etikett',
    tagNone: 'Keines',
    newTagTrigger: '+ Neues Etikett',
    tagNamePlaceholder: 'Etikettenname',
    createTag: 'Erstellen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    deleteEvent: 'Löschen',
  },

  tagFilterBar: {
    label: 'Etiketten:',
    tagNamePlaceholder: 'Etikettenname',
    save: 'Speichern',
    cancel: 'Abbrechen',
    /** @param {string} name */
    editTag: name => `Etikett „${name}" bearbeiten`,
    /** @param {string} name */
    deleteTag: name => `Etikett „${name}" löschen`,
  },

  clearDialog: {
    ariaLabel: 'Kalender löschen – Bestätigung',
    title: 'Kalender löschen?',
    bodyPrefix: 'Dadurch werden dauerhaft',
    /** @param {number} n */
    eventCount: n => `${n} Ereignis${n !== 1 ? 'se' : ''}`,
    bodyAnd: 'und',
    /** @param {number} n */
    tagCount: n => `${n} Etikett${n !== 1 ? 'en' : ''}`,
    bodySuffix: 'gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
    exportHint: '💡 Wir empfehlen, Ihre Daten vor dem Löschen zu exportieren.',
    exportFirst: 'Zuerst exportieren',
    cancel: 'Abbrechen',
    confirm: 'Alles löschen',
  },

  deleteTagDialog: {
    ariaLabel: 'Etikett löschen – Bestätigung',
    /** @param {string|undefined} name */
    title: name => (name ? `Etikett „${name}" löschen?` : 'Etikett löschen?'),
    /** @param {number} n */
    eventCount: n => `${n} Ereignis${n !== 1 ? 'se' : ''}`,
    usesTag: 'verwendet dieses Etikett. Es wird aus',
    singularRef: 'diesem Ereignis',
    pluralRef: 'diesen Ereignissen',
    bodySuffix: 'entfernt und gelöscht.',
    cancel: 'Abbrechen',
    confirm: 'Etikett löschen',
  },

  importError: {
    invalidType: 'Ungültiger Dateityp — bitte eine .ics-Datei auswählen.',
    noEvents: 'Keine gültigen Ereignisse in der Datei gefunden.',
    tooLarge: 'Datei zu groß (max. 5 MB).',
    parseFailed: 'Die .ics-Datei konnte nicht verarbeitet werden.',
  },

  helpModal: {
    ariaLabel: 'Hilfe',
    title: 'Willkommen beim Linearen Kalender',
    close: 'Schließen',
    intro: 'Ein Jahreskalender, in dem jeder Monat als horizontale Zeile dargestellt wird.',
    gotIt: 'Verstanden',

    gettingStarted: {
      heading: 'Erste Schritte',
      addEvent: 'Ereignis hinzufügen',
      addEventText: '— klicken Sie auf eine beliebige Datumszelle im Kalender.',
      editEvent: 'Ereignis bearbeiten oder löschen',
      editEventText: '— klicken Sie auf den farbigen Ereignisbalken.',
      changeYear: 'Jahr wechseln',
      changeYearText:
        '— verwenden Sie die Jahresauswahl in der Kopfzeile oder setzen Sie ein Lesezeichen mit',
      changeYearCode: '?year=2025',
      changeYearSuffix: '.',
    },

    tags: {
      heading: 'Etiketten',
      assignPrefix: 'Weisen Sie jedem Ereignis ein',
      assignTag: 'Etikett',
      assignSuffix: '(mit Farbe) zur einfachen Gruppierung zu.',
      createInline:
        'Erstellen Sie Etiketten direkt beim Hinzufügen oder Bearbeiten eines Ereignisses.',
      toggleVisibility: 'Schalten Sie die Sichtbarkeit von Etiketten über die Filterleiste ein.',
    },

    importExport: {
      heading: 'Import und Export',
      exportLabel: 'Exportieren',
      exportText: '— lädt alle Ereignisse als Standard-',
      exportCode: '.ics',
      exportSuffix: '-Datei herunter.',
      importLabel: 'Importieren',
      importText: '— lädt Ereignisse aus einer beliebigen',
      importCode: '.ics',
      importSuffix: '-Datei (ersetzt aktuelle Daten).',
    },

    shortcuts: {
      heading: 'Tastenkürzel',
      helpKbd: '?',
      helpText: '— Hilfe öffnen.',
      newEventKbd: 'N',
      newEventText: '— neues Ereignis erstellen.',
      exportKbd: 'X',
      exportText: '— Ereignisse als',
      exportCode: '.ics',
      exportSuffix: '-Datei exportieren.',
      importKbd: 'I',
      importText: '— aus einer',
      importCode: '.ics',
      importSuffix: '-Datei importieren.',
      escKbd: 'Esc',
      escText: '— aktuellen Dialog schließen.',
    },

    other: {
      heading: 'Sonstiges',
      togglePrefix: 'Zwischen',
      toggleLabel: 'Dunkel- und Hellmodus',
      toggleSuffix: 'mit dem Mond-/Sonnensymbol wechseln.',
      printLabel: 'Drucken',
      printText: 'erzeugt eine saubere, für Querformat optimierte Ansicht.',
      localStorage:
        'Alle Daten werden lokal in Ihrem Browser gespeichert — es werden keine Daten an Server übertragen.',
    },
  },

  calendar: {
    months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    dayAbbrs: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dateRangeSeparator: '–',
  },
}

export default de
